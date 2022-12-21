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
import Toast from '../../functions/sweetAlert';

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

export default function Products() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [products, setProducts] = useState<IProductsData[]>([]);


  const GetProducts = useCallback(async () => {
    await getProductsTable((page * rowsPerPage), rowsPerPage)
      .then((res) => { setProducts(res.data.products) })
      .catch((err) => { console.log(err) })
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
    <div className="h-[100vh] lg:px-20 px-10 flex items-center justify-center">
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
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
                  <Link href={`/products/${row.id}`}>
                    <TableCell className="link text-blue-500">{row.title}</TableCell>
                  </Link>
                  <TableCell>{row.category.name}</TableCell>
                  <TableCell>{row.likes.length}</TableCell>
                  <TableCell>{row.pieces}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <Link href={`/admin/update-product/?id=${row.id}`}>
                    <TableCell>
                      <Button className="bg-green-500 shadow-md lowercase p-0 text-gray-900 shadow-green-500">Edit</Button>
                    </TableCell>
                  </Link>
                  <TableCell>
                    <Button onClick={() => handelDelete(row.id)} className="bg-red-500 shadow-md lowercase p-0 text-gray-900 shadow-red-500">Delete</Button>
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
    </div>
  );
}