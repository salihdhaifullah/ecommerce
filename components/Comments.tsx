import React, { FormEvent, useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import Comment from './Comment';
import { CircularProgress } from '@mui/material';
import { IComment, ICreateComment } from '../types/comment';
import { createComment, getComments } from '../api';



const Comments = ({ id }: { id: number }) => {
    const [comment, setComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [comments, setComments] = useState<IComment[]>([])


    const init = useCallback(async () => {
        await getComments(id).then((res) => { setComments(res.data.comments.comments) }).catch((err) => { console.log(err) })
    }, [id])

    useEffect(() => {
        init()
    }, [init])

    const handelSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data: ICreateComment = { content: comment };
        if (!comment) return;

        setIsLoading(true)
        await createComment(id, data).then((res) => {
            
            console.log(res)
            
        }).catch((err) => {
            console.log(err)
        });
        setIsLoading(false)
    }

    return (
        <motion.div
            initial={{ x: 400, opacity: 0, scale: 0.2 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0.8, x: 700, scale: 1 }}
            className="w-full my-6 grid lg:grid-cols-2 md:grid-cols-2  gap-6  ease-in-out duration-100 transition-all min-h-[50vh] rounded-lg">



            <div className="w-full flex h-[50vh] max-h-fit justify-center items-center rounded-lg drop-shadow-lg bg-white">
                <form onSubmit={(e) => handelSubmitComment(e)} className="w-full p-4">
                    <div className="mb-2">
                        <label htmlFor="comment" className="text-lg text-gray-600">{isUpdate ? "Update comment" : "Add comment"}</label>
                        <textarea
                            className="w-full max-h-[35vh] h-[35vh] min-h-[1vh] p-2 border rounded focus:outline-none focus:ring-gray-300 focus:ring-1"
                            placeholder="Comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        >

                        </textarea>
                    </div>
                    <div className="flex justify-around item-center">
                        {isLoading ? (
                            <button className="text-xs text-blue-100 bg-blue-600 rounded drop-shadow-md
                    hover:bg-white hover:drop-shadow-2xl hover:text-blue-600 hover:rounded-3xl hover:border hover:border-blue-600" disabled>
                                <CircularProgress />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-3 py-2 text-sm text-blue-100 bg-blue-600 rounded drop-shadow-md
                        hover:bg-white hover:drop-shadow-2xl hover:text-blue-600 hover:rounded-3xl hover:border hover:border-blue-600 transition-all duration-[130ms] ease-in-out">
                                {isUpdate ? "Update" : "Comment"}
                            </button>
                        )}

                        <button
                            onClick={() => setComment("")}
                            className="px-3 py-2 text-sm text-blue-600 border border-blue-500 drop-shadow-md 
                    hover:bg-blue-600 hover:drop-shadow-2xl hover:text-white hover:rounded-3xl transition-all duration-[130ms] ease-in-out">
                            Cancel
                        </button>
                    </div>

                </form>
            </div>

            <div className="flex justify-center  items-center gap-6 flex-col h-fit w-full rounded-lg">
                {comments.length > 0 && comments.map((item, index) => (
                    <Comment item={item} key={index} />
                ))}
            </div>
        </motion.div>
    )
}

export default Comments;