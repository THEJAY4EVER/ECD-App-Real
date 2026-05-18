import { Router, type IRouter, type Request, type Response } from "express";
import { getUploadUrl, listBuckets, BUCKET } from "../lib/supabaseStorage";
import { requireUser, requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

// Diagnostic endpoint — admin only. Hit /api/storage/health in the browser to
// see which bucket is configured and which buckets actually exist in Supabase.
router.get("/storage/health", requireAdmin, async (_req: Request, res: Response) => {
  const { data: buckets, error } = await listBuckets();
  res.json({
    configuredBucket: BUCKET,
    supabaseUrl: process.env.SUPABASE_URL ? process.env.SUPABASE_URL.slice(0, 30) + "…" : "NOT SET",
    serviceKeySet: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    buckets: buckets?.map((b) => b.name) ?? null,
    bucketsError: error?.message ?? null,
  });
});

router.post("/storage/uploads/request-url", requireUser, async (req: Request, res: Response) => {
  const { name, size, contentType, folder } = req.body;
  if (!name || !contentType) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  try {
    const { uploadUrl, fileUrl } = await getUploadUrl(name, contentType, folder);
    res.json({
      uploadURL: uploadUrl,
      objectPath: fileUrl,
      metadata: { name, size, contentType },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL", detail: message });
  }
});

export default router;
