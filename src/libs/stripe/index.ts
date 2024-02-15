import { Stripe, loadStripe } from '@stripe/stripe-js';
let stripePromise: Promise<Stripe | null>;

export default function getStripe() {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) throw new Error('STRIPE PUBLIC KEY NOT FOUND');
    if (!stripePromise) stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    return stripePromise;
};