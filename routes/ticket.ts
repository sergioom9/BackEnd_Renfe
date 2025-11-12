import express, { Request, Response } from "express";
import { Ticket } from "../DB/tickets.ts";
import { TicketType } from "../types.ts";
import { User } from "../DB/user.ts";
import { checkAuth } from "../util.ts";

const router = express.Router();

//doc
router.get("/", async (_req: Request, res: Response) => {
    try {
        const tickets: TicketType[] = await Ticket.find().select("-__v -_id -userid -coinsGained");
        res.status(200).json(tickets);
    } catch (err: Error | any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//doc
router.get("/:ticketid", async (req: Request, res: Response) => {
    try {
        const ticketid = req.params.ticketid;
        if (!ticketid) {
            return res.status(400).json({ error: "Missing params" });
        }
        const ticket: TicketType | null = await Ticket.findOne({ ticketid }).select("-__v -_id -userid -coinsGained");
        if(!ticket){
            return res.status(404).json({ error: "Not Found" });
        }
        res.status(200).json(ticket);
    } catch (err: Error | any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//doc
router.post("/create", async (req: Request, res: Response) => {
    try {
        if(req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`){
            return res.status(401).json({ error: "Unauthorized" });
        }
        if(req.body.ticketid==null || req.body.origin==null|| req.body.destination==null|| req.body.date==null|| req.body.price==null){
            return res.status(400).json({ error: "Missing params" });
        }
        const ticket = new Ticket({
            ticketid: req.body.ticketid,
            origin: req.body.origin,
            destination: req.body.destination,  
            date: req.body.date,
            price: req.body.price,
            vendido:false
        });
        await ticket.save();
        if(!ticket){
            res.status(409).json({error:"Ticketid exists"});
        }
        res.status(200).json({success:"OK",ticketid:ticket.ticketid});
    } catch (err: Error | any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//doc
router.post("/sell", async (req: Request, res: Response) => {
    try {
        if(req.body.ticketid==null || req.body.userid==null){
            return res.status(400).json({ error: "Missing params" });
        }
        const ticketid=req.body.ticketid;
        const userid=req.body.userid;
        const isAuth = await checkAuth(userid,req.cookies.bearer)
        if(!isAuth && (req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`)){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const ticket = await Ticket.findOne({ ticketid });
        const user = await User.findOne({ userid });
        if(!ticket || !user || ticket.vendido){
            return res.status(404).json({ error: "Not found" });
        }
        ticket.vendido=true;
        const coinsGained= (parseInt(ticket.price)/10).toString();
        ticket.coinsGained=coinsGained;
        ticket.userid=userid;
        user.coins=(parseInt(user.coins)+parseInt(coinsGained)).toString();
        await ticket.save();
        await user.save();
        res.status(200).json({success:"OK",ticketid:ticket.ticketid,userid:user.userid});
    } catch (err: Error | any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//doc
router.put("/", async (req: Request, res: Response) => {
    try {
        if(req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`){
            return res.status(401).json({ error: "Unauthorized" });
        }
        if(req.body.ticketid==null || req.body.origin==null|| req.body.destination==null|| req.body.date==null|| req.body.price==null){
            return res.status(400).json({ error: "Missing params" });
        }
        const ticket: TicketType | null = await Ticket.findOne({ ticketid: req.body.ticketid });
        if(!ticket){
            return res.status(404).json({ error: "Not found" });
        }
        await Ticket.updateOne({ ticketid: req.body.ticketid }, {
            $set: {
                origin: req.body.origin,
                destination: req.body.destination,
                date: req.body.date,
                price: req.body.price
            }
        });
        res.status(200).json({success:"OK",ticketid:req.body.ticketid});
    } catch (err: Error | any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//doc
router.delete("/:ticketid", async (req: Request, res: Response) => {
    try {
        if(req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const ticketid = req.params.ticketid;
        if (!ticketid) {
            return res.status(400).json({ error: "Missing params" });
        }
        const ticket: TicketType | null = await Ticket.findOne({ ticketid });
        if(!ticket){
            return res.status(404).json({ error: "Not found" });
        }
        await Ticket.deleteOne({ ticketid });
        res.status(200).json({success:"OK",ticketid:ticketid});
    } catch (err: Error | any) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;

