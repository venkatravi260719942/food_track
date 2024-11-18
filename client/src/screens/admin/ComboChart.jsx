import { Chart } from "react-google-charts";

// Process data to get predicted demand
const processData = (data) => {
  const menuItems = [...new Set(data.map((item) => item.menu_item))];
  const branches = [...new Set(data.map((item) => item.branch))];

  // Create an initial data array with headers
  const chartData = [["Menu Item", ...branches]];

  menuItems.forEach((item) => {
    const itemData = data.filter((d) => d.menu_item === item);
    const branchDemands = branches.map((branch) => {
      const branchItem = itemData.find((d) => d.branch === branch);
      return branchItem ? branchItem.predicted_demand : 0;
    });

    chartData.push([item, ...branchDemands]);
  });

  return chartData;
};

const ChartComponent = ({ data }) => {
  const chartData = processData(data);

  const options = {
    vAxis: { title: "Average Predicted Demand" },
    hAxis: { title: "Menu Item" },
    seriesType: "bars",
  };

  return (
    <Chart
      chartType="ComboChart"
      width="100%"
      height="400px"
      data={chartData}
      options={options}
    />
  );
};

export default ChartComponent;
