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
import Details from '../../components/admin/Details';
import CircularProgress from '@mui/material/CircularProgress';

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



export default function HistoryOrders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [historyOrders, setHistoryOrders] = useState<IHistoryOrdersOrderData[]>([])
  const [loading, setLoading] = useState(true);

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
                      <TableCell><Details details={row.saleProducts} /></TableCell>
                      <TableCell>{row.totalPrice}</TableCell>
                      <TableCell>{row.user.firstName + " " + row.user.lastName}</TableCell>
                      <TableCell>{row.verified ? "Verified" : "Canceled"}</TableCell>
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




