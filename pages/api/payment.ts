import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../libs/prisma';
import { IMakeASale } from '../../types/sale';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {

    }


    if (req.method === 'POST') {
        interface ISale {
            productId: number
            quantity: number
        }

        const data: ISale[] = req.body.data;

        const ids: number[] = []

        for (let item of data) {
            ids.push(item.productId)
        }

        const products = await prisma.product.findMany({
            where: {
                id: {in: ids}
            },
            select: {
                id: true,
                price: true,
                discount: true,
            },
        })


        if (!products.length) return res.status(400).json({ massage: "No Product found" });


        interface ICreateSale {
            userId: number;
            productId: number;
            totalprice: number;
            numberOfItems: number;
        }

        const CreateData: ICreateSale[] = [];


        for (let product of products) {
            const quantity = data.find((sale) => sale.productId === product.id)?.quantity;
            
            if (!quantity) return;
           
            const totalPrice = Number(Number(product.price) - (Number(product.price) * product.discount)) * quantity;

            CreateData.push({userId: 1, productId: product.id, totalprice: totalPrice, numberOfItems: quantity})
        }

        const endData = await prisma.sale.createMany({ data: CreateData })


        return res.status(200).json({endData})
    }


    if (req.method === 'DELETE') {

    }


    if (req.method === 'PATCH') {

    }
};