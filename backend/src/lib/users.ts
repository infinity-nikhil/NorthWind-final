//This function basically takes the user id given to if
//no need to check cause checking is already done in meRouter from clerk side getAuth()
//this is just to query the user id from the db and return rest of the information

import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema";

//eq means equal btw 

export async function getLocalUser(clerkUserId:string) {
    //And this query is human readable like youa all can understand it right ?
    const [row] = await db.select().from(users).where(eq(users.clerkUserId, clerkUserId)).limit(1);
    return row;
}