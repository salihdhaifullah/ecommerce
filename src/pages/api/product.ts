import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const getLength = req.query["get-length"];

        if (getLength === "true") {
            const products = await prisma.product.count()
            return res.status(200).json({ products })
        }

        const products = await prisma.product.findMany({
            select: {
                id: true,
                imageUrl: true,
                title: true,
                price: true,
                discount: true
            },
        });

        return res.status(200).json({ products });
    }
}
