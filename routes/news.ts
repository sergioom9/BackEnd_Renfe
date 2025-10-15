import express, { Request, Response } from "express";
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { News } from "../DB/news.ts";
import { NewsType } from "../types.ts";
const router = express.Router();


//GET ALL NEWS
router.get("/", async (req: Request, res: Response) => {
    try {
        if(req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const news: NewsType[] = await News.find();
        res.status(200).json(news);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});

//GET ONE NEW BY ID
router.get("/:newid", async (req: Request, res: Response) => {
    try {
        const newid = req.params.newid;
        if (!newid) {
            return res.status(400).json({ error: "Missing newid" });
        }
        const uniquenew : NewsType | null = await News.findOne({ newid });
        if(!uniquenew){
            return res.status(404).json({ error: "New not found" });
        }
        res.status(200).json(uniquenew);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/create", async (req: Request, res: Response) => {
    try {
        if(req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`){
            return res.status(401).json({ error: "Unauthorized" });
        }
        if(req.body.newid==null || req.body.title==null|| req.body.content==null|| req.body.date==null){
            return res.status(400).json({ error: "Missing params" });
        }
        const news = new News({
            newid: req.body.newid,
            image: req.body.image || "",
            title: req.body.title,
            content: req.body.content,
            date: req.body.date
        });
        await news.save();
        res.status(200).json(news);
    } catch (err: Error | any) {
        res.status(500).json({ error: err.message });
    }
});


export default router;
