import Head from 'next/head'
import Row from '../../components/Row';
import { getCategoriesAndTags } from '../../api';
import { useCallback, useEffect, useState, useRef, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export default function Index() {
  const [isLoadingRow, setLoadingRow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const LastElement = useRef<HTMLDivElement | null>(null)
  const [categoriesOptions, setCategoriesOptions] = useState<{ name: string }[]>([]);

  const GetCategories = useCallback(async () => {
    setIsLoading(true)
    await getCategoriesAndTags()
      .then((res) => {
        if (!res.data.categories.length) return;
        setCategoriesOptions(res.data.categories)
      })
      .catch((err) => { console.log(err) })
    setIsLoading(false)
  }, [])

  useEffect(() => {
    GetCategories()
  }, [GetCategories])

  const HandelGetLast = async () => {
    setLoadingRow(true)
    await new Promise((resolve, reject) => {
      setTimeout(() => { resolve(1) }, 3 * 1000)
    })

    const data = [{ name: "dsdvcasds" + Math.random() * 1000 }, { name: "dsdvsasds" + Math.random() * 1000 }, { name: "dsdvcasds" + Math.random() * 1000 }, { name: "dsdscavds" }]
    setCategoriesOptions((val) => [...val, ...data])
    setLoadingRow(false)
  }

  const observer = new IntersectionObserver((entries) => { if (entries[0].isIntersecting && !isLoadingRow) HandelGetLast() })

  useEffect(() => { if (LastElement.current) observer.observe(LastElement.current) }, [LastElement.current])

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
              <div ref={LastElement} className="p-8 w-full min-h-8 flex justify-center items-center">{!isLoadingRow ? null : <CircularProgress className="w-8 h-8" />}</div>
            </div>
            : <Typography variant='h3' className="text-blue-600 text-center">Sorry No Products Found !</Typography>
        }
      </div>
    </>
  )
}
