import { useEffect, useState, ChangeEvent, useCallback, Fragment } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { deliverOrder, getHistoryOrders } from '../../api';
import Details from '../../components/admin/Details';
import CircularProgress from '@mui/material/CircularProgress';
import { Button, Chip, Typography } from '@mui/material';
import dateFormat from '../../utils/dateFormat';
import Box from '@mui/material/Box';
import FilterListIcon from '@mui/icons-material/FilterList';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DoneIcon from '@mui/icons-material/Done';
import LoaderCircle from '../utils/LoaderCircle';


interface IHistoryOrdersOrderData {
  saleProducts: {
    product: {
      title: string;
      id: number;
    };
    numberOfItems: number;
  }[]

  totalPrice: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  id: number;
  verified: boolean;
  received: boolean;
  address1: string;
  address2: string;
  phoneNumber: string;
  country: string;
  countryCode: string;
  createdAt: Date;
}

const Row = ({ row }: { row: IHistoryOrdersOrderData }) => {
  const [isLoading, setIsLoading] = useState(false)


  const handelDeliver = async (id: number) => {
    setIsLoading(true)

    await deliverOrder(id)
      .then((res) => { row.received = true })
      .catch((err) => { })
      .finally(() => { setIsLoading(false) })
  }

  const data = {
    address1: row.address1,
    address2: row.address2,
    phoneNumber: row.phoneNumber,
    country: row.country,
    countryCode: row.countryCode,
    email: row.user.email,
    saleProducts: row.saleProducts
  }

  return (
    <TableRow hover role="checkbox" tabIndex={-1}>
      <TableCell>{dateFormat(row.createdAt)}</TableCell>
      <TableCell><Details details={data} /></TableCell>
      <TableCell>{row.totalPrice}</TableCell>
      <TableCell>{row.user.firstName + " " + row.user.lastName}</TableCell>
      <TableCell>{row.verified ? "Verified" : "Canceled"}</TableCell>
      <TableCell>

        {row.received ? "Received" : row.verified ? (
          <Button onClick={() => handelDeliver(row.id)} className="bg-green-500 p-0  shadow-md lowercase text-white shadow-green-500">
            {isLoading ? <CircularProgress className="text-white p-2 w-8 h-8" />
              : <span title="Unreceived Products">Deliver</span>}
          </Button>
        ) : <div>UnVerified</div>}
      </TableCell>
    </TableRow>
  )
}

export default function HistoryOrders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [historyOrders, setHistoryOrders] = useState<IHistoryOrdersOrderData[]>([])
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false)
  const [userNameFilter, setUserNameFilter] = useState("")
  const [sort, setSort] = useState({ date: false, totalPrice: false })
  const [paymentFilter, setPaymentFilter] = useState("")
  const [deliverFilter, setDeliverFilter] = useState("")

  const GetHistoryOrders = useCallback(async () => {
    if (open) return;
    setLoading(true)
    await getHistoryOrders((page * rowsPerPage), rowsPerPage, userNameFilter, paymentFilter, deliverFilter, sort.date, sort.totalPrice)
      .then((res) => { setHistoryOrders(res.data.orders) })
      .catch((err) => { console.log(err) })
      .finally(() => { setLoading(false) })
  }, [deliverFilter, open, page, paymentFilter, rowsPerPage, sort.date, sort.totalPrice, userNameFilter])

  useEffect(() => {
    GetHistoryOrders()
  }, [GetHistoryOrders])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="h-[100vh] flex-col lg:px-20 break-keep px-4 flex items-center justify-center">
      <Box className="my-20 text-start">
        <Typography variant="h3" className="text-gray-900 font-bold">Orders</Typography>
      </Box>

      <Paper className="w-full overflow-auto px-4 pt-4">
        <Box className="w-full flex flex-row justify-start m-1 mr-2 gap-2 items-center">

          <FilterListIcon onClick={() => setOpen(true)} className="text-gray-600 cursor-pointer hover:bg-slate-100  rounded-md p-2  w-12 h-12" />

          <Dialog onClose={() => setOpen(false)} open={open}>
            <DialogTitle>Sort And Filter</DialogTitle>
            <Box className="p-4 flex flex-col gap-4">
              <section className="gap-4 max-w-[400px] flex-col">
                <div className="flex flex-row flex-wrap gap-2">
                  <Chip clickable label="date" variant="outlined" icon={sort.date ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => setSort({ ...sort, date: !sort.date })} />
                  <Chip clickable label="total-price" variant="outlined" icon={sort.totalPrice ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => setSort({ ...sort, totalPrice: !sort.totalPrice })} />
                </div>
              </section>

              <section className="h-full justify-start flex items-center gap-4 flex-col">
                <label htmlFor='user-name' className="sr-only ">user name</label>
                <input id="user-name" className="border w-full border-gray-400 focus:ring-2 p-1 rounded-md focus:border-0 ring-blue-500 outline-none hover:border-black " placeholder='user name' value={userNameFilter} onChange={(e) => setUserNameFilter(e.target.value)} />

                <div className="flex flex-row w-[300px]">
                  <label htmlFor="payment-state" className="text-sm w-[180px] text-center font-medium text-gray-700">payment state</label>
                  <select id="payment-state" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="Verified">Verified</option>
                    <option value="Canceled">Canceled</option>
                  </select>
                </div>

                <div className="flex flex-row w-[300px]">
                  <label htmlFor="deliver-state" className="text-sm w-[180px] text-center font-medium text-gray-700">deliver state</label>
                  <select id="deliver-state" value={deliverFilter} onChange={(e) => setDeliverFilter(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                    <option value="UnVerified">UnVerified</option>
                    <option value="UnDelivered">UnDelivered</option>
                    <option value="Received">Received</option>
                  </select>
                </div>

              </section>
            </Box>
          </Dialog>

        </Box>
        {loading ? <LoaderCircle /> : (
        <TableContainer>
        <Table stickyHeader aria-label="Table of Orders">
          <TableHead>
            <TableRow>
              <TableCell> <div className="w-[100px]">Created-At</div> </TableCell>
              <TableCell> <div className="w-[100px]">Details</div> </TableCell>
              <TableCell> <div className="w-[100px]">total-Price</div> </TableCell>
              <TableCell> <div className="w-[100px]">User-Name</div> </TableCell>
              <TableCell> <div className="w-[120px]">Payment State</div> </TableCell>
              <TableCell> <div className="w-[100px]">Deliver State</div> </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyOrders.map((row, index) => (
                <Fragment key={index}>
                  <Row row={row} />
                </Fragment>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={historyOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>


    </div>
  );
}
