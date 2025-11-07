import express, { Request, Response } from "express";
import { News } from "../DB/news.ts";
import { NewsType } from "../types.ts";
const router = express.Router();


//GET ALL NEWS
router.get("/", async (_req: Request, res: Response) => {
    try {
        const news: NewsType[] = await News.find().select("-__v -_id");
        res.status(200).json(news);
    } catch (err: Error | any) {
        res.status(500).json({ error: "Error interno servidor" });
    }
});

//GET ONE NEW BY ID
router.get("/:newid", async (req: Request, res: Response) => {
    try {
        const newid = req.params.newid;
        if (!newid) {
            return res.status(400).json({ error: "Missing newid" });
        }
        const uniquenew : NewsType | null = await News.findOne({ newid }).select("-__v -_id");
        if(!uniquenew){
            return res.status(404).json({ error: "New not found" });
        }
        res.status(200).json(uniquenew);
    } catch (err: Error | any) {
        res.status(500).json({ error: "Error interno servidor" });
    }
});

//CREATE A NEW
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
        res.status(200).json({success:"OK",newid:news.newid});
    } catch (err: Error | any) {
        res.status(500).json({ error: "Error interno servidor" });
    }
});

//UPDATE A NEW
router.put("/", async (req: Request, res: Response) => {
    try {
        if(req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`){
            return res.status(401).json({ error: "Unauthorized" });
        }
        if(req.body.newid==null){
            return res.status(400).json({ error: "Missing newid" });
        }
        const newid=req.body.newid;
        const updatedNew = await News.updateOne({ newid }, { $set: {
                image: req.body.image,
                content: req.body.content,
                title: req.body.title,
                date: req.body.date
            } });
        if(updatedNew){
            const uniquenew : NewsType | null = await News.findOne({ newid });
            return res.status(200).json(uniquenew);
        }
        res.status(401).json({error: "Error Updating New"});
        } catch (err: Error | any) {
        res.status(500).json({ error: "Error interno servidor" });
    }
});

//DELETE A NEW BY ID
router.delete("/:newid", async (req: Request, res: Response) => {
    try {
        if(req.headers.authorization==null || req.headers.authorization!==`${Deno.env.get("ADMIN_TOKEN")}`){
            return res.status(401).json({ error: "Unauthorized" });
        }
        const newid=req.params.newid;
        if(newid==null){
            return res.status(400).json({ error: "Missing newid" });
        }
        const deletedNew = await News.deleteOne({ newid });
        if(deletedNew){
            return res.status(200).json({ message: "New Deleted Succesfully" });
        }
        res.status(401).json({error: "Error Deleting New"});
        } catch (err: Error | any) {
        res.status(500).json({ error: "Error Interno Servidor" });
    }
});

export default router;
