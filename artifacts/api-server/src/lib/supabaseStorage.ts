import { UTApi } from "uploadthing/server";

const utapi = new UTApi({
    token: process.env.UPLOADTHING_SECRET,
});

export async function uploadFileToStorage(
    buffer: Buffer,
    name: string,
    contentType: string,
): Promise<string> {
    const file = new File([buffer], name, { type: contentType });
    const response = await utapi.uploadFiles(file);
    if (response.error) {
        throw new Error(`Upload failed: ${response.error.message}`);
    }
    return response.data.url;
}