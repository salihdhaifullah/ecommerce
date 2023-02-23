import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        try {
            const data = await prisma.user.groupBy({ by: ['isPayUse'], _count: true })

            const getData = () => {
                let isPayUse = 0
                let isNotPayUse = 0

                for (let item of data) {
                    if (item.isPayUse) {
                        isPayUse = item._count
                    } else {
                        isNotPayUse = item._count
                    }
                }

                return [isPayUse, isNotPayUse]
            }

            return res.status(200).json({ data: getData()})
        } catch (error) {
            console.log(error);
            return res.status(400).json({ error })
        }
    }
};
