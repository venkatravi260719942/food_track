import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import dayjs from "dayjs";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "antd";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "../../styles/admin/demandForecasting.css";
import LineChartComponent from "./Chart";
import PieChart from "./PieChart";
import ChartComponent from "./ComboChart";
import API_ENDPOINTS from "../../config/url.config";

const SalesForecast = () => {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [demandData, setDemandData] = useState([]);
  const [staticDemandData, setStaticDemandData] = useState([]);
  const [topDishesData, setTopDishesData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [chartloading, setchartLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [branch, setBranch] = useState("all");

  const { RangePicker } = DatePicker;

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchOptions("menuItem");
    fetchOptions("season");
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    const dateNextWeek = addWeekToDate(currentDate);

    const formattedCurrentDate = formatDate(currentDate);
    const formattedDateNextWeek = formatDate(dateNextWeek);

    const topDishes = {
      start_date: formattedCurrentDate,
      end_date: formattedDateNextWeek,
      branch: branch,
      season: "all",
      top_n: 5,
    };

    const forecastBodyData = {
      start_date: formattedCurrentDate,
      end_date: formattedDateNextWeek,
      branch: "all",
      season: "all",
      menu_item: "all",
      interval: "weekly",
    };

    const popToast = toast.loading("Please wait...");

    try {
      fetchTopDishes(topDishes);
      fetchPredicteddata(forecastBodyData)
        .then((data) => {
          setStaticDemandData(data);
          setchartLoading(false);
          toast.dismiss(popToast);
        })
        .finally(() => {
          setchartLoading(false);
        });
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching data");
      setLoading(false);
    }
  }, [branch]);

  const fetchTopDishes = async (topDishes) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.server.topdishes}`,
        topDishes
      );
      setTopDishesData(response.data.top_dishes);
    } catch (error) {
      console.error("Error fetching top dishes:", error);
    }
  };
  const handleBranchChange = (event) => {
    setBranch(event.target.value);
  };
  const fetchPredicteddata = async (data) => {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.server.forecast}`,
        data
      );
      return response.data.predictions;
    } catch (error) {
      console.error("Error fetching predicted data:", error);
    }
  };

  const fetchOptions = async (optionFor) => {
    try {
      const storedToken = Cookies.get("token");
      const response = await axios.get(
        `${API_ENDPOINTS.SalesForecast.salesForecast}/${optionFor}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      if (optionFor === "menuItem") setMenuItems(response.data);
      if (optionFor === "season") setSeasons(response.data);
    } catch (error) {
      console.error(`Error fetching ${optionFor}:`, error);
    }
  };

  const formik = useFormik({
    initialValues: { branch: "", menu_item: "", season: "all" },
    validationSchema: Yup.object({
      branch: Yup.string().required("Branch is required"),
      menu_item: Yup.string().required("Menu Item is required"),
      season: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        setchartLoading(true);
        await predictedData(values);
        setShowChart(true);
      } catch (error) {
        console.error("Error submitting form:", error.message);
      } finally {
        setchartLoading(false);
      }
    },
  });

  const predictedData = async (values) => {
    const interval = calculateInterval(fromDate, toDate);

    const data = {
      ...values,
      start_date: fromDate,
      end_date: toDate,
      interval,
    };
    console.log(data);

    try {
      fetchPredicteddata(data).then(setDemandData);
    } catch (error) {
      console.error("Error fetching predicted data:", error);
    }
  };

  const calculateInterval = (fromDate, toDate) => {
    const monthDiff = dayjs(toDate).diff(dayjs(fromDate), "month");
    const yearDiff = dayjs(toDate).diff(dayjs(fromDate), "year");
    console.log(monthDiff);
    if (monthDiff <= 1) return "weekly";
    return yearDiff >= 2 ? "yearly" : "monthly";
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const addWeekToDate = (date) => {
    const resultDate = new Date(date);
    resultDate.setDate(resultDate.getDate() + 7);
    return resultDate;
  };
  const staticDemandColumns = [
    { field: "date", headerName: "Date", width: 110 },
    { field: "branch", headerName: "Branch", width: 90 },
    { field: "menuItem", headerName: "Menu Item", width: 190 },
    { field: "demand", headerName: "Demand", width: 130 },
  ];
  const staticdemandRows = staticDemandData.map((item, index) => ({
    id: index + 1,
    date: item.date,
    branch: item.branch,
    menuItem: item.menu_item,
    season: item.season,
    demand: item.predicted_demand,
  }));
  const demandColumns = [
    { field: "date", headerName: "Date", width: 110 },
    { field: "branch", headerName: "Branch", width: 90 },
    { field: "menuItem", headerName: "Menu Item", width: 190 },
    { field: "demand", headerName: "Demand", width: 130 },
  ];
  const demandRows = demandData.map((item, index) => ({
    id: index + 1,
    date: item.date,
    branch: item.branch,
    menuItem: item.menu_item,
    season: item.season,
    demand: item.predicted_demand,
  }));
  const topDishesColumns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "menuItem", headerName: "Menu Item", width: 220 },
    { field: "total_demand", headerName: "Total Demand", width: 220 },
  ];
  const topDishesRows = topDishesData.map((item, index) => ({
    id: index + 1,
    menuItem: item.menu_item,
    total_demand: item.total_demand,
  }));
  const convertDateFormat = (date) => {
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };
  const handleChange = (dates, dateStrings) => {
    if (dates) {
      const [startDate, endDate] = dateStrings;
      const fromDate = convertDateFormat(startDate);
      const toDate = convertDateFormat(endDate);
      setFromDate(fromDate);
      setToDate(toDate);
    } else {
      console.log("Dates cleared");
    }
  };

  return (
    <div className="sales-forecast">
      <ToastContainer />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingRight: "50px",
        }}
      >
        <h2>
          <b>Demand Forecast</b>
        </h2>
        {location.pathname !== "/admin/sales_forecast" && (
          <Button
            onClick={() => {
              navigate("/admin/sales_forecast");
            }}
          >
            View More
          </Button>
        )}
      </div>

      <div className="chart-container">
        <div className="chart-item">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div>
              <h2>
                <b>Top 5 dishes for this Week</b>
              </h2>
            </div>
            <div>
              <FormControl sx={{ m: 1, width: 100 }} size="small">
                <InputLabel id="branch-label">Branch</InputLabel>
                <Select
                  labelId="branch-label"
                  id="branch"
                  name="branch"
                  value={branch}
                  label="Branch"
                  onChange={handleBranchChange}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="BR001">BR001</MenuItem>
                  <MenuItem value="BR002">BR002</MenuItem>
                  <MenuItem value="BR003">BR003</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          <PieChart data={topDishesData} />
          <div style={{ height: 200 }}>
            <DataGrid
              columns={topDishesColumns}
              rows={topDishesRows}
              pageSize={5}
              initialState={{
                ...demandRows.initialState,
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              autoHeight
            />
          </div>
        </div>
        <div className="chart-item">
          <div>
            <h2>
              <b>Top 5 dishes for this Week</b>
            </h2>
          </div>
          <PieChart data={topDishesData} />
          <div style={{ height: 200 }}>
            <DataGrid
              columns={topDishesColumns}
              rows={topDishesRows}
              pageSize={5}
              initialState={{
                ...topDishesRows.initialState,
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
              autoHeight
            />
          </div>
        </div>
        <div className="chart-item">
          {/* <BarChart data={staticDemandData} /> */}
          <div style={{ paddingTop: "10px" }}>
            <b>Predicted demand over Time for this week</b>
          </div>
          <ChartComponent data={staticDemandData} />
          <div style={{ height: 371, marginTop: "10px" }}>
            <DataGrid
              columns={staticDemandColumns}
              rows={staticdemandRows}
              initialState={{
                ...staticdemandRows.initialState,
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </div>
        </div>
        <div className="chart-item">
          <div>
            {chartloading && <div>Loading...</div>}
            <div>
              <form onSubmit={formik.handleSubmit} className="forecast-form">
                <FormControl
                  sx={{ m: 1, width: 100 }}
                  size="small"
                  error={formik.touched.branch && Boolean(formik.errors.branch)}
                >
                  <InputLabel id="branch-label">Branch</InputLabel>
                  <Select
                    labelId="branch-label"
                    id="branch"
                    name="branch"
                    value={formik.values.branch}
                    label="Branch"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="BR001">BR001</MenuItem>
                    <MenuItem value="BR002">BR002</MenuItem>
                    <MenuItem value="BR003">BR003</MenuItem>
                  </Select>
                  {formik.touched.branch && formik.errors.branch && (
                    <FormHelperText>{formik.errors.branch}</FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                  error={
                    formik.touched.menu_item && Boolean(formik.errors.menu_item)
                  }
                >
                  <InputLabel id="menu_item-label">Menu Item</InputLabel>
                  <Select
                    labelId="menu_item-label"
                    id="menu_item"
                    name="menu_item"
                    value={formik.values.menu_item}
                    label="Menu Item"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {menuItems.map((item, index) => (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.menu_item && formik.errors.menu_item && (
                    <FormHelperText>{formik.errors.menu_item}</FormHelperText>
                  )}
                </FormControl>

                <FormControl
                  sx={{ m: 1, minWidth: 120 }}
                  size="small"
                  error={formik.touched.season && Boolean(formik.errors.season)}
                >
                  <InputLabel id="season-label">Season</InputLabel>
                  <Select
                    labelId="season-label"
                    id="season"
                    name="season"
                    value={formik.values.season}
                    label="Season"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="all">All</MenuItem>
                    {seasons.map((season, index) => (
                      <MenuItem key={index} value={season}>
                        {season}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.season && formik.errors.season && (
                    <FormHelperText>{formik.errors.season}</FormHelperText>
                  )}
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <RangePicker format="DD-MM-YYYY" onChange={handleChange} />
                </LocalizationProvider>

                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  sx={{ m: 1 }}
                >
                  Predict
                </Button>
              </form>
            </div>
            <div>
              {showChart ? (
                <LineChartComponent data={demandData} />
              ) : (
                <div>
                  <div style={{ paddingTop: "10px" }}>
                    <b>Predicted demand over Time for this week</b>
                  </div>
                  <ChartComponent data={staticDemandData} />
                </div>
              )}
              <div style={{ height: 300 }}>
                <DataGrid
                  rows={showChart ? demandRows : staticdemandRows}
                  columns={showChart ? demandColumns : staticDemandColumns}
                  initialState={{
                    ...demandRows.initialState,
                    pagination: { paginationModel: { pageSize: 5 } },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesForecast;
