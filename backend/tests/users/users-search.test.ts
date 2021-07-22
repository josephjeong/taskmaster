import { createConnection, getConnection } from "typeorm";
import { clearEntity } from "../test-helpers/clear";
import { User } from "../../src/entity/User";
import { createUser } from "../../src/users/users-create";
import { getUserIdByEmail } from "../../src/users/users-search";

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

describe("getUserIdByEmail", () => {
  it("Should return the correct id for a user's email", async () => {
    const details = {
      email: "soorria.ss@gmail.com",
      password: "great password",
      first_name: "soorria",
      last_name: "saruva",
      bio: "",
    };
    await createUser(
      details.email,
      details.password,
      details.first_name,
      details.last_name,
      details.bio
    );

    const [userInDb] = await getConnection()
      .getRepository<User>(User)
      .find({ where: { email: details.email } });

    const expectedUserId = userInDb.id;

    const foundId = await getUserIdByEmail(details.email);

    expect(foundId).toBe(expectedUserId);
  });
  it("Should return null when the no user has the email", async () => {
    const id = await getUserIdByEmail("soorria.ss@gmail.com");
    expect(id).toBeNull();
  });
  it("Should return null when email is invalid", async () => {
    const id = await getUserIdByEmail("not a valid email");
    expect(id).toBeNull();
  });
});
