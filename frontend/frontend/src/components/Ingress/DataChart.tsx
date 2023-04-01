import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale";
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
      text: "Chart.js Time Scale",
    },
  },
  scales: {
    x: {
      type: "time",
      time: {
        unit: "second",
      },
      title: {
        display: true,
        text: "Time",
      },
    },
    y: {
      type: "linear",
      min: 0,
      max: 100,
      title: {
        display: true,
        text: "value",
      },
    },
  },
};

const DataChart: React.FC<ChartProps> = ({
  chartMetadata,
  refreshInterval,
}) => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [options, setOptions] = useState<ChartOptions<"line">>({
    plugins: {
      title: {
        display: true,
        text: "Chart.js Time Scale",
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "second",
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        type: "linear",
        min: 0,
        max: 100,
        title: {
          display: true,
          text: "value",
        },
      },
    },
  });
  const newUrl = `${process.env.REACT_APP_DATAEXPLORER_URL}/api/DataRequest/amount/${chartMetadata?.id}/10`;
  useEffect(() => {
    if(!chartMetadata) return;
    const fetchData = async () => {
      const result = await axios.get(newUrl);
      setData(result.data);
    };

    fetchData();
    const intervalId = setInterval(fetchData, refreshInterval);
    return () => clearInterval(intervalId);
  }, [chartMetadata, refreshInterval]);
  useEffect(() => {
    const min = Math.round(data[0]?.value) - 100;
    const max = Math.round(data[0]?.value) + 100;

    setOptions((prevOptions) => ({
      ...prevOptions,
      scales: {
        ...prevOptions.scales,
        y: {
          min: Number.isNaN(min) ? 0 : min,
          max: Number.isNaN(max) ? 100 : max,
        },
      },
    }));
  }, [data]);

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      plugins: {
        ...prevOptions.plugins,
        title: {
          text: chartMetadata?.name,
        },
      },
    }));
  }, [chartMetadata]);
  
  const chartData = {
    labels: data.map((d) => d.timestamp),
    datasets: [
      {
        label: chartMetadata?.name,
        data: data.map((d) => d.value),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.2,
      },
    ],
  };
  // var min = Math.round(data[0]?.value - 100);
  // var max = Math.round(data[0]?.value + 100);
  // console.log(min, max);
  
  // if (optionss.scales && optionss.scales.y) {
  //   console.log("changing",  Number.isNaN(min),  Number.isNaN(max))
  //   optionss.scales.y.min = Number.isNaN(min) ? 0 : min;
  //   optionss.scales.y.max = Number.isNaN(max) ? 100 : max;
  //   console.log("scales", optionss.scales.y.min, optionss.scales.y.max);
  // }


  // if (optionss.plugins && optionss.plugins.title) {
  //   optionss.plugins.title.text = chartMetadata?.name;
  // }

  return <Line options={options} data={chartData} />;

};

export default DataChart;
