import Head from 'next/head'
import Row from '../../components/products/Row';
import { getCategories } from '../../api';
import { useCallback, useEffect, useState, useRef } from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export default function Index() {
  const [isLoading, setIsLoading] = useState(true)
  const [categoriesOptions, setCategoriesOptions] = useState<{ name: string }[]>([]);
  const [isLoadingRow, setLoadingRow] = useState(false)
  const [page, setPage] = useState(1)
  const [isDone, setIsDone] = useState(false)
  let init = useRef(true)

  const GetCategoriesCallBack = useCallback(async () => {
    if (init.current) setIsLoading(true)
    else setLoadingRow(true)

    await getCategories(page)
      .then((res) => {
        const data = [...categoriesOptions, ...res.data.categories]
        setCategoriesOptions(data)
        if (data.length >= res.data.totalCategories) setIsDone(true);
      })
      .catch((err) => { console.log(err) })
      .finally(() => {
        if (init.current) setIsLoading(false)
        else setLoadingRow(false)
        init.current = false
      })
  }, [page])

  useEffect(() => { GetCategoriesCallBack() }, [GetCategoriesCallBack])

  const { current: observer } = useRef(new IntersectionObserver((entries) => {
    console.log(entries[0].isIntersecting)
    if (entries[0].isIntersecting && !isLoadingRow) setPage((prev) => (prev + 1));
   }))

  useEffect(() => { if (isDone) observer.disconnect(); }, [isDone])

  const lastElement = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) observer.observe(node)
  }, [observer])

  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="Products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full flex-col min-h-[100vh] mt-16 h-full justify-center items-center">
        {isLoading ? <CircularProgress className="w-12 h-12" />
          : categoriesOptions.length > 0 ?
            <div className='flex gap-4 w-full justify-center items-center flex-col'>
              <div className='flex w-full overflow-auto justify-center items-center flex-col'>
                {categoriesOptions.map((category, index) => (
                  <Row category={category.name} key={index} />
                ))}
              </div>
              <div ref={lastElement} style={{ minHeight: "100px" }} className="w-full flex justify-center items-center">{!isLoadingRow ? null : <CircularProgress className="w-8 h-8" />}</div>
            </div>
            : <Typography variant='h3' className="text-blue-600 text-center">Sorry No Products Found !</Typography>
        }
      </div>
    </>
  )
}





