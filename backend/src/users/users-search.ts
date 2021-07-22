import { User } from "../entity/User";
import { getConnection } from "typeorm";

export const getUserIdByEmail = async (
  maybeEmail: string
): Promise<string | null> => {
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
