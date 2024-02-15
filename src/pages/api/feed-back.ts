import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import GetUserIdAndRole from '../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const productId = Number(req.query["id"])
        if (typeof productId !== 'number') return res.status(400).json({ massage: "Product Not Found" });

        const productFeedBack = await prisma.product.findFirst({
            where: { id: productId },
            select: {
                feedBacks: {
                    select: {
                        rate: true,
                        user: { select: { firstName: true, lastName: true } },
                        userId: true,
                        productId: true,
                        content: true,
                        createdAt: true,
                        id: true
                    }
                }
            }
        });

        return res.status(200).json({ feedBack: productFeedBack })
    }

    if (req.method === 'POST') {
        const productId = Number(req.query["id"])
        const data: { rate: number, content: string } = req.body;
        const { id: userId, error } = GetUserIdAndRole(req)

        if (!(data.rate === 1 || 2 || 3 || 4 || 5)) return res.status(400).json({ massage: "inValid Rate Type" });

        if (typeof productId !== 'number') return res.status(400).json({ massage: "Product Not Found" });

        if (error || !userId) return res.status(400).json({ massage: "No user Found" });

        if (!data.content) return res.status(400).json({ massage: "No Content Found" });

        const isFound = await prisma.feedBack.findUnique({
            where: { productId_userId: { productId: productId, userId: userId } },
            select: { id: true }
        });

        if (isFound?.id) {
            await prisma.feedBack.update({
                where: { id: isFound.id },
                data: {
                    content: data.content,
                    rate: data.rate
                }
            })
        } else {
            await prisma.feedBack.create({
                data: {
                    content: data.content,
                    rate: data.rate,
                    userId: userId,
                    productId: productId,
                }
            })
        }

        return res.status(200).json({ massage: "Success" })
    }
};
