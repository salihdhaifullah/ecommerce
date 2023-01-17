import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import GetUserIdAndRoleMiddleware from '../../middleware';
import { ICreateFeedback } from '../../src/types/feedBack';

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
        const data: ICreateFeedback = req.body;
        const { id: userId, error } = GetUserIdAndRoleMiddleware(req)

        if (!(data.rate === 1 || 2 || 3 || 4 || 5)) return res.status(400).json({ massage: "inValid Rate Type" });
        if (typeof productId !== 'number') return res.status(400).json({ massage: "Product Not Found" });
        if (error || !userId) return res.status(400).json({ massage: "No user Found" });
        if (!data.content) return res.status(400).json({ massage: "No Content Found" });

        const isFound = await prisma.feedBack.findUnique({
            where: { productId_userId: { productId: productId, userId: userId } },
            select: { id: true }
        });

        if (isFound?.id) return res.status(400).json({ massage: "Feed Back Is All Ready Exist" })

        const endData = await prisma.feedBack.create({
            data: {
                rate: data.rate,
                userId: userId,
                product: { connect: { id: productId } },
                content: data.content
            },
            select: {
                rate: true,
                user: { select: { firstName: true, lastName: true } },
                userId: true,
                productId: true,
                content: true,
                createdAt: true,
                id: true
            }
        })

        return res.status(200).json({ massage: "Success", data: endData })
    }

    if (req.method === "PATCH") {
        const FeedBackId = Number(req.query["id"])
        const data: ICreateFeedback = req.body;
        const { id: userId, error } = GetUserIdAndRoleMiddleware(req)

        if (!(data.rate === 1 || 2 || 3 || 4 || 5)) return res.status(400).json({ massage: "inValid Rate Type" });
        if (typeof FeedBackId !== 'number') return res.status(400).json({ massage: "Product Not Found" });
        if (error || !userId) return res.status(400).json({ massage: "No user Found" });
        if (!data.content) return res.status(400).json({ massage: "No Content Found" });

        const isFound = await prisma.feedBack.findUnique({ where: { id: FeedBackId }, select: { id: true, userId: true } });

        if (!isFound?.id) return res.status(404).json({ massage: "Feedback Not Found" });
        if (isFound.userId !== userId) return res.status(403).json({ massage: "unAuthorized To Do This action" });

        const endData = await prisma.feedBack.update({
            where: { id: FeedBackId },
            data: {
                rate: data.rate,
                userId: userId,
                content: data.content
            },
            select: {
                rate: true,
                user: { select: { firstName: true, lastName: true } },
                userId: true,
                productId: true,
                content: true,
                createdAt: true,
                id: true
            }
        })

        return res.status(200).json({ massage: "Success Updating FeedBack", data: endData })
    }

    if (req.method === "DELETE") {
        const FeedBackId = Number(req.query["id"])
        const { id: userId, error } = GetUserIdAndRoleMiddleware(req)

        if (typeof FeedBackId !== 'number') return res.status(400).json({ massage: "Product Not Found" });
        if (error || !userId) return res.status(400).json({ massage: "No user Found" });

        const isFound = await prisma.feedBack.findUnique({ where: { id: FeedBackId }, select: { id: true, userId: true } });

        if (!isFound?.id) return res.status(404).json({ massage: "Feedback Not Found" });
        if (isFound.userId !== userId) return res.status(403).json({ massage: "unAuthorized To Do This action" });

        const endData = await prisma.feedBack.delete({ where: { id: FeedBackId } })

        return res.status(200).json({ massage: "Success Deleting FeedBack", data: endData })
    }
};
