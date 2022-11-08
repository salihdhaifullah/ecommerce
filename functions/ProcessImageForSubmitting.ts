import { IPreviewImage } from "../types/image";

export default function handelProcessImageForSubmitting (images: IPreviewImage[], justProcess?: boolean): string[] {
    const data: string[] = []
    for (let image of images) {
        data.push(image.fileUrl);
        if (!justProcess) URL.revokeObjectURL(image.previewUrl)
    }
    return data;
}