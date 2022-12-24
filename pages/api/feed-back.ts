import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import GetUserIdAndRoleMiddleware from '../../middleware';
import { ICreateFeedback } from '../../types/rate';

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
        const data: ICreateFeedback = req.body;
        // const { id: userId, error } = GetUserIdAndRoleMiddleware(req)
        const userId = 4;
        if (!(data.rate === 1 || 2 || 3 || 4 || 5)) return res.status(400).json({ massage: "inValid Rate Type" });
        if (typeof productId !== 'number') return res.status(400).json({ massage: "Product Not Found" });
        // if (error || !userId) return res.status(400).json({ massage: "No user Found" });
        if (!data.content) return res.status(400).json({ massage: "No Content Found" });

        const isFound = await prisma.feedBack.findUnique({
            where: { productId_userId: { productId: productId, userId: userId } },
            select: { id: true }
        });

        let endData = null;

        if (isFound?.id) {
            endData = await prisma.feedBack.update({
                where: { id: isFound.id },
                data: {
                    rate: data.rate,
                    userId: userId,
                    content: data.content
                },
                select: { rate: true, userId: true, productId: true, content: true, createdAt: true, id: true }
            })
        }
        else {
            endData = await prisma.feedBack.create({
                data: {
                    rate: data.rate,
                    userId: userId,
                    product: { connect: { id: productId } },
                    content: data.content
                },
                select: { rate: true, userId: true, productId: true, content: true, createdAt: true, id: true }
            })
        }

        return res.status(200).json({ massage: "Success", data: endData })
    }
};