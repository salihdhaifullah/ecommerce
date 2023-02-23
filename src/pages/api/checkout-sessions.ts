import { NextApiRequest, NextApiResponse } from 'next'
import stripe from '../../libs/stripe/api'
import Stripe from 'stripe'
import GetUserIdAndRole from '../../utils/auth'
import prisma from '../../libs/prisma'
import { ICheckoutData } from '../../types/cart'

interface IProductSale {
    productId: number
    numberOfItems: number
    totalPrice: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {

        try {

            const data: ICheckoutData = req.body;
            const ids: number[] = [];
            const productsSale: IProductSale[] = [];
            const line_items = [];
            let totalPrice = 0;

            const { error, id: userId } = GetUserIdAndRole(req);

            if (error || !userId) return res.status(400).json({ massage: "No User Found" });
            if (!data || !data.items?.length) return res.status(400).json({ massage: "No Payment Found" });
            if (!data.details || !data.details.address1 || !data.details.address2) return res.status(400).json({ massage: "No Address Found" });
            if (!data.details.phoneData?.country || !data.details.phoneData.phoneCode || !data.details.phoneData.phoneNumber) return res.status(400).json({ massage: "No phoneNumber Found" });

            for (let item of data.items) { ids.push(item.productId) }

            const products = await prisma.product.findMany({
                where: { id: { in: ids } },
                select: { id: true, price: true, discount: true, stripePriceId: true }
            })


            for (let product of products) {
                const quantity = data.items.find((item) => item.productId === product.id)?.quantity || 1

                line_items.push({ price: product.stripePriceId, quantity })
                const num = (Number(product.price) - (Number(product.price) * product.discount)) * quantity;
                const dataSale = { productId: product.id, numberOfItems: quantity, totalPrice: num }
                productsSale.push(dataSale)
                totalPrice += num;
            }

            const params: Stripe.Checkout.SessionCreateParams = {
                submit_type: 'pay',
                payment_method_types: ['card'],
                line_items: line_items,
                mode: 'payment',
                success_url: `${req.headers.origin}/cart?success=true`,
                cancel_url: `${req.headers.origin}/cart`
            }

            const checkoutSession = await stripe.checkout.sessions.create(params)

            await prisma.sale.create({
                data: {
                    userId: userId,
                    totalPrice: totalPrice,
                    checkoutSessionId: checkoutSession.id as string,
                    saleProducts: { createMany: { data: productsSale } },
                    address1: data.details.address1,
                    address2: data.details.address2,
                    phoneNumber: data.details.phoneData.phoneNumber,
                    country: data.details.phoneData.country,
                    countryCode: data.details.phoneData.phoneCode
                }
            })

            return res.status(200).json(checkoutSession)

        } catch (err) {
            console.log(err)
            return res.status(500).json({ message: "Internal Server Error" })
        }
    }
}
