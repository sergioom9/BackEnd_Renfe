import express, { Request, Response } from "express";
import { Ticket } from "../DB/tickets.ts";
import { TicketType } from "../types.ts";
import { User } from "../DB/user.ts";
import { UserType } from "../types.ts";

const router = express.Router();

//GET ALL TICKETS
router.get("/", async (req: Request, res: Response) => {
    try {
        if(req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const tickets: TicketType[] = await Ticket.find();
        res.status(200).json(tickets);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});

//GET ONE TICKET BY ID
router.get("/:ticketid", async (req: Request, res: Response) => {
    try {
        const ticketid = req.params.ticketid;
        if (!ticketid) {
            return res.status(400).json({ error: "Missing ticketid" });
        }
        const ticket: TicketType | null = await Ticket.findOne({ ticketid });
        if(!ticket){
            return res.status(404).json({ error: "Ticket not found" });
        }
        res.status(200).json(ticket);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});

//CREATE A TICKET
router.post("/create", async (req: Request, res: Response) => {
    try {
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
        res.status(200).json(ticket);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});

//SELL A TICKET
router.post("/sell", async (req: Request, res: Response) => {
    try {
        if(req.body.ticketid==null || req.body.userid==null){
            return res.status(400).json({ error: "Missing params" });
        }
        const ticketid=req.body.ticketid;
        const userid=req.body.userid;
        const ticket = await Ticket.findOne({ ticketid });
        if(!ticket){
            return res.status(404).json({ error: "Ticket not found" });
        }
        if(ticket.vendido){
            return res.status(400).json({ error: "Ticket already sold" });
        }
        const user = await User.findOne({ userid });
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }
        ticket.vendido=true;
        const coinsGained= (parseInt(ticket.price)/10).toString();
        ticket.coinsGained=coinsGained;
        ticket.userid=userid;
        user.coins=(parseInt(user.coins)+parseInt(coinsGained)).toString();
        await ticket.save();
        await user.save();
        res.status(200).json(ticket);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
