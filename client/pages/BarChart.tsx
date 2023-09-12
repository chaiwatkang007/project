import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as Chartjs, BarElement} from 'chart.js'

Chartjs.register(
  BarElement
)

const DoughnutChart = () => {
  const data = {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  return (
    <div>
    
    </div>
  )
  }
export default DoughnutChart;