import { useState, useContext, useEffect } from 'react';
import { Context } from '../../context/index';
import { motion } from 'framer-motion';
import AddTaskIcon from '@mui/icons-material/AddTask';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

const AddProduct = ({productId}: {productId: number}) => {
    const [isFound, setIsFound] = useState(false);
    const { addItem, removeItem } = useContext(Context);

    useEffect(() => {
        setIsFound(Boolean(localStorage.getItem(`product id ${productId}`)))
    }, [productId])

    const handelAdd = () => {
        setIsFound(true)
        localStorage.setItem(`product id ${productId}`, JSON.stringify(productId))
        addItem()
    }

    const handelRemove = () => {
        setIsFound(false)
        localStorage.removeItem(`product id ${productId}`)
        removeItem()
    }

    return (
        isFound ? (
            <motion.div whileTap={{ scale: 0.6 }} className="w-8 h-8 rounded-full  bg-gradient-to-tr from-blue-300 to-blue-600   flex items-center justify-center cursor-pointer hover:shadow-md ">
                <AddTaskIcon onClick={handelRemove} className='text-white' />
            </motion.div>
        ) : (
            <motion.div whileTap={{ scale: 0.6 }} className="w-8 h-8  duration-75 rounded-full bg-gradient-to-tr  from-red-300 to-red-600 flex items-center justify-center cursor-pointer hover:shadow-md ">
                <AddShoppingCartOutlinedIcon onClick={() => handelAdd()} className='text-white' />
            </motion.div>
        )
    )
}

export default AddProduct;
