import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

const data = {
  labels: ['Red', 'Blue'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)'
      ]
    },
  ],
};


const UsersPaymentsChart = () => {
ChartJS.register(ArcElement, Tooltip, Legend);
  return (
    <div className='flex justify-center sm:justify-start items-center my-20'>
        <div className="w-[500px] h-[500px] p-10 rounded-md bg-white shadow-md">
        <Pie data={data} />
        </div>
    </div>
  )
}
export default UsersPaymentsChart;