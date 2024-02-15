import { useState, useEffect, useContext } from 'react';
import { Context } from '../../context/index';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import Likes from './Likes';

interface IAddRemoveProps {
    price: number
    discount: number
    pieces: number
    productId: number
}

const AddRemove = ({ price, discount, pieces, productId }: IAddRemoveProps) => {
    const [quantity, setQuantity] = useState(1);
    const { insertCartItem } = useContext(Context);

    useEffect(() => {
        insertCartItem({ quantity: quantity, price: (price - (price * discount)), id: productId })
    }, [quantity])

    const handelIncrement = () => {
        if (quantity === Number(pieces)) return;
        else setQuantity((value) => value + 1)
    }

    const handelDecrement = () => {
        if (quantity === 1) return;
        else setQuantity((value) => value - 1)
    }



    return (
        <div className="flex h-fit w-full justify-between flex-row items-center">
            <div className="flex justify-center text-gray-800 items-center ml-2">
                <p className="font-semibold">
                    {pieces - quantity >= 1
                        ? `${pieces - quantity > 1
                            ? `items left: ${pieces - quantity}`
                            : 'one item left !'}`
                        : 'sorry no item left'}
                </p>
            </div>

            <div className="flex self-end h-fit  rounded-lg justify-end mr-4 my-6 bg-gray-800">
                <div className="p-2 flex flex-row">
                    {quantity === Number(pieces)
                        ? <AddCircleOutlineIcon className="flex w-6 h-6 bg-gray-500 rounded-lg justify-between px-1 text-base " />
                        : <AddCircleOutlineIcon onClick={handelIncrement} className="flex w-6 h-6 bg-blue-400 px-1 rounded-lg text-white cursor-pointer text-base" />
                    }

                    <span className="rounded-lg px-2 mx-2 text-base text-white bg-gradient-to-tr from-blue-300 to-blue-600">{quantity}</span>

                    {quantity >= 2
                        ? <RemoveCircleOutlineIcon onClick={handelDecrement} className="flex w-6 h-6 px-1 bg-blue-400 rounded-lg text-white cursor-pointer text-base" />
                        : <RemoveCircleOutlineIcon className="flex w-6 h-6 bg-gray-500 rounded-lg px-1 text-base " />
                    }
                </div>
            </div>

            <div className="flex justify-center items-center mr-3">
                <Likes productId={productId} />
            </div>
        </div>
    )
}


export default AddRemove;
