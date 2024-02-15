import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InterNationalPhoneNumberInput from '../utils/InterNationalPhoneNumberInput';
import { IOrderDetails } from '../../types/cart';
import { InterNationalPhoneNumberInputData } from '../../types/utils';


const CheckOutDetails = ({setDetails}: {setDetails: (input: IOrderDetails) => void}) => {
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [phoneData, setPhoneData] = useState<InterNationalPhoneNumberInputData | null>(null)

    useEffect(() => {
        setDetails({ address1, address2, phoneData })
     }, [phoneData, address1, address2])

    return (
        <div className="h-full gap-4 w-full flex flex-col justify-center items-center" >

                <Box className="flex sm:flex-row gap-4 flex-col w-full justify-center items-center">
                    <TextField className="h-fit w-full" required name="address1" error={address1?.length < 5} value={address1} label="address1" helperText={address1?.length < 5 ? "min length is 5" : "country, city, state"} id="address1" onChange={(e) => setAddress1(e.target.value)} />
                    <TextField className="h-fit w-full" required name="address2" error={address2?.length < 5} value={address2} label="address2" helperText={address2?.length < 5 ? "min length is 5" : "street, apartment, house"} id="address2" onChange={(e) => setAddress2(e.target.value)} />
                </Box>

                <InterNationalPhoneNumberInput setter={setPhoneData} />
        </div>
    )
}

export default CheckOutDetails


