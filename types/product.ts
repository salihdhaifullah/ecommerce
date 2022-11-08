export interface ICreateProduct {
    title: string;
    content: string;
    tags: string[];
    category: string;
    image: string;
    images: string[];
    pieces: number;
    price: number;
    discount: number;
}