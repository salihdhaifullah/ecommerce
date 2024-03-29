import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const base = 5;
        const page = Number(req.query["page"])
        const category = req.query["category"]
        const filter = { category: { name: category }, pieces: { gt: 0 }  } as Prisma.ProductWhereInput

        if (typeof page !== 'number' || page < 1) return res.status(400).json({ massage: "bad Request invalid argument page" })
        if (typeof category !== "string") return res.status(400).json({ massage: "bad Request invalid argument category" })

        const [products, totalProducts] = await prisma.$transaction([
            prisma.product.findMany({
                skip: (base * (page - 1)),
                take: base,
                where: filter,
                select: {
                    id: true,
                    imageUrl: true,
                    title: true,
                    price: true,
                    discount: true
                },
            }),
            prisma.product.count({ where: filter}),
        ])

        return res.status(200).json({ products, totalProducts });
    }
}
