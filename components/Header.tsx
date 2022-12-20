import { motion } from 'framer-motion'
import SideBar from "./SideBar"
import CircularProgress from '@mui/material/CircularProgress';
import Link from 'next/link';
import Image from 'next/image';


const Header = () => {
  
    const classes = {
        li: 'text-base text-gray-600 rounded-lg hover:text-blue-600  duration-100 transition-all cursor-pointer ease-in-out',
        p: 'hover:bg-gray-300 rounded-lg transition-all duration-100 text-base ease-in-out cursor-pointer px-2 py-2 mt-1 flex flex-row items-center content-between justify-between'
    }

    return (
        <header className={` px-4  md:px-16 w-screen p-[11px] ease-in-out duration-100 transition-all shadow-md shadow-blue-300  fixed z-50 bg-Blur`} >
            <div className="hidden h-full w-full md:flex justify-center ">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/logo.png" width={40} height={40} alt='logo' className='w-9 cursor-pointer object-cover' />
                    <p className='font-bold text-xl text-gray-800 cursor-pointer'> Selexome </p>
                </Link>
                <div className="flex justify-end w-full gap-8 items-center">
                    <motion.ul
                        initial={{ opacity: 0, x: 200 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 200 }}
                        className='flex items-center gap-8'>


                        <li className="flex justify-center">
                            <div className="  flex  ">
                                <div className=" relative flex items-center w-full">
                                    <input type="search" className="relative duration-200 transition-all focus:w-full ease-in-out focus:min-w-[38vw] rounded-2xl focus:shadow-xl flex-auto block w-full px-3 py-1.5 text-base font-normal max-h-fit text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />

                                    {false ? (
                                        <button className=" px-3 ml-2 hover:rounded-2xl rounded py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center" type="button" id="button-addon2">
                                            <CircularProgress />
                                        </button>
                                    ) : (
                                        <button className=" px-3 ml-2 hover:rounded-2xl rounded py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700  focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex items-center" type="button" id="button-addon2">
                                            <svg aria-hidden="true" focusable="false" data-prefix="fas" className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                                            </svg>
                                        </button>
                                    )}

                                </div>
                            </div>
                        </li>
                        <li className={classes.li}>
                            <motion.img className='w-10 rounded-full ease-in-out cursor-pointer shadow-xl h-10 min-w-[40px] min-h-[40px]'
                                whileTap={{ scale: 0.6, rotate: 180 }} src={`https://avatars.dicebear.com/api/bottts/${"hello world"}.svg`} alt='profile'
                            />
                        </li>
                        <li className=' text-base text-gray-600 duration-100 transition-all cursor-pointer ease-in-out relative mr-4'>
                            <SideBar />
                        </li>

                    </motion.ul>
                </div>
            </div>





            {/*  mobil view  */}

            <motion.ul
                initial={{ opacity: 0, x: 200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 200 }}
                className='flex items-center relative justify-between md:hidden'>


                <li className={classes.li}>
                    <motion.img className='w-10 rounded-full ease-in-out cursor-pointer shadow-xl h-10 min-w-[40px] min-h-[40px]'
                        whileTap={{ scale: 0.6, rotate: 180 }} src={`https://avatars.dicebear.com/api/bottts/${"hello world"}.svg`} alt='profile' />
                </li>

                <li className='text-base text-gray-600 duration-100 transition-all cursor-pointer ease-in-out'>
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/images/logo.png" width={40} height={40} alt='logo' className='w-9 cursor-pointer object-cover' />
                        <p className='font-bold text-xl text-gray-800 cursor-pointer'> Selexome </p>
                    </Link>
                </li>



                <li className=' text-base text-gray-600 duration-100 transition-all cursor-pointer ease-in-out relative mr-4 '>
                    <SideBar />
                </li>
            </motion.ul>
        </header >
    )
}

export default Header;