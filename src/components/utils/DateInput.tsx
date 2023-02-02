import InputLabel from '@mui/material/InputLabel'

const DateInput = ({ label }: { label?: string }) => {

    return (
        <>
            {label ? <InputLabel htmlFor='date-input'>{label}</InputLabel> : null}
            <input
                type="date"
                id='date-input'
                className="bg-gray-50 border outline-none focus:p-[7px] focus:border-blue-500 focus:border-[2px] border-gray-300 hover:border-gray-700  text-gray-900 text-base rounded-md w-fit p-2"
            />
        </>
    )
}

export default DateInput
