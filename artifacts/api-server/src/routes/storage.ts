import { Router, type IRouter, type Request, type Response } from "express";
import {
  RequestUploadUrlBody,
  RequestUploadUrlResponse,
} from "@workspace/api-zod";
import { supabaseStorage } from "../lib/supabaseStorage";
import { requireUser } from "../middlewares/auth";

const router: IRouter = Router();

/**
 * POST /storage/uploads/request-url
 *
 * Request a presigned URL for file upload to Supabase Storage.
 */
router.post("/storage/uploads/request-url", requireUser, async (req: Request, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  try {
    const { name, size, contentType } = parsed.data;
    const { uploadUrl, fileUrl } = await supabaseStorage.getUploadUrl();

    res.json(
      RequestUploadUrlResponse.parse({
        uploadURL: uploadUrl,
        objectPath: fileUrl,
        metadata: { name, size, contentType },
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

export default router;