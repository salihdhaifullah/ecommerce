import { useCallback, useEffect, useState } from 'react'
import CartChild from '../components/CartChild'
import EmptyCart from '../components/EmptyCart'
import TotalCard from '../components/TotalCard'
import { AnimatePresence } from 'framer-motion'
import useGetProductsIds from '../hooks/useGetProductsIds'
import { CircularProgress } from '@mui/material'
import { getCartProducts, makePayment } from '../api'
import { ICartProduct } from '../types/cart'
import { ISale } from '../types/sale'

const Cart = () => {
    const [productsIds] = useGetProductsIds()
    const [total, setTotal] = useState(1)
    const [products, setProducts] = useState<ICartProduct[]>([])
    const [totalProductsPrice, setTotalProductsPrice] = useState<{ id: number, price: number }[]>([])
    const [change, setChange] = useState(false)

    const init = useCallback(async () => {
        if (productsIds.length === 0) return;
        await getCartProducts(productsIds).then((res) => { setProducts(res.data.products) }).catch((err) => { console.log(err) })
    }, [productsIds])

    const handelDelete = (id: number) => {
        localStorage.removeItem(`product id ${id}`)
        setProducts(products.filter((product) => product.id !== id))
    }

    useEffect(() => {
        setTotal(totalProductsPrice.reduce((accumulator, current) => accumulator + current.price, 0))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [change])

    useEffect(() => {
        init()
    }, [init])


    const handelPayment = async () => {
        const data: ISale[] = [];

        for (let item of totalProductsPrice) {
            const product = products.find((product) => product.id === item.id)
            if (!product) return;
            const quantity = item.price / (product.price - (product.price * product.discount))
            data.push({ productId: item.id, quantity: quantity })

        }

        console.log(data);
        await makePayment(data).then((res) => { console.log(res) }).catch((err) => { console.log(err) });
        for (let productId of productsIds) {
            localStorage.removeItem("product id " + productId)
        }
        setProducts([])
    }

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
                                            <CartChild product={item} setChange={setChange} change={change} totalProductsPrice={totalProductsPrice} setTotalProductsPrice={setTotalProductsPrice} handelDelete={handelDelete} />
                                        </AnimatePresence >
                                    )
                                })}
                            </div>
                            <TotalCard handelPayment={handelPayment} Total={total} />
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