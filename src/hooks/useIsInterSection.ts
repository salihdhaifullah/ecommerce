import { useState, useCallback, useRef, useEffect } from 'react';

const useIsInterSection = (): [boolean, (node: Element) => void] => {
  const [state, setState] = useState(false)
  const [ele, setEle] = useState<Element | null>(null)
  const eleCallBack = useCallback((node: Element) => { setEle(node) }, [])

  const { current: observer } = useRef(new IntersectionObserver((entries) => {
    setState(entries[0].isIntersecting)
  }))

  useEffect(() => {
    if (ele) {
      observer.observe(ele)
    }
  }, [ele])

  return [state, eleCallBack]
}


export default useIsInterSection;
