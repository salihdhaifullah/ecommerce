import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';

const prosesRates = (input: {_avg: { rate: 1 | 2 | 3 | 4 | 5 }, productId: number}[]): number[] => {
  const intitule = [0, 0, 0, 0, 0];

  for (let item of input) {
    intitule[(Math.round(item._avg.rate) - 1)] += 1;
  }
  return intitule;
}

const ProductsRateChart = ({productsRate}: {productsRate: {_avg: { rate: 1 | 2 | 3 | 4 | 5 }, productId: number}[]}) => {

  const [data, setData] = useState<ChartData<"pie", number[], unknown> | null>(null)

  useEffect(() => {
    if (!productsRate) return;
    setData({
      labels: ['One Star', 'Two Stars', 'Three Stars', 'Four Stars', 'Five Stars'],
      datasets: [{
        label: 'of Products',
        data: prosesRates(productsRate),
        backgroundColor: ['rgb(255, 0, 0)', 'rgb(255, 69, 0)', 'rgb(255, 140, 0)', 'rgb(255, 165, 0)', 'rgb(255, 215, 0)']
      }]
    })
  }, [productsRate])

  ChartJS.register(ArcElement, Tooltip, Legend);

  return (
    <div className='flex justify-center mx-4  items-center my-20'>
      <div className="max-w-[500px] max-h-[500px] w-full p-10 rounded-md bg-white shadow-md">
        {data ? <Pie data={data} className="w-full h-full" /> : null}
      </div>
    </div>
  )
}
export default ProductsRateChart;
