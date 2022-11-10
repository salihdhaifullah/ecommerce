import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const skip = Number(req.query["skip"])
        const take = Number(req.query["take"])

        if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({massage: "Bad Request"});

        const users = await prisma.user.findMany({
            where: {
                role: 'USER',
            },
            skip: skip,
            take: take,
            select: {
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true,
            },
        });

        return res.status(200).json({ users })

    }


    if (req.method === 'POST') {

    }


    if (req.method === 'DELETE') {

    }


    if (req.method === 'PATCH') {

    }
};