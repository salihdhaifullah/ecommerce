import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

interface IDetailsProps {
    details: {
        product: {
            title: string;
            id: number;
        };
        numberOfItems: number;
    }[]
    index: number;
}

const Details = ({ details, index }: IDetailsProps) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) document.getElementById(index + " dev id to scroll")?.scrollIntoView({ inline: 'end', block: 'start', behavior: 'smooth' });
    }, [index, open])

    return (
        open ? (
            <div>
                <Button onClick={() => setOpen(!open)} className="text-xs">
                    Details <ArrowUpwardIcon className="ml-2 w-4 h-4 " />
                </Button >

                <div className="flex flex-col w-fit gap-4 rounded-lg bg-white p-2 justify-center items-center shadow-2xl h-fit m-2 mb-5">
                    <Box>
                        {(!details || details.length < 1) ? (
                            <Box className="flex flex-row rounded-md w-auto break-keep p-2 hover:bg-gray-100 gap-2">
                                <p>None Found !</p>
                            </Box>
                        ) : details.map((item, index) => (
                            <div  key={index}>
                                <Box className="flex flex-row rounded-md w-auto break-keep p-2 hover:bg-gray-100 gap-2">
                                    <p>Quantity {item.numberOfItems}</p>
                                    <Link href={`/products/${item.product.id}`}>
                                        <p className="link">{item.product.title}</p>
                                    </Link>
                                </Box>
                                <hr className="w-full my-2" />
                            </div>
                        ))}
                    </Box>

                    <div className="absolute bottom-[400px]" id={index + " dev id to scroll"}></div>
                </div>
            </div>
        ) : (
            <Button onClick={() => setOpen(!open)} className="text-xs">
                Details <ArrowDownwardIcon className="ml-2 w-4 h-4" />
            </Button >
        )
    )
}

export default Details;