import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { getUsers } from '../api';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography';

interface IUsersData {
  createdAt: Date;
  firstName: string;
  lastName: string;
  email: string;
  payment: { totalPrice: string }[]
}

const getTotal = (input: { totalPrice: string }[]): number => {
  let total = 0;
  for (let item of input) {
    total += Number(item.totalPrice)
  }
  return total;
}

export default function Users() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState<IUsersData[]>([]);
  const [loading, setLoading] = useState(true);

  const GetUsers = useCallback(async () => {
    setLoading(true)
    await getUsers((page * rowsPerPage), rowsPerPage)
      .then((res) => { setUsers(res.data.users) })
      .catch((err) => { console.log(err) })
    setLoading(false)
  }, [page, rowsPerPage])

  useEffect(() => {
    GetUsers()
  }, [GetUsers])

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
        <Typography variant="h3" className="text-gray-900 font-bold">Users </Typography>
      </Box>
      {loading ? <CircularProgress className="w-12 h-12" />
        : (
          <Paper className="w-full overflow-auto">
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell> Join At </TableCell>
                    <TableCell> First Name </TableCell>
                    <TableCell> Last Name </TableCell>
                    <TableCell> Email </TableCell>
                    <TableCell> Total Payments </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell>{moment(row.createdAt).format("ll")}</TableCell>
                      <TableCell>{row.firstName}</TableCell>
                      <TableCell>{row.lastName}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{getTotal(row.payment) + "$"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={users.length}
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