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
import ProductContent from './ProductContent';
import Box from '@mui/material/Box';
import moment from 'moment';
import AddRemove from './AddRemove';


interface ICartChildProps {
    product: ICartProduct;
    handelDelete: (id: number) => void;
}

const CartChild = ({ product, handelDelete }: ICartChildProps) => {
    const { deleteCartItem, insertCartItem } = useContext(Context);


    const init = useCallback(async () => {
        if (product.pieces < 1) {
            handelDelete(product.id);
            deleteCartItem(product.id)
        } else insertCartItem({ quantity: 1, price: (product.price - (product.price * product.discount)), id: product.id })
    }, [])

    useEffect(() => { init() }, [init])


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

                    <div className="w-full text-sm font-normal text-gray-600 h-fit flex justify-end py-2 items-center">
                        <time>Created at {moment(product.createdAt).format("ll")}</time>
                    </div>

                    <ProductContent title={product.title} image={product.imageUrl} />

                    <Box className="text-center w-full text-gray-800 flex flex-col justify-center items-center">
                        <p>{product.content}</p>
                    </Box>

                </div>

                <div className="w-full h-full flex flex-end flex-col justify-center items-center" >
                     <AddRemove productId={product.id} discount={product.discount} price={product.price} pieces={product.pieces} />
                </div>

            </motion.div>
        </AnimatePresence>
    )
}

export default CartChild;
