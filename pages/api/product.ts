import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {

        const products = await prisma.product.findMany({
            select: {
                id: true,
                imageUrl: true,
                title: true,             
                price: true,
                discount: true
            },
        });

        return res.status(200).json({products});
    }

    if (req.method === 'POST') {
    
    }
  
    if (req.method === 'DELETE') {

    }

    if (req.method === 'PATCH') {

    }
}
