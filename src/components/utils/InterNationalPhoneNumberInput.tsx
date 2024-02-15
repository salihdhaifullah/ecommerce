import { InterNationalPhoneNumberInputData } from '../../types/utils'
import { Fragment, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Image from 'next/image';
import countries, { CountryType } from '../../utils/countries';
import Line from '../utils/Line';
import useIsClickOut from '../../hooks/useIsClickOut';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const InterNationalPhoneNumberInput = ({ setter }: { setter: (val: InterNationalPhoneNumberInputData) => void }) => {
    const [countryDefault, setCountryDefault] = useState<CountryType>(countries[230])
    const [phoneNumber, setPhoneNumber] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [open, setOpen] = useState(false)
    const [eleCallBack] = useIsClickOut(setOpen, () => open)

    const isErrorPhoneNumber = () => phoneNumber?.length < 5

    useEffect(() => {
        if (isErrorPhoneNumber()) return;
        setter({
            phoneCode: countryDefault.phone,
            phoneNumber: phoneNumber,
            country: countryDefault.label
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countryDefault, phoneNumber])


    return (
        <>
            <Box className="flex relative flex-row w-full">

                <Box className={`${isErrorPhoneNumber() ? "border-red-600 text-red-600" : isFocused ? "border-blue-500" : "border-[#0000003b] hover:border-black"} ${!isFocused ? "" : "border-[2px]"} text-gray-500 border rounded-sm bg-transparent flex flex-row w-full min-h-[56px]`}>
                    <div className={`w-full z-10 max-w-[150px] flex flex-row justify-between items-center rounded-sm`}
                        onClick={() => setOpen(!open)} >
                        <KeyboardArrowDownIcon className={`w-9 h-9 text-gray-600 ease-in-out transition-all ${!open ? "rotate-0" : "rotate-180"}`} />
                        <div className='flex flex-row'>
                            <Image className="w-[30px] h-[20px] mr-2" width={150} height={150} src={`https://flagcdn.com/w20/${countryDefault.code.toLowerCase()}.png`} alt="flag" />
                            <span>+{countryDefault.phone}</span>
                        </div>
                    </div>

                    <TextField
                        onFocus={(e) => setIsFocused(true)}
                        onBlur={(e) => setIsFocused(false)}
                        className="h-full w-fit remove_border "
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/^0-9/g, ""))}
                        fullWidth
                        type="tel"
                        placeholder='Phone Number'
                    />

                    <p className=" absolute -bottom-6 left-[50%] text-sm">{phoneNumber?.length < 5 ? "min length is 5" : "Phone Number"}</p>

                </Box>
            </Box>

            {!open ? null : (
                <ul ref={eleCallBack} className="h-[300px] w-[400px] overflow-y-auto flex flex-col ease-in-out transition-all absolute left-0 z-40 p-2 items-start bg-white rounded-sm shadow-md">
                    {countries.map((option, index) => {
                        const uniqueValueString = JSON.stringify(option)
                        return (
                            <Fragment key={index}>
                                <li value={uniqueValueString}
                                    onClick={(e) => {
                                        setCountryDefault(JSON.parse(uniqueValueString))
                                        setOpen(!open)
                                    }}
                                    className="flex hover:bg-gray-200 rounded-md cursor-pointer items-center w-full p-2 flex-row">
                                    <Image className="w-[30px] h-[20px] mr-2" width={150} height={150} src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`} alt="flag" />
                                    <span>{option.label} ({option.code}) +{option.phone}</span>
                                </li>
                                <Line />
                            </Fragment>
                        )
                    })}
                </ul>
            )}
        </>
    )
}

export default InterNationalPhoneNumberInput;
