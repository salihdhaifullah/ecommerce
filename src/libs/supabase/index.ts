import supabase from './config';
import { randomUUID } from 'crypto';

interface IUploadFile {
    error: null | any;
    Url: string;
}

async function base64toBuffer(base64: string) {
    return await fetch(base64).then(async (res) => await res.arrayBuffer())
}

class Storage {

    static async uploadFile(file: string): Promise<IUploadFile> {
        try {

            const supaBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

            if (!supaBaseUrl) throw new Error("No SupaBase Url Found");

            const fileId = Date.now().toString() + randomUUID() + '.webp';
            const Url = `${supaBaseUrl}/storage/v1/object/public/public/${fileId}`;

            const Buffer = await base64toBuffer(file)

            const { error, data } = await supabase.storage.from("public").upload(fileId, Buffer, {contentType: "image/webp" });
            return { error, Url };

        } catch (error) {
            console.log(error)
            throw new Error("internal Server Error")
        }
    }

    static async deleteFile(filePath: string) {
        try {
            await supabase.storage.from("public").remove([filePath])
        } catch (error) {
            throw new Error("internal Server Error")
        }
    }

}

export default Storage;
