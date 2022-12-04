import Image from 'next/image';
import { motion } from 'framer-motion';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { useState } from 'react';
import { useRouter } from 'next/router';

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
    
    const [isFound, setIsFound] = useState(Boolean(localStorage.getItem(`product id ${item.id}`)));

    const handelAdd = () => {
        setIsFound(true)
        localStorage.setItem(`product id ${item.id}`, JSON.stringify(item.id))
    }

    const handelRemove = () => {
        setIsFound(false)
        localStorage.removeItem(`product id ${item.id}`)
    }

    return (

        <motion.div
            initial={{ y: -(index * 100), opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            key={item.id}
            className={`bg-Blur bg-white h-[270px]  min-w-[180px] md:min-w-[220px] flex flex-col   rounded-lg py-2 px-4  my-12 backdrop-blur-lg hover:drop-shadow-lg shadow-xl relative`}>
            <div className="w-full flex flex-col items-center justify-between -p-2">
                <div className="w-full flex justify-between items-center mb-16">
                    {item.discount !== 0 ?
                        (
                            <>
                                <p className="text-gray-100 md:text-lg p-1 rounded-full drop-shadow-lg bg-red-600  flex justify-between text-semibold text-base">{String(item.discount).split(".")[1]}0%</p>

                                <div className="flex justify-between items-center gap-8 flex-col">
                                    <p className='text-lg text-gray-700 font-semibold flex-row flex'>
                                        <span className='text-sm text-blue-600'>$</span>
                                        <span className="line-through mr-2">
                                            {item.price}
                                        </span>
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

                <motion.div onClick={() => router.push(`/products/${item.id}`)} whileHover={{ scale: 1.15 }} className='w-40 h-40 -mt-8 drop-shadow-2xl flex cursor-pointer'>
                    <Image width={160} height={160} src={item.imageUrl} alt={item.title} className='w-full h-full object-contain cursor-pointer' />
                </motion.div>

            </div>
            <div className="w-full flex flex-wrap items-center justify-between ">

                {isFound ? (
                    <motion.div whileTap={{ scale: 0.6 }} className="w-8 h-8 rounded-full  bg-gradient-to-tr from-blue-300 to-blue-600   flex items-center justify-center cursor-pointer hover:shadow-md ">
                        <AddTaskIcon onClick={handelRemove} className='text-white' />
                    </motion.div>
                ) : (
                    <motion.div whileTap={{ scale: 0.6 }} className="w-8 h-8  duration-75 rounded-full bg-gradient-to-tr  from-red-300 to-red-600 flex items-center justify-center cursor-pointer hover:shadow-md ">
                        <AddShoppingCartOutlinedIcon onClick={() => handelAdd()} className='text-white' />
                    </motion.div>
                )}

                <p className="text-gray-700 md:text-lg flex justify-between text-semibold text-base">{item.title}</p>
            </div>
        </motion.div >
    )
}

export default RowChild;