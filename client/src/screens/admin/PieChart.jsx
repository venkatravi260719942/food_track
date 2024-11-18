import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

const PieChart = ({ data }) => {
  const [chartData, setChartData] = useState([
    ["Menu Item", "Predicted Demand"],
  ]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const processedData = processChartData(data);
      setChartData([["Menu Item", "Predicted Demand"], ...processedData]);
    }
  }, [data]);

  const processChartData = (data) => {
    const chartData = [];

    data.forEach((prediction) => {
      const menuItem = prediction.menu_item;
      const predictedDemand = prediction.total_demand;

      const existingItem = chartData.find((item) => item[0] === menuItem);
      if (existingItem) {
        existingItem[1] += predictedDemand;
      } else {
        chartData.push([menuItem, predictedDemand]);
      }
    });

    return chartData;
  };

  return (
    <div style={{ width: "160%" }}>
      <Chart
        chartType="PieChart"
        data={chartData}
        options={{
          // title: "Top 5 dishes for this Week",
          chartArea: { width: "100%", height: "80%" }, // Increase pie chart size
          titleTextStyle: { fontSize: 20, bold: true, alignment: "center" }, // Center and style the title
          // pieHole: 0.4,
          // pieSliceText: "label",
          is3D: true,
        }}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
};

export default PieChart;
