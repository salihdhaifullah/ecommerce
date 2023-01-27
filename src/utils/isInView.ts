import { MutableRefObject } from 'react'

export default function IsInView(ref: MutableRefObject<HTMLDivElement | null>): boolean {
    if (!ref.current) return false;
    const top = document.scrollingElement?.scrollTop! + (document.scrollingElement?.clientWidth! / 2) + 400
    const bottom = document.scrollingElement?.scrollTop! - 400
    const position = ref.current?.offsetTop

    if (top > position && position > bottom) return true;

    return false
}
