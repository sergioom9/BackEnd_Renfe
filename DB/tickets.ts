import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    ticketid: { type: String, required: true, unique: true },
    userid: { type: String, required: false },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: String, required: true },
    price: { type: String, required: true },
    coinsGained: { type: String, required: false },
    vendido: { type: Boolean, required: true, default: false}
});


export const Ticket = mongoose.model("Tickets", ticketSchema);
