import { useState, useEffect, useContext, FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import useGetUser from '../hooks/useGetUser';
import { useRouter } from 'next/router';
import { Logout } from '../api';
import { Context } from '../context';
import DashboardIcon from '@mui/icons-material/Dashboard';

const SideBar = () => {
    const [open, setOpen] = useState(false)
    const [user] = useGetUser()
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    const handelSearch = async (e: any) => {
        e.preventDefault()
        const search = e?.target[0]?.value;
        if (typeof search !== "string") return;
        setOpen(false);
        await router.push(`/search?search=${search}`);
    }

    useEffect(() => {
        setIsAdmin(user?.role === 'ADMIN')
    }, [user?.role])

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
                                                <Link href="/admin/users" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                                    <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                                    <span className="flex-1 ml-3 whitespace-nowrap">Users</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/admin/products" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                                    <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path></svg>
                                                    <span className="flex-1 ml-3 whitespace-nowrap">Products</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/admin/create-product" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                                    <CreateOutlinedIcon className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"></CreateOutlinedIcon>
                                                    <span className="flex-1 ml-3 whitespace-nowrap">Create Product</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/admin/history-orders" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                                    <HistoryOutlinedIcon className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900"></HistoryOutlinedIcon>
                                                    <span className="flex-1 ml-3 whitespace-nowrap">History Payments</span>
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
                                                <svg className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm-1 9v-1h5v2H5a1 1 0 01-1-1zm7 1h4a1 1 0 001-1v-1h-5v2zm0-4h5V8h-5v2zM9 8H4v2h5V8z" clipRule="evenodd"></path></svg>
                                                <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
                                            </Link>
                                        </li>
                                    )}

                                    <li className="flex justify-center  items-center p-2 md:hidden text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
                                        <form onSubmit={(e) => handelSearch(e)} className=" relative flex items-center w-full">
                                            <input name="search" id="search" type="search" className="relative focus:shadow-2xl flex-auto min-w-0 block w-full px-3 py-1.5 text-base font-normal max-h-fit text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-2xl transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
                                            <button className=" px-3 ml-2 hover:rounded-lg rounded py-2.5 bg-blue-600 text-white shadow-md hover:bg-blue-600  transition-all flex items-center" type="submit" id="button-addon2">
                                                <svg aria-hidden="true" focusable="false" data-prefix="fas" className="w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                    <path fill="currentColor" d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                                                </svg>
                                            </button>
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
