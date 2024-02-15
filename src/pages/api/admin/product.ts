import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../libs/prisma';
import stripe from '../../../libs/stripe/api';
import Storage from '../../../libs/supabase';
import GetUserIdAndRole from '../../../utils/auth'
import { ICreateProduct, IUpdateProduct } from '../../../types/product';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'DELETE') {
    const productId: number = Number(req.query["id"]);

    const { error, id, role } = GetUserIdAndRole(req);
    if (error) return res.status(500).json({ error: error });
    if (role !== "ADMIN") return res.status(403).json({ massage: "unauthorized" })

    if (typeof productId !== "number") return res.status(400).json({ massage: "Product Id Not Found" });

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stripePriceId: true, stripeProductId: true }
    })

    if (!product?.stripeProductId) return res.status(404).json({ massage: "Product Not Found" });

    const promise1 = prisma.product.delete({ where: { id: productId } });
    const promise2 = stripe.products.update(product.stripeProductId, { active: false });
    const promise3 = stripe.prices.update(product.stripePriceId, { active: false });

    await Promise.all([promise1, promise2, promise3])

    return res.status(200).json({ massage: "Product Successfully Deleted" })
  }


  if (req.method === 'PATCH') {
    const productId: number = Number(req.query["id"]);

    const { error, id, role } = GetUserIdAndRole(req);
    if (error) return res.status(500).json({ error: error });
    if (role !== "ADMIN") return res.status(403).json({ massage: "unauthorized" })

    if (typeof productId !== "number") return res.status(400).json({ massage: "Product Id Not Found" });

    const discountOptions = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]

    const { tags, category, content, title, pieces, price, discount }: IUpdateProduct = req.body;

    const validation: boolean = Boolean((discountOptions.includes(Number(discount))) && pieces >= 1 && price >= 1 && title.length >= 6 && content.length >= 20 && category.length >= 2 && tags.length >= 2);

    if (!validation) return res.status(400).json({ massage: "Invalid Data" });

    // Start UpdateIng Process

    const TagsQuery = [];
    const TagsQuery2 = [];

    for (let tag of tags) {
      TagsQuery.push({ where: { name: tag.trim() }, create: { name: tag.trim() } })
    }

    const productData = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        stripeProductId: true,
        stripePriceId: true,
        tags: {
          select: { id: true }
        }
      }
    })

    if (!productData?.stripeProductId) return res.status(400).json({ massage: "Product Not Found" });

    for (let tag1 of productData.tags) {
      TagsQuery2.push({ id: tag1.id })
    }

    const StripePrice = await stripe.prices.create({
      unit_amount: (price * 100) - (discount * price * 100),
      currency: 'usd',
      product: productData.stripeProductId
    })

    const promise1 = stripe.products.update(productData.stripeProductId, { name: title, description: content, default_price: StripePrice.id });

    const promise2 = prisma.product.update({
      where: { id: productId },
      data: {
        tags: {
          disconnect: TagsQuery2,
          connectOrCreate: TagsQuery
        },
        title: title,
        content: content,
        discount: discount,
        price: price,
        pieces: pieces,
        stripePriceId: StripePrice.id,
        category: { connectOrCreate: { where: { name: category.trim() }, create: { name: category.trim() } } }
      }
    });

    const promise3 = stripe.prices.update(productData.stripePriceId, { active: false })

    await Promise.all([promise1, promise2, promise3])

    return res.status(200).json({ massage: "Product Successfully Updated" })
  }


  if (req.method === 'POST') {

    const { error, id, role } = GetUserIdAndRole(req);

    if (error) return res.status(500).json({ error: error });
    if (role !== "ADMIN") return res.status(403).json({ massage: "unauthorized" })
    if (typeof id !== "number") return res.status(404).json({ massage: "User Not Found" });

    const discountOptions = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]

    const { tags, category, content, title, pieces, price, image, images, discount }: ICreateProduct = req.body;

    const validation: boolean = Boolean((discountOptions.includes(Number(discount))) && pieces >= 1 && price >= 1 && title.length >= 6 && content.length >= 20 && category.length >= 2 && tags.length >= 2 && image.length > 10);

    if (!validation) return res.status(400).json({ massage: "Invalid Data" });

    // start Creating Process

    const TagsQuery = [];
    const imagesUrls: string[] = [];

    const uploadPromises = []

    uploadPromises.push(Storage.uploadFile(image))

    for (let image of images) {
      uploadPromises.push(Storage.uploadFile(image))
    }

    const uploadData = await Promise.all(uploadPromises)

    if (uploadData[0].error) return res.status(500).json({ massage: "Internal server Error" });
    const imageUrl = uploadData[0].Url;
    imagesUrls.push(imageUrl)

    for (let i = 1; i < uploadData.length; i++) {
      if (uploadData[i].error) return res.status(500).json({ massage: "Internal server Error" });
      imagesUrls.push(uploadData[i].Url);
    }

    const product = await stripe.products.create({
      name: title,
      description: content,
      shippable: true,
      images: imagesUrls,
      default_price_data: {
        unit_amount: (price * 100) - (discount * price * 100),
        currency: 'usd',
      }
    });

    for (let tag of tags) {
      TagsQuery.push({ where: { name: tag.trim() }, create: { name: tag.trim() } })
    }

    const data = await prisma.product.create({
      data: {
        imageUrl: imageUrl,
        tags: { connectOrCreate: TagsQuery },
        title: title,
        content: content,
        images: imagesUrls,
        discount: discount,
        price: price,
        pieces: pieces,
        category: { connectOrCreate: { where: { name: category.trim() }, create: { name: category.trim() } } },
        stripeProductId: product.id,
        stripePriceId: product.default_price as string
      },
      select: { id: true }
    });

    return res.status(200).json({ id: data.id, massage: "Product Successfully Created" })
  }
};
