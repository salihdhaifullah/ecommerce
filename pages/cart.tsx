import { useCallback, useContext, useEffect, useState } from 'react'
import CartChild from '../components/CartChild'
import EmptyCart from '../components/EmptyCart'
import TotalCard from '../components/TotalCard'
import { AnimatePresence } from 'framer-motion'
import useGetProductsIds from '../hooks/useGetProductsIds'
import { CircularProgress } from '@mui/material'
import { checkoutSessions, getCartProducts } from '../api'
import { ICartProduct } from '../types/cart'
import { ISale } from '../types/sale'
import getStripe from '../libs/stripe'
import { Context } from '../context'
import { useRouter } from 'next/router'
import ThankYou from '../components/ThankYou'
import Toast from '../functions/sweetAlert'
import Swal from 'sweetalert2'

const Cart = () => {
    const [productsIds] = useGetProductsIds()
    const [products, setProducts] = useState<ICartProduct[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()
    const { removeItem, deleteCartItem, cartItems, state } = useContext(Context);
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

    const handelDelete = (id: number) => {
        localStorage.removeItem(`product id ${id}`)
        deleteCartItem(id)
        setProducts(products.filter((product) => product.id !== id))
        removeItem()
    }

    useEffect(() => {
        init()
    }, [init])

    const HandelSuccess = useCallback(() => {
        if (router.query.success) {
            for (let productId of productsIds) {
                localStorage.removeItem("product id " + productId)
                removeItem()
            }
            setIsSuccess(true)
        } else setIsSuccess(false)
    }, [router])

    useEffect(() => {
        HandelSuccess()
    }, [HandelSuccess])

    const handelPayment = async () => {
        const data: ISale[] = [];

        for (let item of state.cartItems) {
            const product = products.find((product) => product.id === item.id)
            if (!product) continue;
            data.push({ productId: item.id, quantity: item.quantity })
        }

        await checkoutSessions(data).then(async (response) => {
            const stripe = await getStripe()
            await stripe!.redirectToCheckout({ sessionId: response.data.id })
        })
            .catch(() => {
                Swal.fire({
                    title: "You Have To Login To Make This Payment",
                    icon: "error",
                    showCancelButton: true,
                    showConfirmButton: true
                })
                    .then(async (res) => { if (res.value) router.push("/sing-up") })
            })


    }



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
                                <TotalCard handelPayment={handelPayment} />
                            </div>
                        ) : <EmptyCart />}
        </section>
    )
}

export default Cart;

