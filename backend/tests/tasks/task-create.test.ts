import { createConnection, getConnection } from "typeorm";
import { clearEntity } from "../test-helpers/clear";
import { Task, Status } from "../../src/entity/Task"
import { User } from "../../src/entity/User"
import { createTask } from "../../src/tasks/task-create"
import { createUser } from "../../src/users/users-create"

test('empty string param of createTask test', async () => {
    expect.assertions(1);
    return expect(createTask("","title",new Date(),Status.NOT_STARTED)).rejects.toEqual(
        "error creating task with given params, ensure they are defined, not empty strings etc.");
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
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    const task_id = await createTask(
        task_creator, task_title, task_deadline, 
        task_status, task_project, task_description, task_estimated_days
    )
    
    expect.assertions(8);
    const task = await getConnection().getRepository(Task).find({where : {id : task_id}});
    expect(task.length).toBe(1);
    expect(task[0].project).toBe(task_project);
    expect(task[0].creator).toBe(task_creator);
    expect(task[0].title).toBe(task_title);
    expect(task[0].deadline).toStrictEqual(task_deadline);
    expect(task[0].status).toBe(task_status);
    expect(task[0].description).toBe(task_description);
    expect(task[0].estimated_days).toBe(task_estimated_days);
});

beforeAll(async () => {
    await createConnection();
});

beforeEach(async () => {
    await clearEntity(Task);
    await clearEntity(User);
});

afterAll(async () => {
    await clearEntity(Task);
    await clearEntity(User);
    return await getConnection().close()
});

