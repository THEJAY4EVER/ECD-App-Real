const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function getUploadUrl(name: string): Promise<{ uploadUrl: string; fileUrl: string }> {
    const path = `${Date.now()}-${name}`;
    const res = await fetch(
        `${SUPABASE_URL}/storage/v1/object/upload/sign/uploads/${path}`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
        }
    );
    if (!res.ok) throw new Error(`Failed to get upload URL: ${res.statusText}`);
    const data = await res.json();
    return {
        uploadUrl: `${SUPABASE_URL}/storage/v1${data.url}`,
        fileUrl: `${SUPABASE_URL}/storage/v1/object/public/uploads/${path}`,
    };
}