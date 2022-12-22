import Status from '../../components/Status';
import Products from '../../components/Products';
import UsersPaymentsChart from '../../components/UsersPaymentsChart';

const Dashboard = () => {
  return (
    <div className="p-4 m-4 min-w-[80vw] min-h-[100vh] flex flex-col">
      <Status />
      <Products />
      <UsersPaymentsChart />
    </div>
  )
}

export default Dashboard


