import express, { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { User } from "../DB/user.ts";
import { UserType } from "../types.ts";
const router = express.Router();


router.post("/", async (req: Request, res: Response) => {
    try {
        if(req.body.email==null || req.body.password==null){
            return res.status(400).json({ error: "Missing params" });
        }
        const email=req.body.email;
        const user : UserType | null = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ error: "Invalid user" });
        }
        if(!await bcrypt.compare(req.body.password, user.password)){
            return res.status(401).json({ error: "Invalid password" });
        }
        res.status(200).json({userid:user.userid, name:user.name, email:user.email, coins:user.coins});
        } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;