import { motion } from 'framer-motion'
import SideBar from "./SideBar"
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';

const classes = {
    li: 'text-base text-gray-600 rounded-lg hover:text-blue-600  duration-100 transition-all cursor-pointer ease-in-out',
    p: 'hover:bg-gray-300 rounded-lg transition-all duration-100 text-base ease-in-out cursor-pointer px-2 py-2 mt-1 flex flex-row items-center content-between justify-between'
}


const Header = () => {
    const router = useRouter()
    const [search, setSearch] = useState("")

    useEffect(() => { setSearch(router.query["search"] as string || "") }, [router.query])

    const handelSearch = async (e: any) => {
        e.preventDefault()
        if (!search) return;
        await router.push(`/search?search=${search}`);
    }

    return (
        <header className="px-4  md:px-16 w-screen p-[11px] ease-in-out duration-100 transition-all shadow-md shadow-blue-300  fixed z-50 bg-Blur" >
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
                            <form onSubmit={(e) => handelSearch(e)} className=" relative flex items-center w-full">
                                <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" className="relative duration-200 transition-all focus:w-full ease-in-out focus:min-w-[38vw] rounded-2xl focus:shadow-xl flex-auto block w-full px-3 py-1.5 text-base font-normal max-h-fit text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" />

                                <Button type="submit" className="min-w-0 w-fit min-h-0 h-fit ml-2 rounded hover:rounded-md  bg-blue-500 hover:bg-blue-400 transition-all">
                                    <SearchIcon className="w-6 h-6 text-white" />
                                </Button>
                            </form>
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
