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
import Link from 'next/link';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

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

interface IDetailsProps {
  details: {
    product: {
      title: string;
      id: number;
    };
    numberOfItems: number;
  }[]
}

const Details = ({ details }: IDetailsProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(details)
  }, [])
  return (
    open ? (
      <>
        <Button onClick={() => setOpen(!open)} className="text-xs">
          Details <ArrowUpwardIcon className="ml-2 w-4 h-4 " />
        </Button >

        <div className="flex flex-col w-fit gap-4 rounded-lg bg-white p-2 justify-center items-center shadow-2xl h-fit m-2 mb-5">
        <Box>

          {(!details || details.length < 1) ? (
            <Box className="flex flex-row rounded-md w-auto break-keep p-2 hover:bg-gray-100 gap-2">
              <p>None Found !</p>
            </Box>
          ) : details.map((item, index) => (
            <>
              <Box className="flex flex-row rounded-md w-auto break-keep p-2 hover:bg-gray-100 gap-2" key={index}>
                <p>Quantity {item.numberOfItems}</p>
                <Link href={`/products/${item.product.id}`}>
                  <p className="link">{item.product.title}</p>
                </Link>
              </Box>
              <hr className="w-full my-2" />
            </>
          ))}
        </Box>
        </div>
      </>
    ) : (
      <Button onClick={() => setOpen(!open)} className="text-xs">
        Details <ArrowDownwardIcon className="ml-2 w-4 h-4" />
      </Button >
    )
  )
}

export default function HistoryOrders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [historyOrders, setHistoryOrders] = useState<IHistoryOrdersOrderData[]>([])

  const GetHistoryOrders = useCallback(async () => {
    await getHistoryOrders((page * rowsPerPage), rowsPerPage)
      .then((res) => { setHistoryOrders(res.data.orders) })
      .catch((err) => { console.log(err) })
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
    <div className="h-[100vh] lg:px-20 px-10 flex items-center justify-center">
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
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
                    <Details details={row.saleProducts} />
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
    </div>
  );
}