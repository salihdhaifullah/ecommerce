import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import { SortByType } from '../../src/types/product';


type TFilterQuery =  { pieces: { gt: number }, category: { name: { contains: string, mode: 'insensitive' } } } | { pieces: { gt: number } }

type TOrderQuery = {  likes: { _count: "desc" } } | { price: "asc" } | { price: "desc" } | { createdAt: "asc"  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        const getLength = req.query["get-length"];
        const filter = req.query["filter"] as string;

        if (getLength === "true") {
            const products = await prisma.product.count(filter !== "null" ? { where: { category: { name: filter } } } : undefined)
            return res.status(200).json({ products })
        }

        const sort = req.query["sortBy"] as SortByType | undefined;
        const skip = Number(req.query["skip"]);
        const take = Number(req.query["take"]);

        const filterQuery: TFilterQuery = filter !== "null" ? { pieces: { gt: 1 }, category: { name: { contains: filter, mode: 'insensitive' } } } : { pieces: { gt: 1 } };

        if (typeof skip !== "number" || typeof take !== "number") return res.status(400).json({ massage: "Bad Request" });
        if (typeof sort !== "string") return res.status(400).json({ massage: "Bad Request" });

        if (!["CreateAt", "Likes", "Price High To Low", "Price Low To High"].includes(sort)) return res.status(404).json({ massage: "Sort unValid" })


        let orderQuery: TOrderQuery = { createdAt: "asc" };

        switch (sort) {
            case "Likes": orderQuery = { likes: { _count: "desc" } }
                break;
            case "CreateAt": orderQuery = { createdAt: "asc" }
                break;
            case "Price High To Low": orderQuery = { price: "desc" }
                break;
            case "Price Low To High": orderQuery = { price: "asc" }
                break;
            default: orderQuery = { createdAt: "asc" }
        }

        const products = await prisma.product.findMany({
            where: filterQuery,
            skip: skip,
            take: take,
            orderBy: orderQuery,
            select: {
                id: true,
                imageUrl: true,
                title: true,
                price: true,
                discount: true
            },
        });

        return res.status(200).json({ products });
    }
}
