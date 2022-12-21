import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

        const search: string | any = req.query["search"];
        const tag: string | any = req.query["tag"];
        const category: string | any = req.query["category"];

        if (typeof search === 'string') {

            const products = await prisma.product.findMany({
                where: {
                    OR: [{ title: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }],
                    pieces: { gt: 1 }

                },
                select: {
                    id: true,
                    imageUrl: true,
                    title: true,
                    price: true,
                    discount: true
                }
            });

            return res.status(200).json({ products });
        }

        else if (typeof tag === 'string') {

            const products = await prisma.tag.findFirst({
                where: { name: { contains: tag, mode: 'insensitive' } },
                select: {
                    product: {
                        where: { pieces: { gt: 1 } },
                        select: {
                            id: true,
                            imageUrl: true,
                            title: true,
                            price: true,
                            discount: true
                        }
                    }
                }
            });

            return res.status(200).json({ products });
        }


        else if (typeof category === 'string') {
            const products = await prisma.product.findMany({
                where: {
                    pieces: { gt: 1 },
                    category: { name: { contains: category, mode: 'insensitive' } }
                },
                select: {
                    id: true,
                    imageUrl: true,
                    title: true,
                    price: true,
                    discount: true
                }
            });

            return res.status(200).json({ products });
        }


    }
};