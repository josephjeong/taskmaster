/*
    file to test whether tests are working
*/

import app from "../../src/index";
import request from "supertest";

import { createConnection, getConnection } from "typeorm";
import { User } from "../../src/entity/User";
import { clearEntity } from "../test-helpers/clear";
import { hashMatch } from "../../src/users/users-helpers";


// establish request for testing
const req = request(app);

beforeAll(async () => {
    await createConnection();
});
  
  beforeEach(async () => {
    await clearEntity(User);
});
  
/** clear out database after all tests run */
afterAll(async () => {
    await clearEntity(User);
    await getConnection().close();
});

it('creates a user correctly', async () => {
    const user_email = "validemail@webiste.com";
    const user_password = "strong password";
    const user_first_name = "dude";
    const user_last_name = "bro";
    const user_bio = "an awesome person";
    const res = await req.post('/users/signup').send({
        email: user_email,
        password: user_password,
        first_name: user_first_name,
        last_name: user_last_name,
        bio: user_bio
    });

    expect(res.body.token).toBeTruthy();

    const user = await getConnection()
        .getRepository(User)
        .find({ where: { email: user_email } });
    expect(user.length).toBe(1);
    expect(user[0].first_name).toBe(user_first_name);
    expect(user[0].last_name).toBe(user_last_name);
    expect(user[0].bio).toBe(user_bio);
    expect(hashMatch(user_password, user[0].password_hash)).toBe(true);

    return;
});

it('logs in a user correctly', async () => {
    const user_email = "validemail@webiste.com";
    const user_password = "strong password";
    const user_first_name = "dude";
    const user_last_name = "bro";
    const user_bio = "an awesome person";
    const res = await req.post('/users/signup').send({
        email: user_email,
        password: user_password,
        first_name: user_first_name,
        last_name: user_last_name,
        bio: user_bio
    });

    expect(res.body.token).toBeTruthy();

    const user = await getConnection()
        .getRepository(User)
        .find({ where: { email: user_email } });
    expect(user.length).toBe(1);
    expect(user[0].first_name).toBe(user_first_name);
    expect(user[0].last_name).toBe(user_last_name);
    expect(user[0].bio).toBe(user_bio);
    expect(hashMatch(user_password, user[0].password_hash)).toBe(true);

    return;
});