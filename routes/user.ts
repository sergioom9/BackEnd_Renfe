import express, { Request, Response } from "express";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from "../DB/user.ts";
import { TicketType, UserType } from "../types.ts";
import { Ticket } from "../DB/tickets.ts";
const router = express.Router();


//GET ALL USERS
router.get("/", async (req: Request, res: Response) => {
    try {
        if(req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const users: UserType[] = await User.find();
        res.status(200).json(users);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});

//GET ONE USER BY ID
router.get("/:userid", async (req: Request, res: Response) => {
    try {
        const userid = req.params.userid;
        if (!userid) {
            return res.status(400).json({ error: "Missing userid" });
        }
        const user: UserType | null = await User.findOne({ userid });
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});


router.get("/tickets/:userid", async (req: Request, res: Response) => {
    try {
        const userid = req.params.userid;
        if (!userid) {
            return res.status(400).json({ error: "Missing userid" });
        }
        const tickets: TicketType[] | null = await Ticket.find({ userid });
        if(!tickets){
            return res.status(404).json({ error: "User has no tickets" });
        }
        res.status(200).json(tickets);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});


export default router;
