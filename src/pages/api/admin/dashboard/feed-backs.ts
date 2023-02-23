import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../../libs/prisma';
import GetUserIdAndRole from '../../../../utils/auth';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const { error, id, role } = GetUserIdAndRole(req);
            if (error) return res.status(500).json({ error: error });
            if (role !== "ADMIN") return res.status(403).json({ massage: "unauthorized" })

            const skip = Number(req.query["skip"])
            const take = Number(req.query["take"])

            if (typeof skip !== 'number' || typeof take !== 'number') return res.status(400).json({ massage: "Bad Request" });

            const data = await prisma.feedBack.findMany({
                skip: skip,
                take: take,
                select: {
                    id: true,
                    createdAt: true,
                    product: { select: { title: true, id: true } },
                    user: { select: { firstName: true, lastName: true } },
                    rate: true,
                    content: true
                }
            })

            return res.status(200).json({ data })

        } catch (error) {
            console.log(error)
            return res.status(400).json({ error })
        }
    }
};



