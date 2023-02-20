import { useCallback, useContext, useEffect, useState } from 'react'
import CartChild from '../components/cart/CartChild'
import EmptyCart from '../components/cart/EmptyCart'
import TotalCard from '../components/cart/TotalCard'
import { AnimatePresence } from 'framer-motion'
import useGetProductsIds from '../hooks/useGetProductsIds'
import { CircularProgress } from '@mui/material'
import { getCartProducts } from '../api'
import { ICartProduct } from '../types/cart'
import { ISale } from '../types/sale'
import getStripe from '../libs/stripe'
import { Context } from '../context'
import { useRouter } from 'next/router'
import ThankYou from '../components/utils/ThankYou'
import Swal from 'sweetalert2'

const Cart = () => {
    const [productsIds] = useGetProductsIds()
    const [products, setProducts] = useState<ICartProduct[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()
    const { removeItem, deleteCartItem } = useContext(Context);
    const [isSuccess, setIsSuccess] = useState(false)

    const init = useCallback(async () => {
        setIsLoading(true);

        if (productsIds.length === 0) {
            setIsLoading(false)
            return;
        };
        await getCartProducts(productsIds)
            .then((res) => { setProducts(res.data.products) })
            .catch((err) => { console.log(err) });
        setIsLoading(false)

    }, [productsIds])

    useEffect(() => { init() }, [init])

    const handelDelete = (id: number) => {
        localStorage.removeItem(`product id ${id}`)
        deleteCartItem(id)
        setProducts(products.filter((product) => product.id !== id))
        removeItem()
    }

    const HandelSuccess = useCallback(() => {
        if (router.query["success"]) {
            for (let productId of productsIds) {
                localStorage.removeItem("product id " + productId)
                removeItem()
            }
            setIsSuccess(true)
        } else setIsSuccess(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query?.success])

    useEffect(() => { HandelSuccess() }, [HandelSuccess])

    return (
        <section className='w-full h-auto flex justify-center items-center min-h-screen bg-Blur rounded-lg py-2 px-6'>
            {isLoading ? <CircularProgress /> :
                isSuccess ? <ThankYou /> :
                    products.length > 0
                        ? (
                            <div className="w-full my-20 h-auto gap-4 grid lg:grid-cols-2 grid-cols-1 min-h-screen">
                                <div className="w-full h-full gap-10 flex flex-col ">
                                    {products.map((item, index) => (
                                        <AnimatePresence key={index}>
                                            <CartChild product={item} handelDelete={handelDelete} />
                                        </AnimatePresence >
                                    ))}
                                </div>
                                <TotalCard />
                            </div>
                        ) : <EmptyCart />}
        </section>
    )
}

export default Cart;

