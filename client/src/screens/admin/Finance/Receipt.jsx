import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_ENDPOINTS from "../../../config/url.config";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Tabs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faXmark } from "@fortawesome/free-solid-svg-icons";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import "../../../styles/admin/Finance/receipt.css";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

function Receipt() {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState([]);
  const [branch, setBranches] = useState([]);
  const [cookies, setCookie] = useCookies(["organisationId"]);
  const [tenantToken, setTenantToken] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setCookie("organisationId", "1");
    const tenant = Cookies.get("token");
    setTenantToken(tenant);
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.productMangement.category}`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    fetchBranches(tenant);
  }, []);

  const fetchBranches = async (tenantToken) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.adminDashboard.getBranchBasedOnOrganisationId}/${cookies.organisationId}`,
        {
          headers: {
            Authorization: `Bearer ${tenantToken}`,
          },
        }
      );
      setBranches(response.data);
      console.log(response.data);
    } catch (error) {
      // setError(error.response?.data?.message || "Error fetching branches");
      console.log(error);
    }
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleApply = () => {
    // Apply filter logic here
    setOpen(false);
  };

  const handleReset = () => {
    setFromDate(null);
    setToDate(null);
    setSelectedCategories([]);
    setStatus([]);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedCategories(typeof value === "string" ? value.split(",") : value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const rows = []; // Populate this with your data
  const columns = [
    { id: "receipt", label: "RECEIPT NO." },
    { id: "supplier", label: "SUPPLIER NAME" },
    { id: "category", label: "CATEGORY" },
    { id: "issued", label: "ISSUED DATE" },
    { id: "arrived", label: "ARRIVED DATE" },
    { id: "status", label: "STATUS" },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" mb={2} sx={{ pt: "5px" }}>
        <IconButton>
          <ArrowBackIcon
            sx={{ color: "#000000" }}
            onClick={() => navigate("/admin")}
          />
        </IconButton>
        <Typography variant="h6">Receipt</Typography>
      </Box>
      <div className="receiptsearch">
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 250,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search for a receipt"
            inputProps={{ "aria-label": "search for a receipt" }}
          />
        </Paper>
        <div>
          <IconButton
            size="small"
            sx={{ marginLeft: "7px", padding: "10px 10px", color: "black" }}
          >
            <FontAwesomeIcon icon={faFilter} onClick={handleClickOpen} />
          </IconButton>
          <Dialog
            open={open}
            onClose={handleClose}
            sx={{
              "& .MuiDialog-paper": {
                width: "350px",
                maxWidth: "100%",
                backgroundColor: "rgba(255, 255, 255)",
              },
            }}
          >
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography variant="h6">Filter</Typography>
                <FontAwesomeIcon
                  icon={faXmark}
                  onClick={() => {
                    setOpen(false);
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    Date Range
                  </Typography>
                  <Button
                    onClick={() => {
                      setFromDate(null);
                      setToDate(null);
                    }}
                    sx={{ textTransform: "none" }}
                  >
                    Reset
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <DatePicker
                        label="From"
                        value={fromDate}
                        onChange={(newValue) => setFromDate(newValue)}
                        format="DD/MM/YYYY"
                        maxDate={dayjs()}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth size="small" />
                        )}
                      />
                      <DatePicker
                        label="To"
                        value={toDate}
                        onChange={(newValue) => setToDate(newValue)}
                        format="DD/MM/YYYY"
                        maxDate={dayjs()}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth size="small" />
                        )}
                      />
                    </Box>
                  </LocalizationProvider>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    Category
                  </Typography>
                  <Button
                    onClick={() => setSelectedCategories([])}
                    sx={{ textTransform: "none" }}
                  >
                    Reset
                  </Button>
                </Box>
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    renderValue={(selected) => selected.join(", ")}
                  >
                    {categories.map((category) => (
                      <MenuItem
                        key={category.categoryId}
                        value={category.categoryName}
                      >
                        <Checkbox
                          checked={
                            selectedCategories.indexOf(category.categoryName) >
                            -1
                          }
                        />
                        <ListItemText primary={category.categoryName} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    Status
                  </Typography>
                  <Button
                    onClick={() => setStatus([])}
                    sx={{ textTransform: "none" }}
                  >
                    Reset
                  </Button>
                </Box>
                <FormControl fullWidth>
                  <Select value={status} onChange={handleStatusChange}>
                    <MenuItem value={"closed"}>Closed</MenuItem>
                    <MenuItem value={"pending"}>Pending</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleReset} variant="outlined">
                Reset
              </Button>
              <Button onClick={handleApply} color="primary" variant="contained">
                Apply now
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="branch tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mt: 2 }}
      >
        {branch.map((branchItem) => (
          <Tab key={branchItem.branchId} label={branchItem.branchName} />
        ))}
      </Tabs>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>{row[column.id]}</TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}

export default Receipt;
