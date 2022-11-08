import { NextApiRequest, NextApiResponse } from 'next';
import { removeCookies } from 'cookies-next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        removeCookies('refresh-token');
        res.status(200).json({ message: 'Logout success' });
    }
}

export default handler;