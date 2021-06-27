/*
    simple file to test users-login.ts
*/

import { createConnection, getConnection } from "typeorm";
import { clearEntity } from "../test-helpers/clear";
import { User } from "../../src/entity/User";
import { loginUser } from "../../src/users/users-login";

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

// test password correct