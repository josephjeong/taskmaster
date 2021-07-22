import { User } from "../entity/User";
import { getConnection } from "typeorm";
import { ApiError } from "../errors";
import { regexEmailCheck } from "./users-helpers";

export const getUserIdByEmail = async (
  maybeEmail: unknown
): Promise<string | null> => {
  if (typeof maybeEmail !== "string" || !regexEmailCheck(maybeEmail)) {
    throw new ApiError(
      "user_search/invalid_email",
      "Please enter a valid email"
    );
  }

  const userRepo = getConnection().getRepository<User>(User);

  const [user] = await userRepo.find({
    where: { email: maybeEmail },
    select: ["id"],
    take: 1,
  });

  // User not found
  if (!user) return null;

  return user.id;
};
