/*
    test file to test users-update.ts file
*/

import { createConnection, getConnection } from "typeorm";

import { User } from "../../src/entity/User";
import { Task, Status } from "../../src/entity/Task";
import { TaskAssignment } from "../../src/entity/TaskAssignment";
import { Connection } from "../../src/entity/Connection";
import { CalendarCredential } from "../../src/entity/CalendarCredential";
import { createTask } from "../../src/tasks/task-create";
import { createUser } from "../../src/users/users-create";
import {
    getCalendarEventStartTime,
    saveTaskToCalendar
} from "../../src/googleOAuth/calendar-create-event";
import {
    createCalendarCredential,
    getCalendarCredential
} from "../../src/calendar-credentials";
import { clearEntity } from "../test-helpers/clear";

import {
    createUserConnection,
    acceptRequest
  } from "../../src/connection";

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

// // test that cal event start time return expected date
// test("test cal event start time will return expected date", async() => {
//     const user_email = "taskertestcal@gmail.com";
//     const user_password = "strong password";
//     const user_first_name = "Tasker";
//     const user_last_name = "TestCal";
//     const user_bio = "an awesome person";
//     await createUser(
//       user_email,
//       user_password,
//       user_first_name,
//       user_last_name,
//       user_bio
//     );

//     const userRepo = getConnection().getRepository(User);
//     const user0 = await userRepo.findOne({ where: { email: user_email } });
//     const task_deadline = new Date(2021, 8, 3);
//     console.log(task_deadline.toDateString());
//     const task_status = Status.NOT_STARTED;
//     const task_estimated_days = 10;
//     const task_id = await createTask(
//         user0.id, "Test Task", task_deadline,
//          task_status, [], null, "test description", task_estimated_days);
//     const taskRepo = getConnection().getRepository(Task);
//     const task = await taskRepo.findOne({ where: { id: task_id } });
//     expect(new Date(2021, 7, 24).toDateString()).toBe(getCalendarEventStartTime(task).toDateString())

// });

// // test that the event creation works for multiple users  
// test("oauth test", async() => {
//     const user_email = "asmuchtypescriptaspossible@gmail.com";
//     const user_password = "strong password";
//     const user_first_name = "TypeScript";
//     const user_last_name = "Tester";
//     const user_bio = "an awesome typescript";
//     await createUser(
//       user_email,
//       user_password,
//       user_first_name,
//       user_last_name,
//       user_bio
//     );

//     const user_email1 = "taskertestcal@gmail.com";
//     const user_password1 = "strong password";
//     const user_first_name1 = "Tasker";
//     const user_last_name1 = "TestCal";
//     const user_bio1 = "an awesome person";
//     await createUser(
//       user_email1,
//       user_password1,
//       user_first_name1,
//       user_last_name1,
//       user_bio1
//     );

//     const userRepo = await getConnection().getRepository(User);
//     const user = await userRepo.findOne({ where: { email: user_email } });
//     const user1 = await userRepo.findOne({ where: { email: user_email1 } });
//     // const codetypescript = "4/0AX4XfWjDeTWw_ACQ64cKwzRIHicU2KM3DMd4h9jYZZEgARWhmlYwVWJAlfjKcRWlW2UYhw";
//     // const codetaskertestcal = "4/0AX4XfWhBRa1e0Ke4OIJYBHrFvzgK3c_AiJkKhjButL08vQ1TaoIwtz6a9JjTsDjsvCBaJA";
//     // await createCalendarCredential(user, codetypescript);    
//     // await createCalendarCredential(user1, codetaskertestcal);
//     const calendarCredential = new CalendarCredential();
//     calendarCredential.user_id = user.id;
//     calendarCredential.refresh_token = "1//04qgpOruXS0C7CgYIARAAGAQSNwF-L9IrrBscH35oZ1PpJdtfjDM1b5eoHbiyEXxjJMFMVEo9-5QTbaN--HWrSrpa-cR59MLHm84";
//     calendarCredential.access_token = "ya29.a0ARrdaM8DzByvADPmWl08gcFHK8jii51FHmZx5yTSRjarrnEm3nougJn-DIKyoV2Eu7DAh8ZvPLMQhuqnz6fEBoT9ydPDBal8Fs5D47yXNhR04mEBGRWgCgCSCU8769YNr4HW6WVfArKQaYAsyybBerl6jabM";
//     await getConnection().manager.save(calendarCredential);

//     const calendarCredential1 = new CalendarCredential();
//     calendarCredential1.user_id = user1.id;
//     calendarCredential1.refresh_token = "1//04dJIPUIy8JHeCgYIARAAGAQSNgF-L9IrfMYBaFtsapTjGt3dvTffkWam-ys3cprrKMb3Ho6JERhB4UpwSpJcWq0MrqU3uOoVIQ";
//     calendarCredential1.access_token = "ya29.a0ARrdaM91eoG8wsMCpRIsqzwrK6CZCTy74Xo8pLSYbiNByoqtTkyZEm_kKeXkCDS7PLPsh1h1n4IahVT1uAbgmbzTy2LtyUalb1hZl--FMkU9G_kCT2uLQgPDvPSFDnf6XAK9-hN_LYy2FvmIOjqyIhw9ka5V";
//     await getConnection().manager.save(calendarCredential1);

//    await createUserConnection(user.id, user1.id);
//    await acceptRequest(user.id, user1.id);

//   const connRepo = getConnection().getRepository(Connection);
//   //for whatever reason the requestee and requester ids are switched here during lookup
//   const conn = await connRepo.findOne({
//     where: { requestee: user.id, requester: user1.id },
//   });
//   console.log(conn);
//     const task_deadline = new Date(2021, 8, 3);
//     const task_status = Status.NOT_STARTED;
//     const task_estimated_days = 10;
//     const task_id = await createTask(
//         user.id, "Test Task", task_deadline,
//         task_status, [user.id, user1.id], null, "test description", task_estimated_days);
//     // const taskAssignmentRepo = getConnection().getRepository(TaskAssignment);
//     // const taskAssignments = await taskAssignmentRepo.find({ where: { task: task_id } });
//     //      console.log(taskAssignments);

//     await saveTaskToCalendar(task_id);

// });




// // test that the oauth works 
// test("oauth test", async() => {
//     const user_email = "asmuchtypescriptaspossible@gmail.com";
//     const user_password = "strong password";
//     const user_first_name = "TypeScript";
//     const user_last_name = "Tester";
//     const user_bio = "an awesome typescript";
//     await createUser(
//       user_email,
//       user_password,
//       user_first_name,
//       user_last_name,
//       user_bio
//     );
//     const userRepo = await getConnection().getRepository(User);
//     const user = await userRepo.findOne({ where: { email: user_email } });

//     const code = "4/0AX4XfWjDeTWw_ACQ64cKwzRIHicU2KM3DMd4h9jYZZEgARWhmlYwVWJAlfjKcRWlW2UYhw";
//     await createCalendarCredential(user, code);
//     const calCred = await getCalendarCredential(user.id);
//     const task_deadline = new Date(2021, 8, 3);
//     const task_status = Status.NOT_STARTED;
//     const task_estimated_days = 10;
//     const task_id = await createTask(
//         user.id, "Test Task", task_deadline,
//         task_status, [user.id], null, "test description", task_estimated_days);
//     // const taskAssignmentRepo = getConnection().getRepository(TaskAssignment);
//     // const taskAssignments = await taskAssignmentRepo.find({ where: { task: task_id } });
//     //      console.log(taskAssignments);

//     await saveTaskToCalendar(task_id);

// });



//  test getting users allocated to a task
// test("get users allocated to task", async () => {
//   const user_email = "taskertestcal@gmail.com";
//   const user_password = "strong password";
//   const user_first_name = "Tasker";
//   const user_last_name = "TestCal";
//   const user_bio = "an awesome person";
//   await createUser(
//     user_email,
//     user_password,
//     user_first_name,
//     user_last_name,
//     user_bio
//   );

//   const user_email1 = "asmuchtypescriptaspossible@gmail.com";
//   const user_password1 = "stronger password";
//   const user_first_name1 = "dudeman";
//   const user_last_name1 = "broseph";
//   const user_bio1 = "an awesome person with a moustache";
//   await createUser(
//     user_email1,
//     user_password1,
//     user_first_name1,
//     user_last_name1,
//     user_bio1
//   );

//   const user_email2 = "alholda@webiste.com";
//   const user_password2 = "saffiztwehjfgsdlk";
//   const user_first_name2 = "Sammy";
//   const user_last_name2 = "J";
//   const user_bio2 = "an awesome person with a top hat";
//   await createUser(
//     user_email2,
//     user_password2,
//     user_first_name2,
//     user_last_name2,
//     user_bio2
//   );

//   const user_email3 = "cowboyboyboy@webiste.com";
//   const user_password3 = "696969hello";
//   const user_first_name3 = "Randy";
//   const user_last_name3 = "Randerson";
//   const user_bio3 = "an awesome person with a tickets to the gun show.";
//   await createUser(
//     user_email3,
//     user_password3,
//     user_first_name3,
//     user_last_name3,
//     user_bio3
//   );  

//   const userRepo = getConnection().getRepository(User);
//   const user0 = await userRepo.findOne({ where: { email: user_email } });
//   const user1 = await userRepo.findOne({ where: { email: user_email1 } });
//   const user2 = await userRepo.findOne({ where: { email: user_email2 } });
//   const user3 = await userRepo.findOne({ where: { email: user_email3 } });

//   await createUserConnection(user0.id, user1.id);
//   await createUserConnection(user0.id, user2.id);
//   await createUserConnection(user0.id, user3.id);
//   await createUserConnection(user1.id, user2.id);
//   await createUserConnection(user1.id, user3.id);
//   await createUserConnection(user2.id, user3.id);

//   const task = createTask(user0.id, "Test Task",
//     deadline: Date,
//     status: Status,
//     assignees?: string[] | null,
//     project?: string | null,
//     description?: string | null,
//     estimated_days?: number | null
//   await createUserConnection(user1.id, user2.id);

//   const connRepo = getConnection().getRepository(Connection);
//   //for whatever reason the requestee and requester ids are switched here during lookup
//   const conn = await connRepo.findOne({
//     where: { requestee: user1.id, requester: user2.id },
//   });
