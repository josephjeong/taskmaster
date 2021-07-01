import { createConnection, getConnection } from "typeorm";
import { clearEntity } from "../test-helpers/clear";
import { Task, Status } from "../../src/entity/Task"
import { User } from "../../src/entity/User"
import { Connection } from "../../src/entity/Connection"
import { getProfileTasks } from "../../src/tasks/get-profile-tasks"
import { createTask } from "../../src/tasks/task-create"
import { createUser } from "../../src/users/users-create"
import { createUserConnection, declineRequest, acceptRequest } from "../../src/connection"

test('invalid ids test', async () => {
    expect.assertions(4);
    await expect(getProfileTasks("",null)).rejects.toEqual("a user id provided is invalid");
    await expect(getProfileTasks("","")).rejects.toEqual("a user id provided is invalid");
    await expect(getProfileTasks(null,null)).rejects.toEqual("a user id provided is invalid");
    return expect(getProfileTasks(null,"")).rejects.toEqual("a user id provided is invalid");
});

test('connected test', async () => {
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    await createUser(
        "bas@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    await createTask(
        task_creator, task_title, task_deadline, 
        task_status, task_project, task_description, task_estimated_days
    )
    const task_project2: string = null;
    const task_title2 = "title2";
    const task_deadline2 = new Date();
    const task_status2 = Status.BLOCKED;
    const task_description2 = "description2\n";
    const task_estimated_days2 = 3;
    const user2 = await getConnection().getRepository(User).find({where : {email : "bas@gmail.com"}});
    const task_creator2 = user2[0].id;
    await createTask(
        task_creator2, task_title2, task_deadline2, 
        task_status2, task_project2, task_description2, task_estimated_days2
    ) 
    await createUserConnection(task_creator, task_creator2);
    await acceptRequest(task_creator, task_creator2);
    expect.assertions(16);
    const tasks = await getProfileTasks(task_creator, task_creator2);
    expect(tasks.length).toBe(1);
    expect(tasks[0].project).toBe(task_project2);
    expect(tasks[0].creator).toBe(task_creator2);
    expect(tasks[0].title).toBe(task_title2);
    expect(tasks[0].deadline).toStrictEqual(task_deadline2);
    expect(tasks[0].status).toBe(task_status2);
    expect(tasks[0].description).toBe(task_description2);
    expect(tasks[0].estimated_days).toBe(task_estimated_days2);
    
    const tasks2 = await getProfileTasks(task_creator2, task_creator);
    expect(tasks2.length).toBe(1);
    expect(tasks2[0].project).toBe(task_project);
    expect(tasks2[0].creator).toBe(task_creator);
    expect(tasks2[0].title).toBe(task_title);
    expect(tasks2[0].deadline).toStrictEqual(task_deadline);
    expect(tasks2[0].status).toBe(task_status);
    expect(tasks2[0].description).toBe(task_description);
    expect(tasks2[0].estimated_days).toBe(task_estimated_days);
});

test('not accepted connection test', async () => {
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    await createUser(
        "bas@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    await createTask(
        task_creator, task_title, task_deadline, 
        task_status, task_project, task_description, task_estimated_days
    )
    const task_project2: string = null;
    const task_title2 = "title2";
    const task_deadline2 = new Date();
    const task_status2 = Status.BLOCKED;
    const task_description2 = "description2\n";
    const task_estimated_days2 = 3;
    const user2 = await getConnection().getRepository(User).find({where : {email : "bas@gmail.com"}});
    const task_creator2 = user2[0].id;
    await createTask(
        task_creator2, task_title2, task_deadline2, 
        task_status2, task_project2, task_description2, task_estimated_days2
    ) 
    await createUserConnection(task_creator, task_creator2);
    expect.assertions(2);
    const tasks = await getProfileTasks(task_creator, task_creator2);
    expect(tasks.length).toBe(0);
    
    const tasks2 = await getProfileTasks(task_creator2, task_creator);
    expect(tasks2.length).toBe(0);
});

test('declined connection test', async () => {
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    await createUser(
        "bas@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    await createTask(
        task_creator, task_title, task_deadline, 
        task_status, task_project, task_description, task_estimated_days
    )
    const task_project2: string = null;
    const task_title2 = "title2";
    const task_deadline2 = new Date();
    const task_status2 = Status.BLOCKED;
    const task_description2 = "description2\n";
    const task_estimated_days2 = 3;
    const user2 = await getConnection().getRepository(User).find({where : {email : "bas@gmail.com"}});
    const task_creator2 = user2[0].id;
    await createTask(
        task_creator2, task_title2, task_deadline2, 
        task_status2, task_project2, task_description2, task_estimated_days2
    ) 
    await createUserConnection(task_creator, task_creator2);
    await declineRequest(task_creator, task_creator2);
    expect.assertions(2);
    const tasks = await getProfileTasks(task_creator, task_creator2);
    expect(tasks.length).toBe(0);
    
    const tasks2 = await getProfileTasks(task_creator2, task_creator);
    expect(tasks2.length).toBe(0);
});

test('get own tasks test', async () => {
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    await createTask(
        task_creator, task_title, task_deadline, 
        task_status, task_project, task_description, task_estimated_days
    )
    await createTask(
        task_creator, task_title, task_deadline, 
        task_status, task_project, task_description, task_estimated_days
    )
    
    expect.assertions(15);
    const tasks = await getProfileTasks(task_creator, task_creator);
    expect(tasks.length).toBe(2);
    expect(tasks[0].project).toBe(task_project);
    expect(tasks[0].creator).toBe(task_creator);
    expect(tasks[0].title).toBe(task_title);
    expect(tasks[0].deadline).toStrictEqual(task_deadline);
    expect(tasks[0].status).toBe(task_status);
    expect(tasks[0].description).toBe(task_description);
    expect(tasks[0].estimated_days).toBe(task_estimated_days);
    
    expect(tasks[1].project).toBe(task_project);
    expect(tasks[1].creator).toBe(task_creator);
    expect(tasks[1].title).toBe(task_title);
    expect(tasks[1].deadline).toStrictEqual(task_deadline);
    expect(tasks[1].status).toBe(task_status);
    expect(tasks[1].description).toBe(task_description);
    expect(tasks[1].estimated_days).toBe(task_estimated_days);
});

test('not connected test', async () => {
    await createUser(
        "asd@gmail.com","badpassword","bob","dob","asd"
    )
    await createUser(
        "bas@gmail.com","badpassword","bob","dob","asd"
    )
    const user = await getConnection().getRepository(User).find({where : {email : "asd@gmail.com"}});
    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    await createTask(
        task_creator, task_title, task_deadline, 
        task_status, task_project, task_description, task_estimated_days
    )
    const user2 = await getConnection().getRepository(User).find({where : {email : "bas@gmail.com"}});
    const task_creator2 = user2[0].id;
    await createTask(
        task_creator2, task_title, task_deadline, 
        task_status, task_project, task_description, task_estimated_days
    )
    
    expect.assertions(2);
    const tasks = await getProfileTasks(task_creator,task_creator2);
    const tasks2 = await getProfileTasks(task_creator2,task_creator);
    expect(tasks.length).toBe(0);
    
    expect(tasks2.length).toBe(0);
});

beforeAll(async () => {
    await createConnection();
});

beforeEach(async () => {
    await clearEntity(Task);
    await clearEntity(Connection);
    await clearEntity(User);
});

afterAll(async () => {
    await clearEntity(Task);
    await clearEntity(Connection);
    await clearEntity(User);
    return await getConnection().close()
});

