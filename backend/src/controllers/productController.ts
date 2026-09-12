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

//Now this function just to fetch a particluar row from the db i.e. category 
export async function getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
        //This is bassically that what else category do we have....and when user cliks on one upper controller gets trigger
        //It just gives specific row from db such as camera, audia, accessories, home, travel etc
        const rows = await db.select({ category: products.category }).from(products).where(eq(products.active, true));

        //this is to sort them alphabetically
        const categories = [...new Set(rows.map((r) => r.category))].sort((a, b) => a.localeCompare(b));

        res.json({ categories });
    } catch (e) {
        next(e);
    }
}

//If you have came this far then i don't think you should be having probem to understand the logic here 
export async function getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
        const [row] = await db.select().from(products).where(eq(products.slug, req.params.slug as string)).limit(1);

        if(!row || !row.active) return res.status(404).json({ error: "Not found"});

        res.json({ product: row});
    } catch (e) {
        next(e)
    }
}