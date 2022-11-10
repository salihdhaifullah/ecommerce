import { NextApiRequest, NextApiResponse } from 'next';
import { removeCookies, setCookie } from 'cookies-next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const fullYear = 1000 * 60 * 60 * 24 * 365;

        setCookie("refresh-token", null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: fullYear, // full year
            expires: new Date(Date.now() + fullYear),
            path: "/",
            req,
            res
        })
        res.status(200).json({ message: 'Logout success' });
    }
}

export default handler;