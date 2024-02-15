import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../libs/prisma';
import { Prisma } from '@prisma/client';

const filterQuery = (category: unknown, title: unknown) => {
    let query: Prisma.ProductWhereInput = {}
    if (typeof category === "string" && category.length > 2) query["category"] = { name: category };
    if (typeof title === 'string' && title.length > 0) query["title"] = { contains: title, mode: 'insensitive' };
    return query;
}

const SortQuery = (sort: unknown) => {
    let query: Prisma.ProductOrderByWithRelationInput = {}
    const sortOptions = ["date", "likes", "pieces", "price"]
    if (typeof sort !== "string" || sort.length < 1) return query;
    if (!sortOptions.includes(sort)) return query;

    if (sort === "date") query = { createdAt: "desc" }
    else if (sort === "likes") query = { likes: { _count: "desc" } }
    else if (sort === "pieces") query = { pieces: "desc" }
    else query = { price: "desc" }
    return query;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const skip = Number(req.query["skip"])
        const take = Number(req.query["take"])
        const category = req.query["category"]
        const title = req.query["title"]
        const sort = req.query["sort"]


        if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({ massage: "Bad Request" });

        const products = await prisma.product.findMany({
            skip: skip,
            take: take,
            orderBy: SortQuery(sort),
            where: filterQuery(category, title),
            select: {
                id: true,
                title: true,
                likes: { select: { id: true } },
                price: true,
                pieces: true,
                createdAt: true,
                category: { select: { name: true } }
            }
        });

        return res.status(200).json({ products })
    }
};
