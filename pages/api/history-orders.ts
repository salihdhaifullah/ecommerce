import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const skip = req.query["skip"]
        const take = req.query["take"]

        if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({ massage: "Bad Request" });

        const orders = await prisma.sale.findMany({
            where: {
                OR: [
                    { verified: true },
                    { rejected: true },
                ]
            },
            skip: skip,
            take: take,
            select: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                totalprice: true,
                numberOfItems: true,
                product: {
                    select: {
                        title: true,
                        id: true,
                    },
                },
            },
        });

        return res.status(200).json({ orders })
    }


    if (req.method === 'POST') {

    }


    if (req.method === 'DELETE') {

    }


    if (req.method === 'PATCH') {

    }
};