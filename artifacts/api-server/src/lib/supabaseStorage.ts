import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseStorageService {
    async getUploadUrl(): Promise<{ uploadUrl: string; fileUrl: string }> {
        const fileName = `uploads/${randomUUID()}`;

        const { data, error } = await supabase.storage
            .from('uploads')
            .createSignedUploadUrl(fileName);

        if (error) throw error;

        const fileUrl = `${supabaseUrl}/storage/v1/object/public/uploads/${fileName}`;

        return {
            uploadUrl: data.signedUrl,
            fileUrl,
        };
    }

    async getFileUrl(filePath: string): Promise<string> {
        if (filePath.startsWith('http')) return filePath;

        const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;

        const { data } = supabase.storage
            .from('uploads')
            .getPublicUrl(cleanPath);

        return data.publicUrl;
    }

    async deleteFile(filePath: string): Promise<void> {
        const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;

        const { error } = await supabase.storage
            .from('uploads')
            .remove([cleanPath]);

        if (error) throw error;
    }
}

export const supabaseStorage = new SupabaseStorageService();