import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../libs/prisma';

interface IFilterQuery {
    email?: { contains: string, mode: 'insensitive' },
    user?: { OR: [
        { firstName: { contains: string, mode: 'insensitive' } },
        { lastName: { contains: string, mode: 'insensitive' } }
    ]},
    verified?: boolean
    received?: boolean
}

const filterQuery = (userName: unknown, paymentState: unknown, deliverState: unknown) => {
    let query: IFilterQuery = {}
    const paymentStateOptions = ["verified", "canceled"]
    const deliverStateOptions = ["undelivered", "received"]

    if (typeof userName === "string" && userName.length > 2) {
        query["user"] = { OR: [
            { firstName: { contains: userName, mode: 'insensitive' } },
            { lastName: { contains: userName, mode: 'insensitive' } }
        ] }
    }

    if (typeof paymentState === 'string' && paymentState.length > 0 && paymentStateOptions.includes(paymentState)) {
        if (paymentState === "verified") query["verified"] = true
        else query["verified"] = false
    }

    if (typeof deliverState === 'string' && deliverState.length > 0 && deliverStateOptions.includes(deliverState)) {
        if (deliverState === "received") query["received"] = true
        else query["received"] = false
    }


    return query;
}

type ISortQuery = { createdAt: "desc" } | { totalPrice: "desc" } | {};

const SortQuery = (sort: unknown) => {
    let query: ISortQuery = {}
    const sortOptions = ["total-price", "date"]
    if (typeof sort !== "string" || sort.length < 1) return query;
    if (!sortOptions.includes(sort)) return query;

    if (sort === "total-price") query = { totalPrice: "desc" }
    else query = { createdAt: "desc" }

    return query;
}



export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const skip = Number(req.query["skip"])
        const take = Number(req.query["take"])
        const sort = req.query["sort"]
        const userName = req.query["user-name"]
        const paymentState = req.query["payment-state"]
        const deliverState = req.query["deliver-state"]

        if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({ massage: "Bad Request" });

        const orders = await prisma.sale.findMany({
            skip: skip,
            take: take,
            orderBy: SortQuery(sort),
            where: filterQuery(userName, paymentState, deliverState),
            select: {
                user: { select: { firstName: true, lastName: true, email: true } },
                saleProducts: {
                    select: {
                        numberOfItems: true,
                        product: { select: { title: true, id: true } }
                    },
                },
                totalPrice: true,
                id: true,
                verified: true,
                received: true,
                address1: true,
                address2: true,
                phoneNumber: true,
                country: true,
                countryCode: true,
                createdAt: true
            },
        });

        return res.status(200).json({ orders })
    }
};
