import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import Comment from './FeedBack';
import { CircularProgress } from '@mui/material';
import { IComment, ICreateComment } from '../types/comment';
import { createComment, deleteComment, getComments, updateComment } from '../api';



const FeedBacks = ({ id }: { id: number }) => {
    const [comment, setComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isUpdateById, setIsUpdateById] = useState<number | null>(null)
    const [comments, setComments] = useState<IComment[]>([]);
    const formRef = useRef<HTMLDivElement>(null)

    const init = useCallback(async () => {
        await getComments(id)
        .then((res) => { setComments(res.data.comments.comments) })
        .catch((err) => { console.log(err) })
    }, [id])

    useEffect(() => {
        if (isUpdateById) {
            setComment(comments.find((comment) => comment.id === isUpdateById)?.content || "")
            scroll(Number(formRef.current?.offsetLeft), (Number(formRef.current?.offsetTop) - 200));
        }
    }, [comments, isUpdateById])

    const handelDelete = async (commentId: number) => {
        await deleteComment(id, commentId)
        .then((res) => { init() })
        .catch((err) => { console.log(err) })
    }

    useEffect(() => {
        init()
    }, [init])

    const handelSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data: ICreateComment = { content: comment };
        if (!comment) return;

        setIsLoading(true)
        if (isUpdateById) {
            await updateComment(id, isUpdateById, data)
            .then((res) => { })
            .catch((err) => { console.log(err) })
        } else {
            await createComment(id, data)
            .then((res) => {})
            .catch((err) => {console.log(err) });
        }
        setIsUpdateById(null)
        setIsLoading(false)
        setComment("")
        init()
    }

    return (
        <motion.div
            initial={{ x: 400, opacity: 0, scale: 0.2 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0.8, x: 700, scale: 1 }}
            className="w-full my-6 grid px-10 lg:grid-cols-2 md:grid-cols-2  gap-6  ease-in-out duration-100 transition-all min-h-[50vh] rounded-lg">

            <div ref={formRef} className="w-full flex h-[50vh] max-h-fit justify-center items-center rounded-lg shadow-lg bg-white">
                <form onSubmit={(e) => handelSubmitComment(e)} className="w-full p-4">
                    <div className="mb-2">
                        <label htmlFor="comment" className="text-lg text-gray-600">{isUpdateById ? "Update comment" : "Add comment"}</label>
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
                            <button className="text-xs  text-blue-100 bg-blue-600 rounded shadow-lg
                    hover:bg-white hover:shadow-2xl hover:text-blue-600 hover:rounded-3xl hover:border hover:border-blue-600" disabled>
                                <CircularProgress />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-3 py-2 text-sm text-blue-100 bg-blue-600 rounded shadow-lg
                        hover:bg-white hover:shadow-lg hover:text-blue-600 hover:rounded-3xl hover:border hover:border-blue-600 transition-all duration-[130ms] ease-in-out">
                                {isUpdateById ? "Update" : "Comment"}
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setComment("")
                                setIsUpdateById(null)
                            }}
                            className="px-3 py-2 text-sm text-blue-600 border border-blue-500 shadow-md 
                    hover:bg-blue-600 hover:shadow-2xl hover:text-white hover:rounded-3xl transition-all duration-[130ms] ease-in-out">
                            Cancel
                        </button>
                    </div>

                </form>
            </div>

            <div className="flex justify-center  items-center gap-6 flex-col h-fit w-full rounded-lg">
                {comments.length > 0 && comments.map((item, index) => (
                    <Comment setIsUpdateById={setIsUpdateById} handelDelete={handelDelete} item={item} key={index} />
                ))}
            </div>
        </motion.div>
    )
}

export default FeedBacks;