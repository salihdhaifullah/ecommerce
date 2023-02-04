import React, { useCallback, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import RowChild from '../components/RowChild'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { generalSearch } from '../api'
import { IProductRow } from '../types/product'
import { useRouter } from 'next/router'
import Loader from '../components/utils/Loader'
import CircularProgress from '@mui/material/CircularProgress';

const handelSetData = (value: undefined | string | string[]): string => {
  let data = "";
  if (typeof value === "string") data = value;
  else if (Array.isArray(value)) data = value[0];
  return data;
}

const Search = () => {
  const [products, setProducts] = useState<IProductRow[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRow, setIsLoadingRow] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [tag, setTag] = useState("")
  const [category, setCategory] = useState("");
  const [take, setTake] = useState(5);
  const [skip, setSkip] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const router = useRouter();

  useEffect(() => {
    setProducts([])
    setSearch(handelSetData(router.query.search))
    setTag(handelSetData(router.query.tag))
    setCategory(handelSetData(router.query.category))
  }, [router.query])


  useEffect(() => {
    if (products.length === totalProducts) setIsDone(true)
    else setIsDone(false)
  }, [products.length, totalProducts])

  const init = useCallback(async () => {
    if (!tag && !search && !category) return;
    setIsLoading(true)
    await generalSearch(search, 0, take, tag ? "tag" : category ? "category" : "search")
      .then((res) => {
        setProducts((prev) => [...prev, ...res.data.products])
        setTotalProducts(res.data.totalProducts)
       })
      .catch((err) => { console.log(err) })
      .finally(() => { setIsLoading(false) })
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search, tag])

  useEffect(() => { init() }, [init])

  const handelSearch = useCallback(async () => {
    if (!tag && !search && !category) return;
    setIsLoadingRow(true)
    await generalSearch(search, (skip * take), take, tag ? "tag" : category ? "category" : "search")
      .then((res) => { setProducts((prev) => [...prev, ...res.data.products]) })
      .catch((err) => { console.log(err) })
      .finally(() => { setIsLoadingRow(false) })
  }, [category, search, skip, tag, take])


  const [state, setState] = useState(false)
  const [ele, setEle] = useState<Element | null>(null)
  const eleCallBack = useCallback((node: Element) => { setEle(node) }, [])

  const { current: observer } = useRef(new IntersectionObserver((entries) => { setState(entries[0].isIntersecting) }))

  useEffect(() => { if (ele) observer.observe(ele) }, [ele])

  useEffect(() => {
    if (isDone || isLoadingRow) return;
    if (state) {
      setSkip((prev) => (prev + 1))
      handelSearch()
    };
  }, [state])

  return (
    <>
      <Head>
        <title>{search || tag || category}</title>
        <meta name="description" content={search || tag || category} />
        <meta name="keywords" content={tag} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full min-h-[75vh] my-20 flex flex-col min-w-full">
        {isLoading ? <Loader /> :
          products.length > 0 ? (
            <>
              <Box className="flex w-full min-h-full h-auto flex-wrap gap-4 justify-center items-center flex-row">
                {products.map((item, index) => (
                  <RowChild key={index} isLoading={isLoading} item={item} />
                ))}
              </Box>
              {/* @ts-ignore */}
              <div ref={eleCallBack} className="w-full mt-40 min-h-6 h-6 flex justify-center items-center">{isLoadingRow ? <CircularProgress className="w-8 h-8" /> : null}</div>
            </>
          ) : (
            <div className="w-full min-h-[75vh] flex items-center justify-center">
              <Typography variant='h4' component='h1' className="font-extrabold text-xl md:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400"> Sorry No Products Found </Typography>
            </div>
          )
        }
      </div>
    </>
  )
}

export default Search;



