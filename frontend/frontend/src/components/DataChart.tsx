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
  refreshInterval: number;
  chartMetadata: any;
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

const DataChart: React.FC<ChartProps> = ({ chartMetadata, refreshInterval}) => {
  const [data, setData] = useState<DataPoint[]>([]);
    const newUrl = `http://localhost:5292/api/DataRequest/amount/${chartMetadata?.topic}/10`
  useEffect(() => {
    const fetchData = async () => {

      const result = await axios.get(newUrl);
      setData(result.data);
    };

    fetchData();
    const intervalId = setInterval(fetchData, refreshInterval);
    return () => clearInterval(intervalId);
  }, [chartMetadata, refreshInterval]);

  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: chartMetadata?.name,
        data: data.map(d => d.value),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.2
      }
    ]
  };
  if (optionss.scales && optionss.scales.y) {
    optionss.scales.y.min = 0;
    optionss.scales.y.max = 100;
  }

  if(optionss.plugins && optionss.plugins.title) {
    optionss.plugins.title.text = chartMetadata?.name;
    }

  return <Line options={optionss} data={chartData} />;
};

export default DataChart;