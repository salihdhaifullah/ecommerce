import { useState, useEffect, FormEvent, ChangeEvent, useCallback } from 'react';
import BackupIcon from '@mui/icons-material/Backup';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { createFilterOptions } from '@mui/material/Autocomplete';
import PreviewProduct from '../../components/PreviewProduct';
import { createProduct, getCategoriesAndTags } from '../../api';
import { ICreateProduct } from '../../types/product';
import CircularProgress from '@mui/material/CircularProgress';
import Toast from '../../utils/sweetAlert';
import createResizedImage from '../../utils/image-resizer';

interface ICategory {
    inputValue?: string;
    name: string;
}

interface IDiscountsOptions {
    value: number;
    name: string;
}

const filter = createFilterOptions<ICategory>();
const filter1 = createFilterOptions<string>();

const discountsOptions: IDiscountsOptions[] = [{ value: 0, name: "none" }, { value: 0.1, name: "10%" }, { value: 0.2, name: "20%" }, { value: 0.3, name: "30%" }, { value: 0.4, name: "40%" }, { value: 0.5, name: "50%" }, { value: 0.6, name: "60%" }, { value: 0.7, name: "70%" }, { value: 0.8, name: "80%" }, { value: 0.9, name: "90%" }];
const disableStyle = "bg-gray-100 text-xs sm:text-sm hover:bg-gray-200 text-gray-700 hover:text-gray-600";

const CreateProduct = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [category, setCategory] = useState<ICategory | null>(null)
    const [image, setImage] = useState<string>("");
    const [pieces, setPieces] = useState(1)
    const [price, setPrice] = useState(1)
    const [discount, setDiscount] = useState(0)
    const [images, setImages] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [tagsOptions, setTagsOptions] = useState<ICategory[]>([])
    const [categoriesOptions, setCategoriesOptions] = useState<ICategory[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const init = useCallback(async () => {
        await getCategoriesAndTags()
            .then((res) => {
                setTagsOptions(res.data.tags);
                setCategoriesOptions(res.data.categories);
            })
            .catch((err) => { console.log(err) })
    }, [])

    useEffect(() => { init() }, [init])

    const Validator = useCallback(() => {
        const validation: boolean = Boolean(pieces >= 1 && price >= 1 && title.length >= 6 && content.length >= 20 && (category && category?.name?.length >= 2) && tags.length >= 2 && image);
        if (validation) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [category, content.length, image, pieces, price, tags.length, title.length])

    useEffect(() => { Validator() }, [Validator])

    const handelUploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files ? event.target.files[0] : null;
        if (!file) return Toast.fire("No File Selected", '', "error");
        await createResizedImage(file)
            .then((res) => { setImage(res) })
    }

    const handelUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event?.target?.files
        if (!files) return;
        if (files?.length < 1) return;
        let data: string[] = [];
        for (let file of files) {
            await createResizedImage(file)
                .then((res) => { data.push(res) })
        }
        setImages(data);
    }

    useEffect(() => { setIsLoading(false) }, [])

    const handelSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true)

        const endData: ICreateProduct = {
            title: title,
            content: content,
            tags: tags,
            category: category?.name!,
            image: image,
            images: images,
            pieces: pieces,
            price: price,
            discount: discount,
        }

        await createProduct(endData)
            .then((res) => {
                setTitle("")
                setContent("")
                setTags([])
                setCategory(null)
                setImage("")
                setImages([])
                setPieces(1)
                setPrice(1)
                setDiscount(0)
                Toast.fire(res.data.massage || "Success Product Created", "", 'success')
            })
            .catch((err) => { Toast.fire(err.response.data.massage || "some thing want wrong !", "", 'error') })
        setIsLoading(false)
    }

    return (
        <Box className="flex min-w-full min-h-[100vh] items-center justify-center">
            {category && tags && image && (
                <PreviewProduct
                    setOpen={setOpen}
                    open={open}
                    title={title}
                    tags={tags}
                    category={category}
                    image={image}
                    pieces={Number(pieces)}
                    price={Number(price)}
                    discount={discount}
                    images={images.length ? [...images, image] : [image]}
                    content={content}
                />
            )}
            <Box component="form" onSubmit={(event) => handelSubmit(event)} className='sm:p-10 m-10 gap-4 p-8 flex items-center justify-center flex-col rounded-md shadow-md bg-white'>
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
                                helperText={!(category?.name) ? "Category Is Required" : (category?.name.length < 2 && "Min length is 2")}
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

                <Box className="flex w-full gap-4 flex-wrap sm:flex-nowrap">

                    <div className="w-full">
                        <Button size='small' startIcon={<BackupIcon />} className="text-sm w-full justify-center items-center flex lowercase" variant="contained" component="label">
                            {image ? "uploaded" : "background image"}
                            <input onChange={(event) => handelUploadImage(event)} hidden accept="image/*" type="file" />
                        </Button>

                        {(!image) && (
                            <p className="text-red-600 text-sm font-light">
                                background Image are required
                            </p>
                        )}
                    </div>

                    <div className="w-full">
                        <Button size='small' startIcon={<BackupIcon />} className="text-sm w-full justify-center items-center flex lowercase" variant="contained" component="label">
                            {images.length ? "uploaded" : "images"}
                            <input id="images" onChange={(event) => handelUploadImages(event)} multiple hidden accept="image/*" type="file" />
                        </Button>
                        <InputLabel htmlFor="images" className="text-sm"> upload images for product (optionally) </InputLabel>
                    </div>

                </Box>

                <div className="w-full mb-2">
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

                <div className="w-full flex mt-2 justify-evenly">
                    <Button type="submit" disabled={isLoading || !isValid} className={!isValid ? disableStyle : "bg-blue-600 text-xs sm:text-sm hover:bg-blue-200 shadow-lg shadow-blue-600 text-white hover:text-blue-600"}>
                        {isLoading ? <CircularProgress className="w-4 h-4 text-white" /> : "submit"}
                    </Button>

                    <Button disabled={!isValid} onClick={() => setOpen(true)} className={!isValid ? disableStyle : "bg-green-600 text-xs sm:text-sm hover:bg-green-200 shadow-lg shadow-green-600 text-white hover:text-green-600"}>
                        Preview Product
                    </Button>
                </div>
            </Box>
        </Box>
    )
}

export default CreateProduct;
