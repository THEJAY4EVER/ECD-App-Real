const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const BUCKET = "uploads";

export async function getUploadUrl(
    name: string,
    contentType?: string
): Promise<{ uploadUrl: string; fileUrl: string }> {

    const path = `${Date.now()}-${name}`;

    const res = await fetch(
        `${SUPABASE_URL}/storage/v1/object/upload/sign/${BUCKET}/${path}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${SUPABASE_KEY}`,
                apikey: SUPABASE_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contentType,
            }),
        }
    );

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to get upload URL: ${res.status} ${text}`);
    }

    const data = await res.json();

    return {
        uploadUrl: `${SUPABASE_URL}/storage/v1${data.url}`,
        fileUrl: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`,
    };
}