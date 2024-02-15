import { FormEvent, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from "next/link";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { NextPage } from 'next';
import { singUp } from '../api'
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import FormControl from '@mui/material/FormControl';
import { useRouter } from 'next/router';
import Toast from '../utils/sweetAlert';
import Demo from '../components/utils/Demo';


const SingUp: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    event.preventDefault();

    await singUp({ password, firstName, lastName, email })
    .then(async ({ data }) => {
      Toast.fire("Successfully SingUp", "", 'success');
      localStorage.setItem("user", JSON.stringify(data.data));
      await router.push("/products")
      router.reload()
    })
    .catch(({ response }: any) => Toast.fire(response.data.massage || "something want wrong", "", 'error') )

    setIsLoading(false)
    setLastName("")
    setFirstName("")
    setPassword("")
    setEmail("")
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };



  return (
    <Container component="main" className='w-full h-full mt-20 flex justify-center items-center'>
      <CssBaseline />
      <Box
        className='rounded-md bg-white shadow-lg w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] p-8 h-full flex justify-center items-center flex-col mt-2'>
        <Avatar className="bg-blue-600 shadow-md">
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            type="email"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <FormControl className='w-full' variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              required
              fullWidth
              name="password"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

            <div className="inline-flex">
            <TextField
            margin="normal"
            required
            fullWidth
            className="mr-3"
            name="First-Name"
            label="First-Name"
            type="First-Name"
            id="First-Name"
            autoComplete="currentFirst-Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="Last-Name"
            label="Last-Name"
            type="Last-Name"
            id="Last-Name"
            autoComplete="currentLast-Name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
            </div>

          <Button
            type={(isLoading) ? "reset" : "submit"}
            fullWidth
            variant="contained"
            className='mt-3 mb-4 bg-[#1976d2] hover:bg-[#1d81e6] text-white'
          >
            {(isLoading) ? (
              <CircularProgress size={28} className='text-white ' />
            ) : "Sing up"}
          </Button>

          <Demo />
          <Grid container>
            <Grid item>
              <Link href='login'>
                <p className='link'>already have an account? Login</p>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SingUp;
