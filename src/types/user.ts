export interface IUser {
    id: number;
    createdAt: Date;
    email: string;
    firstName: string
    lastName: string
    role: "USER" | "ADMIN"
}


export interface ILogin {
    password: string
    email: string
}

export interface ISingUp {
    password: string
    firstName: string
    lastName: string
    email: string
}
