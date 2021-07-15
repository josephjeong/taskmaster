import { createConnection, getConnection } from "typeorm";
import { clearEntity } from "../test-helpers/clear";
import { Task, Status } from "../../src/entity/Task";
import { User } from "../../src/entity/User";
import { editTask } from "../../src/tasks/task-edit";
import { createTask } from "../../src/tasks/task-create";
import { createUser } from "../../src/users/users-create";
import { Connection } from "../../src/entity/Connection";
import { TaskAssignment } from "../../src/entity/TaskAssignment";
import { createUserConnection, acceptRequest } from "../../src/connection";

test('empty string param of editTask test', async () => {
    expect.assertions(4);
    expect(editTask("task_id","editor")).rejects.toEqual(
        "error editing task with given params, ensure at least one field is defined or not empty");
    expect(editTask("task_id","editor","")).rejects.toEqual(
        "error editing task with given params, ensure at least one field is defined or not empty");
    expect(editTask("task_id","editor", null)).rejects.toEqual(
        "error editing task with given params, ensure at least one field is defined or not empty");
    expect(editTask("task_id","editor", "", null)).rejects.toEqual(
        "error editing task with given params, ensure at least one field is defined or not empty");
});

test('correct task edit', async () => {
    await createUser(
        "bas@gmail.com","badpassword","bob","dob","asd"
    )
    const user2 = await getConnection().getRepository(User).find({where : {email : "bas@gmail.com"}});
    const user2_id = user2[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    const task_id = await createTask(
        user2_id, task_title, task_deadline, 
        task_status, [user2_id], task_project, task_description, task_estimated_days
    )

    const new_deadline = new Date();
    new_deadline.setMinutes(new_deadline.getMinutes() + 10);
    await editTask(
        task_id, user2_id, null, 
        new_deadline, null, null, null
    )
    expect.assertions(8);
    const tasks = await getConnection().getRepository(Task).find({where : {id : task_id}, relations: ["creator"]}) as any;
    expect(tasks.length).toBe(1);
    expect(tasks[0].project).toBe(null);
    expect(tasks[0].creator.id).toBe(user2_id);
    expect(tasks[0].title).toBe(task_title);
    expect(tasks[0].deadline).toStrictEqual(new_deadline);
    expect(tasks[0].status).toBe(task_status);
    expect(tasks[0].description).toBe(task_description);
    expect(tasks[0].estimated_days).toBe(task_estimated_days);
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
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    const task_id = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator], task_project, task_description, task_estimated_days
    )
    const bad_status = "b";
    return expect(editTask(
        task_id, task_creator, task_title, 
        task_deadline, bad_status as any, [], task_description, task_estimated_days
    )).rejects.toEqual("invalid task status");
});

test('correct task edit connected user assignee', async () => {
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    await createUser(
        "bas@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const user2 = await getConnection().getRepository(User).find({where : {email : "bas@gmail.com"}});
    const task_creator = user[0].id;
    const user2_id = user2[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    await createUserConnection(user2_id, task_creator);
    await acceptRequest(user2_id, task_creator);
    const task_id = await createTask(
        user2_id, task_title, task_deadline, 
        task_status, [task_creator], task_project, task_description, task_estimated_days
    )
    
    const new_deadline = new Date();
    new_deadline.setMinutes(new_deadline.getMinutes() + 10);
    await editTask(
        task_id, user2_id, null, 
        new_deadline, null, [task_creator, user2_id], null
    )
    const tasks = await getConnection().getRepository(Task).find({where : {id : task_id}, relations: ["creator"]}) as any;
    expect(tasks.length).toBe(1);
    expect(tasks[0].project).toBe(null);
    expect(tasks[0].creator.id).toBe(user2_id);
    expect(tasks[0].title).toBe(task_title);
    expect(tasks[0].deadline).toStrictEqual(new_deadline);
    expect(tasks[0].status).toBe(task_status);
    expect(tasks[0].description).toBe(task_description);
    expect(tasks[0].estimated_days).toBe(task_estimated_days);
    const assigns = await getConnection().getRepository(TaskAssignment).find({where : {task : task_id}}) as any;
    expect(assigns.length).toBe(2);
    expect(assigns[0].user_assignee.id).toBe(task_creator);
    expect(assigns[1].user_assignee.id).toBe(user2_id);
});

test('not connected assignee test', async () => {
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    await createUser(
        "bas@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const user2 = await getConnection().getRepository(User).find({where : {email : "bas@gmail.com"}});
    const task_creator2 = user2[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    const task_id = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator], task_project, task_description, task_estimated_days
    )
    await expect(editTask(
        task_id, task_creator, task_title, 
        task_deadline, Status.NOT_STARTED, [task_creator2], task_description, task_estimated_days
    )).rejects.toEqual("invalid assignees, they must be connected or in same group");
    await createUserConnection(task_creator2, task_creator);
    await expect(editTask(
        task_id, task_creator, task_title, 
        task_deadline, Status.NOT_STARTED, [task_creator2], task_description, task_estimated_days
    )).rejects.toEqual("invalid assignees, they must be connected or in same group");
    await acceptRequest(task_creator2, task_creator);
    await expect(editTask(
        task_id, task_creator, task_title, 
        task_deadline, Status.NOT_STARTED, [task_creator2], task_description, task_estimated_days
    )).resolves.not.toThrow();
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
    const task_status = Status.NOT_STARTED;
    const task_deadline = new Date();
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    const task_id = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator], task_project, task_description, task_estimated_days
    );
    const new_task_deadline = new Date(); // sets time to now;
    return expect(editTask(
        task_id, task_creator, task_title, 
        new_task_deadline, task_status, null, task_description, task_estimated_days
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
    const task_estimated_days = 2.5;
    const task_id = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator], task_project, task_description, task_estimated_days
    );
    const new_estimated_days = -0.00001;
    return expect(editTask(
        task_id, task_creator, task_title, 
        task_deadline, task_status, [], task_description, new_estimated_days
    )).rejects.toEqual("estimated_days must be >= 0");
});

test('editor is not creator test', async () => {
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
    const user2_id = user2[0].id;
    await createUserConnection(task_creator, user2_id);
    await acceptRequest(task_creator, user2_id);
    
    const task_id = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, [user2_id], task_project, task_description, task_estimated_days
    );
    const task_id2 = await createTask(
        user2_id, task_title, task_deadline, 
        task_status, [task_creator], task_project, task_description, task_estimated_days
    );
    expect.assertions(3);
    await expect(editTask(
        task_id, "asd", "newtitle"
    )).rejects.toEqual("this user cannot edit this task, only it's creator");
    await expect(editTask(
        task_id, user2_id, "newtitle"
    )).rejects.toEqual("this user cannot edit this task, only it's creator");
    await expect(editTask(
        task_id2, task_creator, "newtitle"
    )).rejects.toEqual("this user cannot edit this task, only it's creator");
});

test('invalid task id test', async () => {
    expect.assertions(5);
    await expect(editTask(
        null, "a"
    )).rejects.toEqual("task id or editor id invalid");
    await expect( editTask(
        "a", null
    )).rejects.toEqual("task id or editor id invalid");
    await expect(editTask(
        "a", null, "a"
    )).rejects.toEqual("task id or editor id invalid");
    await expect(editTask(
        '1', null, "a"
    )).rejects.toEqual("task id or editor id invalid");
    return expect(editTask(
        null, null
    )).rejects.toEqual("task id or editor id invalid");
});

test('task not exist test', async () => {
    expect.assertions(2);
    await expect(editTask(
        'null', "a", "a"
    )).rejects.toEqual("either task does not exist or duplicate task ids exist");
    await expect(editTask(
        "bad23", "a", "a"
    )).rejects.toEqual("either task does not exist or duplicate task ids exist");
});


test('implicit edit assignees test', async () => {
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    await createUser(
        "bas@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const user2 = await getConnection().getRepository(User).find({where : {email : "bas@gmail.com"}});
    const task_creator2 = user2[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    await createUserConnection(task_creator2, task_creator);
    await acceptRequest(task_creator2, task_creator);
    const task_id = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, [task_creator2], task_project, task_description, task_estimated_days
    )
    await expect(editTask(
        task_id, task_creator, task_title, 
        task_deadline, Status.NOT_STARTED, [task_creator2], task_description, task_estimated_days
    )).resolves.not.toThrow();
    let assigns = await getConnection().getRepository(TaskAssignment).find({where : {task: task_id}}) as any;
    expect(assigns.length).toBe(1);
    expect(assigns[0].user_assignee.id).toBe(task_creator2);
    await expect(editTask(
        task_id, task_creator, task_title, 
        task_deadline, Status.NOT_STARTED, [], task_description, task_estimated_days
    )).resolves.not.toThrow();
    assigns = await getConnection().getRepository(TaskAssignment).find({where : {task: task_id}}) as any;
    expect(assigns.length).toBe(1);
    expect(assigns[0].user_assignee.id).toBe(task_creator);
    await expect(editTask(
        task_id, task_creator, task_title, 
        task_deadline, Status.NOT_STARTED, [task_creator2, task_creator], task_description, task_estimated_days
    )).resolves.not.toThrow();
    assigns = await getConnection().getRepository(TaskAssignment).find({where : {task: task_id}}) as any;
    expect(assigns.length).toBe(2);
    expect(assigns[0].user_assignee.id).toBe(task_creator);
    expect(assigns[1].user_assignee.id).toBe(task_creator2);
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

