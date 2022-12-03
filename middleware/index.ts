import jwt from "jsonwebtoken";
import type { NextApiRequest } from 'next'

interface IGetUserIdAndRoleMiddleware {
    error: any | null
    id: number | null
    role: "ADMIN" | "USER" | null;
}

export default function GetUserIdAndRoleMiddleware(req: NextApiRequest, FromCookie = false): IGetUserIdAndRoleMiddleware {
    const data: IGetUserIdAndRoleMiddleware = { error: null, id: null, role: null }
    let token = "";
    if (FromCookie) token = req.cookies['refresh-token']!;
    else token = req.headers["authorization"]?.split("Bearer ")[1]!;

    if (!token) return { error: "no token found", id: null, role: null };

    jwt.verify(token, process.env.SECRET_KEY!, (err: any, decodedToken: any) => {
        if (err) return { error: err, id: null, role: null };
        data.id = Number(decodedToken.id);
        data.role = decodedToken.role;
    });

    return data;
}
