import { useState, useEffect, FormEvent, ChangeEvent, useCallback } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { getCategoriesAndTags, getProductToUpdate, updateProduct } from '../../api';
import Swal from 'sweetalert2';
import CircularProgress from '@mui/material/CircularProgress';
import { IUpdateProduct } from '../../types/product';
import { useRouter } from 'next/router';


interface ICategory {
  inputValue?: string;
  name: string;
}

interface IDiscountsOptions {
  value: number;
  name: string;
}

const filter = createFilterOptions<ICategory>();

const discountsOptions: IDiscountsOptions[] = [{ value: 0, name: "none" }, { value: 0.1, name: "10%" }, { value: 0.2, name: "20%" }, { value: 0.3, name: "30%" }, { value: 0.4, name: "40%" }, { value: 0.5, name: "50%" }, { value: 0.6, name: "60%" }, { value: 0.7, name: "70%" }, { value: 0.8, name: "80%" }, { value: 0.9, name: "90%" }];

const UpdateProduct = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [category, setCategory] = useState<ICategory | null>(null)
  const [pieces, setPieces] = useState(1)
  const [price, setPrice] = useState(1)
  const [discount, setDiscount] = useState(0)
  const [isValid, setIsValid] = useState(false)

  const [tagsOptions, setTagsOptions] = useState<ICategory[]>([])
  const [categoriesOptions, setCategoriesOptions] = useState<ICategory[]>([])

  const [isLoading, setIsLoading] = useState(false)
  const [productId, setProductId] = useState<number | null>(null)

  const router = useRouter()
  const validation: boolean = Boolean(pieces >= 1 && price >= 1 && title.length >= 8 && content.length >= 20 && (category && category?.name?.length >= 2) && tags.length >= 2);


  const getProductIdQuery = useCallback(() => {
    const id = Number(window.location.href.split("?id=")[1]);
    if (typeof id !== "number") return;
    setProductId(id)
  }, [])

  useEffect(() => {
    getProductIdQuery()
  }, [getProductIdQuery])


  const init = useCallback(async () => {
    await getCategoriesAndTags().then((res) => {
      setTagsOptions(res.data.tags);
      setCategoriesOptions(res.data.categories);
    })

    if (!productId) return;

    await getProductToUpdate(productId).then((res) => {
      const data = res.data.data;
      console.log(data)
      setTitle(data.title);
      setContent(data.content);

      const processedTags: string[] = [];

      for (let tag of data.tags) {
        processedTags.push(tag.name)
      }

      setTags(processedTags);
      setDiscount(data.discount);

      setPieces(data.pieces);
      setPrice(data.price);


      setCategory(data.category);

    }).catch((err) => {
      console.log(err)
    })


  }, [productId])

  useEffect(() => {
    init()
  }, [init])

  const Validator = useCallback(() => {
    if (validation) setIsValid(true);
    else setIsValid(false);
  }, [validation])


  useEffect(() => {
    Validator()
  }, [Validator])


  const handelSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true)
    if (!isValid) return;
    if (!productId) return;

    const endData: IUpdateProduct = {
      title: title,
      content: content,
      tags: tags,
      category: category?.name as string,
      pieces: pieces,
      price: price,
      discount: discount,
    }

    await updateProduct(productId, endData).then((res) => { Swal.fire("success", "product Updated", 'success') })
      .catch((err) => { Swal.fire("error", "some think want wrong", 'error') })

    router.back()
    
    setTitle("")
    setContent("")
    setTags([])
    setCategory(null)
    setPieces(1)
    setPrice(1)
    setDiscount(0)
    setIsLoading(false)
  }



  return (
    <Container>
      <Box component="form" onSubmit={(event) => handelSubmit(event)} className='px-6 sm:p-10 my-10 flex items-center justify-center flex-col py-2 rounded-md shadow-md bg-white'>
        <Box className="flex w-full sm:mb-2">

          <TextField
            className='w-full mb-2 mr-4'
            error={title.length < 8}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
            fullWidth
            id="title"
            label="title"
            name="title"
            autoFocus
            helperText="min length is 8 characters"
          />

          <Autocomplete
            className='w-full  ml-4'
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

        <Box className="flex flex-col sm:flex-row w-full sm:mb-2">

          <Autocomplete
            className='w-full mr-4 mb-2'
            multiple
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
            className=" w-full ml-4"
            value={discount}
            error={!(`${discount}`)}
            onChange={(event) => setDiscount(Number(event.target.value))}
            helperText="Please select a discount"
          >
            {discountsOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box className="flex flex-col sm:flex-row  w-full sm:mb-2">
          <TextField
            id="Price"
            label="Price"
            required
            type="number"
            className="w-full mr-4"
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
            className="w-full ml-4"
            value={pieces}
            onChange={(event) => setPieces(Number(event.target.value))}
            error={pieces < 1}
            helperText="place insert a pieces number"
          />
        </Box>

        <div className="w-full flex-1 sm:ml-2 mb-2 sm:mb-0">
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

        <div className="w-full inline-flex mt-2 justify-evenly">

          {isValid ? (
            <>
              {isLoading ? (
                <Button disabled className="bg-blue-600 hover:bg-blue-200 shadow-lg shadow-blue-600 text-white hover:text-blue-600">
                  <CircularProgress />
                </Button>
              ) : (
                <Button type="submit" className="bg-blue-600 hover:bg-blue-200 shadow-lg shadow-blue-600 text-white hover:text-blue-600">
                  update
                </Button>
              )}
            </>
          ) : (
            <Button disabled className="bg-gray-600 hover:bg-gray-200 text-white hover:text-gray-600">
              update
            </Button>
          )}
        </div>
      </Box>
    </Container >
  )
}

export default UpdateProduct;