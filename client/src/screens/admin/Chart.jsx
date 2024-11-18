import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const LineChartComponent = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const processedData = processChartData(data);
      setChartData(processedData);
    }
  }, [data]);

  const processChartData = (data) => {
    const header = ["Date"];
    const rows = {};

    data.forEach((prediction) => {
      const date = prediction.date;
      const menuItem = prediction.menu_item;
      const predictedDemand = prediction.predicted_demand;

      if (!header.includes(menuItem)) {
        header.push(menuItem);
      }

      if (!rows[date]) {
        rows[date] = { date };
      }

      rows[date][menuItem] = predictedDemand;
    });

    const formattedData = [header];

    Object.keys(rows)
      .sort((a, b) => new Date(a) - new Date(b))
      .forEach((date) => {
        const row = [new Date(date)];
        header.slice(1).forEach((item) => {
          row.push(rows[date][item] || 0);
        });
        formattedData.push(row);
      });

    return formattedData;
  };

  const options = {
    title: "Average Predicted Demand over Time",
    curveType: "function",
    legend: { position: "top" },
    hAxis: {
      title: "Date",
      format: "dd/MM/yyyy",
      gridlines: { count: -1 },
    },
    vAxis: {
      title: "Average Predicted Demand",
    },
    pointSize: 4,
  };

  return (
    <div style={{ width: "100%", margin: "auto", height: "400px" }}>
      {chartData.length > 1 ? (
        <Chart
          chartType="LineChart"
          width="100%"
          height="400px"
          data={chartData}
          options={options}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default LineChartComponent;
