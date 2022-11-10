import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {


        const orders = await prisma.sale.findMany({
            where: {
                verified: false,
                rejected: false,
            },
            select: {
                id: true,
            },
        });

        return res.status(200).json({ordersLength: orders.length})
    }


    if (req.method === 'POST') {

    }


    if (req.method === 'DELETE') {

    }


    if (req.method === 'PATCH') {

    }
};