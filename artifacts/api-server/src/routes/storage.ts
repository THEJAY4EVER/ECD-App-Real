import { Router, type IRouter, type Request, type Response } from "express";
import { getUploadUrl } from "../lib/supabaseStorage";
import { requireUser } from "../middlewares/auth";

const router: IRouter = Router();

router.post("/storage/uploads/request-url", requireUser, async (req: Request, res: Response) => {
  const { name, size, contentType } = req.body;
  if (!name || !contentType) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const { uploadUrl, fileUrl } = await getUploadUrl(name);
    res.json({
      uploadURL: uploadUrl,
      objectPath: fileUrl,
      metadata: { name, size, contentType },
    });
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

export default router;