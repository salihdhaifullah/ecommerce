import jwt  from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { GetUserIdMiddleware } from '../../../middleware';
import prisma from '../../../libs/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "GET") {
        const {error, id} = GetUserIdMiddleware(req)
        if (error) return res.status(400).json({ massage: error });
        if (id === null) return res.status(400).json({ massage: "User Not Found" });

        const user = await prisma.user.findFirst({
            where: {
                id: id
            },
            select: {
                id: true,
                role: true
            }
        });

        if (!user) return res.status(404).json({ massage: "user Not Found" });

        const token = jwt.sign({ id: id, role: user.role }, process.env.SECRET_KEY as string, { expiresIn: '2h' })
        
        return res.status(200).json({token})

    } else return res.status(404).json({ massage: `this method ${req.method} is not allowed` });

}

export default handler;