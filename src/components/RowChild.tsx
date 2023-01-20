import Image from 'next/image';
import { motion } from 'framer-motion';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Context } from '../context';
import AddProduct from './AddProduct';

interface IRowChild {
    index: number;
    item: {
        id: number;
        discount: number;
        price: number;
        title: string;
        imageUrl: string;
    }
}

const RowChild = ({ item, index }: IRowChild) => {
    const router = useRouter();

    return (
        <div className="w-full flex justify-center items-center">
            <motion.div
                initial={{ y: -(index * 100), opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                key={item.id}
                className='backdrop-blur-2xl w-fit bg-white min-h-[280px] min-w-[220px] flex flex-col rounded-lg p-4 hover:shadow-xl shadow-lg relative'>
                <div className="w-full flex flex-col mb-auto items-center justify-between">
                    <div className="w-full flex justify-between items-center">
                        {item.discount !== 0 ?
                            (
                                <>
                                    <p className="text-gray-100 md:text-lg p-1 rounded-full shadow-lg bg-red-600  flex justify-between text-semibold text-base">{String(item.discount).split(".")[1]}0%</p>

                                    <div className="flex justify-between items-center gap-8 flex-col">
                                        <p className='text-lg text-gray-700 font-semibold flex-row flex'>
                                            <span className='text-sm text-blue-600'>$</span>
                                            <span className="line-through mr-2">{item.price}</span>
                                            <span className='text-sm text-blue-600'>$</span>
                                            {Number(item.price - (item.price * item.discount)).toFixed(2)}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between items-center gap-8">
                                    <p className='text-lg text-gray-700 font-semibold flex-row flex'>
                                        <span className='text-sm text-blue-600'>$</span>{item.price}
                                    </p>
                                </div>
                            )}

                    </div>

                    <div className="w-full h-full flex justify-center items-center">
                        <motion.div onClick={() => router.push(`/products/${item.id}`)} whileHover={{ scale: 1.25, rotateX: 25, rotate: -15 }} className='w-[150px] h-[150px]  flex cursor-pointer'>
                            <Image width={150} height={150} src={item.imageUrl} alt={item.title} className='w-full h-full object-contain cursor-pointer' />
                        </motion.div>
                    </div>


                </div>
                <div className="w-full flex flex-wrap items-center justify-between ">

                <AddProduct productId={item.id} />

                    <p className="text-gray-700 md:text-lg flex justify-between text-semibold text-base">{item.title}</p>
                </div>
            </motion.div >
        </div>
    )
}

export default RowChild;
