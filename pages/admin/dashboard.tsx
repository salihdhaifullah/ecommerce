import Status from '../../components/Status';
import Products from '../../components/Products';
import UsersPaymentsChart from '../../components/UsersPaymentsChart';
import Users from '../../components/Users';
import ProductsRateChart from '../../components/ProductsRateChart';

const Dashboard = () => {
  return (
    <div className="md:p-4 m-1 md:m-4 min-w-[80vw] min-h-[100vh] flex flex-col">
      <Status />
      <Products />
      <ProductsRateChart />
      <hr />
      <Users />
      <UsersPaymentsChart />
    </div>
  )
}

export default Dashboard;

