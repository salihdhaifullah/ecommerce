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
import ImageSlider from './ImageSlider';
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

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
    images: string[] | null;
    pieces: number;
    price: number;
    discount: number;
}


export default function PreviewProduct({ setOpen, open, title, content, tags, category, image, images, pieces, price, discount }: IPreviewProductProps) {
    const [value, setValue] = useState<number | null>(null);
    const [openImageSlider, setOpenImageSlider] = useState(false);


    const handelClose = () => {
        setOpen(false);
    }



    return (

        <Dialog fullScreen open={open} onClose={handelClose}>
            <div className="min-w-fit  min-h-fit w-full h-full">

                <DialogTitle className='px-10'>Preview Product</DialogTitle>
                <DialogContent className='sm:px-20 px-4'>

                    <motion.div
                        initial={{ x: 400, opacity: 0, scale: 0.2 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.8, x: 700, scale: 1 }}
                        className="my-6 flex flex-col justify-center items-center mt-10 ease-in-out duration-100 transition-all min-h-[50vh] rounded-lg">

                        <Container className="h-full relative flex w-full flex-col rounded-lg shadow-2xl p-6 bg-blue-50">

                            {images && images?.length > 0 && openImageSlider && (
                                <motion.div
                                    initial={{ y: 100, opacity: 0, scale: 0 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0.8, x: 700, scale: 1 }}
                                    className='w-full mr-5 h-full ease-in-out duration-100 transition-all absolute z-50 flex justify-center items-center l-0 b-0 t-0 r-0'>
                                    <ImageSlider images={images} setOpenImageSlider={setOpenImageSlider} />
                                </motion.div>
                            )}

                            <div className="flex items-center justify-between  mr-3 w-full">
                                <motion.div whileTap={{ scale: 0.6 }} className="w-8 h-8  duration-75 rounded-full bg-gradient-to-tr  from-red-300 to-red-600 flex items-center justify-center cursor-pointer hover:shadow-md ">
                                    <AddShoppingCartOutlinedIcon className='text-white' />
                                </motion.div>
                            </div>

                            {discount !== 0 && (
                                <div className="max-w-fit rounded-full  -top-7 left-[5%] shadow-lg absolute h-10 items-center justify-center  z-[4] flex ">
                                    <p className="text-gray-100 md:text-lg p-1 rounded-full bg-red-600  flex justify-between text-semibold text-base">{String(discount).split(".")[1]}0%</p>
                                </div>
                            )}

                            <div className="bg-gray-800 shadow-lg  max-w-fit rounded-lg  -top-7 right-[5%] px-[6px] absolute h-10 items-center justify-center  z-[4] flex ">

                                {discount !== 0 ?
                                    (
                                        <div className="flex justify-between items-center gap-8 flex-col">
                                            <p className='text-lg text-gray-100 font-semibold flex-row flex'>
                                                <span className='text-sm text-blue-600'>$</span>
                                                <span className="line-through mr-3">
                                                    {price}
                                                </span>
                                                <span className='text-sm text-blue-600'>$</span>
                                                {Number(price - (price * discount)).toFixed(2)}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center gap-8">
                                            <p className='text-lg text-gray-100 font-semibold flex-row flex'>
                                                <span className='text-sm text-blue-600'>$</span>{price}
                                            </p>
                                        </div>
                                    )}
                            </div>

                            <div className="flex items-center w-full flex-col relative justify-center">

                                <h1 className='text-2xl flex flex-col justify-center items-center text-gray-900 mb-6'>{title}
                                    <span className='min-h-[1px] min-w-full mt-2  bg-gradient-to-tr from-blue-300 to-blue-600  flex '></span>
                                </h1>

                                <motion.div whileHover={{ scale: 1.35, rotate: -15 }} className='flex relative my-6 w-[70%] min-h-[200px]'>
                                    <Image width={100} height={200} className='w-full h-full absolute top-0 left-0 object-contain' src={image} alt={title} />
                                </motion.div>
                            </div>

                            <p className="text-gray-800 flex text-center">{content}</p>

                            <hr className="min-h-[1px] min-w-full  bg-gradient-to-tr mt-4 from-blue-300 to-blue-600  flex" />

                            <Box className="w-full flex flex-col mb-6 justify-between items-center">
                                <Rating
                                    name="rate"
                                    className="my-6"
                                    value={value}
                                    onChange={(event, newValue) => setValue(newValue)}
                                />

                                <div className="flex items-center justify-center w-full ">
                                    {tags.length > 0 && tags.map((tag, index) => (
                                        <Chip key={index} label={`#${tag}`} className="mr-1 link" variant="outlined" />
                                    ))}
                                </div>
                            </Box>

                            {images && images?.length > 0 ? (
                                <div className="w-full flex items-center justify-center py-2">
                                    <Button variant="outlined" onClick={() => setOpenImageSlider(true)} >
                                        Look at other images
                                    </Button>
                                </div>
                            ) : null}

                            <Box className="flex justify-between items-center flex-row flex-wrap mt-auto">
                                <p className="text-gray-700 ">
                                    items left <span className="text-blue-600 font-semibold text-lg">
                                        {pieces}
                                    </span>
                                </p>
                                <p className="text-gray-700 ">
                                    item category <span className="text-blue-600 font-semibold text-lg">
                                        {category.name}
                                    </span>
                                </p>
                            </Box>
                        </Container>
                    </motion.div>

                </DialogContent>
                <DialogActions>
                    <Button className="bg-blue-600 text-white hover:bg-blue-300 hover:text-blue-600 shadow-xl shadow-blue-600" onClick={handelClose}>Close</Button>
                </DialogActions>
            </div>
        </Dialog >
    );
}