import { motion } from 'framer-motion';
import Image from 'next/image';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Rating from '@mui/material/Rating'
import Chip from '@mui/material/Chip'
import { useState, useEffect } from 'react'
import ImageSlider from '../utils/ImageSlider';
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import ProductContent from './ProductContent';
import DiscountAndPrice from './DiscountAndPrice';
import Line from '../utils/Line';
import ProductDetails from './ProductDetails';

interface IPreviewProductProps {
    setOpen: (state: boolean) => void;
    open: boolean;
    title: string;
    content: string;
    tags: string[];
    category: {
        name: string;
    };
    image: string;
    images: string[];
    pieces: number;
    price: number;
    discount: number;
}


export default function PreviewProduct({ setOpen, open, title, content, tags, category, image, images, pieces, price, discount }: IPreviewProductProps) {
    const [value, setValue] = useState<number | null>(null);

    const handelClose = () => {
        setOpen(false);
    }

    return (

        <Dialog fullScreen open={open} onClose={handelClose}>
            <div className="min-w-fit  min-h-fit w-full h-full">

                <DialogTitle className='px-10'>Preview Product</DialogTitle>
                <DialogContent>

                    <Container className="w-full sm:px-10 px-4 mt-10 h-full flex-wrap justify-center flex md:flex-nowrap gap-10">

                        <motion.div
                            initial={{ x: 400, opacity: 0, scale: 0.2 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ opacity: 0.8, x: 700, scale: 1 }}
                            className="h-full relative flex border max-w-[700px] border-gray-400 w-full shadow-lg p-6 bg-blue-50 flex-col justify-center items-center ease-in-out duration-100 transition-all min-h-[50vh] rounded-lg">

                            <div className="flex items-center justify-between  mr-3 w-full">
                                <motion.div whileTap={{ scale: 0.6 }} className="w-8 h-8  duration-75 rounded-full bg-gradient-to-tr  from-red-300 to-red-600 flex items-center justify-center cursor-pointer hover:shadow-md ">
                                    <AddShoppingCartOutlinedIcon className='text-white' />
                                </motion.div>
                            </div>

                            <DiscountAndPrice price={price} discount={discount} />

                            <ProductContent title={title} image={image} />

                            <p className="text-gray-800 flex text-center">{content}</p>

                            <Line />


                            <Box className="w-full flex flex-col mb-6 justify-between items-center">
                                <Rating
                                    name="rate"
                                    className="my-6"
                                    value={value}
                                    onChange={(event, newValue) => setValue(newValue)}
                                />

                                <div className="flex items-center justify-center w-full ">
                                    {tags.length > 0 && tags.map((tag, index) => (
                                        <Chip key={index} label={`#${tag}`} className="mr-1 cursor-pointer link" variant="outlined" />
                                    ))}
                                </div>
                            </Box>

                            <ProductDetails pieces={pieces} category={category.name} />
                        </motion.div>


                            <Box className='w-full justify-center items-center max-h-[500px] flex'>
                                <ImageSlider preview images={images} />
                            </Box>
                    </Container>

                </DialogContent>
                <DialogActions>
                    <Button className="bg-blue-600 text-white hover:bg-blue-300 hover:text-blue-600 shadow-xl shadow-blue-600" onClick={handelClose}>Close</Button>
                </DialogActions>
            </div>
        </Dialog >
    );
}
