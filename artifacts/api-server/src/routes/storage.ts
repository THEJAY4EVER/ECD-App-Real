import { Router, type IRouter, type Request, type Response } from "express";
import { uploadFileToStorage } from "../lib/supabaseStorage";
import { requireUser } from "../middlewares/auth";

const router: IRouter = Router();

router.post("/storage/uploads/request-url", requireUser, async (req: Request, res: Response) => {
  const { name, size, contentType } = req.body;
  if (!name || !contentType) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  // Return a fake presigned URL pointing back to our own upload endpoint
  res.json({
    uploadURL: `/api/storage/uploads/direct`,
    objectPath: `/pending/${Date.now()}-${name}`,
    metadata: { name, size, contentType },
  });
});

router.put("/storage/uploads/direct", requireUser, async (req: Request, res: Response) => {
  try {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      const contentType = req.headers["content-type"] || "application/octet-stream";
      const name = `upload-${Date.now()}`;
      const url = await uploadFileToStorage(buffer, name, contentType);
      res.json({ url });
    });
  } catch (error) {
    req.log.error({ err: error }, "Upload failed");
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;