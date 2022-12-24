import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useCallback, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getUsersPayers } from '../api';

const UsersPaymentsChart = () => {

  const [data, setData] = useState({
    labels: ['Payers', 'none Payers'],
    datasets: [
      {
        label: 'of Users',
        data: [9, 35],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)'
        ]
      },
    ],
  })


  const init = useCallback(async () => {
    await getUsersPayers()
      .then((res) => { setData({ labels: ['Payers', 'none Payers'], datasets: [ { label: '# of Users', data: res.data.data, backgroundColor: [ 'rgb(255, 99, 132)', 'rgb(54, 162, 235)' ] } ] }) })
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
export default UsersPaymentsChart;