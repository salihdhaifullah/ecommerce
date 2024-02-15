import Status from '../../components/admin/Status';
import Products from '../../components/admin/Products';
import UsersPaymentsChart from '../../components/admin/UsersPaymentsChart';
import Users from '../../components/admin/Users';
import ProductsRateChart from '../../components/admin/ProductsRateChart';
import Line from '../../components/utils/Line';
import HistoryOrders from '../../components/admin/HistoryOrders';
import FeedBacks from './../../components/admin/FeedBacks';
import OrdersChart from '../../components/admin/OrdersChart';
import prisma from '../../libs/prisma';
import { GetServerSidePropsContext, GetServerSideProps } from 'next'
import GetUserIdAndRole from './../../utils/auth';
import Loader from '../../components/utils/Loader';

interface IData {
  feedbacks: {
    id: number;
    createdAt: Date;
    rate: number;
    content: string;
    product: {
      id: number;
      title: string;
    };
    user: {
      firstName: string;
      lastName: string;
    };
  }[];
  orders: {
    id: number;
    createdAt: Date;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
    totalPrice: string;
    verified: boolean;
    received: boolean;
    address1: string;
    address2: string;
    phoneNumber: string;
    country: string;
    countryCode: string;
    saleProducts: {
      product: {
        id: number;
        title: string;
      };
      numberOfItems: number;
    }[]
  }[];
  ordersChart: {
    _count: number;
    verified: boolean;
  }[];
  products: {
    id: number;
    createdAt: Date;
    title: string;
    likes: { id: number}[];
    price: string;
    pieces: string;
    category: {
      name: string;
    };
  }[];
  status: {
    sales: number;
    total: string;
    users: number;
  }
  users: {
    createdAt: Date;
    firstName: string;
    lastName: string;
    email: string;
    payment: {
      totalPrice: string;
    }[];
  }[]
  productsRateChart: {
    _avg: { rate: 1 | 2 | 3 | 4 | 5 };
    productId: number
  }[]

  usersPaymentChart: {
    _count: number
    isPayUse: boolean
  }[]
  categories: { name: string }[]
  usersCount: number;
  feedbacksCount: number;
  ordersCount: number;
  productsCount: number;
}

const Dashboard = ({ data }: { data: IData }) => {

  return (
    <div className="md:p-4 m-1 md:m-4 min-w-[80vw] min-h-[100vh] flex flex-col">
      {!data ? <Loader /> : (
        <>
          <Status status={data.status} />
          <Products count={data.productsCount} productsInit={data.products} categories={data.categories}/>
          <ProductsRateChart productsRate={data.productsRateChart} />
          <Line />
          <Users count={data.usersCount} usersInit={data.users}/>
          <UsersPaymentsChart usersPayment={data.usersPaymentChart} />
          <Line />
          <HistoryOrders count={data.ordersCount} ordersInit={data.orders}/>
          <OrdersChart ordersChart={data.ordersChart} />
          <Line />
          <FeedBacks count={data.feedbacksCount} feedBacksInit={data.feedbacks} />
        </>
      )}
    </div>
  )
}

export default Dashboard;

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSideProps> {

  // @ts-ignore
  const { id, error, role } = GetUserIdAndRole(context.req)
  // @ts-ignore
  if (error || !id || role !== "ADMIN") return { notFound: true };

  const [feedbacks, feedbacksCount, orders, ordersCount, ordersChart, products, productsCount, sales, total, usersCount, users, productsRateChart, usersPaymentChart, categories] = await prisma.$transaction([
    prisma.feedBack.findMany({
      take: 10,
      select: {
        id: true,
        createdAt: true,
        product: { select: { title: true, id: true } },
        user: { select: { firstName: true, lastName: true } },
        rate: true,
        content: true
      }
    }),
    prisma.feedBack.count(),
    prisma.sale.findMany({
      take: 10,
      select: {
        user: { select: { firstName: true, lastName: true, email: true } },
        saleProducts: {
          select: {
            numberOfItems: true,
            product: { select: { title: true, id: true } }
          },
        },
        totalPrice: true,
        id: true,
        verified: true,
        received: true,
        address1: true,
        address2: true,
        phoneNumber: true,
        country: true,
        countryCode: true,
        createdAt: true
      },
    }),
    prisma.sale.count(),
    // @ts-ignore
    prisma.sale.groupBy({ by: ["verified"], _count: true }),
    prisma.product.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        likes: { select: { id: true } },
        price: true,
        pieces: true,
        createdAt: true,
        category: { select: { name: true } }
      }
    }),
    prisma.product.count(),
    prisma.sale.count({ where: { verified: true } }),
    prisma.sale.aggregate({ _sum: { totalPrice: true }, where: { verified: true } }),
    prisma.user.count(),

    prisma.user.findMany({
      take: 10,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
        payment: { select: { totalPrice: true }, where: { verified: true } }
      }
    }),
    // @ts-ignore
    prisma.feedBack.groupBy({ by: ["productId"], _avg: { rate: true } }),
    // @ts-ignore
    prisma.user.groupBy({ by: ['isPayUse'], _count: true }),
    prisma.category.findMany({
      where: { product: { some: {} } },
      select: { name: true }
    })
  ])

  const data = {
    feedbacks,
    orders,
    ordersChart: ordersChart,
    products,
    status: { sales, total: total._sum.totalPrice, users: usersCount },
    users,
    productsRateChart,
    usersPaymentChart,
    categories,
    usersCount,
    feedbacksCount,
    ordersCount,
    productsCount
  }

  console.log(productsRateChart)

  return {
    // @ts-ignore
    props: { data: JSON.parse(JSON.stringify(data)) as IData || null }
  };
}
