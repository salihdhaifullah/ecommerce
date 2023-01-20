import { AnimatePresence, motion } from 'framer-motion'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react';
import { ICartProduct } from '../types/cart';
import { getLikes, likeProduct } from '../api';
import useGetUser from '../hooks/useGetUser';
import { useContext } from 'react';
import { Context } from '../context';
import Likes from './Likes';
import DiscountAndPrice from './DiscountAndPrice';

interface ICartChildProps {
    product: ICartProduct;
    handelDelete: (id: number) => void;
}

const CartChild = ({ product, handelDelete }: ICartChildProps) => {
    const { deleteCartItem, insertCartItem } = useContext(Context);
    const [quantity, setQuantity] = useState(1);

    const init = useCallback(async () => {
        if (product.pieces < 1) {
            handelDelete(product.id);
            deleteCartItem(product.id)
        } else insertCartItem({ quantity: 1, price: (product.price - (product.price * product.discount)), id: product.id })
    }, [])

    useEffect(() => {
        insertCartItem({ quantity: quantity, price: (product.price - (product.price * product.discount)), id: product.id })
    }, [quantity])

    useEffect(() => { init() }, [init])

    const handelIncrement = () => {
        if (quantity === Number(product.pieces)) return;
        else setQuantity((value) => value + 1)
    }

    const handelDecrement = () => {
        if (quantity === 1) return;
        else setQuantity((value) => value - 1)
    }


    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 400, opacity: 0, scale: 0.2 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ opacity: 0.8, x: 600, scale: 1 }}
                transition={{ duration: 0.8 }}

                className="w-full h-fit py-1 px-3 ease-in-out flex-col duration-100 transition-all shadow-lg flex bg-white rounded-lg">
                <div className="p-8 w-full h-fit flex flex-col relative rounded-lg">

                    <CancelPresentationIcon onClick={() => handelDelete(product.id)} className='flex ml-[2px] top-0 left-0 mt-[2px] text-[2rem] p-[6px] cursor-pointer absolute hover:from-red-400 hover:text-red-700 transition-all bg-gradient-to-tr from-red-300 to-red-60  text-red-500  rounded-lg ' />
                    <DiscountAndPrice price={product.price} discount={product.discount} />

                    <div className="flex mb-2 text-center w-full h-fit flex-col justify-center items-center rounded-lg">
                        <p className="text-base w-fit">
                            <span className='text-2xl'>{product.title}</span>
                            <span className='h-[1px] w-full   bg-gradient-to-tr from-blue-300 to-blue-600  flex flex-row'></span>
                        </p>
                        <br />
                        <p className="text-gray-500 flex self-center px-4">{product.content}</p>
                    </div>

                    <div className="flex w-full justify-center items-center">
                        <motion.div whileHover={{ scale: 1.35, rotate: -15 }} className='h-[200px] w-fit flex justify-center items-center'>
                            <Image width={400} height={400} className='max-h-[200px] max-w-[200px] object-contain' src={product.imageUrl} alt={product.title} />
                        </motion.div>
                    </div>
                </div>

                <div className=" w-full h-full flex flex-end flex-col  justify-center items-center">

                    <div className="flex h-fit w-full justify-between flex-row items-center">

                        <div className="flex justify-center items-center ml-2">
                            <p className="font-semibold">

                                {product.pieces - quantity >= 1
                                    ? `${product.pieces - quantity > 1
                                        ? `items left: ${product.pieces - quantity}`
                                        : 'one item left !'}`
                                    : 'sorry no item left'}
                            </p>
                        </div>

                        <div className="flex self-end h-fit  rounded-lg justify-end mr-4 my-6 bg-gray-800">

                            <div className="p-2 flex flex-row">

                                {quantity === Number(product.pieces)
                                    ? <span className="flex bg-gray-500 rounded-lg justify-between px-1 self-center text-base ">+</span>
                                    : <span onClick={handelIncrement} className="flex bg-blue-400 px-1 self-center rounded-lg text-white cursor-pointer text-base ">+</span>}

                                <span className="flex bg-gradient-to-tr rounded-lg px-2 mx-2 from-blue-300 text-base  to-blue-600 ">{quantity}</span>

                                {quantity >= 2
                                    ? <span onClick={handelDecrement} className="flex  px-1 self-center bg-blue-400 rounded-lg text-white cursor-pointer text-base ">-</span>
                                    : <span className="flex bg-gray-500 rounded-lg px-1 self-center text-base ">-</span>
                                }

                            </div>

                        </div>

                        <div className="flex justify-center items-center mr-3 ">
                                <Likes productId={product.id}/>
                        </div>

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default CartChild;
