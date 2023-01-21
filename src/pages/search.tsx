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
  const [activePage, setActivePage] = useState(0);
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


  useEffect(() => {
    init()
  }, [init])

  const handelNextPage = () => {
    const page = (activePage + 1);
    if (activePage < (productsPages.length - 1)) setActivePage(page);
    setSkip(page * take);
  }

  const handelPreviousPage = () => {
    const page = (activePage - 1);
    if (activePage > 0) setActivePage(page);
    setSkip(page * take);
  }

  const handelToPage = (pageIndex: number) => {
    setActivePage(pageIndex++);
    setSkip(pageIndex++ * take);
  }

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
            {products.length > 0 ?
              <>
                <Row products={products} />

                <nav aria-label="Page navigation" className="mt-16 min-w-full flex justify-center items-center">
                  <ul className="flex items-center">

                    {activePage > 0 ? (
                      <li onClick={handelPreviousPage}>
                        <div className="flex py-2 px-3 mr-0 text-blue-500 cursor-pointer bg-gray-100  rounded-l-lg border border-blue-600 hover:bg-white ">
                          <span className="sr-only" title="Previous">Previous</span>
                          <NavigateBeforeIcon />
                        </div>
                      </li>
                    ) : (
                      <li>
                        <div className="flex py-2 px-3 mr-0 text-blue-500 bg-gray-100 rounded-l-lg border border-blue-600">
                          <span className="sr-only" title="Previous">Previous</span>
                          <NavigateBeforeIcon />
                        </div>
                      </li>
                    )}

                    {productsPages.map((item: number, index: number) => (
                      <li key={index}>
                        <div onClick={() => handelToPage(index)} className={`py-2  bg-gradient-to-tr px-3 ${activePage === index ? " text-gray-100  from-blue-300 to-blue-700 " : "hover:from-blue-300 hover:to-blue-700 from-blue-500 to-blue-600 text-white cursor-pointer "} border border-blue-600  `}>{index + 1}</div>
                      </li>
                    ))}

                    {activePage < (productsPages.length - 1) ? (
                      <li onClick={handelNextPage}>
                        <div className="flex py-2 px-3 ml-0 text-blue-500 cursor-pointer bg-gray-100  rounded-r-lg border border-blue-600 hover:bg-white ">
                          <span className="sr-only">Next</span>
                          <NavigateNextOutlinedIcon />
                        </div>
                      </li>
                    ) : (
                      <li >
                        <div className="flex py-2 px-3 ml-0 text-blue-500 bg-gray-100 rounded-r-lg border border-blue-600">
                          <span className="sr-only">Next</span>
                          <NavigateNextOutlinedIcon />
                        </div>
                      </li>
                    )}

                  </ul>
                </nav>
              </>
              : (
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
