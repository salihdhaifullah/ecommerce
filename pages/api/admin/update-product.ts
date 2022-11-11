import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma';
import { GetUserIdAndRoleMiddleware } from '../../../middleware';
import { IUpdateProduct } from '../../../types/product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'GET') {
        const id: number = Number(req.query["id"]);

        if (typeof id !== "number") return res.status(400).json({ massage: "Product Id Not Found" });

        const data = await prisma.product.findFirst({
            where: {
                id: id
            },
            select: {
                title: true,
                discount: true,
                price: true,
                pieces: true,
                content: true,
                tags: {
                    select: {
                        name: true,
                    },
                },
                category: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!data) return res.status(404).json({ massage: "Product Not Found" })
        return res.status(200).json({ data })
    }


    if (req.method === 'POST') {

    }


    if (req.method === 'DELETE') {

    }


    if (req.method === 'PATCH') {

        const { error, id, role } = GetUserIdAndRoleMiddleware(req);

        if (error) return res.status(500).json({ error: error });

        if (role !== "ADMIN") return res.status(403).json({ massage: "unauthorized" })

        const productId: number = Number(req.query["id"]);

        if (typeof productId !== "number") return res.status(400).json({ massage: "Product Id Not Found" });

        const discountOptions = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]

        const { tags, category, content, title, pieces, price, discount }: IUpdateProduct = req.body;

        const validation: boolean = Boolean((discountOptions.includes(Number(discount))) && pieces >= 1 && price >= 1 && title.length >= 8 && content.length >= 20 && category.length >= 2 && tags.length >= 2);

        if (!validation) return res.status(400).json({ massage: "Invalid Data" });

        // Start UpdateIng Process 

        const TagsQuery = [];

        for (let tag of tags) {
            TagsQuery.push({
                where: {
                    name: tag
                },
                create: {
                    name: tag
                }
            })
        }

        await prisma.product.update({
            where: {
                id: productId,
            },
            data: {
                tags: {
                    connectOrCreate: TagsQuery,
                },
                title: title,
                content: content,
                discount: discount,
                price: price,
                pieces: pieces,
                category: {
                    connectOrCreate: {
                        where: {
                            name: category
                        },
                        create: {
                            name: category
                        }
                    },
                },
            },
        });

        return res.status(200).json({ massage: "Product Successfully Updated" })
    }
};