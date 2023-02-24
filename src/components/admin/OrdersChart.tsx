import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

const OrdersChart = ({ordersChart}: { ordersChart: { _count: number, verified: boolean}[] }) => {

  const [data, setData] = useState<ChartData<"pie", number[], unknown> | null>(null)

  useEffect(() => {
    if (!ordersChart) return;
    setData({
       labels: ['canceled', 'verified'],
      datasets: [{
          label: '# of Orders',
          data: [ ordersChart[0]._count, ordersChart[1]._count ],
          backgroundColor: [ 'rgb(255, 99, 132)', 'rgb(54, 162, 235)' ]
        }]
      })
  }, [ordersChart])

  ChartJS.register(ArcElement, Tooltip, Legend);

  return (
    <div className='flex justify-center mx-4  items-center my-20'>
      <div className="max-w-[500px] max-h-[500px] w-full p-10 rounded-md bg-white shadow-md">
        {data ? <Pie data={data} className="w-full h-full"/> : null}
      </div>
    </div>
  )
}
export default OrdersChart;
