import { useEffect, useState } from 'react'
import CartChild from '../components/CartChild'
import EmptyCart from '../components/EmptyCart'
import TotalCard from '../components/TotalCard'
import { AnimatePresence } from 'framer-motion'
import useGetProductsIds from '../hooks/useGetProductsIds'
import { CircularProgress } from '@mui/material'
import { IProduct } from '../types/product'

const Cart = () => {
    const [productsIds] = useGetProductsIds()
    const [total, setTotal] = useState(1)
    const [products, setProducts] = useState<IProduct[]>([])


    return (
        <section className='w-full h-auto flex justify-center items-center min-h-screen bg-Blur rounded-lg py-2 px-6'>
            {products ? (
                <>
                    {products && products?.length > 0 ? (
                        <div className="w-full h-auto gap-4 grid lg:grid-cols-2 grid-cols-1  min-h-screen">
                            <div className="w-full h-full gap-4 flex flex-col ">
                                {products && products.map((item, index) => {
                                    return (
                                        <AnimatePresence key={index}>
                                            <CartChild product={item}/>
                                        </AnimatePresence >
                                    )
                                })}
                            </div>
                            <TotalCard Total={total} />
                        </div>
                    ) : (
                        <div className="min-w-[100vh] min-h-[60vh] justify-center items-center w-full h-full gap-4 flex flex-col ">
                            <EmptyCart />
                        </div>
                    )}
                </>
            ) : (
                <CircularProgress />
            )}
        </section>
    )
}

export default Cart;