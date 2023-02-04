import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import { Prisma } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

        const search: string | any = req.query["search"];
        const tag: string | any = req.query["tag"];
        const category: string | any = req.query["category"];
        const skip = Number(req.query["skip"])
        const take = Number(req.query["take"])
        const getLength = req.query["get-length"];

        let searchQuery: Prisma.ProductWhereInput = { pieces: { gt: 1 } }

        console.log(search)
        if (typeof search === 'string') searchQuery = {
            OR: [{
                title: { contains: search, mode: 'insensitive' },
                OR: [{
                    content: { contains: search, mode: 'insensitive' },
                    OR: [{
                        tags: { every: { name: { contains: tag, mode: 'insensitive' } } },
                        category: { name: { contains: category, mode: 'insensitive' } }
                    }]
                }]
            }],
            pieces: { gt: 1 },
        }
        else if (typeof tag === 'string') searchQuery = { tags: { every: { name: { contains: tag, mode: 'insensitive' } } } }
        else if (typeof category === 'string') searchQuery = { pieces: { gt: 1 }, category: { name: { contains: category, mode: 'insensitive' } } };



        console.log("FUCK YOU 2")
        if (getLength) {
            const products = await prisma.product.count({ where: searchQuery });
            return res.status(200).json({ products });
        } else {

            if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({ massage: "Bad Request" });

            const products = await prisma.product.findMany({
                where: searchQuery,
                skip: skip,
                take: take,
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


