import { Button, CircularProgress } from '@mui/material'
import Link from 'next/link'
import { useState, useContext } from 'react'
import useGetProductsIds from '../hooks/useGetProductsIds'
import { Context } from '../context';

interface ITotalCardProps {
    handelPayment: () => Promise<void>;
}

const TotalCard = ({ handelPayment }: ITotalCardProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const { totalPrice, items } = useContext(Context);

    const handelPay = async () => {
        setIsLoading(true)

        await handelPayment()
            .then((res) => console.log(res))
            .catch((err) => console.error(err));

        setIsLoading(false)
    }

    return (
        <section className='flex flex-col lg:ml-16 justify-center items-center rounded-lg md:mx-12 h-fit  lg:mt-6 shadow-lg bg-white p-8'>
            <p className="flex p-2 text-base font-semibold text-black">
                {items > 1 ? `items: ${items}` : `one item`}
            </p>
            <div className="flex justify-center items-center">
                <h1 className="flex font-semibold text-xl text-black p-2">total $:{totalPrice.toFixed(2)}</h1>
            </div>

            <hr className='bg-black w-full h-[1px]' />

            {!isLoading ? (
                <Button onClick={handelPay} className='bg-gradient-to-tr m-4 p-2 rounded-md shadow-md flex from-blue-300 to-blue-600 duration-500  border-[0] ease-in-out hover:bg-gradient-to-r'>
                    <span title='checkout with stripe' className="z-10 text-white text-md font-semibold cursor-pointer p-2 uppercase">
                        check out!
                    </span>
                </Button>
            ) : (
                <Button className='bg-gradient-to-tr m-4 p-2 rounded-md shadow-md flex from-blue-300 to-blue-600 duration-500  border-[0] ease-in-out hover:bg-gradient-to-r justify-center items-center'>
                    <CircularProgress />
                </Button>
            )}

            <div className="w-full flex justify-center items-center">
                <p className="text-gray-700 justify-center items-center"> do Not have an account !</p>
                <Link href='/sing-up' className='text-blue-600 link hover:underline'>Sing Up</Link>
            </div>
        </section>
    )
}

export default TotalCard;
