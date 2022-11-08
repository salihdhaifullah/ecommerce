import Swal from 'sweetalert2';
import supabase from '../libs/supabase';
import { IPreviewImage } from "../types/image";

export default async function uploadImages(image: IPreviewImage) {
    
    const { data: success, error } = await supabase.storage.from("public").upload(image.name, image.file)
    
    if (error) Swal.fire('some think want wrong', 'place check internet connection', 'error');
}