import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../src/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const id = Number(req.query["id"])
        if (typeof id !== "number") return res.status(404).json({ massage: "Product Not Found" });

        const data = await prisma.feedBack.aggregate({
            where: { productId: id },
            _sum: { rate: true },
            _count: true
        });

        if (!data._sum.rate) return res.status(200).json({ massage: "Rate is Unknown for This Product" });

        return res.status(200).json({ data: { rate: Math.round(data._sum.rate / data._count), votes: data._count } })
    }

};
