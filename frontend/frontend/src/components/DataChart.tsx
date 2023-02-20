import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    TimeScale,
    Tooltip,
    Legend,
    ChartOptions
  } from 'chart.js';
  import 'chartjs-adapter-date-fns';
  import { enUS } from 'date-fns/locale';
ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
type ChartProps = {
  url: string;
  refreshInterval: number;
};

type DataPoint = {
  timestamp: number;
  value: number;
};

const optionss: ChartOptions<"line"> = {
    plugins: {
        title: {
            display: true,
            text: 'Chart.js Time Scale'
        }
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'second'
            },
            title: {
                display: true,
                text: 'Time'
            }
        },
        y: {
            type: 'linear',
            min: 0,
            max: 100,
            title: {
                display: true,
                text: 'value'
            }
        }
    }
  };
//   options: {
//     plugins: {
//       title: {
//         text: 'Chart.js Time Scale',
//         display: true
//       }
//     },
//     scales: {
//       x: {
//         type: 'time',
//         title: {
//           display: true,
//           text: 'Date'
//         }
//       },
//       y: {
//         title: {
//           display: true,
//           text: 'value'
//         }
//       }
//     },
//   },

const DataChart: React.FC<ChartProps> = ({ url, refreshInterval }) => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(url);
      setData(result.data);
    };

    fetchData();
    const intervalId = setInterval(fetchData, refreshInterval);
    return () => clearInterval(intervalId);
  }, [url, refreshInterval]);

  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: 'Vibration',
        data: data.map(d => d.value),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };
  if (optionss.scales && optionss.scales.y) {
    optionss.scales.y.min = -100;
    optionss.scales.y.max = 100;
  }

  if(optionss.plugins && optionss.plugins.title) {
    optionss.plugins.title.text = 'Machine F: Vibration';
    }

  return <Line options={optionss} data={chartData} />;
};

export default DataChart;