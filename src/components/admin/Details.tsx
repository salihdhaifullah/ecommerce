import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import useIsClickOut from '../../hooks/useIsClickOut';
import Line from '../utils/Line';
import { Dialog, DialogTitle } from '@mui/material';

interface IDetailsProps {
    address1: string;
    address2: string;
    phoneNumber: string;
    country: string;
    countryCode: string;
    email: string;
    saleProducts: {
        product: {
            title: string;
            id: number;
        };
        numberOfItems: number;
    }[];
}

const Details = ({ details }: { details: IDetailsProps }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="lowercase relative break-keep p-0">
            <Button onClick={() => setOpen(!open)} className="text-xs">
                Details {open ? <ArrowUpwardIcon className="ml-2 w-4 h-4 " /> : <ArrowDownwardIcon className="ml-2 w-4 h-4" />}
            </Button>
            <Dialog onClose={() => setOpen(false)} open={open}>
                <DialogTitle>payment details</DialogTitle>
                <Box className="flex flex-col min-w-[50vw] h-auto mb-4 gap-4 rounded-lg bg-white py-2 px-4 justify-start items-start">
                    {details.saleProducts.map((item, index) => (
                        <Box key={index} className="flex flex-row rounded-md min-w-full p-2 hover:bg-gray-100 gap-2">
                            <span>{"(" + (index + 1) + ")- "} </span>
                            <p className="break-keep">Quantity {item.numberOfItems}</p>
                            <Link href={`/products/${item.product.id}`}>
                                <p className="link break-keep">{item.product.title}</p>
                            </Link>
                        </Box>
                    ))}
                    <Line />
                    <Box className="gap-4 flex flex-col">
                        <div className="flex flex-row gap-4">
                            <p>address: </p>
                            <span title="address">{details.address1} {" "} {details.address2}</span>
                        </div>
                        <div className="flex flex-row gap-4">
                            <p>country: </p>
                            <span title="country">{details.country}</span>
                        </div>
                        <div className="flex flex-row gap-4">
                            <p>email: </p>
                            <span title="email">{details.email}</span>
                        </div>
                        <div className="flex flex-row gap-4">
                            <p>phone-number: </p>
                            <span title="phone-number">+{details.countryCode} {" "} {details.phoneNumber}</span>
                        </div>
                    </Box>
                </Box>
            </Dialog>
        </div>
    )
}

export default Details;
