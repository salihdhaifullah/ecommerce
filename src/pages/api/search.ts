import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import { Prisma } from '@prisma/client';

const filterQuery = (search: unknown, tag: unknown, category: unknown, discount: unknown) => {
    let query: Prisma.ProductWhereInput = {}
    query["pieces"] = { gt: 1 }

    const discountOptions = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]

    if (typeof search === 'string' && search.length > 0) query["OR"] = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
    ];

    if (typeof tag === 'string' && tag.length > 1) query["tags"] = { some: { name: tag } };

    if (typeof category === 'string' && category.length > 1) query["category"] = { name: category };

    if (typeof discount === "number" && discountOptions.includes(discount)) query["discount"] = discount;

    return query;
}


const SortQuery = (sort: unknown) => {
    let query: Prisma.ProductOrderByWithRelationInput = {}
    const sortOptions = ["likes", "price-low-to-high", "price-high-to-low", "discount", "date"]

    if (typeof sort !== "string" || sort.length < 1 || !sortOptions.includes(sort)) return query;

    if (sort === "likes") query = { likes: { _count: "desc" } }
    else if (sort === "price-low-to-high") query = { price: "asc" }
    else if (sort === "price-high-to-low") query = { price: "desc" }
    else if (sort === "discount") query = { discount: "desc" }
    else query = { createdAt: "desc" }

    return query;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        try {
            const search: string | any = req.query["search"];
            const tag: string | any = req.query["tag"];
            const category: string | any = req.query["category"];
            const discount = Number(req.query["discount"])
            const skip = Number(req.query["skip"])
            const take = Number(req.query["take"])
            const sort = req.query["sort"]

            if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({ massage: "Bad Request" });

            const [products, totalProducts] = await prisma.$transaction([
                prisma.product.findMany({
                    where: filterQuery(search, tag, category, discount),
                    skip: skip,
                    take: take,
                    orderBy: SortQuery(sort),
                    select: {
                        id: true,
                        imageUrl: true,
                        title: true,
                        price: true,
                        discount: true
                    }
                }),
                prisma.product.count({ where: filterQuery(search, tag, category, discount) }),
            ])

            return res.status(200).json({ products, totalProducts });
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error })
        }
    }
};


