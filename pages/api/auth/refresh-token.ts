import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import GetUserIdAndRoleMiddleware from '../../../middleware';
import prisma from '../../../libs/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const { error, id, role } = GetUserIdAndRoleMiddleware(req, true)
        if (error) return res.status(400).json({ massage: error });
        
        if (typeof id !== "number") return res.status(400).json({ massage: "User Not Found" });

        const user = await prisma.user.findUnique({ where: { id: id }, select: { id: true, role: true } });

        if (!user) return res.status(404).json({ massage: "user Not Found" });

        const token = jwt.sign({ id: id, role: user.role }, process.env.SECRET_KEY!, { expiresIn: (1000 * 60 * 5) })

        return res.status(200).json({ token })
    }
}

export default handler;




