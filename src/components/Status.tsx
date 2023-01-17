import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { IStatus } from '../types/dashboard';
import { getStatus } from '../api';
import { useCallback, useEffect, useState } from 'react';

const Status = () => {
    const [status, setStatus] = useState<IStatus | null>(null)

    const init = useCallback(async () => {
        await getStatus()
            .then((res) => { setStatus(res.data) })
            .catch((err) => { console.error(err) });
    }, []);

    useEffect(() => {
        init()
    }, [init])

    return (
        status ? (
            <Box className="w-full gap-4 inline-flex mt-10 justify-evenly items-center">

                <Box className="flex py-4 w-full gap-4 text-white font-semibold flex-col hover-animation-card bg-blue-400 items-center justify-center rounded-md shadow-md h-full text-center">
                    <Typography variant='h6' component='p'>Sales</Typography>
                    <Typography variant='h5' component='p'>{status.sales}</Typography>
                </Box>

                <Box className="flex py-4 w-full gap-4 text-white font-semibold flex-col hover-animation-card bg-blue-400 items-center justify-center rounded-md shadow-md h-full text-center">
                    <Typography variant='h6' component='p'>Total</Typography>
                    <Typography variant='h5' component='p'>{status.total}$</Typography>
                </Box>

                <Box className="flex py-4 w-full gap-4 text-white font-semibold flex-col hover-animation-card bg-blue-400 items-center justify-center rounded-md shadow-md h-full text-center">
                    <Typography variant='h6' component='p'>Users</Typography>
                    <Typography variant='h5' component='p'>{status.users}</Typography>
                </Box>

            </Box>
        ) : null
    )
}

export default Status;
