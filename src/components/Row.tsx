import { useCallback, useEffect, useRef, useState } from 'react';
import RowChild from './RowChild'
import { getProducts } from '../api';
import CircularProgress from '@mui/material/CircularProgress';
import Line from './Line';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { motion } from 'framer-motion';

interface IProduct {
    id: number;
    discount: number;
    price: number;
    title: string;
    imageUrl: string;
}

const GetButtonClass = (rest: string): string => {
    return `cursor-pointer shadow-md hover:shadow-xl hover:bg-blue-600 z-[100] bg-blue-500 absolute top-[45%] flex justify-center text-white p-2.5 transition-all rounded-full ${rest}`
}

const Row = ({ category }: { category: string }) => {
    const [products, setProducts] = useState<IProduct[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const [isLastEleVisible, setIsLastEleVisible] = useState(false)
    const [isFirstEleVisible, setIsFirstEleVisible] = useState(true)
    const [isVisible, setIsVisible] = useState(true)
    const [isTouchDevise, setIsTouchDevise] = useState(true)
    const [isLoadingRow, setIsLoadingRow] = useState(false)

    useEffect(() => { setIsTouchDevise(window.ontouchstart !== undefined) }, [])

    const HandelGetProducts = useCallback(async () => {
        setIsLoading(true)
        await getProducts()
            .then((res) => { setProducts(res.data.products) })
            .catch((err) => { console.log(err) })

        setIsLoading(false);
    }, [])

    useEffect(() => { HandelGetProducts() }, [HandelGetProducts])

    const HandelGetLast = async () => {
        setIsLoadingRow(true)
        await new Promise((resolve, reject) => { setTimeout(() => { resolve(1) }, 3 * 1000) })
        setProducts((val) => [...val, ...products])
        setIsLoadingRow(false)
    }

    const {current: observer} = useRef(new IntersectionObserver((entries) => { setIsVisible(entries[0].isIntersecting) }))
    const {current: lastObserver} = useRef(new IntersectionObserver((entries) => { setIsLastEleVisible(entries[0].isIntersecting) } , {rootMargin: "100px"}))
    const {current: firstObserver} = useRef(new IntersectionObserver((entries) => { setIsFirstEleVisible(entries[0].isIntersecting) }))

    useEffect(() => {
        if ((isLastEleVisible  && isVisible) && !(isLoadingRow && isLoading)) HandelGetLast()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLastEleVisible, isLoading, isLoadingRow, isVisible])

    const mainElement = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) observer.observe(node)
    }, [observer])

    const lastElement = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) lastObserver.observe(node)
    }, [lastObserver])

    const firstElement = useCallback((node: HTMLDivElement | null) => {
        if (node !== null) firstObserver.observe(node)
    }, [firstObserver])

    useEffect(() => {
        if (!isVisible) {
            lastObserver.disconnect()
            firstObserver.disconnect()
        }
    }, [isVisible])

    const handelScroll = (direction: "l" | "r") => {
        if (direction === "r") {
            scrollRef.current?.scrollBy({ behavior: "smooth", left: 300, top: 0 })
        } else {
            scrollRef.current?.scrollBy({ behavior: "smooth", left: -300, top: 0 })
        }
    }

    return (
        <div ref={mainElement} className="flex h-[500px] flex-col w-full">

            {!isVisible ? null : (
                <>

                    <div className="justify-start ml-4 mb-4 w-fit items-start flex flex-col">
                        <h1 className="text-blue-600 text-2xl">{category}</h1>
                        <div className="w-[calc(100%+30px)]"><Line height={3} /> </div>
                    </div>

                    <div className="relative w-full justify-center items-center flex">
                        {!(!isTouchDevise && !isFirstEleVisible) ? null : <motion.button whileTap={{ scale: 0.6 }} onClick={() => handelScroll("l")} className={GetButtonClass("left-4")}> <ArrowBackIosIcon /> </motion.button>}

                        <div ref={scrollRef} className="flex hide_scroll_bar h-[300px] flex-row w-[90vw] overflow-auto">
                        <div ref={firstElement} className="h-full px-8"></div>
                            {products.length >= 1 ? products.map((item, index) => (
                                <RowChild key={index} isLoading={isLoading} item={item} />
                            )) : null}
                            <div ref={lastElement} className="h-full px-8 flex justify-center items-center">{(isLoadingRow && !isLoading) ? <CircularProgress className="w-8 h-8" /> : null}</div>
                        </div>

                        {!(!isTouchDevise && !isLastEleVisible) ? null : <motion.button whileTap={{ scale: 0.6 }} onClick={() => handelScroll("r")} className={GetButtonClass("right-4")}> <ArrowForwardIosIcon />  </motion.button>}
                    </div>

                    <div className="w-full flex justify-center"><Line className="min-w-[80%] w-[80%] my-16" /></div>
                </>
            )}

        </div >
    )
}

export default Row;
