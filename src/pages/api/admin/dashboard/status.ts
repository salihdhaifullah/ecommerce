import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../libs/prisma';
import GetUserIdAndRole from '../../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const {role, error} = GetUserIdAndRole(req)

        if (error || role !== "ADMIN") return res.status(403).json({massage: "UnAuthorized"})

        const [sales, total, users] = await prisma.$transaction([
            prisma.sale.count({ where: { verified: true } }),
            prisma.sale.aggregate({ _sum: { totalPrice: true }, where: { verified: true } }),
            prisma.user.count()
        ])

        return res.status(200).json({ sales, total: total._sum.totalPrice, users })
    }

};
