import React, { useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import RowChild from '../components/RowChild'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { generalSearch, GetSearchLength, SearchByCategory, SearchByTag } from '../api'
import { IProductRow } from '../types/product'
import { CircularProgress } from '@mui/material'
import { useRouter } from 'next/router'
import Row from '../components/Row'
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

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
  const [category, setCategory] = useState("");
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(5);
  const [productsPages, setProductsPages] = useState<number[]>([]);

  const router = useRouter();

  const init = useCallback(async () => {
    if (search) {
      await GetSearchLength("search", search)
        .then((res) => {
          const pages = [];
          for (let i = 0; i < Math.ceil(res.data.products / take); i++) { pages.push(i) };
          setProductsPages(pages)
        })
        .catch((err) => { console.error(err) });
    }
    else if (tag) {
      await GetSearchLength("tag", tag)
        .then((res) => {
          const pages = [];
          for (let i = 0; i < Math.ceil(res.data.products / take); i++) { pages.push(i) };
          setProductsPages(pages)
        })
        .catch((err) => { console.error(err) });
    }
    else if (category) {
      await GetSearchLength("category", category)
        .then((res) => {
          const pages = [];
          for (let i = 0; i < Math.ceil(res.data.products / take); i++) { pages.push(i) };
          setProductsPages(pages)
        })
        .catch((err) => { console.error(err) });
    }
  }, [category, search, tag])


  useEffect(() => { init() }, [init])

  useEffect(() => {
    setSearch(handelSetData(router.query.search))
    setTag(handelSetData(router.query.tag))
    setCategory(handelSetData(router.query.category))
  }, [router])

  const handelSearch = useCallback(async () => {
    if (tag || search || category) {
      setIsLoading(true)
      if (search) await generalSearch(search, skip, take)
        .then((res) => { setProducts(res.data.products) })
        .catch((err) => { console.log(err) })

      else if (tag) await SearchByTag(tag, skip, take)
        .then((res) => { setProducts(res.data.products.product) })
        .catch((err) => { console.log(err) })

      else if (category) await SearchByCategory(category, skip, take)
        .then((res) => { setProducts(res.data.products) })
        .catch((err) => { console.log(err) })
    };

    setIsLoading(false)
  }, [category, search, tag, skip, take])

  useEffect(() => { handelSearch() }, [handelSearch])

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
            {products.length > 0 ? products.map((item, index) => (
                  <RowChild key={index} isLoading={isLoading} item={item} />
                )) : (
                <div className="w-full flex items-center justify-center">
                  <Typography variant='h4' component='h1' className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400"> Sorry No Products Found </Typography>
                </div>
            )}
          </Grid>
        )}
      </div>
    </>
  )
}

export default Search;
