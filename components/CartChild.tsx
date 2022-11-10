import { AnimatePresence, motion } from 'framer-motion'
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import Image from 'next/image'
import { useState } from 'react';
import { IProduct } from '../types/product';

interface ICartChildProps {
    product: IProduct;
}

const CartChild = ({ product }: ICartChildProps) => {

    const [isLikedByUser, setIsLikedByUser] = useState(false)
    const [likes, setLikes] = useState<string[]>([])



    const Total = 2;



    const handelDelete = (id: number) => {

    }

    const handelIncrement = () => {

    }

    const handelDecrement = () => {

    }

    const handelLike = () => {

    }


    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: 400, opacity: 0, scale: 0.2 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ opacity: 0.8, x: 600, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full my-6 h-fit ease-in-out flex-col duration-100 transition-all drop-shadow-lg flex bg-white rounded-lg">
                <div className="p-8 w-full h-fit flex flex-row flex-wrap lg:grid xl:grid md:grid relative grid-cols-2 rounded-lg">

                    <CancelPresentationIcon onClick={() => handelDelete(product.id)} className='flex ml-[2px] top-0 left-0 mt-[2px] text-[2rem] p-[6px] cursor-pointer absolute hover:from-red-400 hover:text-red-700 transition-all bg-gradient-to-tr from-red-300 to-red-60  text-red-500  rounded-lg ' />

                    {product.discount !== 0 && (
                        <div className="shadow-lg max-w-fit rounded-full  -top-7 left-[5%] drop-shadow-lg absolute h-10 items-center justify-center  z-[4] flex ">
                            <p className="text-gray-100 md:text-lg p-1 rounded-full bg-red-600  flex justify-between text-semibold text-base">{String(product.discount).split(".")[1]}0%</p>

                        </div>
                    )}

                    <div className="bg-gray-800 shadow-lg  max-w-fit rounded-lg  -top-7 right-[5%] px-[6px] absolute h-10 items-center justify-center  z-[4] flex ">

                        {product.discount !== 0 ?
                            (
                                <>

                                    <div className="flex justify-between items-center gap-8 flex-col">
                                        <p className='text-lg text-gray-100 font-semibold flex-row flex'>
                                            <span className='text-sm text-blue-600'>$</span>
                                            <span className="line-through mr-3">
                                                {product.price}
                                            </span>
                                            <span className='text-sm text-blue-600'>$</span>
                                            {Number(product.price - (product.price * product.discount)).toFixed(2)}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between items-center gap-8">
                                    <p className='text-lg text-gray-100 font-semibold flex-row flex'>
                                        <span className='text-sm text-blue-600'>$</span>{product.price}
                                    </p>
                                </div>
                            )}
                    </div>

                    <div className="h-32 flex rounded-lg justify-center items-center w-full bg-white ">
                        <Image width={400} height={400} className=' w-full  h-full object-contain' src={product.imageUrl} alt={product.title} />
                    </div>

                    <div className="flex  h-fit flex-col justify-center items-center rounded-lg">
                        <p className="text-base  w-fit"><span className='text-2xl'>{product.title}</span>
                            <span className='h-[1px] w-full   bg-gradient-to-tr from-blue-300 to-blue-600  flex flex-row'></span></p>
                        <br />
                        <p className="text-gray-500 flex self-start px-4">{product.content}</p>
                    </div>
                </div>




                <div className=" w-full h-full flex flex-end flex-col  justify-center items-center">



                    <div className="flex h-fit w-full justify-between flex-row items-center">

                        <div className="flex justify-center items-center ml-2">
                            <p className="font-semibold">

                                {product.pieces - Total >= 1

                                    ? `${product.pieces - Total > 1
                                        ? `items left: ${product.pieces - Total}`
                                        : 'one item left !'}`

                                    : 'sorry no item left'}

                            </p>
                        </div>

                        <div className="flex self-end h-fit  rounded-lg justify-end mr-4 my-6 bg-gray-800">

                            <div className="p-2 flex flex-row">

                                {Total === product.pieces ? (
                                    <span className="flex bg-gray-500 rounded-lg justify-between px-1 self-center text-base ">+</span>
                                ) : (
                                    <span onClick={handelIncrement} className="flex bg-blue-400 px-1 self-center rounded-lg text-white cursor-pointer text-base ">+</span>
                                )}

                                <span className="flex bg-gradient-to-tr rounded-lg px-2 mx-2 from-blue-300 text-base  to-blue-600 ">{Total}</span>

                                {Total >= 2 ? (
                                    <span onClick={handelDecrement} className="flex  px-1 self-center bg-blue-400 rounded-lg text-white cursor-pointer text-base ">-</span>
                                ) : (
                                    <span className="flex bg-gray-500 rounded-lg px-1 self-center text-base ">-</span>
                                )}

                            </div>

                        </div>
                        <div className="flex justify-center items-center mr-3 ">
                            <motion.button
                                whileTap={{ scale: 0.6 }}
                                onClick={handelLike} className={`flex-none flex flex-col items-center ease-in-out duration-[50] transition-all justify-center w-10 h-10 rounded-md ${isLikedByUser ? 'text-red-600 shadow-md shadow-red-500 border-red-300' : 'text-slate-300 border-slate-200'} border `} type="button" aria-label="Like">

                                <svg width="20" height="20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                </svg>
                                <span className="flex text-xs text-gray-400">{likes.length}</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default CartChild;