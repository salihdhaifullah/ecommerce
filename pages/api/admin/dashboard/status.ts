import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../src/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const sales = prisma.sale.count({ where: { verified: true } })
        const total = prisma.sale.aggregate({ _sum: { totalPrice: true } })
        const users = prisma.user.count()

        const data = await Promise.all([sales, total, users]);

        return res.status(200).json({ sales: data[0], total: data[1]._sum.totalPrice, users: data[2] })
    }

};
