import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.ts";
import loginRoutes from "./routes/login.ts";
import registerRoutes from "./routes/register.ts";
import ticketRoutes from "./routes/ticket.ts";
import newsRoutes from "./routes/news.ts";
dotenv.config();

const app = express();
const port = Deno.env.get("PORT") || 3000;
const mongoUri = Deno.env.get("MONGO_URI") || "";

app.use(express.json());
app.use("/user", userRoutes);
app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/ticket", ticketRoutes);
app.use("/news", newsRoutes);

mongoose.connect(mongoUri)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
  })
  .catch((err) => console.error("Error al conectar a MongoDB:", err));
