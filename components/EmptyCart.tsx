import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image';
import Link from 'next/link';

const EmptyCart = () => {
    return (
        <AnimatePresence>

            <div className='w-full ease-in-out transition-all duration-100 h-full min-h-[50vh] flex flex-col justify-center items-center'>

                <motion.div
                    initial={{ x: 400, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.8, x: -700, scale: 1 }}
                    className=" ease-in-out transition-all duration-100  flex flex-col justify-center items-center">
                    <div className="bg-Blur rounded-lg p-8 lg:flex-row xl:flex-row md:flex-row  flex-col flex justify-center items-center">
                        <h1 className='text-2xl  justify-center items-center'>look like your cart is empty!.</h1>
                        <Image
                            width={400}
                            height={400}
                            className='object-contain flex justify-center items-center'
                            src="/images/empty-cart.svg"
                            alt="Empty Cart" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ x: -400, opacity: 0, scale: 0.8 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    exit={{ opacity: 0.8, x: 700, scale: 1 }}
                    className=" ease-in-out transition-all  mt-20  duration-100  flex flex-col justify-center items-center">

                    <div className="flex rounded-lg justify-center items-center">
                        <Link href='/products'>
                            <p className="flex hover:underline text-blue-400 text-2xl items-center justify-center cursor-pointer hover:text-blue-600" ><HomeOutlinedIcon />Go to Shop Page</p>
                        </Link>
                    </div>
                </motion.div>
            </div>

        </AnimatePresence>
    )
}

export default EmptyCart;