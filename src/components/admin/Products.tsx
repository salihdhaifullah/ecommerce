import { useEffect, useState, ChangeEvent, useCallback } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { deleteProduct, getProductsTable } from '../../api';
import moment from 'moment';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Toast from '../../utils/sweetAlert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface IProductsData {
  createdAt: Date;
  category: {
    name: string
  };
  id: number;
  likes: string[];
  pieces: number;
  price: number;
  title: string;
}

const Products = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [products, setProducts] = useState<IProductsData[]>([]);
  const [loading, setLoading] = useState(true);


  const GetProducts = useCallback(async () => {
    setLoading(true)
    await getProductsTable((page * rowsPerPage), rowsPerPage)
      .then((res) => { setProducts(res.data.products) })
      .catch((err) => { console.log(err) })
    setLoading(false)
  }, [page, rowsPerPage])

  useEffect(() => {
    GetProducts()
  }, [GetProducts])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handelDelete = async (id: number) => {
    Swal.fire({
      title: 'Delete product',
      text: 'Are you sure you want to delete this product',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true
    }).then(async (res) => {
      if (res.value) {
        await deleteProduct(id)
          .then((res) => { Toast.fire("Product SuccessFully Deleted", '', 'success') })
          .catch((err) => { Toast.fire("Some thing Want Wrong !", '', 'error') })
        GetProducts()
      }
    })

  }

  return (
    <div className="h-[100vh] lg:px-20 whitespace-nowrap px-4 flex flex-col items-center justify-center">
       <Box className="my-20 text-start">
       <Typography variant="h3" className="text-gray-900 font-bold">Products </Typography>
       </Box>
      {loading ? <CircularProgress className="w-12 h-12" />
        : (
          <Paper className="w-full overflow-auto">
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell> Created At </TableCell>
                    <TableCell> Title </TableCell>
                    <TableCell> Category </TableCell>
                    <TableCell> Likes </TableCell>
                    <TableCell> Pieces </TableCell>
                    <TableCell> Price </TableCell>
                    <TableCell> Update </TableCell>
                    <TableCell> Delete </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((row, index) => (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell>{moment(row.createdAt).format("ll")}</TableCell>

                      <TableCell className="link text-blue-500">
                        <Link href={`/products/${row.id}`}>{row.title}</Link>
                      </TableCell>

                      <TableCell>{row.category.name}</TableCell>
                      <TableCell>{row.likes.length}</TableCell>
                      <TableCell>{row.pieces}</TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>
                        <Link href={`/admin/update-product/?id=${row.id}`}>
                          <Button className="bg-green-500 shadow-md lowercase p-0 text-white shadow-green-500">Update</Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Button onClick={() => handelDelete(row.id)} className="bg-red-500 shadow-md lowercase p-0 text-white shadow-red-500">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={products.length}
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

export default Products;
