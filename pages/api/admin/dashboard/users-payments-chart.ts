import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        try {
            const data = await prisma.user.groupBy({ by: ['isPayUse'], _count: true })

            return res.status(200).json({ data: [data[1]._count, data[0]._count] })
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error })
        }
    }

};