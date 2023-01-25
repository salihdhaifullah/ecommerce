import RowChild from './RowChild'

interface IRow {
    products: {
        id: number;
        discount: number;
        price: number;
        title: string;
        imageUrl: string;
    }[];
    category: string
}

const Row = ({ products, category }: IRow) => {
    return (
        <div className="min-w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-center items-center gap-6">
            {products && products.length && products.map((item, index) => (
                <RowChild key={index} index={index} item={item} />
            ))}
        </div >
    )
}

export default Row;
