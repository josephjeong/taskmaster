/*
    Helper file to clear out databases between test runs
*/

import { createConnection} from "typeorm";

import { User } from "../../src/entity/User";

/** simple helper function to clear a table of entity table */
export async function clearEntity(entity : typeof User | any) {
    const connection = await createConnection();
    return await connection.createQueryBuilder().delete().from(entity).execute();
}