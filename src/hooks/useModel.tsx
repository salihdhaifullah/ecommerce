import { useState, useCallback, ReactNode, useEffect, ReactPortal, Fragment } from 'react';
import ReactDOM from "react-dom"

const useModel = (setOpen: (bool: boolean) => void, children: ReactNode): [ReactNode] => {
    const [ele, setEle] = useState<HTMLDivElement | null>(null)
    const eleCallback = useCallback((node: HTMLDivElement) => { setEle(node) }, [])

    useEffect(() => {
        if (ele === null) return;
        const handleClick = (e: any) => { if (!ele.contains(e.target)) { setOpen(false) } }

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ele]);

    useEffect(() => {
        const element = document.getElementById("root-model")
        element?.classList.add("blur-sm")
        return () => element?.classList.remove("blur-sm")
    }, [])

    return [
        <Fragment key="portal">
        {ReactDOM.createPortal(<section ref={eleCallback}>{children}</section>, document.getElementById('__next')!)}
        </Fragment>
    ]
}

export default useModel
