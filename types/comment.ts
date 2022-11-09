export interface IComment {
    id: number;
    content: string;
    userId: number;
    createdAt: Date;
    user: {
        firstName: string;
        lastName: string;
    };
}

export interface ICreateComment {
    content: string;
}