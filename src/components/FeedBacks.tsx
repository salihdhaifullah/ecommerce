import React, { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion';
import { getFeedBacks } from '../api';
import FeedBackRate from './FeedBackRate';
import FeedBack from './FeedBack';
import { IFeedback } from '../types/feedBack';
import CreateFeedBack from './CreateFeedBack';


const FeedBacks = ({ productId }: { productId: number }) => {
    const [feedBacks, setFeedBacks] = useState<IFeedback[]>([]);

    const init = useCallback(async () => {
        await getFeedBacks(productId)
            .then((res) => { setFeedBacks(res.data.feedBack.feedBacks) })
            .catch((err) => { console.log(err) })
    }, [productId])

    useEffect(() => {
        init()
    }, [init])

    return (
        <motion.div
            initial={{ x: 400, opacity: 0, scale: 0.2 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ opacity: 0.8, x: 700, scale: 1 }}
            className="w-full my-6 px-10 gap-6 min-h-[50vh]">

            <CreateFeedBack init={init} productId={productId} />

                {feedBacks.length < 1
                    ? null
                    : <div className="flex justify-center mt-10 items-center gap-6 flex-col h-fit w-full rounded-lg">
                            {feedBacks.map((item, index) => (<FeedBack item={item} key={index} />))}
                    </div>}

        </motion.div>
    )
}

export default FeedBacks;
