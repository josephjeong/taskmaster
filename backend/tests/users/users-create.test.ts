/*
    test file to test users-create.ts file
*/

import { User } from "../../src/entity/User";
import { clearEntity } from "../test-helpers/clear";
import { createUser } from "../../src/users/users-create"
import { createConnection, getConnection } from "typeorm";

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

// 1. test email regex check
test('incorrect email regex error', async () => {
    let invalid_emails = ['not a valid email', 'bob mcgee', 'hello.com', 'joe@com'];
    expect.assertions(invalid_emails.length);
    await Promise.all(invalid_emails.map(async (email) => await expect(
        createUser(email, 'password', 'first_name', 'last_name', 'bio'))
        .rejects.toEqual("Please Provide a Valid Email")
    ));
});

test('correct email regex working', async () => {
    let valid_emails = ['validemail@website.com', 'hello@platter.io'];
    await Promise.all(valid_emails.map(async (email) => await expect(
        createUser(email, 'password', 'first_name', 'last_name', 'bio'))
        .resolves.toBeDefined()
    ))
});

// 2. check existing email error
test('existing email conflict error', async () => {
    let valid_emails = ['validemail@website.com', 'hello@platter.io'];
    // create the emails of the users
    await Promise.all(valid_emails.map(async (email) => await createUser(email, 'password', 'first_name', 'last_name', 'bio')));
    // the same emails should not be able to register
    expect.assertions(valid_emails.length);
    await Promise.all(valid_emails.map(async (email) => await expect(
        createUser(email, 'password', 'first_name', 'last_name', 'bio'))
        .rejects.toEqual("This email already has an account! Please log in.")
    ));
});

// 3. check users are created
test('users correctly created', async () => {
    const user_email = 'validemail@webiste.com'
    const user_first_name = 'dude';
    const user_last_name = 'bro';
    const user_bio = 'an awesome person';
    await createUser(
        user_email,
        'strong password',
        user_first_name,
        user_last_name,
        user_bio
    )
    const user = await getConnection().getRepository(User).find({where : {email : user_email}});
    expect(user.length).toBe(1);
    expect(user[0].first_name).toBe(user_first_name);
    expect(user[0].last_name).toBe(user_last_name);
    expect(user[0].bio).toBe(user_bio);
});