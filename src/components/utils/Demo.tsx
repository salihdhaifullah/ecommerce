import Button from '@mui/material/Button';
import { demoAccount } from '../../api'
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Toast from '../../utils/sweetAlert';

const Demo = () => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handelDemo = async () => {
        setIsLoading(true)
        await demoAccount()
        .then(async ({ data }) => {
          Toast.fire("Successfully SingUp", "", 'success');
            localStorage.setItem("user", JSON.stringify(data.data));
            await router.push("/admin/dashboard")
            router.reload()
          })
          .catch(() => Toast.fire("something want wrong", "", 'error') )
          .finally(() => { setIsLoading(false) })
      }

    return (
        <Button
        variant="contained"
        className='mb-2 bg-[#1976d2] hover:bg-[#1d81e6] text-white'
        >
        {(isLoading) ? (
              <CircularProgress size={28} className='text-white ' />
        ) : <p onClick={handelDemo}>Demo Account</p>}

        </ Button>
    )
}


export default Demo;
