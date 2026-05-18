import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "uploads";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export { BUCKET };

export async function listBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  return { data, error };
}

export async function getUploadUrl(
    name: string,
    contentType?: string,
    folder?: string
): Promise<{ uploadUrl: string; fileUrl: string }> {

    const filename = `${Date.now()}-${name}`;
    const path = folder ? `${folder}/${filename}` : filename;

    const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUploadUrl(path);

    if (error || !data) {
        throw new Error(
            `Failed to create signed upload URL: ${error?.message || "Unknown error"}`
        );
    }

    return {
        uploadUrl: data.signedUrl,
        fileUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`,
    };
}
