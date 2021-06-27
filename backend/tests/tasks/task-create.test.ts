import { createConnection, getConnection } from "typeorm";
import { clearEntity } from "../test-helpers/clear";
import { Task, Status } from "../../src/entity/Task"
import { createTask } from "../../src/tasks/task-create"

test('empty string param of createTask test', async () => {
    expect.assertions(1);
    return expect(createTask("project","","title",new Date(),Status.NOT_STARTED)).rejects.toEqual(
        "error creating task with given params, ensure they are all defined");
});

test('correct task creation', async () => {
    const task_project = "project";
    const task_creator = "creator";
    const task_title = "title";
    const task_deadline = new Date();
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    await createTask(
        task_project, task_creator, task_title, task_deadline, 
        task_status, task_description, task_estimated_days
    )
    const task = await getConnection().getRepository(Task).find({where : {title : task_title}});
    expect.assertions(8);
    expect(task.length).toBe(1);
    expect(task[0].project).toBe(task_project);
    expect(task[0].creator).toBe(task_creator);
    expect(task[0].title).toBe(task_title);
    expect(task[0].deadline).toBe(task_deadline);
    expect(task[0].status).toBe(task_status);
    expect(task[0].description).toBe(task_description);
    expect(task[0].estimated_days).toBe(task_estimated_days);
});

beforeAll(async () => {
    await createConnection();
});

beforeEach(async () => {
    await clearEntity(Task);
});

afterAll(async () => {
    await clearEntity(Task);
    return await getConnection().close()
});

