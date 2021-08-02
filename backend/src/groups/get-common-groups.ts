import { getConnection } from "typeorm";
import { Membership } from "../entity/Membership";
import { Group } from "../entity/Group";

export async function getCommonGroups(
  user_id: string,
  profile_user_id: string
): Promise<Group[]> {
  // if userid=profile get all groups

  //else onyl get common

  const mems = await getConnection()
    .getRepository(Membership)
    .find({ where: { user: user_id } });
  const groups = mems.map((a) => a.groupObj) as any;
  groups.sort(function (a: Group, b: Group) {
    return a.name.localeCompare(b.name);
  });
  return groups;
}
