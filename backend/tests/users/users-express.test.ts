/*
    file to test whether tests are working
*/

import app from "../../src/index";

import request from "supertest"

import { createConnection, getConnection } from "typeorm";
import { User } from "../../src/entity/User";
import { clearEntity } from "../test-helpers/clear";

beforeAll(async () => {
    await createConnection();
});
  
  beforeEach(async () => {
    await clearEntity(User);
});
  
/** clear out database after all tests run */
afterAll(async () => {
    await clearEntity(User);
    return await getConnection().close();
});

// establish request for testing
const res = request(app);