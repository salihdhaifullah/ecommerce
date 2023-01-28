import { useCallback, useEffect, useRef, useState } from 'react';
import RowChild from './RowChild'
import { getProducts } from '../api';
import CircularProgress from '@mui/material/CircularProgress';
import Line from './Line';
import Box from '@mui/material/Box';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

interface IProduct {
    id: number;
    discount: number;
    price: number;
    title: string;
    imageUrl: string;
}

const Row = ({ category }: { category: string }) => {
    const [products, setProducts] = useState<IProduct[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const LastElement = useRef<HTMLDivElement | null>(null)
    const [isVisible, setIsVisible] = useState(true)
    const [isTouchDevise, setIsTouchDevise] = useState(true)
    const [position, setPosition] = useState(0)
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

        await new Promise((resolve, reject) => {
            setTimeout(() => { resolve(1) }, 3 * 1000)
        })

        setProducts((val) => [...val, ...products])
        setIsLoadingRow(false)
    }

    const observer = new IntersectionObserver((entries) => { setIsVisible(entries[0].isIntersecting) })
    const lastObserver = new IntersectionObserver((entries) => { if (entries[0].isIntersecting && !isLoadingRow && !isLoading && isVisible) HandelGetLast() })

    useEffect(() => { if (ref.current) observer.observe(ref.current) }, [ref.current])
    useEffect(() => { if (LastElement.current) lastObserver.observe(LastElement.current) }, [LastElement.current])

    const handelScroll = (direction: "l" | "r") => {
        if (direction === "r") setPosition(scrollRef.current?.scrollWidth! < scrollRef.current?.scrollLeft! + 300 ? scrollRef.current?.scrollWidth! : scrollRef.current?.scrollLeft! + 300)
        else setPosition(0 < scrollRef.current?.scrollLeft! - 300 ? scrollRef.current?.scrollLeft! - 300 : 0)
        scrollRef.current?.scroll({ behavior: "smooth", left: position, top: 0 })
    }

    return (
        <div ref={ref} className="flex h-[400px] relative w-full justify-center items-center">

            {/* <div>
                <h2 className="text-blue-600 text-xl">{category}</h2>
                <Line />
            </div> */}
            {!isVisible ? null
                : (
                    <>
                        {!isTouchDevise && <Box onClick={() => handelScroll("l")} className="cursor-pointer flex justify-center items-center z-[100] bg-blue-500 absolute top-[45%] left-2 hover:bg-blue-500 text-white p-2 rounded-full"> <ArrowBackIosIcon /> </Box>}

                        <div ref={scrollRef} className="flex hide_scroll_bar h-[400px] flex-row w-[90vw] overflow-auto">
                            {products.length >= 1 && products.map((item, index) => (
                                <RowChild key={index} isLoading={isLoading} item={item} />
                            ))}
                            <div ref={LastElement} className="p-8 h-full min-w-8 flex justify-center items-center">{!isLoadingRow ? null : <CircularProgress className="w-8 h-8" />}</div>
                        </div>

                        {!isTouchDevise && <Box onClick={() => handelScroll("r")} className="cursor-pointer flex justify-center items-center z-[100] bg-blue-500 absolute top-[45%] right-2 hover:bg-blue-500 text-white p-2 rounded-full"> <ArrowForwardIosIcon />  </Box>}
                    </>
                )
            }
        </div >
    )
}

export default Row;
