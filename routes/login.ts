import express, { Request, Response } from "express";
import  bcrypt from "bcryptjs";
import { User } from "../DB/user.ts";
import { UserType } from "../types.ts";
import { createJWT } from "../util.ts";

const router = express.Router();
//doc
router.post("/", async (req: Request, res: Response) => {
    try {
        if(req.body.email==null || req.body.password==null){
            return res.status(400).json({ error: "Missing params" });
        }
        if(!req.body.email.toString().includes("@")){res.status(500).json({ error: "El email parece invalido" });}
        const email=req.body.email;
        const user : UserType | null = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ error: "Not found" });
        }
        if(!await bcrypt.compare(req.body.password, user.password)){
            return res.status(404).json({ error: "Not found" });
        }
        const token = await createJWT({ userid:user.userid});
        res.set({
         "Set-Cookie": `bearer=${token}; Secure; Path=/; SameSite=Strict`,
         "Content-Type": "application/json",
          }).status(200).json({success:"OK",userid:user.userid});
        } catch (err: Error | any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});



export default router;