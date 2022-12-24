import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const data = await prisma.rate.groupBy({ by: ['productId'], _count: true });
        
        return res.status(200).json({data})
    }
};