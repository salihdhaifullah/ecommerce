import { useEffect, useState, useCallback } from "react";

export const useIsClickOut = (): [boolean, (node: HTMLDivElement) => void] => {
    const [state, setState] = useState(false)
    const [ele, setEle] = useState<HTMLDivElement  | null>(null)
    const eleCallback = useCallback((node: HTMLDivElement) => { setEle(node) }, [])

    useEffect(() => {
        const handleClick = (e: any) => {
            if (ele === null) return;

            if (!ele.contains(e.target)) {
                setState(false)
            } else {
                setState(true)
            };
        }

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [ele]);

    return [state, eleCallback]
};

export default useIsClickOut;
