import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import GetUserIdAndRoleMiddleware from '../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const productId = Number(req.query["id"])
        if (typeof productId !== 'number') return res.status(400).json({ massage: "Product Not Found" });

        const productRate = await prisma.product.findFirst({
            where: { id: productId },
            select: { rates: { select: { rate: true, userId: true } } }
        });

        return res.status(200).json({ rates: productRate?.rates })
    }



    type RateType = 1 | 2 | 3 | 4 | 5
    
    if (req.method === 'PATCH') {
        const productId = Number(req.query["id"])
        const rateType: RateType = Number(req.body.rateType) as RateType;
        const { id: userId, error } = GetUserIdAndRoleMiddleware(req)
        
        if (!(rateType === 1 || 2 || 3 || 4 || 5)) return res.status(400).json({ massage: "inValid Rate Type" });

        if (typeof productId !== 'number') return res.status(400).json({ massage: "Product Not Found" });

        if (error || !userId) return res.status(400).json({ massage: "No user Found" });

        const isFound = await prisma.rate.findFirst({
            where: { productId: productId, userId: userId },
            select: { id: true },
        });

        if (isFound?.id) {
            await prisma.rate.update({
                where: { id: isFound.id },
                data: {
                    rate: `star${rateType}`,
                    userId: userId,
                    productId: productId,
                },
                select: { rate: true, userId: true, productId: true }
            })

        } else {
            await prisma.rate.create({
                data: {
                    rate: `star${rateType}`,
                    userId: userId,
                    productId: productId,
                },
                select: { rate: true, userId: true, productId: true }
            })
        }
 
        return res.status(200).json({ massage: "Success" })
    }
};