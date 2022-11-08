import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import RowChild from './RowChild'

const Row = () => {
    // const dispatch = useDispatch()


    // useEffect(() => { dispatch({ type: actionTypes.SET_CARD }) }, [dispatch])

    // const { cards } = useSelector((state: any) => state.card)

    // const [items, setItems] = useState(cards)


    // useEffect(() => { setItems(cards) }, [cards])



    // const handelAdd = async (itemey: any) => {
    //     const {_id, title, type, likes, price, discount, desc, pieces} = itemey;
    //     const data = { _id, title, type, likes, price, discount, desc, pieces };

    //     cards?.length <= 0 ? setItems([data]) : setItems([...cards, data]);

    //     await localStorage.setItem(`cardItems`, JSON.stringify(items))

    //     dispatch({ type: actionTypes.SET_CARD })
    // }

    // const [scrollWidth, setScrollWidth] = useState(0)
    // const slideRef: any = useRef<HTMLDivElement>()

    // useEffect(() => {
    //     setScrollWidth(slideRef?.current?.scrollWidth - slideRef?.current?.offsetWidth)
    // }, [slideRef?.current?.offsetWidth, slideRef?.current?.scrollWidth])

    return (

        // <div ref={slideRef} className={`w-full flex items-center gap-3  scroll-smooth  
        // ${flag
        //         ? "overflow-x-scroll scrollbar-none "
        //         : "overflow-x-hidden flex-wrap justify-center my-12"
        //     }`}>
        //     {loved ? (
        //         <motion.div drag="x"
        //             whileTap={{ cursor: "grabbing" }}
        //             dragConstraints={{ right: 0, left: -scrollWidth }}
        //             className="w-full flex gap-4 cursor-grab flex-row items-center justify-between">
        //             {!data ? <Loader /> : data.map((item: any, index: number) => (
        //                 <RowChild loved={loved} items={items} index={index} key={item._id} item={item} MdShoppingCart={MdShoppingCart} cards={cards} MdAddTask={MdAddTask} handelAdd={handelAdd} motion={motion} />
        //             ))}
        //         </motion.div>
        //     ) : (
        //         !data ? <Loader /> : data.map((item: any, index: number) => (
        //             <RowChild loved={loved} items={items}  key={item._id} index={index} item={item} MdShoppingCart={MdShoppingCart} cards={cards} MdAddTask={MdAddTask} handelAdd={handelAdd} motion={motion} />
        //         ))
        //     )}


        // </div>
        <>
            Row
        </>
    )
}

export default Row;