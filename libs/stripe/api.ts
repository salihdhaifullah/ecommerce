import Stripe from "stripe";

export function formatAmountForDisplay(amount: number, currency: string): string {

    let numberFormat = new Intl.NumberFormat(['en-US'], {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
    })

    return numberFormat.format(amount)
}


export function formatAmountForStripe(amount: number, currency: string): number {

    let numberFormat = new Intl.NumberFormat(['en-US'], {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol'
    })

    const parts = numberFormat.formatToParts(amount);
    let zeroDecimalCurrency: boolean = true;

    for (let part of parts) {
        if (part.type === 'decimal') zeroDecimalCurrency = false;
    }

    return zeroDecimalCurrency ? amount : Math.round(amount * 100)
}




export function formatAmountFromStripe(amount: number, currency: string): number {

    let numberFormat = new Intl.NumberFormat(['en-US'], {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol'
    })

    const parts = numberFormat.formatToParts(amount);

    let zeroDecimalCurrency: boolean = true;

    for (let part of parts) {
        if (part.type === 'decimal') zeroDecimalCurrency = false;
    }

    return zeroDecimalCurrency ? amount : Math.round(amount / 100)
}



export async function fetchGetJSON(url: string) {

    try {
        const data = await fetch(url).then((res) => res.json())
        return data

    } catch (err) {
        if (err instanceof Error) throw new Error(err.message)
        throw err
    }

}

export async function fetchPostJSON(url: string, data?: {}) {

    try {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data || {}), // body data type must match "Content-Type" header
        })
        return await response.json() // parses JSON response into native JavaScript objects
    } catch (err) {
        if (err instanceof Error) throw new Error(err.message);
        throw err
    }

}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2022-11-15" })

export default stripe;