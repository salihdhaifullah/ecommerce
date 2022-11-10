import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import { GetUserIdMiddleware } from '../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const productId = Number(req.query["id"])
        if (typeof productId !== 'number') return res.status(400).json({ massage: "Product Not Found" });


        const productRate = await prisma.product.findFirst({
            where: {
                id: productId,
            },
            select: {
                rates: {
                    select: {
                        rate: true,
                        userId: true,
                    },
                },
            },
        });


        return res.status(200).json({ rates: productRate?.rates })
    }

    if (req.method === 'PATCH') {
        const productId = Number(req.query["id"])

        const rateType: number = Number(req.body.rateType);

        console.log("rateType: ", rateType)
        if (!(rateType === 1 || 2 || 3 || 4 || 5)) return res.status(400).json({ massage: "inValid Rate Type" });

        if (typeof productId !== 'number') return res.status(400).json({ massage: "Product Not Found" });

        const { id: userId, error } = GetUserIdMiddleware(req)

        if (error || !userId) return res.status(400).json({ massage: "No user Found" });

        const isFound = await prisma.rate.findFirst({
            where: {
                productId: productId,
                userId: userId,
            },
            select: {
                id: true,
            },
        });

        if (isFound?.id) {
            await prisma.rate.update({
                where: {
                    id: isFound.id,
                },
                data: {
                    // @ts-ignore
                    rate: `star${rateType}`,
                    userId: userId,
                    productId: productId,
                },
                select: {
                    rate: true,
                    userId: true,
                    productId: true,
                },
            })
        } else {
            await prisma.rate.create({
                data: {
                    // @ts-ignore
                    rate: `star${rateType}`,
                    userId: userId,
                    productId: productId,
                },
                select: {
                    rate: true,
                    userId: true,
                    productId: true,
                },
            })
        }
 
        return res.status(200).json({ massage: "Success" })
    }
};