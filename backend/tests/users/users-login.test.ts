/*
    simple file to test users-login.ts
*/

import { createConnection, getConnection } from "typeorm";
import { clearEntity } from "../test-helpers/clear";
import { User } from "../../src/entity/User";
import { loginUser } from "../../src/users/users-login";
import { createUser } from "../../src/users/users-create";
import { decodeJWTPayload } from "../../src/users/users-helpers";

beforeAll(async () => {
    await createConnection();
});

beforeEach(async () => {
    await clearEntity(User);
});

/** clear out database after all tests run */
afterAll(async () => {
    await clearEntity(User);
    return await getConnection().close()
});

// test incorrect emails
test('invalid email regex while login', async () => {
    let invalid_emails = ['not a valid email', 'bob mcgee', 'hello.com', 'joe@com'];
    expect.assertions(invalid_emails.length);
    await Promise.all(invalid_emails.map(async (email) => await expect(
        loginUser(email, 'password'))
        .rejects.toEqual("Please Provide a Valid Email")
    ));
});

// test account not exist
test('account with email does not exist', async () => {
    let valid_emails = ['validemail@website.com', 'hello@platter.io'];
    expect.assertions(valid_emails.length);
    await Promise.all(valid_emails.map(async (email) => await expect(
        loginUser(email, 'password'))
        .rejects.toEqual("An account with this email does not exist.")
    ));
});

// test password incorect
test('incorrect password login', async () => {
    const user_email = 'validemail@webiste.com';
    const user_password = 'strong password';
    const user_first_name = 'dude';
    const user_last_name = 'bro';
    const user_bio = 'an awesome person';
    await createUser(
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_bio
    );
    
    // expect an incorrect password
    expect.assertions(1);
    await expect(loginUser(user_email, 'incorrect password'))
    .rejects.toEqual("This is an incorrect password.");
});

// test password correct
test('correct password login', async () => {
    const user_email = 'validemail@webiste.com';
    const user_password = 'strong password';
    const user_first_name = 'dude';
    const user_last_name = 'bro';
    const user_bio = 'an awesome person';
    const create_token = await createUser(
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_bio
    );
    
    const login_token = await loginUser(user_email, user_password)

    expect((await decodeJWTPayload(login_token)).id).toBe((await decodeJWTPayload(create_token)).id) 
});