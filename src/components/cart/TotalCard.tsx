import { Box, Button, CircularProgress } from '@mui/material'
import Link from 'next/link'
import { useState, useContext, useEffect } from 'react'
import { Context } from '../../context';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
import getStripe from '../../libs/stripe';
import { checkoutSessions } from '../../api/index';
import Line from '../utils/Line';
import CheckOutDetails from './CheckOutDetails';
import ReactDOM from "react-dom"
import { useCallback } from 'react';
import { ICheckoutData, IOrderDetails } from '../../types/cart';

const Model = ({ setOpen }: { setOpen: (bool: boolean) => void }) => {
    const [ele, setEle] = useState<HTMLDivElement | null>(null)
    const eleCallback = useCallback((node: HTMLDivElement) => { setEle(node) }, [])
    const [orderDetails, setDetails] = useState<IOrderDetails | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { cartItems } = useContext(Context);
    const router = useRouter()

    useEffect(() => {
        if (ele === null) return;
        const handleClick = (e: any) => { if (!ele.contains(e.target)) { setOpen(false) } }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ele]);

    const isValid = () => (orderDetails && orderDetails.address1 && orderDetails.address2 && orderDetails.phoneData && orderDetails.phoneData.country && orderDetails.phoneData.phoneCode && orderDetails.phoneData.phoneNumber)

    const handelPayment = async () => {
        setIsLoading(true)

        if (!isValid()) return;

        const items: {productId: number, quantity: number}[] = [];

        for (let item of cartItems) {
            items.push({ productId: item.id, quantity: item.quantity })
        }

        const data: ICheckoutData = {
            items,
            details: orderDetails!
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
        <>
            {ReactDOM.createPortal(
                <div className="max-w-[500px]  w-full flex fixed justify-center center items-center">
                    {isLoading ? (
                        <div className="border justify-center items-center bg-slate-50 p-4 min-h-[200px] min-w-[300px] flex flex-col w-full mx-4 md:w-auto shadow-xl z-50 rounded-md ">
                            <CircularProgress className="w-10 h-10 text-blue-600" />
                        </div>
                    ) : (
                        <div ref={eleCallback} className="border bg-slate-50 p-4 gap-4 flex flex-col w-full mx-4 md:w-auto shadow-xl z-50 rounded-md ">
                            <h1 className="font-semibold text-xl text-gray-800 ">Check-Out Details</h1>
                            <Box className="flex flex-col w-full h-fit gap-4 rounded-lg bg-white py-2 px-4 justify-start items-start">
                                <CheckOutDetails setDetails={setDetails} />
                            </Box>
                            <div className="flex w-full justify-end items-center">
                                <Button onClick={() => isValid() ? handelPayment() : () => {}} disabled={!isValid()} className={`text-white ${isValid() ? "bg-blue-500" : "bg-gray-300"}`}>Submit</Button>
                            </div>
                        </div>
                    )}
                </div>,
                document.getElementById('__next')!,
            )}
        </>
    )
}

const TotalCard = () => {
    const [open, setOpen] = useState(false)
    const { totalPrice, items } = useContext(Context);

    useEffect(() => {
        const element = document.getElementById("root-model")
        if (open) element?.classList.add("blur-sm")
        else element?.classList.remove("blur-sm")
    }, [open])

    return (
        <section className='flex flex-col lg:ml-16 justify-center items-center rounded-lg md:mx-12 h-fit  lg:mt-6 shadow-lg bg-white p-8'>
            <p className="flex p-2 text-base font-semibold text-gray-800">
                {items > 1 ? `Products: ${items}` : `one Product`}
            </p>

            <div className="flex justify-center items-center">
                <h1 className="flex font-semibold text-xl text-gray-800 p-2">total $:{totalPrice.toFixed(2)}</h1>
            </div>

            <Line />

            <Button onClick={() => setOpen(true)} className='bg-gradient-to-tr m-4 p-2 rounded-md shadow-md flex from-blue-300 to-blue-600 duration-500  border-[0] ease-in-out hover:bg-gradient-to-r'>
                <span title='checkout with stripe' className="z-10 py-1 text-white text-sm font-semibold uppercase">
                    check out!
                </span>
            </Button>

            {!open ? null : (<Model setOpen={setOpen} />)}

            <div className="w-full flex justify-center items-center">
                <p className="text-gray-700 justify-center items-center"> do Not have an account !</p>
                <Link href='/sing-up' className='text-blue-600 link hover:underline'>Sing Up</Link>
            </div>
        </section>
    )
}

export default TotalCard;
