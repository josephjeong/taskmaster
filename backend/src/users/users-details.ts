/*
    file to allow users to see other people's profiles
*/

import { User } from "../entity/User";
import { getConnection } from "typeorm";
import { UserDetails } from "./users-interface";

export async function fetchUserDetails(id : string) : Promise<UserDetails> {
    const user = await getConnection().getRepository(User).find({where : {id : id}});
    if (user.length != 1) {throw "This Account does not exist";}

    let details : UserDetails =
     {
        avatar_url: user[0].avatar_url,
        email: user[0].email,
        first_name: user[0].first_name,
        last_name: user[0].last_name,
        bio: user[0].bio
    };
    
    return details;
}