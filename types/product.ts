export interface ICreateProduct {
    title: string;
    content: string;
    tags: string[];
    category: {
        name: string;
    };
    image: string;
    images: {
        name: string;
        fileUrl: string;
    }[];
    pieces: number;
    price: number;
    discount: number;
}