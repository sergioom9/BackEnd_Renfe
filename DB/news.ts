import mongoose from "mongoose";

const newsSquema = new mongoose.Schema({
    newid: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true }
});

export const News = mongoose.model("News", newsSquema);
