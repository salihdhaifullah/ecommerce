import React, { FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion';
import { CircularProgress } from '@mui/material';
import { createFeedBack, deleteFeedBack, getFeedBacks, updateFeedBack } from '../api';
import FeedBackRate from './FeedBackRate';
import FeedBack from './FeedBack';
import Rating from '@mui/material/Rating'
import Button from '@mui/material/Button'
import { ICreateFeedback, IFeedback } from '../types/feedBack';


const FeedBacks = ({ productId }: { productId: number }) => {
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [feedBackId, setFeedBackId] = useState<number | null>(null)
    const [feedBacks, setFeedBacks] = useState<IFeedback[]>([]);
    const [rate, setRate] = useState(5);

    const formRef = useRef<HTMLDivElement>(null)

    const init = useCallback(async () => {
        await getFeedBacks(productId)
            .then((res) => { setFeedBacks(res.data.feedBack.feedBacks) })
            .catch((err) => { console.log(err) })
    }, [productId])

    useEffect(() => {
        if (feedBackId) {
            setContent(feedBacks.find((item) => item.id === feedBackId)?.content || "")
            scroll(Number(formRef.current?.offsetLeft), (Number(formRef.current?.offsetTop) - 200));
        }
    }, [feedBacks, feedBackId])

    const handelDelete = async (id: number) => {
        await deleteFeedBack(id)
            .then((res) => { init() })
            .catch((err) => { console.log(err) })
    }

    useEffect(() => {
        init()
    }, [init])

    const handelSubmitComment = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data: ICreateFeedback = { content, rate };

        setIsLoading(true)
        if (feedBackId) {
            await updateFeedBack(feedBackId, data)
                .then((res) => { console.log(res) })
                .catch((err) => { console.log(err) })
        }

        else {
            await createFeedBack(productId, data)
                .then((res) => { console.log(res) })
                .catch((err) => { console.log(err) });
        }
        setFeedBackId(null)
        setIsLoading(false)
        setContent("")
        init()
    }

    const HandelCancel = () => {
        setContent("")
        setFeedBackId(null)
    }

    const handelRateChange = (input: number | null): void => {
        if (input === null) { }
        else setRate(input)
    }

    return (
        <motion.div
            initial={{ x: 400, opacity: 0, scale: 0.2 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0.8, x: 700, scale: 1 }}
            className="w-full my-6 grid px-10 lg:grid-cols-2 md:grid-cols-2  gap-6  ease-in-out duration-100 transition-all min-h-[50vh] rounded-lg">

            <FeedBackRate productId={productId} />

            <Button className="bg-gradient-to-tr text-gray-800 font-semibold from-blue-300 to-blue-700">
                Give A FeedBack
            </Button>

            <div ref={formRef} className="w-full flex h-[50vh] max-h-fit justify-center items-center rounded-lg shadow-lg bg-white">
                <form onSubmit={(e) => handelSubmitComment(e)} className="w-full p-4">
                    <div className="mb-2">
                        <label htmlFor="comment" className="text-lg text-gray-600">{feedBackId ? "Update comment" : "Add comment"}</label>
                        <textarea
                            className="w-full max-h-[35vh] h-[35vh] min-h-[1vh] p-2 border rounded focus:outline-none focus:ring-gray-300 focus:ring-1"
                            placeholder="Comment"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        >

                        </textarea>
                    </div>
                    <Rating
                        name="rate"
                        value={rate}
                        onChange={(event, newValue) => handelRateChange(newValue)}
                    />
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
                                {feedBackId ? "Update" : "Comment"}
                            </button>
                        )}

                        <button
                            onClick={HandelCancel}
                            className="px-3 py-2 text-sm text-blue-600 border border-blue-500 shadow-md
                    hover:bg-blue-600 hover:shadow-2xl hover:text-white hover:rounded-3xl transition-all duration-[130ms] ease-in-out">
                            Cancel
                        </button>
                    </div>

                </form>
            </div>

            <div className="flex justify-center items-center gap-6 flex-col h-fit w-full rounded-lg">
                {feedBacks.length < 1
                    ? null
                    : feedBacks.map((item, index) => (
                        <FeedBack setFeedBackId={setFeedBackId} handelDelete={handelDelete} item={item} key={index} />
                    ))}
            </div>
        </motion.div>
    )
}

export default FeedBacks;
