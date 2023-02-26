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
import { deleteProduct,  getProductsTable } from '../../api';
import Link from 'next/link';
import Swal from 'sweetalert2';
import Toast from '../../utils/sweetAlert';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import dateFormat from '../../utils/dateFormat';
import FilterListIcon from '@mui/icons-material/FilterList';
import DoneIcon from '@mui/icons-material/Done';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Chip from '@mui/material/Chip';
import LoaderCircle from '../utils/LoaderCircle';

interface IProductsData {
  createdAt: Date;
  category: {
    name: string
  };
  id: number;
  likes: { id: number}[];
  pieces: string;
  price: string;
  title: string;
}

const Products = ({productsInit, categories}: { productsInit: IProductsData[], categories: { name: string }[] | null}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [products, setProducts] = useState<IProductsData[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [titleFilter, setTitleFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState<"date" | "likes" | "pieces" | "price" | undefined>(undefined)
  const [isInit, setIsInit] = useState(true)

  const GetProducts = useCallback(async () => {
    if (open) return;
    if (isInit) {
      if (productsInit) {
        setProducts(productsInit)
        setIsInit(false)
      }
      return;
    }
    setLoading(true)
    await getProductsTable((page * rowsPerPage), rowsPerPage, categoryFilter, titleFilter, sort)
      .then((res) => { setProducts(res.data.products) })
      .catch((err) => { console.log(err) })
      .finally(() => { setLoading(false) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFilter, open, page, rowsPerPage, sort, titleFilter])

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


          <Paper className="w-full overflow-auto">
            <Box className="flex justify-start w-full m-1 items-center">

              <Box className="w-full h-full flex flex-row justify-start gap-2 items-center">

                <FilterListIcon onClick={() => setOpen(true)} className="text-gray-600 cursor-pointer hover:bg-slate-100  rounded-md p-2  w-12 h-12" />

                <Dialog onClose={() => setOpen(false)} open={open}>
                  <DialogTitle>Sort And Filter</DialogTitle>
                  <Box className="p-4 flex flex-col gap-4">
                    <section className="gap-4 max-w-[400px] flex-col">
                      <div className="flex flex-row flex-wrap gap-2">
                        <Chip clickable label="date" variant="outlined" icon={sort === "date" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "date" ? setSort(undefined) : setSort("date")} />
                        <Chip clickable label="likes" variant="outlined" icon={sort === "likes" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "likes" ? setSort(undefined) : setSort("likes")} />
                        <Chip clickable label="pieces" variant="outlined" icon={sort === "pieces" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "pieces" ? setSort(undefined) : setSort("pieces")} />
                        <Chip clickable label="price" variant="outlined" icon={sort === "price" ? <DoneIcon className="text-green-500 w-6 h-6 " /> : undefined} onClick={() => sort === "price" ? setSort(undefined) : setSort("price")} />
                      </div>
                    </section>

                    <section className="h-full justify-start flex items-center gap-4 flex-col">
                      <label htmlFor='title' className="sr-only ">title</label>
                      <input id="title" className="border w-full border-gray-400 focus:ring-2 p-1 rounded-md focus:border-0 ring-blue-500 outline-none hover:border-black " placeholder='title' value={titleFilter} onChange={(e) => setTitleFilter(e.target.value)} />
                      <div className="flex flex-row w-[300px]">
                        <label htmlFor="category" className="text-sm w-[180px] text-center font-medium text-gray-700">category</label>
                        <select id="category" onChange={(e) => setCategoryFilter(e.target.value)} value={categoryFilter} className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                        <option value={""}>-all-</option>
                          {(categories && categories.length > 0) ? categories.map((category, index) => (
                            <option value={category.name} key={index}>{category.name}</option>
                          )) : null}
                        </select>
                      </div>
                    </section>
                  </Box>
                </Dialog>

              </Box>
              <Button className="bg-blue-600 mr-2 min-w-[150px] text-white shadow-md">
                <Link href="/admin/create-product" className="w-full">Create Product</Link>
              </Button>
            </Box>
            {loading ? <LoaderCircle /> : (
              <TableContainer>
                <Table>
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
                        <TableCell>{dateFormat(row.createdAt)}</TableCell>

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
            )}
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

export default Products;
