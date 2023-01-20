import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../src/libs/prisma';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const data = await prisma.feedBack.groupBy({
                by: ["productId"],
                _sum: { rate: true },
                _count: true
            });

            const items = [];

            for (let item of data) {
                // @ts-ignore
                items.push({ avg: Math.round(item._sum.rate / item._count) })
            }

            return res.status(200).json({ data: items })
        } catch (error) {
            console.log(error)
            return res.status(400).json({ error })
        }
    }
};



