import Image from 'next/image';
import moment from 'moment'
import { IFeedback } from '../../types/feedBack';
import Rating from '@mui/material/Rating';
import Line from '../utils/Line';


const FeedBack = ({ item }: { item: IFeedback }) => {
    return (
        <section className="justify-center w-fit flex flex-col items-center rounded-lg shadow-lg bg-white px-4 p-2">

            <div className="flex relative w-full items-center">
                <p className="flex text-blue-600 items-center text-base justify-center ml-2">By {item.user.firstName + " " + item.user.lastName}</p>
            </div>

            <Line />

            <article className='flex w-full rounded-lg flex-row items-center'>
                <div className="flex h-9 w-9 rounded-lg justify-center items-center">
                    <Image
                        width={20}
                        height={20}
                        src={`https://avatars.dicebear.com/api/bottts/${item.user.firstName + " " + item.user.lastName}.svg`}
                        alt={"User Profile"} className="object-contain rounded-lg shadow-2xl flex w-full h-full" />
                </div>

                <div className="flex flex-row gap-4">

                    <time className="text-sm ml-2 break-keep font-normal text-gray-600 h-fit flex justify-start items-center">Created at {moment(item.createdAt).format("ll")}</time>

                    <div className="flex w-full justify-end gap-2 flex-row">
                        <Rating name="rate" value={item.rate} readOnly />
                    </div>
                </div>
            </article>

            <p className="text-lg mt-1 p-1 flex place-self-center items-center ml-2 w-full">{item.content}</p>
        </section>
    )
}

export default FeedBack;
