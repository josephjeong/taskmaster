/*
    test file to test users-update.ts file
*/

import {v4 as uuidv4} from "uuid";
import { createConnection, getConnection } from "typeorm";

import { updateUser } from "../../src/users/users-update";
import { User } from "../../src/entity/User";
import { clearEntity } from "../test-helpers/clear";
import { createUser } from "../../src/users/users-create";


beforeEach(async () => {
    await createConnection();
    await clearEntity(User);
})

afterEach(async () => {
    return await getConnection().close();
})

/** clear out database after all tests run */
afterAll(async () => {
    const connection = await createConnection();
    await clearEntity(User);
    return await connection.close()
})

// throw error if trying to update to invalid email address
test('invalid email to update', async () => {
    let nonexistent_users = 
    [{id: '3d45abc1-f475-475d-896a-32018a032ce8', changes: {email: "helloshbaail.com"}}, 
    {id: 'c5b930f3-eed3-4f07-9dbd-a0466a763b49', changes: {email: "2helloshbam@gmm"}}];
    expect.assertions(nonexistent_users.length);
    await Promise.all(nonexistent_users.map(async (user) => await expect(
        updateUser(user.id, user.changes))
        .rejects.toEqual("Please Provide a Valid Email")
    ));
});

// throw error if email address is already assigned to other user
test('email already assigned to another user', async () => {
    let valid_emails = ['validemail@website.com', 'hello@platter.io'];
    // create the emails of the users
    await Promise.all(valid_emails.map(async (email) => await createUser(email, 'password', 'first_name', 'last_name', 'bio')));
    // the same emails should not be able to register
    expect.assertions(valid_emails.length);
    await Promise.all(valid_emails.map(async (email) => await expect(
        updateUser(uuidv4(), {email: email}))
        .rejects.toEqual("This email already has an account! You can't make this your email")
    ));
})


// 1. no such user exists update
test('no such user exists for update', async () => {
    let nonexistent_users = 
    [{id: '3d45abc1-f475-475d-896a-32018a032ce8', changes: {email: "helloshbam@gmail.com"}}, 
    {id: 'c5b930f3-eed3-4f07-9dbd-a0466a763b49', changes: {email: "2helloshbam@gmail.com"}}];
    expect.assertions(nonexistent_users.length);
    await Promise.all(nonexistent_users.map(async (user) => await expect(
        updateUser(user.id, user.changes))
        .rejects.toEqual("No Such User Exists to Update")
    ));
});

// 2. throw error if unknown attributes passed

// 3. check password hashed correctly

// 4. check other user properties correctly modified