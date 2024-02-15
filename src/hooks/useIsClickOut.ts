import { useEffect, useState, useCallback } from "react";

export const useIsClickOut = (setter: (bool: boolean) => void, condition = () => true): [(node: any) => void] => {
    const [ele, setEle] = useState<HTMLDivElement | null>(null)
    const eleCallback = useCallback((node: HTMLDivElement) => { setEle(node) }, [])

    useEffect(() => {
        if (ele === null) return;

        const handleClick = (e: any) => {
            if (ele.contains(e.target)) return;
            if (!condition()) return;
            setter(false)
        }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ele]);

    return [eleCallback]
};

export default useIsClickOut;
