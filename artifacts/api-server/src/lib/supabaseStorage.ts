import { randomUUID } from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
}

export class SupabaseStorageService {
    async getUploadUrl(): Promise<{ uploadUrl: string; fileUrl: string }> {
        const fileName = randomUUID();
        const path = `uploads/${fileName}`;

        const response = await fetch(
            `${supabaseUrl}/storage/v1/object/upload/sign/uploads/${path}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to get upload URL: ${response.statusText}`);
        }

        const data = await response.json();
        const fileUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${path}`;

        return {
            uploadUrl: data.url,
            fileUrl,
        };
    }
}

export const supabaseStorage = new SupabaseStorageService();