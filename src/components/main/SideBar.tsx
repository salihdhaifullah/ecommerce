import { useState, useEffect, useContext, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import LoginIcon from '@mui/icons-material/Login';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import useGetUser from '../../hooks/useGetUser';
import { useRouter } from 'next/router';
import { Logout } from '../../api';
import { Context } from '../../context';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

const SideBar = () => {
    const [open, setOpen] = useState(false)
    const [user] = useGetUser()
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()
    const [search, setSearch] = useState("")

    useEffect(() => { setSearch(router.query["search"] as string || "") }, [router.query])

    const handelSearch = async (e: any) => {
        e.preventDefault()
        if (!search) return;
        setOpen(false);
        await router.push(`/search?search=${search}`);
    }

    useEffect(() => { setIsAdmin(user?.role === 'ADMIN') }, [user?.role])

    const { items } = useContext(Context);

    const handelLogout = async () => {
        await Logout()
        localStorage.clear()
        await router.push("/")
        await router.reload()
    }

    return (
        <>
            <div onClick={() => setOpen(!open)} className="block w-8 left-1/2 top-1/2 z-[2] ">

                {items > 0 ? (
                    <div className="w-5 h-5 z-[100] absolute -top-2 -right-2 rounded-full flex items-center justify-center bg-red-600">
                        <p className='text-sm text-white font-semibold'>{items}</p>
                    </div>
                ) : null}

                <span aria-hidden="true" className={`${open && ' -rotate-[130deg] translate-y-[9px] '} block h-[2px] w-8 mb-[7px] bg-current transform transition duration-[400ms] ease-in-out`}></span>
                <span aria-hidden="true" className={`block  h-[2px] w-8 bg-current transform transition duration-[400ms] ease-in-out ${open && 'opacity-0'} `}></span>
                <span aria-hidden="true" className={`${open && ' rotate-[130deg] -translate-y-[9px] '} block h-[2px] w-8 mt-[7px] bg-current transform transition duration-[400ms] ease-in-out`}></span>
            </div>

            <AnimatePresence>
                {
                    open && (
                        <motion.div className="w-64 absolute top-[40px] max-h-fit shadow-xl -right-[0px] overflow-auto " aria-label="Sidebar"
                            initial={{ x: 400, opacity: 0.8, scale: 0.6 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ opacity: 0.8, x: 400, scale: 0.6 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="overflow-y-auto py-4 px-3 bg-gray-50 rounded">
                                <ul className="space-y-2">
                                    <li>
                                        <Link href="/cart" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                            <AddShoppingCartOutlinedIcon className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                                            <span className="flex-1 ml-3 whitespace-nowrap">Cart</span>
                                            {items > 0 ? (
                                                <span className="inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium text-blue-600 bg-blue-200 rounded-full ">{items}</span>
                                            ) : null}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/products" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                            <StorefrontIcon className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                                            <span className="flex-1 ml-3 whitespace-nowrap">Shop</span>
                                        </Link>
                                    </li>
                                    {isAdmin === true && (
                                        <>
                                            <hr />
                                            <li>
                                                <Link href="/admin/create-product" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                                    <CreateOutlinedIcon className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"></CreateOutlinedIcon>
                                                    <span className="flex-1 ml-3 whitespace-nowrap">Create Product</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/admin/dashboard" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                                    <DashboardIcon className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"></DashboardIcon>
                                                    <span className="flex-1 ml-3 whitespace-nowrap">Dashboard</span>
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                    <hr />

                                    {user ? (
                                        <li onClick={handelLogout} className="flex items-center gap-3 p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                            <LogoutOutlinedIcon className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                                            <span>Logout</span>
                                        </li>
                                    ) : (
                                        <li>
                                            <Link href="/sing-up" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                                <LoginIcon className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"></LoginIcon>
                                                <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
                                            </Link>
                                        </li>
                                    )}

                                    <li className="flex justify-center  items-center p-2 md:hidden text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                        <form onSubmit={(e) => handelSearch(e)} className=" relative flex items-center w-full">
                                            <input value={search} onChange={(e) => setSearch(e.target.value)} type="search" className="relative focus:shadow-2xl flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal max-h-fit text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-2xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" />

                                            <Button type="submit" className="min-w-0 w-fit min-h-0 h-fit ml-2 rounded hover:rounded-md  bg-blue-500 hover:bg-blue-400 transition-all">
                                                <SearchIcon className="w-6 h-6 text-white" />
                                            </Button>
                                        </form>
                                    </li>

                                </ul>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence >
        </>
    )
}

export default SideBar
