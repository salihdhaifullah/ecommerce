import { ChangeEvent, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Image from 'next/image';
import countries, { CountryType } from '../../utils/countries';
import IntlTelInput from 'react-intl-tel-input';
import 'react-intl-tel-input/dist/main.css';
import Line from '../utils/Line';
import useIsClickOut from '../../hooks/useIsClickOut';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const CheckOutDetails = () => {
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [countryDefault, setCountryDefault] = useState<CountryType>(countries[230])
    const [phoneNumber, setPhoneNumber] = useState("")
    const [open, setOpen] = useState(false)
    const [eleCallBack] = useIsClickOut(setOpen, () => open)


    const isError = (): boolean => {
        return (!(countryDefault) || !(countryDefault?.label) || !(countryDefault.phone))
    }

    return (
        <div className="w-[90vw] mx-auto h-screen relative flex flex-col justify-center items-center" >
            <Box className="mt-2 mb-1 py-1" >

                <Box className="flex flex-row gap-4 w-full justify-center items-center">
                    <TextField className="h-fit" required name="address1" error={address1?.length < 5} value={address1} label="address1" helperText={address1?.length < 5 ? "min length is 5" : "country, city, state"} id="address1" onChange={(e) => setAddress1(e.target.value)} />
                    <TextField className="h-fit" required name="address2" error={address2?.length < 5} value={address2} label="address2" helperText={address2?.length < 5 ? "min length is 5" : "street, apartment, house"} id="address2" onChange={(e) => setAddress2(e.target.value)} />
                </Box>

                <Box className="flex flex-row w-full my-20 justify-center items-center">



                    <div className="border border-gray-400 z-10 w-[200px] border-r-0 inline-flex flex-row bg-transparent min-h-[56px] -mr-1 mb-[22px] justify-between items-center rounded-sm"
                        onClick={() => setOpen(!open)} >

                        <KeyboardArrowDownIcon className={`w-10 text-gray-600 ease-in-out transition-all h-10 black ${!open ? "rotate-0" : "rotate-180"}`} />
                        <div className='flex flex-row '>
                            <Image className="w-[30px] h-[20px] mr-2" width={100} height={100} src={`https://flagcdn.com/w20/${countryDefault.code.toLowerCase()}.png`} alt="flag" />
                            <span>+{countryDefault.phone}</span>
                        </div>
                    </div>
                    {!open ? null : (
                        <ul ref={eleCallBack} className="h-[300px] ease-in-out transition-all  absolute left-0 z-40 w-[400px] items-start p-2 overflow-y-auto flex flex-col bg-white rounded-md shadow-md">
                            {countries.map((option, index) => {
                                const uniqueValueString = JSON.stringify(option)
                                return (
                                    <>
                                        <li
                                            key={index}
                                            value={uniqueValueString}
                                            onClick={(e) => {
                                                setCountryDefault(JSON.parse(uniqueValueString))
                                                setOpen(!open)
                                            }}
                                            className="flex hover:bg-gray-200 rounded-md cursor-pointer items-center  w-full p-2 flex-row">
                                            <Image className="w-[30px] h-[20px] mr-2" width={50} height={40} src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`} alt="flag" />
                                            <span>{option.label} ({option.code}) +{option.phone}</span>
                                        </li>
                                        <Line />
                                    </>
                                )
                            })}
                        </ul>
                    )}


                    <TextField
                        className="h-full remove_border w-full ring-0 focus:ring-0 "
                        required
                        fullWidth
                        type="tel"
                        error={phoneNumber?.length < 5}
                        label="Phone Number"
                        helperText={phoneNumber?.length < 5 ? "min length is 5" : "Phone Number"}
                    />

                </Box>

            </Box>
        </div>
    )
}

export default CheckOutDetails


