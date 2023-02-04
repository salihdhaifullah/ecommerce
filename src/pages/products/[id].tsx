import React, { useCallback, useContext, useEffect, useState } from 'react'
import prisma from '../../libs/prisma'
import { IProduct } from '../../types/product';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import ImageSlider from '../../components/ImageSlider';
import Chip from '@mui/material/Chip'
import { createFeedBack, getLikes, getFeedBacks, likeProduct } from '../../api';
import useGetUser from '../../hooks/useGetUser';
import { Context } from '../../context'
import { Box, CircularProgress, Container } from '@mui/material';
import moment from 'moment';
import FeedBacks from '../../components/FeedBacks';
import Likes from '../../components/Likes';
import AddProduct from './../../components/AddProduct';
import DiscountAndPrice from '../../components/DiscountAndPrice';
import ProductDetails from '../../components/ProductDetails';
import ProductContent from '../../components/ProductContent';
import Line from './../../components/Line';
import { GetServerSidePropsContext, GetServerSideProps } from 'next'


const Tags = ({ tags }: { tags: { name: string }[] }) => {
    return (
        <>
            <Line />

            <div className="w-full flex flex-col mb-6 justify-center items-center">
                <div className="flex items-center justify-center w-full ">
                    {tags.length > 0 && tags.map((tag, index) => (
                        <Link key={index} href={`/search?tag=${tag.name}`}>
                            <Chip clickable label={"#" + tag.name} className="mr-1 link" variant="outlined" />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}



const ProductPage = ({ product }: { product: IProduct }) => {

    return (
        <Container className="flex flex-col w-full h-full min-h-[100vh]">
            <Container className="w-full sm:px-10 px-4 my-20 h-full flex-wrap flex lg:flex-nowrap gap-10">

                <Box className="flex min-w-[55%] flex-col relative p-10 w-full justify-center shadow-lg bg-white items-center ease-in-out duration-100 transition-all min-h-[50vh] rounded-lg">

                    <div className="flex items-center justify-between mr-3 w-full">

                        <Likes productId={product.id} />

                        <AddProduct productId={product.id} />

                    </div>

                    <DiscountAndPrice price={product.price} discount={product.discount} />

                    <div className="w-full text-sm font-normal text-gray-600 h-fit flex justify-end py-2 items-center">
                        <time>Created at {moment(product.createdAt).format("ll")}</time>
                    </div>

                    <ProductContent title={product.title} image={product.imageUrl} />

                    <Box className="text-center text-gray-800 w-fit flex flex-col justify-center items-center">
                        <p>{product.content}</p>
                    </Box>

                    <Tags tags={product.tags} />

                    <ProductDetails pieces={product.pieces} category={product.category.name} />
                </Box>


                <Box className='w-full h-full min-h-[40vh] justify-center items-center  flex'>
                    <ImageSlider images={product.images} />
                </Box>


            </Container>

            <FeedBacks productId={product.id} />

        </Container>
    )
}

export default ProductPage;



export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSideProps> {
    const id = Number(context.query["id"])

    const product = await prisma.product.findUnique({
        where: { id: id },
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

    // @ts-ignore
    if (!product) return { notFound: true };


    return {
    // @ts-ignore
        props: { product: JSON.parse(JSON.stringify(product)) || null }
    };
}
