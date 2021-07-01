/*
    test file to test users-update.ts file
*/

import { createConnection, getConnection } from "typeorm";

import {User} from "../../src/entity/User";
import { Connection } from "../../src/entity/Connection";
import { createUser } from "../../src/users/users-create";
import { createUserConnection, acceptRequest, declineRequest, isConnected } from "../../src/connection";
import { clearEntity } from "../test-helpers/clear";

beforeAll(async () => {
    await createConnection();
});

beforeEach(async () => {
    await clearEntity(Connection);
    await clearEntity(User);
});

/** clear out database after all tests run */
afterAll(async () => {
    await clearEntity(Connection);
    await clearEntity(User);
    return await getConnection().close()
});

// 1. test creation of connection. 
test('Connection correctly created', async () => {
    const user_email = 'validemail@webiste.com'
    const user_password = 'strong password'
    const user_first_name = 'dude';
    const user_last_name = 'bro';
    const user_bio = 'an awesome person';
    await createUser(
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_bio
    )

    const user_email1 = 'validemail888@webiste.com'
    const user_password1 = 'stronger password'
    const user_first_name1 = 'dudeman';
    const user_last_name1 = 'broseph';
    const user_bio1 = 'an awesome person with a moustache';
    await createUser(
        user_email1,
        user_password1,
        user_first_name1,
        user_last_name1,
        user_bio1
    )

    const userRepo = getConnection().getRepository(User);
    const user1 = await userRepo.findOne({where : {email : user_email}});
    const user2 = await userRepo.findOne({where : {email : user_email1}});

    await createUserConnection(user1.id, user2.id);
    
    const connRepo = getConnection().getRepository(Connection);
    //for whatever reason the requestee and requester ids are switched here during lookup
    const conn = await connRepo.findOne({where : {requestee : user1.id, requester: user2.id}});
    console.log(conn);
    expect(conn.accepted).toEqual(false);
    expect(conn.requestee).toBe(user1.id);
    expect(conn.requester).toBe(user2.id);
    
});
// 2. test accepting of connection.
test('Connection correctly accepted', async () => {
    const user_email = 'validemail@webiste.com'
    const user_password = 'strong password'
    const user_first_name = 'dude';
    const user_last_name = 'bro';
    const user_bio = 'an awesome person';
    await createUser(
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_bio
    )

    const user_email1 = 'validemail888@webiste.com'
    const user_password1 = 'stronger password'
    const user_first_name1 = 'dudeman';
    const user_last_name1 = 'broseph';
    const user_bio1 = 'an awesome person with a moustache';
    await createUser(
        user_email1,
        user_password1,
        user_first_name1,
        user_last_name1,
        user_bio1
    )

    const userRepo = getConnection().getRepository(User);
    const user1 = await userRepo.findOne({where : {email : user_email}});
    const user2 = await userRepo.findOne({where : {email : user_email1}});

    await createUserConnection(user1.id, user2.id);
    await acceptRequest(user1.id, user2.id);
    const connRepo = getConnection().getRepository(Connection);
    const conn = await connRepo.findOne({where : {requestee : user1.id, requester: user2.id}});
    console.log(conn);
    expect(conn.accepted).toEqual(true);
    expect(conn.requestee).toBe(user1.id);
    expect(conn.requester).toBe(user2.id);
    
});
// 3. test declination of connection.
test('Connection correctly declined', async () => {
    const user_email = 'validemail@webiste.com'
    const user_password = 'strong password'
    const user_first_name = 'dude';
    const user_last_name = 'bro';
    const user_bio = 'an awesome person';
    await createUser(
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_bio
    )

    const user_email1 = 'validemail888@webiste.com'
    const user_password1 = 'stronger password'
    const user_first_name1 = 'dudeman';
    const user_last_name1 = 'broseph';
    const user_bio1 = 'an awesome person with a moustache';
    await createUser(
        user_email1,
        user_password1,
        user_first_name1,
        user_last_name1,
        user_bio1
    )

    const userRepo = getConnection().getRepository(User);
    const user1 = await userRepo.findOne({where : {email : user_email}});
    const user2 = await userRepo.findOne({where : {email : user_email1}});

    await createUserConnection(user1.id, user2.id);
    await declineRequest(user1.id, user2.id);
    const connRepo = getConnection().getRepository(Connection);
    const connDeleted = await connRepo.find({where : {requestee : user1.id}});
    expect(connDeleted).toHaveLength(0);
});

// 4. test adding users multiple times
test('Connection prevented when trying to add existing connection', async () => {
    const user_email = 'validemail@webiste.com'
    const user_password = 'strong password'
    const user_first_name = 'dude';
    const user_last_name = 'bro';
    const user_bio = 'an awesome person';
    await createUser(
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_bio
    )

    const user_email1 = 'validemail888@webiste.com'
    const user_password1 = 'stronger password'
    const user_first_name1 = 'dudeman';
    const user_last_name1 = 'broseph';
    const user_bio1 = 'an awesome person with a moustache';
    await createUser(
        user_email1,
        user_password1,
        user_first_name1,
        user_last_name1,
        user_bio1
    )

    const userRepo = getConnection().getRepository(User);
    const user1 = await userRepo.findOne({where : {email : user_email}});
    const user2 = await userRepo.findOne({where : {email : user_email1}});

    await createUserConnection(user1.id, user2.id);
    expect(await createUserConnection(user1.id, user2.id)).toBe('Connection already exists');
});

// 5. test adding users multiple times vice versa
test('Connection prevented when trying to add existing connection where users were switched', async () => {
    const user_email = 'validemail@webiste.com'
    const user_password = 'strong password'
    const user_first_name = 'dude';
    const user_last_name = 'bro';
    const user_bio = 'an awesome person';
    await createUser(
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_bio
    )

    const user_email1 = 'validemail888@webiste.com'
    const user_password1 = 'stronger password'
    const user_first_name1 = 'dudeman';
    const user_last_name1 = 'broseph';
    const user_bio1 = 'an awesome person with a moustache';
    await createUser(
        user_email1,
        user_password1,
        user_first_name1,
        user_last_name1,
        user_bio1
    )

    const userRepo = getConnection().getRepository(User);
    const user1 = await userRepo.findOne({where : {email : user_email}});
    const user2 = await userRepo.findOne({where : {email : user_email1}});

    await createUserConnection(user1.id, user2.id);
    expect(await createUserConnection(user2.id, user1.id)).toBe('Connection already exists');
});

// 5. test if two users are not connected
test('if two users are not connected', async () => {
    const user_email = 'validemail@webiste.com'
    const user_password = 'strong password'
    const user_first_name = 'dude';
    const user_last_name = 'bro';
    const user_bio = 'an awesome person';
    await createUser(
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_bio
    )

    const user_email1 = 'validemail888@webiste.com'
    const user_password1 = 'stronger password'
    const user_first_name1 = 'dudeman';
    const user_last_name1 = 'broseph';
    const user_bio1 = 'an awesome person with a moustache';
    await createUser(
        user_email1,
        user_password1,
        user_first_name1,
        user_last_name1,
        user_bio1
    )

    const userRepo = getConnection().getRepository(User);
    const user1 = await userRepo.findOne({where : {email : user_email}});
    const user2 = await userRepo.findOne({where : {email : user_email1}});

    await createUserConnection(user1.id, user2.id);
    //console.log(isConnected(user1.id, user2.id));
    expect(await isConnected(user1.id, user2.id)).toEqual(false);
});
// test if two users are connected
test('if two users are connected', async () => {
    const user_email = 'validemail@webiste.com'
    const user_password = 'strong password'
    const user_first_name = 'dude';
    const user_last_name = 'bro';
    const user_bio = 'an awesome person';
    await createUser(
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_bio
    )

    const user_email1 = 'validemail888@webiste.com'
    const user_password1 = 'stronger password'
    const user_first_name1 = 'dudeman';
    const user_last_name1 = 'broseph';
    const user_bio1 = 'an awesome person with a moustache';
    await createUser(
        user_email1,
        user_password1,
        user_first_name1,
        user_last_name1,
        user_bio1
    )

    const userRepo = getConnection().getRepository(User);
    const user1 = await userRepo.findOne({where : {email : user_email}});
    const user2 = await userRepo.findOne({where : {email : user_email1}});

    await createUserConnection(user1.id, user2.id);
    await acceptRequest(user1.id, user2.id);
    expect(await isConnected(user1.id, user2.id)).toEqual(true);
});