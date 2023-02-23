import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../libs/prisma';

interface IFilterQuery {
    email?: { contains: string, mode: 'insensitive' },
    OR?: [
        { firstName: { contains: string, mode: 'insensitive' } },
        { lastName: { contains: string, mode: 'insensitive' } }
    ]
}

const filterQuery = (name: unknown, email: unknown) => {
    let query: IFilterQuery = {}
    if (typeof name === "string" && name.length > 2) {
        query["OR"] = [
            { firstName: { contains: name, mode: 'insensitive' } },
            { lastName: { contains: name, mode: 'insensitive' } }
        ]
    }

    if (typeof email === 'string' && email.length > 0) query["email"] = { contains: email, mode: 'insensitive' };
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
        const skip = Number(req.query["skip"])
        const take = Number(req.query["take"])
        const name = req.query["name"]
        const email = req.query["email"]
        const sort = req.query["sort"]

        if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({ massage: "Bad Request" });

        const users = await prisma.user.findMany({
            skip: skip,
            take: take,
            orderBy: SortQuery(sort),
            where: filterQuery(name, email),
            select: {
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
                payment: { select: { totalPrice: true }, where: { verified: true } }
            }
        });

        return res.status(200).json({ users })
    }
};
