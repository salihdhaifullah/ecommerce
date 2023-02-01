import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const skip = Number(req.query["skip"])
        const take = Number(req.query["take"])

        if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({ massage: "Bad Request" });

        const FirstDate = 987675653647586
        const SecondDate = 987675653647586


        const orders = await prisma.sale.findMany({
            skip: skip,
            take: take,
            // where: {
            //     createdAt: {
            //         lte: new Date(FirstDate),
            //         gte: new Date(SecondDate),
            //     }
            // },
            select: {
                user: { select: { firstName: true, lastName: true } },
                saleProducts: {
                    select: {
                        numberOfItems: true,
                        product: { select: { title: true, id: true } }
                    },
                },
                totalPrice: true,
                id: true,
                verified: true
            },
        });

        return res.status(200).json({ orders })
    }
};
