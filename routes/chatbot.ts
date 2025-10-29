import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { News } from "../DB/news.ts";
import { Ticket } from "../DB/tickets.ts";
import { User } from "../DB/user.ts";

dotenv.config();
const router = express.Router();
const apiKey = Deno.env.get("GOOGLE_API_KEY");
if (!apiKey) throw new Error("GOOGLE_API_KEY no encontrada.");


const callAI = async (prompt: string) => {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
  const body = JSON.stringify({
    contents: [{
      role: "user",
      parts: [{
        text:
          `Interpret this prompt and return a response with only this { "action": "getAllTickets", "params": {} }, ${prompt}
        Possible actions :  getAllTickets.  getTicketsByOrigin , getTicketsByDestination, getTicketsByOriginandDestination, getNewsByDate, getAllNews, getUserDetails
        Some examples : {"action": "nombreDeLaAccion","params": { "clave": "valor" }, params can be origin,destination, origin and destination, date and email,
        Only answer with the json like this example : { "action": "", "params": {} } 
        `,
      }],
    }],
  });

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey!,
    },
    body,
  });

  if (!res.ok) throw new Error(`Error AI`);
  const data = await res.json();

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const cleandata = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleandata);
};

const executeAction = async (action: string, params: any) => {
  switch (action) {
    case "getAllTickets":
      return await Ticket.find().select(
        "-_id -__v -coinsGained -userid -vendido -ticketid",
      ).limit(10);
    case "getTicketsByOrigin":
      return await Ticket.find({ origin: params.origin }).select(
        "-_id -__v -coinsGained -userid -vendido -ticketid",
      ).limit(10);
    case "getTicketsByDestination":
      return await Ticket.find({ destination: params.destination }).select(
        "-_id -__v -coinsGained -userid -vendido -ticketid",
      ).limit(10);
    case "getTicketsByOriginandDestination":
      return await Ticket.find({
        origin: params.origin,
        destination: params.destination,
      }).select("-_id -__v -coinsGained -userid -vendido -ticketid").limit(10);
    case "getNewsByDate":
      return await News.find({ date: params.date }).select("-_id -__v -newid")
        .limit(10);
    case "getAllNews":
      return await News.find().select("-_id -__v -newid").limit(10);
    case "getUserDetails":
      return await User.findOne({ email: params.email }).select(
        "-password -_id -__v ",
      );
    default:
      throw new Error("Accion no reconocida");
  }
};

router.post("/", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });
    const aiResponse = await callAI(prompt);
    const { action, params } = aiResponse;
    const result = await executeAction(action, params);
    if(result==null){res.status(500).json({ error: "Error" });}
    res.status(200).json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Error" });
  }
});

export default router;
