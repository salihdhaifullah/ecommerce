import React, { useCallback, useEffect, useState } from 'react'
import { getFeedBacks } from '../../api';
import FeedBack from './FeedBack';
import { IFeedback } from '../../types/feedBack';
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
        <div
            className="my-6 px-4 md:px-10 w-full gap-6 min-h-[50vh]">

            <CreateFeedBack init={init} productId={productId} />

                {feedBacks.length < 1
                    ? null
                    : <div className="flex justify-center mt-10 items-center gap-6 flex-col h-fit w-full rounded-lg">
                            {feedBacks.map((item, index) => (<FeedBack item={item} key={index} />))}
                    </div>}

        </div>
    )
}

export default FeedBacks;
