import { useCallback, useEffect, useRef, useState } from 'react';
import RowChild from './RowChild'
import { getProducts } from '../api';
import CircularProgress from '@mui/material/CircularProgress';
import Line from './Line';
import IsInView from '../utils/isInView';

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
    const [isVisible, setIsVisible] = useState(true)

    const HandelGetProducts = useCallback(async () => {
        setIsLoading(true)
        await getProducts()
            .then((res) => { setProducts(res.data.products) })
            .catch((err) => { console.log(err) })

        setIsLoading(false);
    }, [])

    useEffect(() => { HandelGetProducts() }, [HandelGetProducts])

    useEffect(() => {
        document.addEventListener("scroll", () => { setIsVisible(IsInView(ref)) })
    }, [])

    return (
        <div ref={ref} className="flex h-[400px] flex-row w-[90vw] overflow-auto">
            {/* <div>
                <h2 className="text-blue-600 text-xl">{category}</h2>
                <Line />
            </div> */}
            {!isVisible ? null : isLoading ? (
                <CircularProgress />
            ) : products.length >= 1 && products.map((item, index) => (
                <RowChild key={index} index={index} item={item} />
            ))}

        </div >
    )
}

export default Row;
