import express, { Request, Response } from "express";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { User } from "../DB/user.ts";
import { UserType } from "../types.ts";
const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        if(req.body.userid==null || req.body.name==null || req.body.email==null|| req.body.password==null){
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password);
        const user = new User({
            userid: req.body.userid,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            coins: req.body.coins || "0"
        });
        await user.save();
        res.status(200).json(user);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;