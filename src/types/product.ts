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

export interface IProductRow {
    id: number;
    discount: number;
    price: number;
    title: string;
    imageUrl: string;
}


export interface IProduct {
    id: number;
    title: string;
    content: string;
    images: string[];
    createdAt: Date;
    discount: number;
    price: number;
    pieces: number;
    imageUrl: string;
    tags: {
        name: string;
    }[];
    category: {
        name: string;
    };
}


export interface IUpdateProduct {
    title: string;
    content: string;
    tags: string[];
    category: string;
    pieces: number;
    price: number;
    discount: number;
}
