import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import { GetUserIdAndRoleMiddleware } from '../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const skip = Number(req.query["skip"])
        const take = Number(req.query["take"])

        if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({massage: "Bad Request"});

        const orders = await prisma.sale.findMany({
            where: {
                verified: false,
                rejected: false,
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
                id: true,
            },
        });

        return res.status(200).json({orders})
    }


    if (req.method === 'POST') {

    }


    if (req.method === 'DELETE') {

    }


    if (req.method === 'PATCH') {
        const isVerify = req.query["verify"]
        const isReject = req.query["reject"]
     
        const { error, id, role } = GetUserIdAndRoleMiddleware(req);

        if (error) return res.status(500).json({ error: error });

        if (role !== "ADMIN") return res.status(403).json({ massage: "unauthorized" })

        const orderId: number = Number(req.query["id"]);

        if (typeof orderId !== "number") return res.status(400).json({ massage: "Order Id Not Found" });

        if (isVerify) {
            await prisma.sale.update({
                where: {
                    id: orderId,
                },
                data: {
                    verified: true,
                },
            })
        } else if (isReject) {
            await prisma.sale.update({
                where: {
                    id: orderId,
                },
                data: {
                    rejected: true,
                },
            })
        }

        return res.status(200).json({ massage: "Success"})
    }
};