import { useState, useEffect, FormEvent, useCallback } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { updateProduct } from '../../api';
import CircularProgress from '@mui/material/CircularProgress';
import { IUpdateProduct } from '../../types/product';
import { useRouter } from 'next/router';
import Toast from '../../utils/sweetAlert';
import { GetServerSidePropsContext } from 'next';
import prisma from '../../libs/prisma';
import GetUserIdAndRole from '../../utils/auth';


interface ICategory {
  inputValue?: string;
  name: string;
}

interface IDiscountsOptions {
  value: number;
  name: string;
}

interface INITData {
  title: string;
  discount: number;
  id: number;
  price: string;
  pieces: string;
  content: string;
  tags: { name: string; }[];
  category: { name: string; };
}


const filter = createFilterOptions<ICategory>();
const filter1 = createFilterOptions<string>();

const discountsOptions: IDiscountsOptions[] = [{ value: 0, name: "none" }, { value: 0.1, name: "10%" }, { value: 0.2, name: "20%" }, { value: 0.3, name: "30%" }, { value: 0.4, name: "40%" }, { value: 0.5, name: "50%" }, { value: 0.6, name: "60%" }, { value: 0.7, name: "70%" }, { value: 0.8, name: "80%" }, { value: 0.9, name: "90%" }];

const UpdateProduct = ({ tagsOptions, categoriesOptions, data }: { tagsOptions: ICategory[], categoriesOptions: ICategory[], data: INITData }) => {
  const [title, setTitle] = useState(data.title)
  const [content, setContent] = useState(data.content)
  const [tags, setTags] = useState<string[]>(() => {
    const tagsData: string[] = []
    for (let tag of data.tags) { tagsData.push(tag.name) }
    return tagsData;
  })

  const [category, setCategory] = useState<ICategory | null>(data.category)
  const [pieces, setPieces] = useState(Number(data.pieces))
  const [price, setPrice] = useState(Number(data.price))
  const [discount, setDiscount] = useState(Number(data.discount))
  const [isValid, setIsValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()


  useEffect(() => {
    if (pieces >= 1 && price >= 1 && title.length >= 6 && content.length >= 20 && (category && category?.name?.length >= 2) && tags.length >= 2) {
      setIsValid(true)
    } else {
      setIsValid(false);
    }
  }, [category, content.length, pieces, price, tags.length, title.length])

  const handelSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    if (!isValid) return Toast.fire("UnValid Update Product Data", "", 'error');
    if (!data.id) return Toast.fire("Product Not Found", "", 'error');

    const endData: IUpdateProduct = {
      title: title,
      content: content,
      tags: tags,
      category: category?.name as string,
      pieces: pieces,
      price: price,
      discount: discount,
    }

    await updateProduct(data.id, endData)
      .then((res) => {
        Toast.fire(res.data.massage || "Success Product Updated", "", 'success')
        router.back()
      })
      .catch((err) => { Toast.fire(err.response.data.massage || "some thing want wrong", "", 'error') })

    setIsLoading(false)
  }

  return (
    <div className="flex w-full justify-center items-center flex-col">
      <Box component="form" onSubmit={(event) => handelSubmit(event)} className='sm:p-10 m-10 gap-4 p-8 w-fit flex items-center justify-center flex-col rounded-md shadow-md bg-white'>
        <Box className="flex w-full gap-4 flex-wrap sm:flex-nowrap">

          <TextField
            className='w-full'
            error={(title.length < 6)}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            fullWidth
            id="title"
            label="title"
            name="title"
            autoFocus
            helperText="min length is 6 characters"
          />

          <Autocomplete
            className='w-full'
            value={category}
            onChange={(event, newValue) => {
              if (typeof newValue === 'string') setCategory({ name: newValue });
              else if (newValue && newValue.inputValue) setCategory({ name: newValue.inputValue });
              else setCategory(newValue);
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.some((option) => inputValue === option.name);
              if (inputValue !== '' && !isExisting) filtered.push({ inputValue, name: `Add "${inputValue}"` });
              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={categoriesOptions}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              if (option.inputValue) return option.inputValue;
              return option.name;
            }}
            renderOption={(props, option) => <li {...props}>{option.name}</li>}
            sx={{ width: 300 }}
            freeSolo
            renderInput={(params) => (
              <TextField
                error={!(category?.name && category?.name.length > 2)}

                helperText={!(category?.name) ? "Category Is Required" :
                  (category?.name.length < 2 && "Min length is 2")}

                {...params}
                label="category"
              />
            )}
          />

        </Box>

        <Box className="flex w-full gap-4 flex-wrap sm:flex-nowrap">

          <Autocomplete
            className='w-full'
            multiple
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            filterOptions={(options, params) => {
              const filtered = filter1(options, params);
              const { inputValue } = params;
              const isExisting = options.some((option) => inputValue === option);
              if (inputValue !== '' && !isExisting) filtered.push(inputValue);
              return filtered;
            }}
            id="tags"
            options={tagsOptions.map((option) => option.name)}
            freeSolo
            value={tags}
            onChange={(event, value) => setTags(value)}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                // eslint-disable-next-line react/jsx-key
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                error={tags.length < 2}
                helperText="you have to insert at least Two tags"
                {...params}
                label="tags"
                placeholder="tag"
              />
            )}
          />

          <TextField
            id="discount"
            required
            select
            label="discount"
            className="w-full"
            value={discount}
            error={!(`${discount}`)}
            onChange={(event) => setDiscount(Number(event.target.value))}
          >
            {discountsOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box className="flex w-full gap-4 flex-wrap sm:flex-nowrap">
          <TextField
            id="Price"
            label="Price"
            required
            type="number"
            className="w-full"
            value={price}
            onChange={(event) => setPrice(Number(event.target.value))}
            error={price < 1}
            helperText="place insert a price"
          />

          <TextField
            id="Pieces"
            label="Pieces"
            required
            type="number"
            className="w-full"
            value={pieces}
            onChange={(event) => setPieces(Number(event.target.value))}
            error={pieces < 1}
            helperText="place insert a pieces number"
          />
        </Box>

        <div className="w-full flex-1">
          <TextField
            error={content.length < 20}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            id="description"
            helperText="min length is 20 characters"
            label="description"
            name="description"
          />
        </div>

        <div className="w-full inline-flex text-xs sm:text-sm items-start justify-between">
          <Button type="submit" disabled={isLoading || !isValid} className={isValid ? "bg-blue-600 hover:bg-blue-200 shadow-lg shadow-blue-600 text-white hover:text-blue-600" : "bg-gray-100 text-xs sm:text-sm hover:bg-gray-200 text-gray-700 hover:text-gray-600"}>
            {isLoading ? <CircularProgress className="w-4 h-4 text-white" /> : "update"}
          </Button>
          <Button disabled={isLoading} onClick={() => router.back()} className={!isLoading ? "bg-blue-600 hover:bg-blue-200 shadow-lg shadow-blue-600 text-white hover:text-blue-600" : "bg-gray-100 text-xs sm:text-sm hover:bg-gray-200 text-gray-700 hover:text-gray-600"}>
            Cancel
          </Button>
        </div>

      </Box>
    </div>
  )
}

export default UpdateProduct;


export async function getServerSideProps(context: GetServerSidePropsContext) {
  // @ts-ignore
  const { id, error, role } = GetUserIdAndRole(context.req)
  if (error || !id || role !== "ADMIN") return { notFound: true };

  const [categoriesOptions, tagsOptions] = await prisma.$transaction([
    prisma.category.findMany({ select: { name: true } }),
    prisma.tag.findMany({ select: { name: true } })
  ])

  const productId = Number(context.query["id"])

  if (typeof productId !== 'number') return { notFound: true };

  const data = await prisma.product.findFirst({
    where: { id: productId },
    select: {
      title: true,
      discount: true,
      price: true,
      pieces: true,
      id: true,
      content: true,
      tags: { select: { name: true } },
      category: { select: { name: true } }
    }
  });

  if (!data) return { notFound: true };

  return { props: { tagsOptions, categoriesOptions, data: JSON.parse(JSON.stringify(data)) } }
}


