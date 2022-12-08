import Head from 'next/head'
import Row from '../../components/Row';
import { getProducts } from '../../api';
import { useCallback, useEffect, useState } from 'react';
import { CircularProgress, Typography } from '@mui/material';

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

  const init = useCallback(async () => {
    setIsLoading(true)
    await getProducts()
      .then((res) => { setProducts(res.data.products) })
      .catch((err) => { console.log(err) })
    setIsLoading(false)
  }, [])

  useEffect(() => {
    init()
  }, [init])

  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="Products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full mt-[200px] h-full justify-center items-center">
        {isLoading ? (
          <CircularProgress />
        ) : (
          products.length > 0 ? (
            <Row products={products} />
          ) : ( 
            <Typography variant='h3' className="text-blue-600 text-center">Sorry No Products Found !</Typography>
          )
        )}
      </div>
    </>
  )
}