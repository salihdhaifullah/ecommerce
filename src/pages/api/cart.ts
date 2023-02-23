import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const ids: number[] = req.body["ids"] || [];

        if (ids.length < 1 || typeof ids[0] !== 'number') return res.status(200).json({ products: [], massage: "No Ids Found" })

        const products = await prisma.product.findMany({
            where: { id: { in: ids } },
            select: {
                id: true,
                title: true,
                content: true,
                imageUrl: true,
                createdAt: true,
                discount: true,
                price: true,
                pieces: true,
            },
        })

        return res.status(200).json({products})
    }
};
