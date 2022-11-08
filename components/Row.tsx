import RowChild from './RowChild'

interface IRow {
    products: {
        id: number;
        discount: number;
        price: number;
        title: string;
        imageUrl: string;
    }[];
}

const Row = ({ products }: IRow) => {
    return (
        <div className="w-full flex items-center gap-3  scroll-smooth">
            {products.map((item, index) => (
                <RowChild key={index} index={index} item={item} />
            ))}
        </div >
    )
}

export default Row;