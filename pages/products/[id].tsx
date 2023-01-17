import React, { useCallback, useContext, useEffect, useState } from 'react'
import prisma from '../../src/libs/prisma'
import { IProduct } from '../../src/types/product';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ImageSlider from '../../src/components/ImageSlider';
import Chip from '@mui/material/Chip'
import { createFeedBack, getLikes, getFeedBacks, likeProduct } from '../../src/api';
import useGetUser from '../../src/hooks/useGetUser';
import { Context } from '../../src/context'
import { Box, CircularProgress, Container } from '@mui/material';
import moment from 'moment';
import FeedBacks from '../../src/components/FeedBacks';

const ProductPage = ({ product }: { product: IProduct }) => {
    const [isFound, setIsFound] = useState(false);
    const [isLikedByUser, setIsLikedByUser] = useState(false)
    const [likes, setLikes] = useState<{ userId: number }[]>([])
    const [user] = useGetUser()
    const [isLoadingLike, setIsLoadingLike] = useState(false)

    const isLikedByUserFunction = useCallback(() => {
        if (user && likes.length > 0 && likes.find((item) => item.userId === user.id)) setIsLikedByUser(true)
        else setIsLikedByUser(false)
    }, [likes, user])

    const GetLikes = useCallback(async () => {
        await getLikes(product.id)
            .then((res) => { setLikes(res.data.likes) })
            .catch((err) => { console.log(err) });
    }, [product.id])

    const init = useCallback(async () => {
        await GetLikes()
    }, [GetLikes])

    useEffect(() => {
        init()
    }, [init])

    useEffect(() => {
        isLikedByUserFunction()
    }, [isLikedByUserFunction])

    useEffect(() => {
        setIsFound(Boolean(localStorage.getItem(`product id ${product.id}`)))
    }, [product.id])

    const { addItem, removeItem } = useContext(Context);

    const handelAdd = () => {
        setIsFound(true)
        localStorage.setItem(`product id ${product.id}`, JSON.stringify(product.id))
        addItem()
    }

    const handelRemove = () => {
        setIsFound(false)
        localStorage.removeItem(`product id ${product.id}`)
        removeItem()
    }

    const handelLike = async () => {
        setIsLoadingLike(true)
        await likeProduct(product.id)
            .then((res) => { console.log(res) })
            .catch((err) => { console.log(err) });
        await GetLikes()
        setIsLoadingLike(false)
    }

    function diagonalDifference(arr: number[][]): number {
        let sumLtoR = 0;
        let sumRtoL = 0;

        let LtoR_Position = [0, 0]
        let RtoL_Position = [(arr[0].length - 1), 0]

        for (let i = 0; i < arr.length; i++) {
            sumLtoR += arr[LtoR_Position[0]][LtoR_Position[1]]
            sumRtoL += arr[RtoL_Position[0]][RtoL_Position[1]]
            LtoR_Position[0] += 1
            LtoR_Position[1] += 1
            RtoL_Position[0] -= 1
            RtoL_Position[1] += 1
        }

        if (sumLtoR > sumRtoL) return (sumLtoR - sumRtoL)
        else return (sumRtoL - sumLtoR);
    }

    function staircase(n: number): void {
        let string = ``
        let i = 1;

        while (n > 0) {
            if (n === 1) string += `${' '.repeat(n - 1)}${'#'.repeat(i)}`
            else string += `${' '.repeat(n - 1)}${'#'.repeat(i)}\n`
            n--
            i++
        }

        console.log(string)
    }



    useEffect(() => {
        staircase(6)
    }, [])

    return (
        <Container className="flex flex-col w-full h-full min-h-[100vh]">
            <Container className="w-full sm:px-10 px-4 my-20 h-full flex-wrap flex lg:flex-nowrap gap-10">

                <Box className="flex min-w-[55%] flex-col relative p-10 w-full justify-center shadow-lg bg-white items-center ease-in-out duration-100 transition-all min-h-[50vh] rounded-lg">

                    <div className="flex items-center justify-between mr-3 w-full">

                        <motion.button
                            whileTap={{ scale: 0.6 }}
                            onClick={handelLike}
                            className={`${(isLikedByUser && !isLoadingLike) ? "text-red-600 shadow-md shadow-red-500 border-red-300" : "text-slate-300 border-slate-200"} flex-none flex flex-col items-center ease-in-out duration-[50] transition-all justify-center w-10 h-10 rounded-md border`} type="button" aria-label="Like">

                            {!isLoadingLike ? (
                                <>
                                    <svg width="20" height="20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                    </svg>
                                    <span className="flex text-xs text-gray-400">{likes.length}</span>
                                </>
                            ) : (
                                <CircularProgress className="w-4 h-4" />
                            )}
                        </motion.button>

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
                        <div className="shadow-lg max-w-fit rounded-full  -top-7 left-[5%] absolute h-10 items-center justify-center  z-[4] flex ">
                            <p className="text-gray-100 md:text-lg p-1 rounded-full bg-red-600  flex justify-between text-semibold text-base">{String(product.discount).split(".")[1]}0%</p>
                        </div>
                    )}

                    <div className="bg-gray-800 shadow-lg  max-w-fit rounded-lg  -top-7 right-[5%] px-[6px] absolute h-10 items-center justify-center  z-[4] flex ">

                        {product.discount !== 0 ?
                            (
                                <div className="flex justify-between items-center gap-8 flex-col">
                                    <p className='text-lg text-gray-100 font-semibold flex-row flex'>
                                        <span className='text-sm text-blue-600'>$</span>
                                        <span className="line-through mr-3"> {product.price} </span>
                                        <span className='text-sm text-blue-600'>$</span>
                                        {Number(product.price - (product.price * product.discount)).toFixed(2)}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center gap-8">
                                    <p className='text-lg text-gray-100 font-semibold flex-row flex'>
                                        <span className='text-sm text-blue-600'>$</span>{product.price}
                                    </p>
                                </div>
                            )}
                    </div>

                    <div className="w-full text-sm font-normal text-gray-600 h-fit flex justify-end py-2 items-center">
                        <time>Created at {moment(product.createdAt).format("ll")}</time>
                    </div>
                    <div className="flex items-center w-full flex-col relative justify-center">

                        <h1 className='text-2xl flex flex-col justify-center items-center text-gray-900 mb-6'>{product.title}
                            <span className='min-h-[1px] min-w-full mt-2  bg-gradient-to-tr from-blue-300 to-blue-600  flex '></span>
                        </h1>

                        <motion.div whileHover={{ scale: 1.35, rotate: -15 }} className='flex relative my-6 w-[70%] min-h-[200px]'>
                            <Image width={800} height={800} className='w-full h-full absolute top-0 left-0 object-contain' src={product.imageUrl} alt={product.title} />
                        </motion.div>
                    </div>

                    <Box className="text-center text-gray-800 w-fit flex flex-col justify-center items-center">
                        <p>{product.content}</p>
                    </Box>

                    <hr className="min-h-[1px] min-w-full  bg-gradient-to-tr mt-4 from-blue-300 to-blue-600  flex" />

                    <div className="w-full flex flex-col mb-6 justify-center items-center">
                        <div className="flex items-center justify-center w-full ">
                            {product.tags.length > 0 && product.tags.map((tag, index) => (
                                <Link key={index} href={`/search?tag=${tag.name}`}>
                                    <Chip clickable label={"#" + tag.name} className="mr-1 link" variant="outlined" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between w-full h-full items-center flex-row flex-wrap mt-auto">
                        <p className="text-gray-700 ">
                            items left <span className="text-blue-600 font-semibold text-lg">
                                {product.pieces}
                            </span>
                        </p>
                        <p className="text-gray-700 ">
                            item category <Link href={`/search?category=${product.category.name}`}>
                                <span className="text-blue-600 hover:underline text-xl font-semibold">
                                    {product.category.name}
                                </span>
                            </Link>
                        </p>
                    </div>
                </Box>

                {product.images ? (
                    <Box className='w-full justify-center items-center max-h-[500px] flex'>
                        <ImageSlider images={product.images} />
                    </Box>
                ) : null}
            </Container>

            <FeedBacks productId={product.id} />

        </Container>
    )
}

export default ProductPage;

export async function getStaticPaths() {
    const productsIds = await prisma.product.findMany({ select: { id: true } });
    let paths: { params: { id: string } }[] = [];

    for (let productId of productsIds) { paths.push({ params: { id: productId.id.toString() } }) }

    return { paths, fallback: false };
}


export async function getStaticProps({ params }: { params: { id: string } }) {
    const product = await prisma.product.findUnique({
        where: { id: Number(params.id) },
        select: {
            id: true,
            title: true,
            content: true,
            images: true,
            imageUrl: true,
            tags: { select: { name: true } },
            category: { select: { name: true } },
            createdAt: true,
            discount: true,
            price: true,
            pieces: true
        },
    });

    return {
        props: { product: JSON.parse(JSON.stringify(product)) || null }
    };
}
