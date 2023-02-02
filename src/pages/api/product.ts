import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const getLength = req.query["get-length"];

        if (getLength === "true") {
            const products = await prisma.product.count()
            return res.status(200).json({ products })
        }

        const base = 5;
        const page = Number(req.query["page"])
        const category = req.query["category"]

        if (typeof page !== 'number' || page < 1) return res.status(400).json({ massage: "bad Request invalid argument page" })
        if (typeof category !== "string") return res.status(400).json({ massage: "bad Request invalid argument category" })

        const [products, totalProducts] = await prisma.$transaction([
            prisma.product.findMany({
                skip: (base * (page - 1)),
                take: base,
                where: { category: { name: category } },
                select: {
                    id: true,
                    imageUrl: true,
                    title: true,
                    price: true,
                    discount: true
                },
            }),
            prisma.product.count({ where: { category: { name: category } } }),
        ])

        return res.status(200).json({ products, totalProducts });
    }
}
