import Image from 'next/image';
import moment from 'moment'
import { IFeedback } from '../types/feedBack';
import Rating from '@mui/material/Rating';
import Line from './Line';


const FeedBack = ({ item}: {item: IFeedback}) => {
    return (
        <section className="justify-center w-full flex flex-col items-center rounded-lg shadow-lg bg-white px-4 p-2">

            <div className="flex cursor-pointer relative w-full items-center">
                <p className="flex text-blue-600  items-center justify-center ml-2">{item.user.firstName + " " + item.user.lastName}</p>
            </div>

            <Line />

            <main className='flex w-full rounded-lg flex-row justify-between items-center'>
                <div className="flex h-9 w-9 rounded-lg justify-center items-center">
                    <Image
                        width={20}
                        height={20}
                        src={`https://avatars.dicebear.com/api/bottts/${item.user.firstName + " " + item.user.lastName}.svg`}
                        alt={"User Profile"} className="object-contain rounded-lg shadow-2xl flex w-full h-full" />
                </div>
                <time className='flex place-self-center items-center ml-2 text-sm w-full'>{moment(item.createdAt).format("ll")}</time>
            </main>

            <Rating name="rate" value={item.rate} disabled />
            <p className="text-lg p-1 flex place-self-center items-center ml-2 w-full">{item.content}</p>
        </section>
    )
}

export default FeedBack;
