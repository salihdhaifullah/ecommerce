import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import GetUserIdAndRoleMiddleware  from '../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const productId = Number(req.query["id"]);

        if (typeof productId !== 'number') return res.status(400).json({ massage: "No Product Found" });

        const likes = await prisma.product.findFirst({
            where: {
                id: productId,
            },
            select: {
                likes: true,
            }
        })

        return res.status(200).json({ likes: likes?.likes || [] })

    }

    if (req.method === 'PATCH') {
        const productId = Number(req.query["id"]);

        if (typeof productId !== 'number') return res.status(400).json({ massage: "No Product Found" });

        const { id: userId, error } = GetUserIdAndRoleMiddleware(req)

        if (error || typeof userId !== "number") return res.status(400).json({ massage: "No user Found" });

        const likes = await prisma.product.findFirst({ where: { id: productId }, select: { likes: true, id: true } })

        if (!likes?.id) return res.status(400).json({ massage: "No Product Found" });

        let isLiked = false;
        let data: string[] = likes.likes;

        if (likes.likes.length > 0 && likes.likes.includes(userId.toString())) isLiked = true;

        if (isLiked) {
            // unLike the product
            data = data.filter((id) => id !== userId.toString());
            await prisma.product.update({
                where: {
                    id: productId,
                },
                data: {
                    likes: data,
                },
            })
        } else {
            // like the product
            data.push(userId.toString());

            await prisma.product.update({
                where: {
                    id: productId,
                },
                data: {
                    likes: data,
                },
            });

        }
        return res.status(200).json({ likes: data || [] }) 
    }
};