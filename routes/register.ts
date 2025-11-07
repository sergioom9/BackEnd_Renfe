import express, { Request, Response } from "express";
import  bcrypt from "bcryptjs";
import { User } from "../DB/user.ts";
import {createJWT} from "../util.ts"

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        if(req.body.userid==null || req.body.name==null || req.body.email==null|| req.body.password==null){
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }
        if(!req.body.email.toString().includes("@")){res.status(500).json({ error: "El email parece invalido" });}
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        const user = new User({
            userid: req.body.userid,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            coins: req.body.coins || "0"
        });
        await user.save();
        const token = await createJWT({ userid:user.userid});
        res.set({
         "Set-Cookie": `bearer=${token}; HttpOnly; Secure; Path=/; SameSite=Strict`,
         "Content-Type": "application/json",
          }).status(200).json({success:"OK",userid:user.userid});
    } catch (err: Error | any) {
        res.status(500).json({ error: "Error interno servidor" });
    }
});

export default router;