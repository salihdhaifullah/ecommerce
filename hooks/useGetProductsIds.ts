import { useCallback, useEffect, useState } from "react";

export default function useGetProductsIds (): [number[]] {
    const [productsIds, setProductsIds] = useState<number[]>([]);
    
    const getProductId = useCallback(() => {
        const data: number[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.includes("product id ")) {           
                const itemId = Number(JSON.parse(JSON.stringify(localStorage.getItem(key as string) || null)));
                console.log(itemId)
                if (typeof itemId === "number")  data.push(itemId);
            }
        }
        setProductsIds(data)
    }, []) 

    useEffect(() => {
        getProductId()
    }, [getProductId])

    return [productsIds];
}

