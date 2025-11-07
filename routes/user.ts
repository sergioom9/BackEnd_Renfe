import express, { Request, Response } from "express";
import  bcrypt from "bcryptjs";
import { User } from "../DB/user.ts";
import { TicketType, UserType } from "../types.ts";
import { Ticket } from "../DB/tickets.ts";
import { checkAuth } from "../util.ts";


const router = express.Router();

//GET ALL USERS
router.get("/", async (req: Request, res: Response) => {
    try {
        if(req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const users: UserType[] = await User.find().select("-password -__v -_id");
        res.status(200).json(users);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});

//GET ONE USER BY ID
router.get("/:userid", async (req: Request, res: Response) => {
    try {
        const userid = req.params.userid
        const isAuth = await checkAuth(userid,req.cookies.bearer)
        if(!isAuth){
           return res.status(400).json({ error: "Not yourself or not admin" });
        }
        const user: UserType | null = await User.findOne({ userid }).select("-password -__v -_id");
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (err: Error | any) {
        res.status(500).json({ error: "Error interno servidor" });
    }
});

//GET TICKETS OF A USER BY USERID
router.get("/tickets/:userid", async (req: Request, res: Response) => {
    try {
        const userid = req.params.userid
        const isAuth = await checkAuth(userid,req.cookies.bearer)
        if(!isAuth){
           return res.status(400).json({ error: "Not yourself or not admin" });
        }
        const tickets: TicketType[] | null = await Ticket.find({ userid }).select("-__v -_id");
        if(!tickets){
            return res.status(404).json({ error: "User has no tickets" });
        }
        res.status(200).json(tickets);
    } catch (err: Error | any) {
        res.status(500).json({ error: "Error interno servidor" });
    }
});

//DELETE A USER BY ID
router.delete("/:userid", async (req: Request, res: Response) => {
    try {
        const userid = req.params.userid
        const isAuth = await checkAuth(userid,req.cookies.bearer)
        if(!isAuth){
           return res.status(400).json({ error: "Not yourself or not admin" });
        }
        const deletedUser = await User.deleteOne({ userid });
        if(deletedUser){
            return res.status(200).json({ message: "User Deleted Succesfully" });
        }
        res.status(401).json({error: "Error Deleting User"});
        } catch (err: Error | any) {
        res.status(500).json({ error: "Error interno servidor" });
    }
});

//UPDATE A USER BY ID
router.put("/", async (req: Request, res: Response) => {
    try {
            const userid = req.body.userid
            const isAuth = await checkAuth(userid,req.cookies.bearer)
            if(!isAuth){
            return res.status(400).json({ error: "Not yourself or not admin" });
            }
            if(req.body.userid==null || req.body.name==null || req.body.email==null|| req.body.password==null){
                return res.status(400).json({ error: "Faltan datos obligatorios" });
            }
            const hashedPassword = await bcrypt.hash(req.body.password,10);
            const useractual = await User.findOne({ userid: req.body.userid });
            if(!useractual){
                return res.status(404).json({ error: "User not found" });
            }
            const coins = useractual ? useractual.coins : "0";
            await User.updateOne(
                { userid: req.body.userid },
                { name: req.body.name, email: req.body.email, password: hashedPassword, coins: coins }
            );
            res.status(200).json({message:"User Updated Succesfully"});
        } catch (err: Error | any) {
            res.status(500).json({ error: "Error interno servidor" });
        }
});

export default router;
