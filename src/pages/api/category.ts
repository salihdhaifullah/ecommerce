import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const page = Number(req.query["page"])

        if (!page || typeof page !== 'number' || page < 1) return res.status(400).json({ massage: "Bad Request Page Number Required" })

        const base = 5;

        const [categories, totalCategories] = await prisma.$transaction([
            prisma.category.findMany({
                skip: (base * (page - 1)),
                take: base,
                where: { product: { some: {} } },
                select: { name: true }
            }),

            prisma.category.count({ where: { product: { some: {} } } }),
        ])

        return res.status(200).json({ categories, totalCategories })
    }
};
