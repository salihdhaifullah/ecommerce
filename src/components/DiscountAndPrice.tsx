const DiscountAndPrice = ({discount, price}: {discount: number, price: number}) => {
    return (
        <>
            {discount !== 0 && (
                <div className="shadow-lg max-w-fit rounded-full  -top-7 left-[5%] absolute h-10 items-center justify-center  z-[4] flex ">
                    <p className="text-gray-100 md:text-lg p-1 rounded-full bg-red-600  flex justify-between text-semibold text-base">{String(discount).split(".")[1]}0%</p>
                </div>
            )}

            <div className="bg-gray-800 shadow-lg  max-w-fit rounded-lg  -top-7 right-[5%] px-[6px] absolute h-10 items-center justify-center  z-[4] flex ">

                {discount !== 0 ?
                    (
                        <div className="flex justify-between items-center gap-8 flex-col">
                            <p className='text-lg text-gray-100 font-semibold flex-row flex'>
                                <span className='text-sm text-blue-600'>$</span>
                                <span className="line-through mr-3"> {Number(price).toFixed(2)} </span>
                                <span className='text-sm text-blue-600'>$</span>
                                {Number(price - (price * discount)).toFixed(2)}
                            </p>
                        </div>
                    ) : (
                        <div className="flex justify-between items-center gap-8">
                            <p className='text-lg text-gray-100 font-semibold flex-row flex'>
                                <span className='text-sm text-blue-600'>$</span>{price.toFixed(2)}
                            </p>
                        </div>
                    )}
            </div>
        </>
    )
}

export default DiscountAndPrice;
