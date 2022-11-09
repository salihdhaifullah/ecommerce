export interface IComment {
    id: number;
    content: string;
    userId: number;
    createdAt: Date;
    userName: string;
}

export interface ICreateComment {
    content: string;
}