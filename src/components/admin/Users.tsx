import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { getUsers } from '../../api';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography';
import dateFormat from '../../utils/dateFormat';
import FilterListIcon from '@mui/icons-material/FilterList';
import Chip from '@mui/material/Chip';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DoneIcon from '@mui/icons-material/Done';
import LoaderCircle from '../utils/LoaderCircle';

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

export default function Users({usersInit, count}: {usersInit: IUsersData[], count: number}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState<IUsersData[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [sort, setSort] = useState<"date" | undefined>()
  const [nameFilter, setNameFilter] = useState("")
  const [emailFilter, setEmailFilter] = useState("")
  const [isInit, setIsInit] = useState(true);
  const GetUsers = useCallback(async () => {
    if (open) return;
    if (isInit) {
      if (usersInit) {
        setUsers(usersInit)
        setIsInit(false)
      }
      return;
    }
    setLoading(true)
    await getUsers((page * rowsPerPage), rowsPerPage, nameFilter, emailFilter, sort)
      .then((res) => { setUsers(res.data.users) })
      .catch((err) => { console.log(err) })
      .finally(() => { setLoading(false) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFilter, nameFilter, open, page, rowsPerPage, sort])

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
                <label htmlFor='name' className="sr-only ">name</label>
                <input id="name" className="border w-full border-gray-400 focus:ring-2 p-1 rounded-md focus:border-0 ring-blue-500 outline-none hover:border-black " placeholder='name' value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} />
                <label htmlFor='email' className="sr-only ">email</label>
                <input id="email" className="border w-full border-gray-400 focus:ring-2 p-1 rounded-md focus:border-0 ring-blue-500 outline-none hover:border-black " placeholder='email' value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} />
              </section>
            </Box>
          </Dialog>

        </Box>

        {loading ? <LoaderCircle /> : (
          <TableContainer>
            <Table>
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
                    <TableCell>{dateFormat(row.createdAt)}</TableCell>
                    <TableCell>{row.firstName}</TableCell>
                    <TableCell>{row.lastName}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>{getTotal(row.payment) + "$"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
