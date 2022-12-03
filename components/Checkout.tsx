import React, { useState } from 'react'
import CustomDonationInput from '../components/CustomDonationInput'
import getStripe from '../libs/stripe'
import { fetchPostJSON } from '../libs/stripe/api'
import { formatAmountForDisplay } from '../libs/stripe/api'
import * as config from '../libs/stripe/config'

const Checkout = () => {
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState({
        customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
    })

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
        setInput({
            ...input,
            [e.currentTarget.name]: e.currentTarget.value,
        })

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Create a Checkout Session.
        const response = await fetchPostJSON('/api/checkout_sessions', {
            amount: input.customDonation,
        })

        if (response.statusCode === 500) {
            console.error(response.message)
            return
        }

        // Redirect to Checkout.
        const stripe = await getStripe()
        const { error } = await stripe!.redirectToCheckout({
            // Make the id field from the Checkout Session creation API response
            // available to this file, so you can provide it as parameter here
            // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
            sessionId: response.id,
        })
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `error.message`.
        console.warn(error.message)
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            <CustomDonationInput
                className="checkout-style"
                name={'customDonation'}
                value={input.customDonation}
                min={config.MIN_AMOUNT}
                max={config.MAX_AMOUNT}
                step={config.AMOUNT_STEP}
                currency={config.CURRENCY}
                onChange={handleInputChange}
            />
            <div className="test-card-notice">
                Use any of the{' '}
                <a
                    href="https://stripe.com/docs/testing#cards"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Stripe test cards
                </a>{' '}
                for this demo, e.g.{' '}
                <div className="card-number">
                    4242<span></span>4242<span></span>4242<span></span>4242
                </div>
                .
            </div>
            <button
                className="checkout-style-background"
                type="submit"
                disabled={loading}
            >
                Donate {formatAmountForDisplay(input.customDonation, config.CURRENCY)}
            </button>
        </form>
    )
}

export default Checkout