import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    ticketid: { type: String, required: true, unique: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    date: { type: String, required: true },
    price: { type: String, required: true },
    available:{type : Number, required: true, default: 1},
});


export const Ticket = mongoose.model("Tickets", ticketSchema);
