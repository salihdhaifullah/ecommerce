import Head from 'next/head'
import Row from '../../components/Row';
import { getProducts, getCategoriesAndTags, GetProductsLength } from '../../api';
import { useCallback, useEffect, useState, useRef } from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { SortByType } from '../../types/product';

interface IProduct {
  id: number;
  discount: number;
  price: number;
  title: string;
  imageUrl: string;
}

export default function Index() {
  const [products, setProducts] = useState<IProduct[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingRow, setLoadingRow] = useState(false)

  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(5);
  const [filter, setFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortByType>("CreateAt");
  const [productsPages, setProductsPages] = useState<number[]>([]);
  const RefRowP = useRef<HTMLDivElement | null>(null)
  const LastElement = useRef<HTMLDivElement | null>(null)
  const [categoriesOptions, setCategoriesOptions] = useState<{ name: string }[]>([]);

  const init = useCallback(async () => {
    await GetProductsLength(filter)
      .then((res) => {
        const pages = [];
        for (let i = 0; i < Math.ceil(res.data.products / take); i++) { pages.push(i) };
        setProductsPages(pages)
      })
      .catch((err) => { console.error(err) });
  }, [filter, take])


  useEffect(() => {
    init()
  }, [init])

  const HandelGetProducts = useCallback(async () => {
    setIsLoading(true)
    await getProducts(skip, take, filter, sortBy)
      .then((res) => { setProducts(res.data.products) })
      .catch((err) => { console.log(err) })

    setIsLoading(false);
  }, [filter, skip, sortBy, take])

  useEffect(() => {
    HandelGetProducts()
  }, [HandelGetProducts])

  const GetCategories = useCallback(async () => {
    await getCategoriesAndTags()
      .then((res) => {
        if (!res.data.categories.length) return;
        setCategoriesOptions(res.data.categories)
      })
      .catch((err) => { console.log(err) })
  }, [])

  useEffect(() => {
    GetCategories()
  }, [GetCategories])

  useEffect(() => {
    init()
  }, [init])

  const HandelGetLast = async () => {
    setLoadingRow(true)
    await new Promise((resolve, reject) => {
      setTimeout(() => { resolve(1) }, 3 * 1000)
    })
    setCategoriesOptions((val) => [...val, {name: "dsdvds"}, {name: "dsdvds"}, {name: "dsdvds"}, {name: "dsdvds"}])
    setLoadingRow(false)
  }

  useEffect(() => {
    document.addEventListener("scroll", async (e: any) => {
      if (!LastElement?.current) return;
      if (!document?.scrollingElement) return;
      const domScroll = document.scrollingElement.scrollTop
      const lastPosition = ((LastElement.current.offsetTop - 300) - (document.scrollingElement.clientHeight / 2))

      if (domScroll >= lastPosition) {
        await HandelGetLast()
      }
    })
  }, [])

  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="Products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full flex-col min-h-[100vh] mt-16 h-full justify-center items-center">
        {isLoading
          ? <CircularProgress />
          : products.length > 0
            ?
            <div className='flex gap-4 justify-center items-center flex-col'>
              <div ref={RefRowP} className='flex gap-4 justify-center items-center flex-col'>
                {categoriesOptions.map((category) => (
                  <Row category={category.name} key={category.name} products={products} />
                ))}
              </div>
              <div ref={LastElement}>{!loadingRow ? null : <CircularProgress className="w-8 h-8" />}</div>
            </div>
            : <Typography variant='h3' className="text-blue-600 text-center">Sorry No Products Found !</Typography>
        }
      </div>
    </>
  )
}
