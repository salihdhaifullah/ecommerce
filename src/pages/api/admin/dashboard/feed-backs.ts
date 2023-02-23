import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../libs/prisma';

interface IFilterQuery {
    product?:  { title: { contains: string, mode: 'insensitive' } },
    user?: {
        OR: [
            { firstName: { contains: string, mode: 'insensitive' } },
            { lastName: { contains: string, mode: 'insensitive' } }
        ]
    },
    content?: { contains: string, mode: 'insensitive' }
    rate?: number
}


const filterQuery = (userName: unknown, productTitle: unknown, content: unknown, rate: unknown) => {
    let query: IFilterQuery = {}
    const rateOptions = [1, 2, 3, 4, 5]

    if (typeof userName === "string" && userName.length > 2) {
        query["user"] = {
            OR: [
                { firstName: { contains: userName, mode: 'insensitive' } },
                { lastName: { contains: userName, mode: 'insensitive' } }
            ]
        }
    }

    if (typeof productTitle === 'string' && productTitle.length > 0) query["product"] = { title: { contains: productTitle, mode: 'insensitive' } };

    if (typeof content === 'string' && content.length > 0) query["content"] = { contains: content, mode: 'insensitive' }

    if (typeof rate === 'number' && rateOptions.includes(rate)) query["rate"] = rate

    return query;
}

type ISortQuery = { createdAt: "desc" } | {};

const SortQuery = (sort: unknown) => {
    let query: ISortQuery = {}
    if (typeof sort !== "string" || sort.length < 1 || sort !== "date") return query;

    query = { createdAt: "desc" }
    return query;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const skip = Number(req.query["skip"])
            const take = Number(req.query["take"])
            const sort = req.query["sort"]
            const userName = req.query["user-name"]
            const productTitle = req.query["product-title"]
            const content = req.query["content"]
            const rate = Number(req.query["rate"])

            if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({ massage: "Bad Request" });

            const data = await prisma.feedBack.findMany({
                skip: skip,
                take: take,
                where: filterQuery(userName, productTitle, content, rate),
                orderBy: SortQuery(sort),
                select: {
                    id: true,
                    createdAt: true,
                    product: { select: { title: true, id: true } },
                    user: { select: { firstName: true, lastName: true } },
                    rate: true,
                    content: true
                }
            })

            return res.status(200).json({ data })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error })
        }
    }
};



