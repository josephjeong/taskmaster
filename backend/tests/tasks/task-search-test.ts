import { User } from "../../src/entity/User";
import { Connection, createConnection, getConnection } from "typeorm";
import { createTask } from "../../src/tasks/task-create";
import { createUser } from "../../src/users/users-create"
import { Status, Task } from "../../src/entity/Task";
import { taskSearch } from "../../src/tasks/task-search";
import { clearEntity } from "../test-helpers/clear";
import { TaskAssignment } from "../../src/entity/TaskAssignment";
import { acceptRequest, createUserConnection } from "../../src/connection";

async function testing() {

    await createConnection();

    // await createUser("joe2.b.jeong@gmail.com", "password!!!", "joseph", "jeong", "lmfao");
    // const token2 = await createUser("joe.b.jeong2@gmail.com", "passw2ord!!!", "jo2seph", "jeo2ng", "lmf2ao");
    const user = await getConnection().getRepository(User).find({where : {email : "joe.b.jeong@gmail.com"}});
    const user2 = await getConnection().getRepository(User).find({where : {email : "joe2.b.jeong@gmail.com"}});


    const task_creator = user[0].id;
    const task_project: string = null;
    const task_title = "title";
    const task_deadline = new Date();
    task_deadline.setMinutes(task_deadline.getMinutes() + 1);
    const task_status = Status.NOT_STARTED;
    const task_description = "description\n";
    const task_estimated_days = 2.5;
    // await createUserConnection(user[0].id, user2[0].id)
    await acceptRequest(user[0].id, user2[0].id);

    // const task_id = await createTask(
    //     task_creator, task_title, task_deadline, 
    //     task_status, [user2[0].id], task_project, task_description, task_estimated_days
    // )

    taskSearch(user2[0].id, "title", null, null, null, null, null, null, null)

    // clearEntity(Task)
    // clearEntity(TaskAssignment)
    // clearEntity(Connection)
    // clearEntity(User)
    // await getConnection().close()
}

testing()