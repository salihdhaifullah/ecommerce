import Status from '../../components/admin/Status';
import Products from '../../components/admin/Products';
import UsersPaymentsChart from '../../components/admin/UsersPaymentsChart';
import Users from '../../components/admin/Users';
import ProductsRateChart from '../../components/admin/ProductsRateChart';
import Line from '../../components/utils/Line';
import HistoryOrders from '../../components/admin/HistoryOrders';
import FeedBacks from './../../components/admin/FeedBacks';

const Dashboard = () => {
  return (
    <div className="md:p-4 m-1 md:m-4 min-w-[80vw] min-h-[100vh] flex flex-col">
      <Status />
      <Products />
      <ProductsRateChart />
      <Line />
      <Users />
      <UsersPaymentsChart />
      <Line />
      <HistoryOrders />
      <Line />
      <FeedBacks />
    </div>
  )
}

export default Dashboard;

