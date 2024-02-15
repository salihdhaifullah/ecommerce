import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

const getData = (data: {isPayUse: boolean, _count: number}[]) => {
  let isPayUse = 0
  let isNotPayUse = 0

  for (let item of data) {
      if (item.isPayUse) {
          isPayUse = item._count
      } else {
          isNotPayUse = item._count
      }
  }

  return [isPayUse, isNotPayUse]
}

const UsersPaymentsChart = ({usersPayment}: { usersPayment: {isPayUse: boolean, _count: number }[] }) => {

  const [data, setData] = useState<ChartData<"pie", number[], unknown> | null>(null)

  useEffect(() => {
    if (!usersPayment) return;
    setData({
      labels: ['Payers', 'none Payers'],
      datasets: [{
          label: 'of Users',
          data: getData(usersPayment),
          backgroundColor: [ 'rgb(255, 99, 132)', 'rgb(54, 162, 235)' ]
         }]
      })
  }, [usersPayment])

  ChartJS.register(ArcElement, Tooltip, Legend);

  return (
    <div className='flex justify-center mx-4  items-center my-20'>
      <div className="max-w-[500px] max-h-[500px] w-full p-10 rounded-md bg-white shadow-md">
        {data ? <Pie data={data} className="w-full h-full"/> : null}
      </div>
    </div>
  )
}
export default UsersPaymentsChart;
