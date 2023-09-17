import { Router, Request, Response } from "express";
import logError from "../utils/logger";
const router = Router();

//home route
router.route("/").get((req: Request, res: Response) => {
  res.send("Hello from routes!");
});

//error logger route
router.post("/log", (req: Request, res: Response) => {
  const { trace } = req.body;
  logError(trace);
  res.sendStatus(200);
});

export default router;
