import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useCallback, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getOrderChart } from '../../api';

const OrdersChart = () => {

  const [data, setData] = useState({
    labels: ['verified', 'canceled'],
    datasets: [
      {
        label: 'of Orders',
        data: [12, 4],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)'
        ]
      },
    ],
  })


  const init = useCallback(async () => {
    await getOrderChart()
      .then((res) => {
        console.log(res)
        setData({ labels: ['verified', 'canceled'], datasets: [ { label: '# of Orders', data: res.data.data, backgroundColor: [ 'rgb(255, 99, 132)', 'rgb(54, 162, 235)' ] } ] }) })
      .catch((err) => { console.log(err) })
  }, [])

  useEffect(() => {
    init()
  }, [init])

  ChartJS.register(ArcElement, Tooltip, Legend);

  return (
    <div className='flex justify-center mx-4  items-center my-20'>
      <div className="max-w-[500px] max-h-[500px] w-full p-10 rounded-md bg-white shadow-md">
        <Pie data={data} className="w-full h-full"/>
      </div>
    </div>
  )
}
export default OrdersChart;
