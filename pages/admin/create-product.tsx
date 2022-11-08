import { useState, useEffect, FormEvent, ChangeEvent, useCallback } from 'react';
import BackupIcon from '@mui/icons-material/Backup';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { IPreviewImage } from '../../types/image';
import imagePreview from '../../functions/imagePreview';
import PreviewProduct from '../../components/PreviewProduct';
import handelProcessImageForSubmitting from '../../functions/ProcessImageForSubmitting';
import uploadImages from '../../functions/uploadImages';
import { createProduct } from '../../api';
import { ICreateProduct } from '../../types/product';


interface ICategory {
    inputValue?: string;
    name: string;
}

interface IDiscountsOptions {
    value: number;
    name: string;
}

const filter = createFilterOptions<ICategory>();

const tagsOptions = [{ name: "awfw" }, { name: "ITfswf" }, { name: "BYGFFH" }, { name: "Fuck" }, { name: "FLoor" }];

const categoriesOptions: ICategory[] = [{ name: 'The Shawshank Redemption' }, { name: 'The Godfather' }, { name: 'The Godfather: Part II' }, { name: 'The Dark Knight' }, { name: '12 Angry Men' }, { name: "Schindler's List" }, { name: 'Pulp Fiction' }];

const discountsOptions: IDiscountsOptions[] = [{ value: 0, name: "none" }, { value: 0.1, name: "10%" }, { value: 0.2, name: "20%" }, { value: 0.3, name: "30%" }, { value: 0.4, name: "40%" }, { value: 0.5, name: "50%" }, { value: 0.6, name: "60%" }, { value: 0.7, name: "70%" }, { value: 0.8, name: "80%" }, { value: 0.9, name: "90%" }];

const CreateProduct = () => {
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [category, setCategory] = useState<ICategory | null>(null)
    const [image, setImage] = useState<IPreviewImage | null>(null);
    const [pieces, setPieces] = useState(1)
    const [price, setPrice] = useState(1)
    const [discount, setDiscount] = useState(0)
    const [images, setImages] = useState<IPreviewImage[]>([])
    const [open, setOpen] = useState(false)
    const [isValid, setIsValid] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const validation: boolean = Boolean(pieces >= 1 && price >= 1 && title.length >= 8 && content.length >= 20 && (category && category?.name?.length >= 2) && tags.length >= 2 && (image && image.fileUrl.length > 10));



    const Validator = useCallback(() => {
        if (validation) setIsValid(true);
        else setIsValid(false);
    }, [validation])


    useEffect(() => {
        Validator()
    }, [Validator])

    const handelUploadImage = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files
        if (!file?.length) return;
        const imageObject = imagePreview(file[0]);
        if (imageObject) setImage(imageObject);
    }

    const handelUploadImages = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event?.target?.files
        if (!files?.length) return;
        let data: IPreviewImage[] = [];

        for (let file of files) {
            const imageObject = imagePreview(file);
            if (imageObject) data.push(imageObject);
        }
        setImages(data);
    }



    const handelSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isValid) return;

        for (let image of images) {
            await uploadImages(image)
        }

        await uploadImages(image as IPreviewImage)


        const endData: ICreateProduct = {
            title: title,
            content: content,
            tags: tags,
            category: category?.name as string,
            image: image?.fileUrl as string,
            images: handelProcessImageForSubmitting(images),
            pieces: pieces,
            price: price,
            discount: discount,
        }

        await createProduct(endData).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })

        console.log(endData);

        setTitle("")
        setContent("")
        setTags([])
        setCategory(null)
        setImage(null)
        setImages([])
        setPieces(1)
        setPrice(1)
        setDiscount(0)
    }

    const getImagesUrl = (): string[] | null => {
        const data: string[] = []
        if (images.length === 0) return null;
        for (let image of images) {
            data.push(image.previewUrl)
        }
        return data;
    }





    return (


        <Container>
            {category && tags && image && (
                <PreviewProduct
                    setOpen={setOpen}
                    open={open}
                    title={title}
                    tags={tags}
                    category={category}
                    image={image?.previewUrl}
                    pieces={Number(pieces)}
                    price={Number(price)}
                    discount={discount}
                    images={getImagesUrl()}
                    content={content}
                />
            )}

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
                                error={!(category?.name && category?.name.length > 8)}

                                helperText={!(category?.name) ? "Category Is Required" :
                                    (category?.name.length > 4 && "Min length is 4")}

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
                        error={!(price)}
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
                        error={!(pieces)}
                        helperText="place insert a pieces number"
                    />
                </Box>

                <Box className="flex mt-4 w-full sm:mb-2">
                    <div className="w-full mr-4">
                        <Button size='small' startIcon={<BackupIcon />} className="text-sm w-full justify-center items-center flex lowercase" variant="contained" component="label">
                            {image ? "uploaded" : "Upload background image"}
                            <input onChange={(event) => handelUploadImage(event)} hidden accept="image/*" type="file" />
                        </Button>

                        {(!image) && (
                            <p className="text-red-600 text-sm font-light">
                                background Image are required
                            </p>
                        )}
                    </div>

                    <div className="w-full ml-4">

                        <Button size='small' startIcon={<BackupIcon />} className="text-sm w-full justify-center items-center flex lowercase" variant="contained" component="label">
                            {images.length ? "uploaded" : "Upload images"}
                            <input id="images" onChange={(event) => handelUploadImages(event)} multiple hidden accept="image/*" type="file" />
                        </Button>
                        <InputLabel htmlFor="images"> upload images for product (optionally) </InputLabel>
                    </div>

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
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-200 shadow-lg shadow-blue-600 text-white hover:text-blue-600">
                                submit
                            </Button>

                            <Button onClick={() => setOpen(true)} className="bg-green-600 hover:bg-green-200 shadow-lg shadow-green-600 text-white hover:text-green-600">
                                Preview Product
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button disabled className="bg-gray-600 hover:bg-gray-200 text-white hover:text-gray-600">
                                submit
                            </Button>

                            <Button disabled className="bg-gray-600 hover:bg-gray-200 text-white hover:text-gray-600">
                                Preview Product
                            </Button>
                        </>
                    )}

                </div>
            </Box>
        </Container >
    )
}

export default CreateProduct;