import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Status = ({ status }: { status: { users: number, sales: number, total: string } }) => {
    return (
        <Box className="w-full gap-4 inline-flex mt-10 justify-evenly items-center">

            <Box className="flex py-4 w-full gap-4 text-white font-semibold flex-col hover-animation-card bg-blue-400 items-center justify-center rounded-md shadow-md h-full text-center">
                <Typography variant='h6' component='p'>Sales</Typography>
                <Typography variant='h5' component='p'>{status.sales}</Typography>
            </Box>

            <Box className="flex py-4 w-full gap-4 text-white font-semibold flex-col hover-animation-card bg-blue-400 items-center justify-center rounded-md shadow-md h-full text-center">
                <Typography variant='h6' component='p'>Total</Typography>
                <Typography variant='h5' component='p'>{Number(status.total) > 1000 ? `k${(Number(status.total) / 1000).toFixed(2)}` : Number(status.total).toFixed(2)}$</Typography>
            </Box>

            <Box className="flex py-4 w-full gap-4 text-white font-semibold flex-col hover-animation-card bg-blue-400 items-center justify-center rounded-md shadow-md h-full text-center">
                <Typography variant='h6' component='p'>Users</Typography>
                <Typography variant='h5' component='p'>{status.users}</Typography>
            </Box>

        </Box>
    )
}

export default Status;
