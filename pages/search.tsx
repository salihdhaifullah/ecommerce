import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import RowChild from '../components/RowChild'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { generalSearch, SearchByCategory, SearchByTag } from '../api'
import { IProductRow } from '../types/product'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'

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
  const [tag, setTag] = useState("")
  const [category, setCategory] = useState("")
  const router = useRouter();

  useEffect(() => {
    setSearch(handelSetData(router.query.search))
    setTag(handelSetData(router.query.tag))
    setCategory(handelSetData(router.query.category))
  }, [router])

  const handelSearch = useCallback(async () => {
    if (tag || search || category) {
      setIsLoading(true)
      if (search) await generalSearch(search)
        .then((res) => { setProducts(res.data.products) })

      else if (tag) await SearchByTag(tag)
        .then((res) => { setProducts(res.data.products.product) })

      else if (category) await SearchByCategory(category)
        .then((res) => { setProducts(res.data.products) })
    };

    setIsLoading(false)
  }, [category, search, tag])


  useEffect(() => {
    handelSearch();
  }, [handelSearch])

  return (
    <>
      <Head>
        <title>{search || tag || category}</title>
        <meta name="description" content={search || tag || category} />
        <meta name="keywords" content={tag} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full min-h-[75vh] flex my-10 p-16 min-w-full justify-center items-center">
        {isLoading ? <CircularProgress /> : (
          <Grid container spacing={4}>
            {products.length > 0 ? (
              <Box className="gap-4 grid w-full grid-cols-1 sm:grid-cols-2 ">

                {products.map((item, index) => (
                  <div key={index} className="w-full">
                    <RowChild index={index} item={item} />
                  </div>
                ))}
              </Box>
            ) : (
              <div className="w-full flex items-center justify-center">
                <Typography variant='h4' component='h1'> Sorry No Products Found </Typography>
              </div>
            )}
          </Grid>
        )}
      </div>
    </>
  )
}

export default Search;