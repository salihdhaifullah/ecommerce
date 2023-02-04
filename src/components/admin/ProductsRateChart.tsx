import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useCallback, useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getProductsAverageRate } from '../../api';

const prosesRates = (input: { avg: 1 | 2 | 3 | 4 | 5 }[]): number[] => {
  const intitule = [0, 0, 0, 0, 0];
  for (let item of input) {
    intitule[(item.avg - 1)] += 1;
  }
  return intitule;
}

const ProductsRateChart = () => {
  const initial = {
    labels: ['One Star', 'Two Stars', 'Three Stars', 'Four Stars', 'Five Stars'],
    datasets: [{
        label: 'of Products', data: [1, 3, 6, 12, 7],
        backgroundColor: ['rgb(255, 0, 0)', 'rgb(255, 69, 0)', 'rgb(255, 140, 0)', 'rgb(255, 165, 0)', 'rgb(255, 215, 0)']
      }]
  }


  const [data, setData] = useState(initial)

  const init = useCallback(async () => {
    await getProductsAverageRate()
      .then((res) => {
        setData({
          labels: ['One Star', 'Two Stars', 'Three Stars', 'Four Stars', 'Five Stars'],
          datasets: [{
            label: 'of Products',
            data: prosesRates(res.data.data),
            backgroundColor: ['rgb(255, 0, 0)', 'rgb(255, 69, 0)', 'rgb(255, 140, 0)', 'rgb(255, 165, 0)', 'rgb(255, 215, 0)']
          }]
        })
      })
      .catch((err) => { console.log(err) })
  }, [])

  useEffect(() => {
    init()
  }, [init])

  ChartJS.register(ArcElement, Tooltip, Legend);

  return (
    <div className='flex justify-center mx-4  items-center my-20'>
      <div className="max-w-[500px] max-h-[500px] w-full p-10 rounded-md bg-white shadow-md">
        <Pie data={data} className="w-full h-full" />
      </div>
    </div>
  )
}
export default ProductsRateChart;
