import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { getOrders, rejectOrder, verifyOrder } from '../../api';
import Link from 'next/link';

interface IOrderData {
  numberOfItems: number;
  product: {
    title: string;
    id: number;
  };
  totalprice: number;
  user: {
    firstName: string;
    lastName: string;
  };
  id: number;
}

export default function Orders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orders, setOrders] = useState<IOrderData[]>([])

  const GetOrders = useCallback(async () => {
    await getOrders((page * rowsPerPage), rowsPerPage).then((res) => {
      console.log(res)
      setOrders(res.data.orders)
    }).catch((err) => {
      console.log(err)
    })
  }, [page, rowsPerPage])

  useEffect(() => {
    GetOrders()
  }, [GetOrders])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handelVerify = async (id: number) => {
    await verifyOrder(id).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
    GetOrders()
  }

  const handelReject = async (id: number) => {
    await rejectOrder(id).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
    GetOrders()
  }

  return (
    <div className="h-[100vh] lg:px-20 px-10 flex items-center justify-center">
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell> Number Of Items </TableCell>
                <TableCell> Product Title </TableCell>
                <TableCell> total Price </TableCell>
                <TableCell> User Full Name </TableCell>
                <TableCell> Verify </TableCell>
                <TableCell> Reject </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row, index) => (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>

                  <TableCell>{row.numberOfItems}</TableCell>
                  <Link href={`/products/${row.product.id}`}>
                    <TableCell className="link">{row.product.title}</TableCell>
                  </Link>
                  <TableCell>{row.totalprice}</TableCell>
                  <TableCell>{row.user.firstName + " " + row.user.lastName}</TableCell>

                  <TableCell onClick={() => handelVerify(row.id)} className="link">Verified</TableCell>
                  <TableCell onClick={() => handelReject(row.id)} className="link">Rejected</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}