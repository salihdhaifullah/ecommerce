import React, { useCallback, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import RowChild from '../components/products/RowChild'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { generalSearch } from '../api'
import { IProductRow } from '../types/product'
import { useRouter } from 'next/router'
import Loader from '../components/utils/Loader'
import CircularProgress from '@mui/material/CircularProgress';
import FilterListIcon from '@mui/icons-material/FilterList';
import Chip from '@mui/material/Chip'
import DialogTitle from '@mui/material/DialogTitle'
import DoneIcon from '@mui/icons-material/Done';
import Dialog from '@mui/material/Dialog'
import prisma from '../libs/prisma'

const handelSetData = (value: undefined | string | string[]): string => {
  let data = "";
  if (typeof value === "string") data = value;
  else if (Array.isArray(value)) data = value[0];
  return data;
}

const Search = ({ categories, tags }: { categories: { name: string }[] | null, tags: { name: string }[] | null }) => {
  const [products, setProducts] = useState<IProductRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRow, setIsLoadingRow] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState<0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | undefined>(undefined)
  const [sort, setSort] = useState<"date" | "likes" | "price-low-to-high" | "price-high-to-low" | "discount" | undefined>(undefined)
  const [tag, setTag] = useState("")
  const [category, setCategory] = useState("");
  let skip = useRef(0)

  const [open, setOpen] = useState(false)
  const [isInit, setIsInit] = useState(false)

  const firstRender = useRef(true)
  const router = useRouter();


  const handelSearch = async (isLoading?: boolean) => {
    if (isLoading) setIsLoading(true)
    else setIsLoadingRow(true)

    await generalSearch((skip.current * 5), 5, search, tag, category, discount, sort)
      .then((res) => {
        setProducts((prev) => [...prev, ...res.data.products])
        setTotalProducts(res.data.totalProducts)
      })
      .catch((err) => { console.log(err) })
      .finally(() => {
        if (isLoading) setIsLoading(false)
        else setIsLoadingRow(false)

        skip.current += 1
      })
  }


  useEffect(() => {
    if (!isInit) {
      setSearch(() => handelSetData(router.query["search"]))
      setTag(() => handelSetData(router.query["tag"]))
      setCategory(() => handelSetData(router.query["category"]))
      // @ts-ignore
      setDiscount(() => Number(router.query["discount"]) || undefined)
      // @ts-ignore
      setSort(() => router.query["sort"] || undefined)

      setIsInit(true)
    } else handelSearch(true)
}, [isInit])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return;
    }

    if (open) return;
    router.push(`/search/?search=${search}&discount=${discount || ""}&sort=${sort || ""}&category=${category}&tag=${tag}`)
    setProducts([])
    skip.current = 0
    handelSearch(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])


  const [state, setState] = useState(false)
  const [ele, setEle] = useState<Element | null>(null)
  const eleCallBack = useCallback((node: Element) => { setEle(node) }, [])

  const { current: observer } = useRef(new IntersectionObserver((entries) => { setState(entries[0].isIntersecting) }))

  useEffect(() => { if (ele) observer.observe(ele) }, [ele])

  useEffect(() => {
    if (products.length !== totalProducts && !isLoadingRow && state) handelSearch();
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

        <Box className="text-gray-100 cursor-pointer fixed bottom-20 z-50 right-1 hover:bg-white hover:bg-gradient-to-bl bg-gradient-to-tr from-blue-700 to-blue-300 shadow-md rounded-md">
          <FilterListIcon onClick={() => setOpen(true)} className="p-2 w-12 h-12" />
        </Box>

        <Dialog onClose={() => setOpen(false)} open={open}>
          <DialogTitle>Sort And Filter</DialogTitle>
          <Box className="p-4 flex flex-col gap-4">
            <section className="gap-4 max-w-[400px] flex-col">
              <div className="flex flex-row flex-wrap gap-2">
                <Chip clickable label="likes" variant="outlined" icon={sort === "likes" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "likes" ? setSort(undefined) : setSort("likes")} />
                <Chip clickable label="price-high-to-low" variant="outlined" icon={sort === "price-high-to-low" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "price-high-to-low" ? setSort(undefined) : setSort("price-high-to-low")} />
                <Chip clickable label="price-low-to-high" variant="outlined" icon={sort === "price-low-to-high" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "price-low-to-high" ? setSort(undefined) : setSort("price-low-to-high")} />
                <Chip clickable label="discount" variant="outlined" icon={sort === "discount" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "discount" ? setSort(undefined) : setSort("discount")} />
                <Chip clickable label="date" variant="outlined" icon={sort === "date" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "date" ? setSort(undefined) : setSort("date")} />
              </div>
            </section>

            <section className="h-full justify-start flex items-center gap-4 flex-col">
              <label htmlFor='search' className="sr-only ">search</label>
              <input id="search" className="border w-full border-gray-400 focus:ring-2 p-1 rounded-md focus:border-0 ring-blue-500 outline-none hover:border-black " placeholder='search' value={search} onChange={(e) => setSearch(e.target.value)} />

              <div className="flex flex-row w-full">
                <label htmlFor="discount" className="text-sm w-[180px] text-center font-medium text-gray-700">discount</label>
                {/* @ts-ignore */}
                <select id="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value={""}>-all-</option>
                  {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9].map((discount, index) => (
                    <option value={discount} key={index}>{(discount * 100)}%</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-row w-full">
                <label htmlFor="categories" className="text-sm w-[180px] text-center font-medium text-gray-700">category</label>
                {/* @ts-ignore */}
                <select id="categories" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value={""}>-all-</option>
                  {!(categories && categories.length > 0) ? null : categories.map((category, index) => (
                    <option value={category.name} key={index}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-row w-full">
                <label htmlFor="tags" className="text-sm w-[180px] text-center font-medium text-gray-700">tag</label>
                {/* @ts-ignore */}
                <select id="tags" value={tag} onChange={(e) => setTag(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value={""}>-all-</option>
                  {!(tags && tags.length > 0) ? null : tags.map((category, index) => (
                    <option value={category.name} key={index}>{category.name}</option>
                  ))}
                </select>
              </div>

            </section>
          </Box>
        </Dialog>

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



export async function getServerSideProps() {

  const [categories, tags] = await prisma.$transaction([
    prisma.category.findMany({
      where: { product: { some: {} } },
      select: { name: true }
    }),
    prisma.tag.findMany({
      where: { product: { some: {} } },
      select: { name: true }
    })
  ])

  return { props: { categories, tags } }
}
