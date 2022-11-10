import { ICreateSale, ISale } from './../../types/sale';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import { GetUserIdMiddleware } from '../../middleware';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

    }


    if (req.method === 'POST') {
        const data: ISale[] = req.body.data;
        const CreateData: ICreateSale[] = [];
        const ids: number[] = [];
        const promises: Promise<any>[] = []

        const {error, id: userId} = await GetUserIdMiddleware(req)

        if (error || !userId) return res.status(400).json({ massage: "No User Found" });

        if (!data || data.length === 0) return res.status(400).json({ massage: "No payment Found" });

        for (let item of data) {
            ids.push(item.productId)
        }

        const products = await prisma.product.findMany({
            where: {
                id: { in: ids }
            },
            select: {
                id: true,
                price: true,
                discount: true,
            },
        })

        if (!products.length) return res.status(400).json({ massage: "No Product found" });

        for (let product of products) {
            const quantity = data.find((sale) => sale.productId === product.id)?.quantity;

            if (!quantity) return;

            const promise = prisma.product.update({
                where: {
                    id: product.id,
                },
                data: {
                    pieces: { decrement: quantity },
                },
                select: {
                    pieces: true,
                },
            })

            promises.push(promise)

            const totalPrice = Number(Number(product.price) - (Number(product.price) * product.discount)) * quantity;

            CreateData.push({ userId: userId, productId: product.id, totalprice: totalPrice, numberOfItems: quantity })
        }

        promises.push(prisma.sale.createMany({ data: CreateData }));

        await Promise.all(promises)

        return res.status(200).json({ massage: "Successfully Made Payment" });
    }


    if (req.method === 'DELETE') {

    }


    if (req.method === 'PATCH') {

    }
};