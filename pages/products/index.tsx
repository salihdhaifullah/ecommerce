import Head from 'next/head'
import Row from '../../components/Row';
import { getProducts } from '../../api';

interface IHomeProps {
  products: {
    id: number;
    discount: number;
    price: number;
    title: string;
    imageUrl: string;
  }[];
}

export default function Index({ products }: IHomeProps) {
    return (
      <>
        <Head>
          <title>Products</title>
          <meta name="description" content="Products" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
  
        <div className="flex w-full mt-[200px] h-full justify-center items-center">
        <Row products={products} />
        </div>
      </>
    )
  }
  
  
  export async function getStaticProps() {
    let data = null;
    await getProducts().then((res) => { data = JSON.parse(JSON.stringify(res.data)) })
  
    return {
      props: data,
    }
  }