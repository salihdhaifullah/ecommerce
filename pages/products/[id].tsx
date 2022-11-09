import React, { useEffect, useState } from 'react'
import prisma from '../../libs/prisma';
import { IProduct } from '../../types/product';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import Button from '@mui/material/Button'
import ImageSlider from '../../components/ImageSlider';
import Rating from '@mui/material/Rating'
import Chip from '@mui/material/Chip'
import handelProcessImageForSubmitting from '../../functions/ProcessImageForSubmitting';
import { IPreviewImage } from '../../types/image';
import Comments from '../../components/Comments';
import { CircularProgress } from '@mui/material';

interface IProductPageProps {
    product: IProduct
}

const ProductPage = ({ product }: IProductPageProps) => {
    const [value, setValue] = useState<number | null>(null);
    const [openImageSlider, setOpenImageSlider] = useState(false);
    const [isFound, setIsFound] = useState(false);
    const [isLoadingLike, setIsLoadingLike] = useState(false)
    const [isLikedByUser, setIsLikedByUser] = useState(false)
    const [likes, setLikes] = useState<string[]>([])

    useEffect(() => {
        setIsFound(Boolean(localStorage.getItem(`product id ${product.id}`)))
    }, [product.id])

    const handelAdd = () => {
        setIsFound(true)
        localStorage.setItem(`product id ${product.id}`, JSON.stringify(product.id))
    }

    const handelRemove = () => {
        setIsFound(false)
        localStorage.removeItem(`product id ${product.id}`)
    }

    const handelLike = async () => {
        setIsLikedByUser(!isLikedByUser)
    }

    return (
        <>
            {product.images && openImageSlider ? (
                <div className='w-full h-full flex justify-center items-center mt-20'>
                    <ImageSlider images={handelProcessImageForSubmitting(product.images as IPreviewImage[], true)} setOpenImageSlider={setOpenImageSlider} />
                </div>
            ) : (
                <div

                    className="mb-6  flex flex-col justify-center items-center mt-20 ease-in-out duration-100 transition-all min-h-[50vh] rounded-lg">



                    <div className="h-full relative p-10 flex w-full sm:w-[80%] md:w-[70%]  lg:w-[60%] flex-col rounded-lg drop-shadow-xl shadow-blue-600 bg-white">

                        <div className="flex items-center justify-between  mr-3 w-full">

                            {isLoadingLike ? (
                                <div className="flex items-center -mr-3 justify-center w-10 h-10 text-xs">
                                    <CircularProgress />
                                </div>
                            ) : (
                                <motion.button
                                    whileTap={{ scale: 0.6 }}
                                    onClick={handelLike} className={`flex-none flex flex-col items-center ease-in-out duration-[50] transition-all justify-center w-10 h-10 rounded-md ${isLikedByUser ? 'text-red-600 shadow-md shadow-red-500 border-red-300' : 'text-slate-300 border-slate-200'} border `} type="button" aria-label="Like">

                                    <svg width="20" height="20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                    </svg>
                                    <span className="flex text-xs text-gray-400">{likes.length}</span>
                                </motion.button>
                            )}

                            {isFound ? (
                                <motion.div whileTap={{ scale: 0.6 }} className="w-8 h-8 rounded-full  bg-gradient-to-tr from-blue-300 to-blue-600   flex items-center justify-center cursor-pointer hover:shadow-md ">
                                    <AddTaskIcon onClick={handelRemove} className='text-white' />
                                </motion.div>
                            ) : (
                                <motion.div whileTap={{ scale: 0.6 }} className="w-8 h-8  duration-75 rounded-full bg-gradient-to-tr  from-red-300 to-red-600 flex items-center justify-center cursor-pointer hover:shadow-md ">
                                    <AddShoppingCartOutlinedIcon onClick={() => handelAdd()} className='text-white' />
                                </motion.div>
                            )}
                        </div>


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

                        <div className="flex items-center w-full flex-col relative justify-center">



                            <h1 className='text-2xl flex flex-col justify-center items-center text-gray-900 mb-6'>{product.title}
                                <span className='min-h-[1px] min-w-full mt-2  bg-gradient-to-tr from-blue-300 to-blue-600  flex '></span>
                            </h1>

                            <Image width={100} height={100} className='flex mb-6 w-full max-h-[200px] object-contain' src={product.imageUrl} alt={product.title} />
                        </div>

                        <p className="text-gray-800 flex text-center">{product.content}</p>

                        <hr className="min-h-[1px] min-w-full  bg-gradient-to-tr mt-4 from-blue-300 to-blue-600  flex" />

                        <div className="w-full flex flex-col mb-6 justify-between items-center">
                            <Rating
                                name="rate"
                                className="my-6"
                                value={value}
                                onChange={(event, newValue) => {
                                    setValue(newValue);
                                }}
                            />

                            <div className="flex items-center justify-center w-full ">
                                {product.tags.length > 0 && product.tags.map((tag, index) => (
                                    <Chip key={index} label={tag.name} className="mr-1 link" variant="outlined" />
                                ))}
                            </div>
                        </div>

                        {product.images && (
                            <div className="w-full flex items-center justify-center py-2">
                                <Button variant="outlined" onClick={() => setOpenImageSlider(true)} >
                                    Look at other images
                                </Button>
                            </div>
                        )}

                        <div className="flex justify-between items-center flex-row flex-wrap mt-auto">
                            <p className="text-gray-700 ">
                                items left <span className="text-blue-600 font-semibold text-lg">
                                    {product.pieces}
                                </span>
                            </p>
                            <p className="text-gray-700 ">
                                item category <span className="text-blue-600 font-semibold text-lg">
                                    {product.category.name}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <Comments id={product.id} />
        </>
    )
}

export default ProductPage;



interface IPath {
    params: {
        id: string,
    },
}
export async function getStaticPaths() {
    const productsIds = await prisma.product.findMany({
        select: {
            id: true
        },
    });
    let paths: IPath[] = [];

    for (let productId of productsIds) {
        paths.push({ params: { id: productId.id.toString() } });
    }

    return {
        paths,
        fallback: false,
    };
}


export async function getStaticProps({ params }: IPath) {
    const product = await prisma.product.findUnique({
        where: {
            id: Number(params.id),
        },
        select: {
            id: true,
            title: true,
            content: true,
            images: {
                select: {
                    fileUrl: true,
                },
            },
            imageUrl: true,
            tags: {
                select: {
                    name: true,
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
            createdAt: true,
            discount: true,
            price: true,
            pieces: true,
        },
    });

    return {
        props: { product: JSON.parse(JSON.stringify(product)) || null },
    };
}