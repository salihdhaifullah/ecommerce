import useGetUser from '../hooks/useGetUser'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import GppGoodIcon from '@mui/icons-material/GppGood';
import Link from 'next/link';

const ThankYou = () => {
    const [user] = useGetUser()

    return (
        <Box className="flex w-full h-full flex-col justify-center items-center">
            <Box className="flex gap-4 w-full h-full flex-col text-center justify-center items-center">
                <GppGoodIcon className="text-blue-600 shadow-lg bg-white text-4xl rounded-md" />
                <Typography variant='h4' component='h1'>Thank You {user ? user.firstName + " " + user.lastName : null} For Paying From Us </Typography>
                <Typography variant='h5' component='h4'>We Hope You Had A Good Experience With Us</Typography>
                <span className="animate-bounce">💙</span>
            </Box>
            <Link href="/products"> <Button>Go To Shop Page ! </Button> </Link>
        </Box>
    )
}

export default ThankYou;
