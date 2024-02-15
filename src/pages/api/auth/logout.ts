import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        res.setHeader('Set-Cookie', [
            `token=; HttpOnly; SameSite=strict Expires=${new Date(Date.now() + (-1))}; Path=/; Max-Age=-1; Secure=${process.env.NODE_ENV === "production" ? "True" : "False"};`,
        ]);

        res.status(200).json({ message: 'Logout success' });
    }
}

export default handler;
