import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography';
import dateFormat from '../../utils/dateFormat';
import FilterListIcon from '@mui/icons-material/FilterList';
import Chip from '@mui/material/Chip';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DoneIcon from '@mui/icons-material/Done';
import LoaderCircle from '../utils/LoaderCircle';
import { getFeedBacksTable } from './../../api/index';
import Link from 'next/link';
import Rating from '@mui/material/Rating';

interface IFeedBack {
  id: number;
  createdAt: Date;
  rate: number;
  content: string;
  product: {
    id: number;
    title: string;
  };
  user: {
    firstName: string;
    lastName: string;
  };
}

const Row = ({ row }: { row: IFeedBack }) => {
  const [open, setOpen] = useState(false)
  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell>{dateFormat(row.createdAt)}</TableCell>
      <TableCell>{row.user.firstName + " " + row.user.lastName}</TableCell>

      <TableCell>{row.content.length > 20 ? <p className="cursor-pointer" onClick={() => setOpen(true)}>{row.content.slice(0, 10)}...</p> : <p>{row.content}</p>}</TableCell>

      <TableCell> <Rating name="rate" value={row.rate} readOnly /></TableCell>
      <TableCell className="link text-blue-500">
        <Link href={`/products/${row.product.id}`}>{row.product.title}</Link>
      </TableCell>

      <Dialog onClose={() => setOpen(false)} open={open}>
        <DialogTitle>payment details</DialogTitle>
        <Box className="flex flex-col min-w-[50vw] h-auto mb-4 gap-4 rounded-lg bg-white py-2 px-4 justify-start items-start">
          <div className="flex flex-row gap-4"><span className="text-gray-600 ">createdAt</span><p>{dateFormat(row.createdAt)}</p></div>
          <div className="flex flex-row gap-4"><span className="text-gray-600 ">UserName</span><p>{row.user.firstName + " " + row.user.lastName}</p></div>
          <div className="flex flex-row gap-4"><span className="text-gray-600 ">content</span><p>{row.content}</p></div>
          <div className="flex flex-row gap-4"><span className="text-gray-600 ">Rate</span><Rating name="rate" value={row.rate} readOnly /></div>

          <div className="flex flex-row gap-4">
            <span className="text-gray-600 ">Product</span> <Link className="link text-blue-500" href={`/products/${row.product.id}`}>{row.product.title}</Link>
          </div>

        </Box>
      </Dialog>
    </TableRow>
  )
}

export default function FeedBacks({feedBacksInit}: {feedBacksInit: IFeedBack[]}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [feedBacks, setFeedBacks] = useState<IFeedBack[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState<"date" | undefined>(undefined)
  const [productTitleFilter, setProductTitleFilter] = useState("")
  const [userNameFilter, setUserNameFilter] = useState("")
  const [contentFilter, setContentFilter] = useState("")
  const [rateFilter, setRateFilter] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined)
  const [isInit, setIsInit] = useState(true);

  const GetFeedBacks = useCallback(async () => {
    if (open) return;
    if (isInit) {
      if (feedBacksInit) {
        setFeedBacks(feedBacksInit)
        setIsInit(false)
      }
      return;
    }
    setLoading(true)
    await getFeedBacksTable((page * rowsPerPage), rowsPerPage, productTitleFilter, userNameFilter, contentFilter, rateFilter, sort)
      .then((res) => { setFeedBacks(res.data.data) })
      .catch((err) => { console.log(err) })
      .finally(() => { setLoading(false) })
  }, [open, page, rowsPerPage, productTitleFilter, userNameFilter, contentFilter, rateFilter, sort])

  useEffect(() => {
    GetFeedBacks()
  }, [GetFeedBacks])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="h-[100vh] lg:px-20 whitespace-nowrap px-4 flex flex-col items-center justify-center">
      <Box className="my-20 text-start">
        <Typography variant="h3" className="text-gray-900 font-bold">Feed Backs</Typography>
      </Box>

      <Paper className="w-full overflow-auto">

        <Box className="w-full flex flex-row justify-start m-1 mr-2 gap-2 items-center">

          <FilterListIcon onClick={() => setOpen(true)} className="text-gray-600 cursor-pointer hover:bg-slate-100  rounded-md p-2  w-12 h-12" />

          <Dialog onClose={() => setOpen(false)} open={open}>
            <DialogTitle>Sort And Filter</DialogTitle>
            <Box className="p-4 flex flex-col gap-4">
              <section className="gap-4 max-w-[400px] flex-col">
                <div className="flex flex-row flex-wrap gap-2">
                  <Chip clickable label="date" variant="outlined" icon={sort === "date" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "date" ? setSort(undefined) : setSort("date")} />
                </div>
              </section>

              <section className="h-full justify-start flex items-center gap-4 flex-col">
                <label htmlFor='product-title' className="sr-only ">product-title</label>
                <input id="product-title" className="border w-full border-gray-400 focus:ring-2 p-1 rounded-md focus:border-0 ring-blue-500 outline-none hover:border-black " placeholder='product-title' value={productTitleFilter} onChange={(e) => setProductTitleFilter(e.target.value)} />
                <label htmlFor='user-name' className="sr-only ">user-name</label>
                <input id="user-name" className="border w-full border-gray-400 focus:ring-2 p-1 rounded-md focus:border-0 ring-blue-500 outline-none hover:border-black " placeholder='user-name' value={userNameFilter} onChange={(e) => setUserNameFilter(e.target.value)} />
                <label htmlFor='content' className="sr-only ">content</label>
                <input id="content" className="border w-full border-gray-400 focus:ring-2 p-1 rounded-md focus:border-0 ring-blue-500 outline-none hover:border-black " placeholder='content' value={contentFilter} onChange={(e) => setContentFilter(e.target.value)} />
              </section>

              <div className="flex flex-row w-[300px]">
                <label htmlFor="product-rate" className="text-sm w-[180px] text-center font-medium text-gray-700">product rate</label>
                {/* @ts-ignore */}
                <select id="product-rate" value={rateFilter} onChange={(e) => setRateFilter(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                  <option value={""}>-all-</option>
                  <option value={1}>1 start</option>
                  <option value={2}>2 starts</option>
                  <option value={3}>3 starts</option>
                  <option value={4}>4 starts</option>
                  <option value={5}>5 starts</option>
                </select>
              </div>
            </Box>
          </Dialog>

        </Box>

        {loading ? <LoaderCircle /> : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> Created At </TableCell>
                  <TableCell> User Name </TableCell>
                  <TableCell> Content </TableCell>
                  <TableCell> Rate </TableCell>
                  <TableCell> Product </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedBacks.map((row, index) => <Row row={row} key={index} /> )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={feedBacks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
