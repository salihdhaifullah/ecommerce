import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from "micro";
import stripe from "../../libs/stripe/api"
import prisma from '../../libs/prisma';

export const config = { api: { bodyParser: false } };

const handelGetSigningSecret = (): string => {
    if (process.env.NODE_ENV === "production") {
        const kay = process.env.STRIPE_SIGNING_SECRET
        if (!kay) throw new Error("No STRIPE_SIGNING_SECRET Found");
        return kay
    } else {
        return "whsec_95c1cb8bf8a555cca91e8571ab37880133586d6369cc0e9c3e8681c4c0993e1c"
    }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const signature = req.headers["stripe-signature"] as string;
    const signingSecret = handelGetSigningSecret();
    const reqBuffer = await buffer(req);

    try {
        const event = stripe.webhooks.constructEvent(reqBuffer, signature, signingSecret);

        if (event.type === "checkout.session.completed") {
            const paymentIntent: any = event.data.object;

            const isFoundSale = await prisma.sale.findFirst({
                where: { checkoutSessionId: paymentIntent.id as string },
                select: { id: true, userId: true, saleProducts: { select: { productId: true, numberOfItems: true } } }
            })

            if (!isFoundSale) return;

            const transactions = [];

            for (let productSale of isFoundSale?.saleProducts) {
                const promise = prisma.product.update({
                    where: { id: productSale.productId },
                    data:  { pieces: { decrement: productSale.numberOfItems } }
                })
                transactions.push(promise)
            }

            await prisma.$transaction([
                prisma.sale.update({ where: { id: isFoundSale.id }, data: { verified: true } }),
                prisma.user.update({ where: { id: isFoundSale.userId }, data: { isPayUse: true } }),
                ...transactions
            ])
        }

    } catch (error: any) {
        console.log(error);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    res.send({ received: true });
};

export default handler;
