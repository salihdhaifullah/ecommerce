import { motion } from 'framer-motion';
import Image from 'next/image';

const ProductContent = ({ title, image }: { title: string, image: string }) => {
    return (
        <div className="flex items-center w-full flex-col relative justify-center">

            <h1 className='text-2xl flex flex-col justify-center items-center text-gray-900 mb-6'>{title}
                <span className="min-h-[1px] min-w-full  bg-gradient-to-tr my-2 from-gray-600 to-blue-400  flex" />
            </h1>

            <motion.div whileHover={{ scale: 1.35, rotate: -15 }} className='flex relative my-6 w-[70%] min-h-[200px]'>
                <Image width={1200} height={800} className='w-full h-full absolute top-0 left-0 object-contain' src={image} alt={title} />
            </motion.div>
        </div>
    )
}


export default ProductContent;
