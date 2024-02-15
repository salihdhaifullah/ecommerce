import { useEffect, useCallback } from 'react';
import { getLikes, likeProduct } from '../../api';
import { useState } from 'react';
import useGetUser from '../../hooks/useGetUser';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';


const Likes = ({ productId }: { productId: number }) => {

    const [isLoadingLike, setIsLoadingLike] = useState(false)
    const [isLikedByUser, setIsLikedByUser] = useState(false)
    const [likes, setLikes] = useState<{ userId: number }[]>([])
    const [user] = useGetUser()

    const handelLike = async () => {
        setIsLoadingLike(true)
        await likeProduct(productId)
            .then((res) => { console.log(res) })
            .catch((err) => { console.log(err) });
        await GetLikes()
        setIsLoadingLike(false)
    }

    const isLikedByUserFunction = useCallback(() => {
        if (user && likes.length > 0 && likes.find((item) => item.userId === user.id)) setIsLikedByUser(true)
        else setIsLikedByUser(false)
    }, [likes, user])

    const GetLikes = useCallback(async () => {
        await getLikes(productId)
            .then((res) => { setLikes(res.data.likes) })
            .catch((err) => { console.log(err) });
    }, [productId])

    const init = useCallback(async () => {
        await GetLikes()
    }, [GetLikes])

    useEffect(() => {
        init()
    }, [init])

    useEffect(() => {
        isLikedByUserFunction()
    }, [isLikedByUserFunction])

    return (
        <motion.button
            whileTap={{ scale: 0.6 }}
            onClick={handelLike}
            className={`${(isLikedByUser && !isLoadingLike) ? "text-red-600 shadow-md shadow-red-500 border-red-300" : "text-slate-300 border-slate-200"} flex-none flex flex-col items-center ease-in-out duration-[50] transition-all justify-center w-10 h-10 rounded-md border`} type="button" aria-label="Like">

            {!isLoadingLike ? (
                <>
                    <svg width="20" height="20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                    </svg>
                    <span className="flex text-xs text-gray-400">{likes.length}</span>
                </>
            ) : (
                <CircularProgress className="w-4 h-4" />
            )}
        </motion.button>
    )
}

export default Likes;
