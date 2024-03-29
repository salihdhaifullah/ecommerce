import jwt from "jsonwebtoken";
import type { NextApiRequest } from 'next'

interface IGetUserIdAndRole {
    error: any | null
    id: number | null
    role: "ADMIN" | "USER" | null;
}

export default function GetUserIdAndRole(req: NextApiRequest): IGetUserIdAndRole {
    const data: IGetUserIdAndRole = { error: null, id: null, role: null }
    let token = req.cookies['token']!;

    if (typeof token !== "string") return { error: "no token found", id: null, role: null };

    jwt.verify(token, process.env.SECRET_KEY!, (err: any, decodedToken: any) => {
        if (err) return data.error = err
        data.id = Number(decodedToken.id);
        data.role = decodedToken.role;
    });

    return data;
}
