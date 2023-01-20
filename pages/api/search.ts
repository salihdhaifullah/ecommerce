import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../src/libs/prisma';

type TSearchQuery =
    { pieces: { gt: number }, category: { name: { contains: string, mode: 'insensitive' } } }
    | { OR: [{ title: { contains: string, mode: 'insensitive' } }, { content: { contains: string, mode: 'insensitive' } }], pieces: { gt: number } }
    | { tags: { every: { name: { contains: string, mode: 'insensitive' } } } }
    | { pieces: { gt: number } };



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

        const search: string | any = req.query["search"];
        const tag: string | any = req.query["tag"];
        const category: string | any = req.query["category"];
        const skip = Number(req.query["skip"])
        const take = Number(req.query["take"])
        const getLength = req.query["get-length"];

        let searchQuery: TSearchQuery = { pieces: { gt: 1 } }

        if (typeof search === 'string') searchQuery = { OR: [{ title: { contains: search, mode: 'insensitive' } }, { content: { contains: search, mode: 'insensitive' } }], pieces: { gt: 1 } }
        else if (typeof tag === 'string') searchQuery = { tags: { every: { name: { contains: tag, mode: 'insensitive' } } } }
        else if (typeof category === 'string') searchQuery = { pieces: { gt: 1 }, category: { name: { contains: category, mode: 'insensitive' } } };


        if (getLength) {
            const products = await prisma.product.count({where: searchQuery});
            return res.status(200).json({ products });
        }
        else {
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
