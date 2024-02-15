import { useState, FormEvent } from 'react';
import { createFeedBack } from '../../api/index';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import CircularProgress from '@mui/material/CircularProgress';
import FeedBackRate from './FeedBackRate';
import useGetUser from '../../hooks/useGetUser';

const buttonClass = "text-gray-50 bg-gradient-to-tr w-fit h-fit font-semibold from-blue-300 to-blue-700"

const CreateFeedBack = ({ init, productId }: { init: () => Promise<void>, productId: number }) => {
    const [rate, setRate] = useState(5);
    const [content, setContent] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [user] = useGetUser()

    const handelSubmitComment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data: { rate: number, content: string } = { content, rate };

        setIsLoading(true)
        await createFeedBack(productId, data)
            .then((res) => { console.log(res) })
            .catch((err) => { console.log(err) });

        setIsLoading(false)
        setContent("")
        setIsOpen(false)
        init()
    }

    const HandelCancel = () => {
        setContent("")
        setIsOpen(false)
    }

    const handelRateChange = (input: number | null): void => {
        if (input === null) { }
        else setRate(input)
    }


    return (


        isOpen ? <div className="flex flex-col w-full p-4 justify-center bg-white rounded-md shadow-md items-center">


            <div className="w-full flex justify-center items-center">
                <form onSubmit={(e) => handelSubmitComment(e)} className="w-full">
                    <div className="mb-2">
                        <label htmlFor="comment" className="text-lg text-gray-600">Add Feedback</label>

                        <textarea
                            id="comment"
                            className="w-full min-h-[35vh] p-2 border rounded focus:outline-none focus:ring-gray-300 focus:ring-1"
                            placeholder="Comment"
                            value={content}
                            autoFocus
                            onChange={(e) => setContent(e.target.value)}
                        ></textarea>

                    </div>

                    <div className="text-gray-500 text-center bg-white shadow-lg border w-fit rounded-md mb-4 p-2 flex flex-row justify-center items-center">
                        <label htmlFor="rating-id">Chose A Rate </label>
                        <Rating
                            id="rating-id"
                            name="rate"
                            className="ml-2"
                            value={rate}
                            onChange={(event, newValue) => handelRateChange(newValue)}
                        />
                    </div>

                    <div className="flex justify-around item-center">
                        {isLoading ? (
                            <Button className="text-xs  text-blue-100 bg-blue-600 rounded shadow-lg
hover:bg-white hover:shadow-2xl hover:text-blue-600 hover:rounded-3xl hover:border hover:border-blue-600" disabled>
                                <CircularProgress className="text-white w-6 h-6" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="px-3 py-2 text-sm text-blue-100 bg-blue-600 rounded shadow-lg
hover:bg-white hover:shadow-lg hover:text-blue-600 hover:rounded-3xl hover:border hover:border-blue-600 transition-all duration-[130ms] ease-in-out">
                                Submit
                            </Button>
                        )}

                        <Button
                            onClick={HandelCancel}
                            className="px-3 py-2 text-sm text-blue-600 border border-blue-500 shadow-md
hover:bg-blue-600 hover:shadow-2xl hover:text-white hover:rounded-3xl transition-all duration-[130ms] ease-in-out">
                            Cancel
                        </Button>
                    </div>

                </form>
            </div>
        </div>
            : <div className="w-full justify-center flex -mt-10 items-center">
                <div className="flex flex-col gap-4 w-fit p-4 justify-center bg-white rounded-md shadow-md items-center">
                    <FeedBackRate productId={productId} />
                    {user && <Button onClick={() => setIsOpen(true)} className={buttonClass}> Give A FeedBack </Button> }
                </div>
            </div>
    )
}

export default CreateFeedBack;
