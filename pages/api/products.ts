import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const skip = Number(req.query["skip"])
        const take = Number(req.query["take"])
        
        if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({massage: "Bad Request"});

        const products = await prisma.product.findMany({
            skip: skip, 
            take: take,
            select: {
                id: true,
                title: true,
                rates: {
                    select: {
                        rate: true,
                    },
                },
                likes: true, 
                price: true,
                pieces: true,
                createdAt: true,
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return res.status(200).json({products})
    }


    if (req.method === 'POST') {

    }


    if (req.method === 'DELETE') {

    }


    if (req.method === 'PATCH') {

    }
};