export interface ICreateFeedback {
    rate: number;
    content: string;
}

export interface IFeedback {
    id: number;
    content: string;
    rate: 1 | 2 | 3 | 4 | 5;
    userId: number;
    createdAt: Date;
    user: {
        firstName: string;
        lastName: string;
    };
}
