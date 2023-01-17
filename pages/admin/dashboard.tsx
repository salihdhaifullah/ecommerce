import Status from '../../src/components/Status';
import Products from '../../src/components/Products';
import UsersPaymentsChart from '../../src/components/UsersPaymentsChart';
import Users from '../../src/components/Users';
import ProductsRateChart from '../../src/components/ProductsRateChart';

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

