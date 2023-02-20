import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma'
import GetUserIdAndRole from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PATCH') {
        const saleId = Number(req.query['id']);

        const { error, id, role } = GetUserIdAndRole(req);
        if (error) return res.status(500).json({ error: error });
        if (role !== "ADMIN") return res.status(403).json({ massage: "unauthorized" })

        if (typeof (saleId) !== "number") return res.status(404).json({ massage: "No Sale Id Found" })

        const sale = await prisma.sale.findUnique({
            where: { id: saleId },
            select: { verified: true, received: true }
        })

        if (!sale) return res.status(404).json({ massage: "No Sale Found" })
        if (!sale.verified) return res.status(400).json({ massage: "Can't Deliver unverified order" })

        if (sale.received) return res.status(400).json({ massage: "Products Already Delivered" })

        await prisma.sale.update({
            where: { id: saleId },
            data: { received: true }
        })

        return res.status(200).json({ massage: "Success Products Delivered" })
    }
};
