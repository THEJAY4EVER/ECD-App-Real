import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BUCKET = "uploads";

export async function getUploadUrl(
    name: string,
    contentType?: string
): Promise<{ uploadUrl: string; fileUrl: string }> {

    const path = `${Date.now()}-${name}`;

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