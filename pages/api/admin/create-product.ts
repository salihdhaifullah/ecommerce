import { ICreateProduct } from './../../../types/product';
import { GetUserIdAndRoleMiddleware } from './../../../middleware/index';
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { error, id, role } = GetUserIdAndRoleMiddleware(req);

    if (error) return res.status(500).json({ error: error });

    if (role !== "ADMIN") return res.status(403).json({ massage: "unauthorized" })

    const discountOptions = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]

    const { tags, category, content, title, pieces, price, image, images, discount }: ICreateProduct = req.body;

    const validation: boolean = Boolean((discountOptions.includes(Number(discount))) && pieces >= 1 && price >= 1 && title.length >= 8 && content.length >= 20 && category.length >= 2 && tags.length >= 2 && image.length > 10);

    if (!validation) return res.status(400).json({ massage: "Invalid Data" });

    // start Creating Process 

    const TagsQuery = [];
    const ImagesQuery = [];

    for (let image of images) {
      ImagesQuery.push({ fileUrl: image })
    }

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

    const data = await prisma.product.create({
      data: {
        imageUrl: image,
        tags: {
          connectOrCreate: TagsQuery,
        },
        title: title,
        content: content,
        images: {
          create: ImagesQuery,
        },
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

    return res.status(200).json({ data, massage: "Product Successfully Created" })

  }

  if (req.method === "GET") {
    const tags = prisma.tag.findMany({
      select: {
        name: true
      },
    });

    const categories = prisma.category.findMany({
      select: {
        name: true
      },
    })

    await Promise.all([tags, categories]).then((data) => {
      return res.status(200).json({ tags: data[0], categories: data[1] })
    });
  
  }
}