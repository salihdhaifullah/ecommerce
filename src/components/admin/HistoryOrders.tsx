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
import { Button } from '@mui/material';
import dateFormat from '../../utils/dateFormat';


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
      .catch((err) => {})
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
        ) : <div>UnVerified</div> }
      </TableCell>
    </TableRow>
  )
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
