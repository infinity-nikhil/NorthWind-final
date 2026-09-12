import type { Request, Response, NextFunction } from "express";
import { db } from "../db";
import { products } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function listProduct( req: Request, res: Response, next: NextFunction) {
    try {
        // learning - typeof -> can be used in 3 cases 
                // to return the var type, 
                // to assign a type to the var, 
                // to return a bool on the condition (like here)

        //it says if the category is of type string then this or else that ....
        const cat = typeof req.query.category === "string" ? req.query.category.trim() : "";

        //only those products who have an active tag on them
        //But does it means we will fetch all the active product ?? ---> ofc not 
        const activeOnly = eq(products.active, true);

        //so here is the second query filter
        //the thing is cat is not a boolean it is a string then how the logic if true then this else that logic is valid here 
        // we are using the concept of truthly and falst here ...since cat can either be something or nothing ....iykyk
        const whereClause = cat ? and(activeOnly, eq(products.category, cat)) : activeOnly;
        //And you might think what is this and from orm ? It basically says that both the conditions must be true. 
        const rows = await db.select().from(products).where(whereClause).orderBy(desc(products.createdAt));

        res.json({ products: rows });
    } catch (e) {
        next(e);
    }
}