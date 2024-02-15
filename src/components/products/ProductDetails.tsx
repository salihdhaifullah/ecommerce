import Link from 'next/link';


const ProductDetails = ({pieces, category}: {pieces: number, category: string}) => {
    return (
        <div className="flex justify-between w-full h-full items-center flex-row flex-wrap mt-auto">
        <p className="text-gray-700">
            items left <span className="text-blue-600 font-semibold text-lg">{pieces}</span>
        </p>
        <p className="text-gray-700 "> item category{' '}
            <Link href={`/search?category=${category}`}>
                <span className="text-blue-600 hover:underline text-xl font-semibold">{category}</span>
            </Link>
        </p>
    </div>
    )
}

export default ProductDetails;
