import { IPreviewImage } from "../types/image";

export default function handelProcessImageForSubmitting (images: IPreviewImage[]): string[] {
    const data: string[] = []
    for (let image of images) {
        data.push(image.fileUrl);
        URL.revokeObjectURL(image.previewUrl)
    }
    return data;
}