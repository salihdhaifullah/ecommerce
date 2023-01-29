import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { getHistoryOrders } from '../../api';
import Details from '../../components/Details';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';

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
  };
  id: number;
  verified: boolean;
}

function Filter({ open, setOpen }: { open: boolean, setOpen: (bool: boolean) => void }) {

  const EditDay = (date: Date, num: number): Date => {
    return new Date(date.getTime() + num * 24 * 60 * 60 * 1000)
  }

  const classNameForDateInput = "bg-gray-50 border outline-none focus:p-[7px] focus:border-blue-500 focus:border-[2px] border-gray-300 hover:border-gray-700  text-gray-900 text-base rounded-md w-fit p-2"

  const [timeFrom, setTimeFrom] = useState<Date>(new Date())
  const [timeTo, setTimeTo] = useState<Date>(EditDay(new Date(), 1))

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <div className="min-w-fit  min-h-fit w-full h-full">

        <DialogTitle className='px-10'>Filter Orders</DialogTitle>
        <DialogContent>

          <div className="w-full flex flex-col gap-4 justify-center items-center">

            <div className="w-full flex flex-row gap-4 justify-between">
              <div className="flex flex-col w-fit">
                <InputLabel htmlFor='time-from-date'>Date From</InputLabel>
                <input
                  type="date"
                  id='time-from-date'
                  value={timeFrom.toISOString().slice(0, 10)}
                  onChange={(e) => setTimeFrom(new Date(e.target.value))}
                  max={EditDay(timeTo, -1).toISOString().slice(0, 10)}
                  className={classNameForDateInput}
                   />
              </div>

              <div className="flex flex-col w-fit">
                <InputLabel htmlFor='time-from-date'>Date To</InputLabel>
                <input
                  type="date"
                  id='time-to-date'
                  value={timeTo.toISOString().slice(0, 10)}
                  onChange={(e) => setTimeTo(new Date(e.target.value))}
                  min={EditDay(timeFrom, 1).toISOString().slice(0, 10)}
                  className={classNameForDateInput}
                  />
              </div>
            </div>

            <div className="flex flex-col w-full h-fit justify-center">
              <InputLabel htmlFor="time-to-date" >User Name</InputLabel>
              <TextField className="w-full h-fit"/>
            </div>

          </div>

        </DialogContent>
        <DialogActions className="flex flex-row justify-end">
          <Button className="bg-blue-600 text-white hover:bg-blue-500 shadow-lg">Filter</Button>
        </DialogActions>
      </div>
    </Dialog >
  )
}


export default function HistoryOrders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [historyOrders, setHistoryOrders] = useState<IHistoryOrdersOrderData[]>([])
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const GetHistoryOrders = useCallback(async () => {
    setLoading(true)
    await getHistoryOrders((page * rowsPerPage), rowsPerPage)
      .then((res) => { setHistoryOrders(res.data.orders) })
      .catch((err) => { console.log(err) })
    setLoading(false)
  }, [page, rowsPerPage])

  useEffect(() => {
    GetHistoryOrders()
  }, [GetHistoryOrders])

  useEffect(() => {
    console.log(open)
  }, [open])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="h-[100vh] lg:px-20 break-keep px-4 flex items-center justify-center">
      {loading ? <CircularProgress className="w-12 h-12" />
        : (
          <Paper className="w-full overflow-auto px-4 pt-4">
            <Filter open={open} setOpen={setOpen} />
            {open ? null : (
              <div className="w-full flex justify-end">
                <Button onClick={() => setOpen(true)}>Filter</Button>
              </div>
            )}
            <TableContainer>
              <Table stickyHeader aria-label="Table of Orders">
                <TableHead>
                  <TableRow>
                    <TableCell> Details </TableCell>
                    <TableCell> total Price </TableCell>
                    <TableCell> User Full Name </TableCell>
                    <TableCell> State </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historyOrders.map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>

                      <TableCell className="lowercase relative p-0">
                        <Details details={row.saleProducts} index={index} />
                      </TableCell>
                      <TableCell>{row.totalPrice}</TableCell>
                      <TableCell>{row.user.firstName + " " + row.user.lastName}</TableCell>
                      <TableCell>{row.verified ? "Verified" : "canceled"}</TableCell>

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
        )}

    </div>
  );
}




