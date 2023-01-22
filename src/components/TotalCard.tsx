import { Button, CircularProgress } from '@mui/material'
import Link from 'next/link'
import { useState, useContext } from 'react'
import useGetProductsIds from '../hooks/useGetProductsIds'
import { Context } from '../context';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import { ISale } from '../types/sale';
import getStripe from '../libs/stripe';
import { checkoutSessions } from './../api/index';
import Line from './Line';

const TotalCard = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { totalPrice, items, cartItems } = useContext(Context);
    const router = useRouter()

    const handelPayment = async () => {
        setIsLoading(true)

        const data: ISale[] = [];

        for (let item of cartItems) {
            data.push({ productId: item.id, quantity: item.quantity })
        }

        await checkoutSessions(data)
            .then(async (response) => {
                const stripe = await getStripe()
                await stripe!.redirectToCheckout({ sessionId: response.data.id })
            })
            .catch(() => {
                Swal.fire({
                    title: "You Have To Sing Up To Make This Payment",
                    icon: "error",
                    showCancelButton: true,
                    showConfirmButton: true
                })
                    .then(async (res) => { if (res.value) router.push("/sing-up") })
            })
        setIsLoading(false)
    }

    return (
        <section className='flex flex-col lg:ml-16 justify-center items-center rounded-lg md:mx-12 h-fit  lg:mt-6 shadow-lg bg-white p-8'>
            <p className="flex p-2 text-base font-semibold text-gray-800">
                {items > 1 ? `Products: ${items}` : `one Product`}
            </p>

            <div className="flex justify-center items-center">
                <h1 className="flex font-semibold text-xl text-gray-800 p-2">total $:{totalPrice.toFixed(2)}</h1>
            </div>

            <Line />

            <Button onClick={handelPayment} className='bg-gradient-to-tr m-4 p-2 rounded-md shadow-md flex from-blue-300 to-blue-600 duration-500  border-[0] ease-in-out hover:bg-gradient-to-r'>
                {!isLoading ? <span title='checkout with stripe' className="z-10 py-1 text-white text-sm font-semibold uppercase">
                    check out!
                </span>
                    : <CircularProgress className="w-6 h-6 text-white" />
                }
            </Button>

            <div className="w-full flex justify-center items-center">
                <p className="text-gray-700 justify-center items-center"> do Not have an account !</p>
                <Link href='/sing-up' className='text-blue-600 link hover:underline'>Sing Up</Link>
            </div>
        </section>
    )
}

export default TotalCard;
