import { createUser } from "../../src/users/users-create"

async function testing() {
    const token1 = await createUser("joe.b.jeong@gmail.com", "password!!!", "joseph", "jeong", "lmfao");
    const token2 = await createUser("joe.b.jeong2@gmail.com", "passw2ord!!!", "jo2seph", "jeo2ng", "lmf2ao");


}

testing()