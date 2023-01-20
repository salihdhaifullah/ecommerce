import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../src/libs/prisma';
import GetUserIdAndRoleMiddleware from '../../src/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const productId = Number(req.query["id"]);

        if (typeof productId !== 'number') return res.status(400).json({ massage: "No Product Found" });

        const likes = await prisma.likes.findMany({
            where: { productId: productId },
            select: { userId: true }
        })

        return res.status(200).json({ likes: likes })
    }

    if (req.method === 'PATCH') {
        const productId = Number(req.query["id"]);

        if (typeof productId !== 'number') return res.status(400).json({ massage: "No Product Found" });

        const { id: userId, error } = GetUserIdAndRoleMiddleware(req)

        if (error || typeof userId !== "number") return res.status(400).json({ massage: "No user Found" });

        const like = await prisma.likes.findFirst({
            where: { productId: productId, userId: userId },
            select: { id: true }
        });

        if (like?.id) await prisma.likes.delete({ where: { id: like.id } })
        else await prisma.likes.create({ data: { userId: userId, productId: productId } });

        return res.status(200).json({ massage: "Success" });
    }
};
