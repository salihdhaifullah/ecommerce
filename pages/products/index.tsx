import Head from 'next/head'
import Row from '../../src/components/Row';
import { getProducts, getCategoriesAndTags, GetProductsLength } from '../../src/api';
import { useCallback, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { SortByType } from '../../src/types/product';

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

  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(5);
  const [filter, setFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortByType>("CreateAt");
  const [productsPages, setProductsPages] = useState<number[]>([]);
  const [activePage, setActivePage] = useState(0)

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

  return (
    <>
      <Head>
        <title>Products</title>
        <meta name="description" content="Products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex w-full flex-col mt-16 h-full justify-center items-center">

        <Box className="flex w-full mb-10 justify-end items-end gap-4">

          <Box className="w-fit inline-flex gap-4 p-4 rounded-md shadow-lg bg-white">
            <FormControl className="w-full">
              <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value as SortByType)}
              >

                <MenuItem value={"Likes"}>Likes</MenuItem>
                <MenuItem value={"Price High To Low"}>Price High To Low</MenuItem>
                <MenuItem value={"Price Low To High"}>Price Low To High</MenuItem>
                <MenuItem value={"CreateAt"}>Create At</MenuItem>

              </Select>
            </FormControl>

            <FormControl className="w-full">
              <InputLabel id="demo-simple-select-label">Filter</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filter === null ? "--all--" : filter}
                label="Filter"
                onChange={(e) => setFilter(e.target.value === "--all--" ? null : e.target.value)}
              >
                <MenuItem value={"--all--"} >--all--</MenuItem>

                {categoriesOptions.map((option, index) => (
                  <MenuItem value={option.name} key={index}>{option.name}</MenuItem>
                ))}

              </Select>

            </FormControl>
          </Box>
        </Box>

        <div className='flex min-h-[70vh] justify-center items-center flex-col'>
          {isLoading
            ? <CircularProgress />
            : products.length > 0
              ? <Row products={products} />
              : <Typography variant='h3' className="text-blue-600 text-center">Sorry No Products Found !</Typography>
          }

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
        </div>
      </div>
    </>
  )
}
