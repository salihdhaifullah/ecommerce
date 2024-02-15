import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import AddProduct from './AddProduct';
import { useState, useRef, useCallback } from 'react';

interface IRowChild {
    isLoading: boolean;
    item: {
        id: number;
        discount: number;
        price: number;
        title: string;
        imageUrl: string;
    }
}

const RowChild = ({ item, isLoading }: IRowChild) => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false)

    const {current: observer} = useRef(new IntersectionObserver((entries) => {
        if (!isLoading && entries[0].isIntersecting) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }))

    const lastElement = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) observer.observe(node)
    }, [observer])

    return (
        <div ref={lastElement} className={`${!isVisible ? "animate-pulse shadow-xl rounded-lg p-4 bg-white" : "flex justify-center items-center"} min-h-[280px] max-h-[280px] min-w-[220px] mx-4`}>

            {isVisible && (
                    <div
                        className='backdrop-blur-2xl bg-white h-[280px] w-[220px] flex flex-col rounded-lg p-4 hover:shadow-xl shadow-lg relative'>
                        <div className="w-full flex  flex-col mb-auto items-center justify-between">
                            <div className="w-full break-keep flex justify-between items-center">
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

                            <p className="text-gray-700 md:text-lg flex justify-between text-semibold text-base">{item.title.length >= 18 ? item.title.slice(0, 15) + "..." : item.title}</p>
                        </div>
                    </div >
                )}
        </div>
    )
}

export default RowChild;
