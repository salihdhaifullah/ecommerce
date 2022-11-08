import Swal from "sweetalert2";
import { IPreviewImage } from "../types/image";

export default function imagePreview(file: File): IPreviewImage | undefined {
    if (file.size > 52428800) Swal.fire('some think want wrong', 'file size is to big', 'error')
    else {
        const previewUrl = URL.createObjectURL(file)

        const name: string = Date.now().toString() + file?.name;

        const fileUrl: string = "https://whigujckvzmtjyeqvnfe.supabase.co/storage/v1/object/public/public/" + name;

        const NewObjectFile: IPreviewImage = { name, fileUrl, file, previewUrl }

        return NewObjectFile;
    }
} 