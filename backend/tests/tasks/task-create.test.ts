import { createConnection, getConnection } from "typeorm";
import { clearEntity } from "../test-helpers/clear";
import { Task, Status } from "../../src/entity/Task";
import { Connection } from "../../src/entity/Connection";
import { TaskAssignment } from "../../src/entity/TaskAssignment";
import { User } from "../../src/entity/User";
import { createTask } from "../../src/tasks/task-create";
import { createUser } from "../../src/users/users-create";
import { createUserConnection, declineRequest, acceptRequest } from "../../src/connection";

test('bad string param of createTask test', async () => {
    await expect(createTask("","title",new Date(),Status.NOT_STARTED,[])).rejects.toEqual(
        "error creating task with given params, ensure they are defined, not empty strings etc.");
    await expect(createTask("","title",new Date(),Status.NOT_STARTED,[],null,"")).rejects.toEqual(
        "error creating task with given params, ensure they are defined, not empty strings etc.");
    await expect(createTask("","title",new Date(),Status.NOT_STARTED,[],null,undefined)).rejects.toEqual(
        "error creating task with given params, ensure they are defined, not empty strings etc.");
    await expect(createTask("","title",new Date(),Status.NOT_STARTED,[],null,null)).rejects.toEqual(
        "error creating task with given params, ensure they are defined, not empty strings etc.");
});

test('not connected assignees test', async () => {
    expect.assertions(7);
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    await createUser(
        "bas@gmail.com","badpassword","bob","dob","asd"
    )
    const user2 = await getConnection().getRepository(User).find({where : {email : "bas@gmail.com"}});
    const task_creator2 = user2[0].id;
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    await expect(createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator2], task_project, task_description, task_estimated_days
    )).rejects.toEqual(
        "invalid assignees, they must be connected or in same group");
    await createUserConnection(task_creator, task_creator2);
    await expect(createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator2], task_project, task_description, task_estimated_days
    )).rejects.toEqual(
        "invalid assignees, they must be connected or in same group");
    await declineRequest(task_creator, task_creator2);
    await expect(createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator2], task_project, task_description, task_estimated_days
    )).rejects.toEqual(
        "invalid assignees, they must be connected or in same group");
    await createUserConnection(task_creator2, task_creator);
    await expect(createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator2], task_project, task_description, task_estimated_days
    )).rejects.toEqual(
        "invalid assignees, they must be connected or in same group");
    await declineRequest(task_creator2, task_creator);
    await expect(createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator2], task_project, task_description, task_estimated_days
    )).rejects.toEqual(
        "invalid assignees, they must be connected or in same group");
    await createUserConnection(task_creator2, task_creator);
    await expect(createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator2], task_project, task_description, task_estimated_days
    )).rejects.toEqual(
        "invalid assignees, they must be connected or in same group");
    await acceptRequest(task_creator2, task_creator)
    await expect(createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator2], task_project, task_description, task_estimated_days
    )).resolves.not.toThrow();
});

test('correct task creation', async () => {
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    
    await createUser(
        "bas@gmail.com","badpassword","bob","dob","asd"
    )
    const user2 = await getConnection().getRepository(User).find({where : {email : "bas@gmail.com"}});
    
    const task_creator2 = user[0].id;
    const task_id = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator, task_creator2], task_project, task_description, task_estimated_days
    )
    
    expect.assertions(11);
    const tasks = await getConnection().getRepository(Task).find({where : {id : task_id}});
    expect(tasks.length).toBe(1);
    expect(tasks[0].project).toBe(null);
    expect(tasks[0].title).toBe(task_title);
    expect(tasks[0].deadline).toStrictEqual(task_deadline);
    expect(tasks[0].status).toBe(task_status);
    expect(tasks[0].description).toBe(task_description);
    expect(tasks[0].estimated_days).toBe(task_estimated_days);
    const obj = await getConnection().getRepository(Task).find({where : {id : task_id}, relations: ["creator"]}) as any;
    expect(obj[0].creator.id).toBe(task_creator);
    const assigns = await getConnection().getRepository(TaskAssignment).find({where : {task: task_id}}) as any;
    expect(assigns.length).toBe(2);
    expect(assigns[0].user_assignee.id).toBe(task_creator);
    expect(assigns[1].user_assignee.id).toBe(task_creator2);
});


test('implicit creator task creation', async () => {
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    const task_id = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, [], task_project, task_description, task_estimated_days
    )
    let assigns = await getConnection().getRepository(TaskAssignment).find({where : {task: task_id}}) as any;
    expect(assigns.length).toBe(1);
    expect(assigns[0].user_assignee.id).toBe(task_creator);
    const tasks = await getConnection().getRepository(Task).find({where : {id : task_id}, relations: ["creator"]}) as any;
    expect(tasks.length).toBe(1);
    expect(tasks[0].project).toBe(null);
    expect(tasks[0].title).toBe(task_title);
    expect(tasks[0].deadline).toStrictEqual(task_deadline);
    expect(tasks[0].status).toBe(task_status);
    expect(tasks[0].description).toBe(task_description);
    expect(tasks[0].estimated_days).toBe(task_estimated_days);
    expect(tasks[0].creator.id).toBe(task_creator);
    const task_id2 = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, null, task_project, task_description, task_estimated_days
    )
    assigns = await getConnection().getRepository(TaskAssignment).find({where : {task: task_id2}}) as any;
    expect(assigns.length).toBe(1);
    expect(assigns[0].user_assignee.id).toBe(task_creator);
    const tasks2 = await getConnection().getRepository(Task).find({where : {id : task_id2}, relations: ["creator"]}) as any;
    expect(tasks2.length).toBe(1);
    expect(tasks2[0].project).toBe(null);
    expect(tasks2[0].title).toBe(task_title);
    expect(tasks2[0].deadline).toStrictEqual(task_deadline);
    expect(tasks2[0].status).toBe(task_status);
    expect(tasks2[0].description).toBe(task_description);
    expect(tasks2[0].estimated_days).toBe(task_estimated_days);
    expect(tasks2[0].creator.id).toBe(task_creator);
    
    const task_id3 = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, undefined, task_project, task_description, task_estimated_days
    )
    assigns = await getConnection().getRepository(TaskAssignment).find({where : {task: task_id3}}) as any;
    expect(assigns.length).toBe(1);
    expect(assigns[0].user_assignee.id).toBe(task_creator);
    const tasks3 = await getConnection().getRepository(Task).find({where : {id : task_id3}, relations: ["creator"]}) as any;
    expect(tasks3.length).toBe(1);
    expect(tasks3[0].project).toBe(null);
    expect(tasks3[0].title).toBe(task_title);
    expect(tasks3[0].deadline).toStrictEqual(task_deadline);
    expect(tasks3[0].status).toBe(task_status);
    expect(tasks3[0].description).toBe(task_description);
    expect(tasks3[0].estimated_days).toBe(task_estimated_days);
    expect(tasks3[0].creator.id).toBe(task_creator);
    
    const task_id4 = await createTask(
        task_creator, task_title, task_deadline, 
        task_status
    )
    assigns = await getConnection().getRepository(TaskAssignment).find({where : {task: task_id4}}) as any;
    expect(assigns.length).toBe(1);
    expect(assigns[0].user_assignee.id).toBe(task_creator);
    const tasks4 = await getConnection().getRepository(Task).find({where : {id : task_id4}, relations: ["creator"]}) as any;
    expect(tasks4.length).toBe(1);
    expect(tasks4[0].project).toBe(null);
    expect(tasks4[0].title).toBe(task_title);
    expect(tasks4[0].deadline).toStrictEqual(task_deadline);
    expect(tasks4[0].status).toBe(task_status);
    expect(tasks4[0].description).toBe(null);
    expect(tasks4[0].estimated_days).toBe(null);
    expect(tasks4[0].creator.id).toBe(task_creator);
});

test('invalid status test', async () => {
    expect.assertions(1);
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    const task_status = "bad status";
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    return expect(createTask(
        task_creator, task_title, task_deadline, 
        task_status as any, [task_creator],task_project, task_description, task_estimated_days
    )).rejects.toEqual("invalid task status");
});

test('invalid deadline test', async () => {
    expect.assertions(1);
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date(); // sets time to now
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    return expect(createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator], task_project, task_description, task_estimated_days
    )).rejects.toEqual("deadline must be in the future");
});

test('invalid estimated_days test', async () => {
    expect.assertions(1);
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = -0.00001;
    return expect(createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator], task_project, task_description, task_estimated_days
    )).rejects.toEqual("estimated_days must be >= 0");
});

beforeAll(async () => {
    await createConnection();
});

beforeEach(async () => {
    await clearEntity(TaskAssignment);
    await clearEntity(Task);
    await clearEntity(Connection);
    await clearEntity(User);
});

afterAll(async () => {
    await clearEntity(TaskAssignment);
    await clearEntity(Task);
    await clearEntity(Connection);
    await clearEntity(User);
    return await getConnection().close()
});

