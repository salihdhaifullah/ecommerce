import { GetUserIdMiddleware } from './../../middleware/index';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import { ICreateComment } from '../../types/comment';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

        const id: number = Number(req.query["id"])

        if (typeof id !== "number") return res.status(400).json({massage: "No Product Id Found"});


        const comments = await prisma.product.findFirst({
            where: {
                id: id,
            },
            select: {
                comments: {
                    select: {
                        content: true,
                        createdAt: true,
                        userId: true,
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                            },
                        },
                    },
                },
            },
        });

        return res.status(200).json({ comments });

    }


    if (req.method === 'POST') {

        const id: number = Number(req.query["id"])

        if (typeof id !== "number") return res.status(400).json({massage: "No Product Id Found"});

        const {id: userId, error} = GetUserIdMiddleware(req)

        if (error || !userId) return res.status(400).json({massage: "No user Found"});

        const data: ICreateComment = req.body;

        if (!data?.content) return res.status(400).json({massage: "No comment found"});

        await prisma.comment.create({
            data: {
                product: {
                    connect: {id: id}
                },
                content: data.content,
                user: {
                    connect: {id: userId}
                },
            },
        });

        return res.status(200).json({ massage: "Successfully Created Comment" });

    }


    if (req.method === 'DELETE') {

        const id: number = Number(req.query["id"])

        const commentId: number = Number(req.query["commentId"])

        if (typeof id !== "number") return res.status(400).json({massage: "No Product Id Found"});

        const {id: userId, error} = GetUserIdMiddleware(req)

        if (error || !userId) return res.status(400).json({massage: "No user Found"});

        const isFound = await prisma.comment.findFirst({
            where: {
                product: {
                    id: id,
                },
                id: commentId,
                user: {
                    id: userId,
                },
            },
            select: {
                id: true,
            },
        })

        if (!isFound?.id) return res.status(404).json({massage: "Comment Not Found" })    

        await prisma.comment.delete({
            where: {
                id: isFound.id,
            },
        })

        return res.status(200).json({ massage: "Successfully Comment Deleted" });
    }


    if (req.method === 'PATCH') {

    }
};