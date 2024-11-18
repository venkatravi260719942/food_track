import {
  Box,
  Tabs,
  Tab,
  Alert,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  AlertTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Receipt from "./Receipt";
import Orders from "./Orders";
import History from "./History";
import Cookies from "js-cookie";
import axios from "axios";
import API_ENDPOINTS from "../../config/url.config";
import { useState, useEffect, useCallback, startTransition } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
const StyledBox = styled(Box)(({ theme }) => ({
  paddingLeft: "20px",
  backgroundColor: "white",
}));
const StyledBox1 = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  padding: "20px 20px 20px 0px",
  backgroundColor: "white",
}));
const StyledTextFieldSearch = styled(TextField)(({ theme }) => ({
  maxWidth: 400,
  // You can add more styles here if needed
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
  alignSelf: "center",
  fontStyle: "italic", // Use fontStyle instead of fontFamily for italic text
}));
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  width: "98.5%",
  height: "65vh",
  padding: "0px",
  "& .MuiDataGrid-cell": {
    backgroundColor: "#FFFFFF", // Set table cell background color to white
  },
  "& .headerStyle": {
    backgroundColor: "#F9FAFB",
  },
  "& .MuiDataGrid-row": {
    backgroundColor: "#FFFFFF", // Set row background color to white
  },
  "& .MuiDataGrid-cell.MuiDataGrid-cell--editable": {
    backgroundColor: "#FFFFFF", // Set editable cell background color to white
  },
  "& .MuiDataGrid-scrollbarFiller": {
    backgroundColor: "#F9FAFB",
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: "#F9FAFB",
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#F9FAFB",
  },
}));
const StyledBox3 = styled(Box)(({ theme }) => ({
  padding: "20px 0px 0px 0px",
  backgroundColor: "white",
}));

function Inventory() {
  const [value, setValue] = useState(0);
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState({});
  const [units, setUnits] = useState({});
  const [error, setError] = useState(null);
  const [cookiesData, setCookiesData] = useState({});
  const [updatedData, setUpdatedData] = useState({});
  const [lastUpdated, setLastUpdated] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [inventoryData, setInventoryData] = useState([]);
  const { t } = useTranslation();
  const columns = [
    {
      field: "productCode",
      headerName: t("inventory.text.productCode"),
      sortable: false,
      headerClassName: "headerStyle",
      width: 245,
    },
    {
      field: "productName",
      headerName: t("inventory.text.productName"),
      width: 245,
      headerClassName: "headerStyle",
    },
    {
      field: "category",
      headerName: t("inventory.text.category"),
      sortable: false,
      width: 245,
      headerClassName: "headerStyle",
    },
    {
      field: "quantity",
      headerName: t("inventory.text.quantity"),
      headerAlign: "left",
      type: "number",
      width: 240,
      height: 30,
      editable: true,
      renderCell: (params) => (
        <TextField
          type="text"
          value={params.value}
          size="small"
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 0 || e.target.value === "") {
              params.setValue(value);
            }
          }}
          sx={{
            paddingTop: "5px",
            width: "100px",
            display: "flex",
          }}
          inputProps={{ min: 0 }}
        />
      ),
      headerClassName: "headerStyle",
    },
    {
      field: "unit",
      headerName: t("inventory.text.unit"),
      sortable: false,
      width: 240,
      headerClassName: "headerStyle",
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSave = async () => {
    try {
      // Validate if any updated quantity is negative
      for (let productId in updatedData) {
        if (updatedData[productId].quantity < 0) {
          toast.error("Quantity cannot be negative.");
          return;
        }
      }

      const payload = Object.entries(updatedData).map(
        ([productId, changes]) => ({
          productId: parseInt(productId),
          quantity: parseInt(changes.quantity),
          branchId: parseInt(cookiesData.branchId),
        })
      );

      let hasErrors = false;

      for (let item of payload) {
        const { productId, branchId, quantity } = item;

        try {
          const existingInventoryResponse = await axios.get(
            `${API_ENDPOINTS.manager.inventory.inventoryResponse}/${branchId}/${productId}`,
            {
              headers: {
                Authorization: `Bearer ${cookiesData.token}`,
              },
            }
          );
          if (existingInventoryResponse.data) {
            const response = await axios.put(
              `${API_ENDPOINTS.manager.inventory.inventoryResponse}/${branchId}/${productId}`,
              item,
              {
                headers: {
                  Authorization: `Bearer ${cookiesData.token}`,
                },
              }
            );
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            const response = await axios.post(
              `${API_ENDPOINTS.manager.inventory.inventoryResponse}`,
              item,
              {
                headers: {
                  Authorization: `Bearer ${cookiesData.token}`,
                },
              }
            );
          } else {
            console.error("Error saving data:", error);
            hasErrors = true;
          }
        }
      }

      if (!hasErrors) {
        setInventoryData((prevData) =>
          prevData.map((row) => {
            const updatedProduct = updatedData[row.productId]; // Access the updated product details
            return updatedProduct
              ? { ...row, quantity: updatedProduct.quantity }
              : row;
          })
        );
        toast.success("Updated Successfully");
        setLastUpdated(new Date().toLocaleString());
        setTimeout(() => {
          setLastUpdated();
        }, 3000);

        setHasChanges(false);
      } else {
        toast.error("Error saving data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving data");
    }
  };

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const organisationId = storedData.organisationId;
    const branchId = storedData.branchId;

    const fetchData = async () => {
      try {
        const [productsResponse, categoriesResponse, unitsResponse] =
          await Promise.all([
            axios.get(
              `${API_ENDPOINTS.productMangement.product}/${organisationId}/${branchId}`,
              {
                headers: {
                  Authorization: `Bearer ${storedData.token}`,
                },
              }
            ),
            axios.get(`${API_ENDPOINTS.productMangement.category}`, {
              headers: {
                Authorization: `Bearer ${storedData.token}`,
              },
            }),
            axios.get(`${API_ENDPOINTS.productMangement.unitofmeasure}`, {
              headers: {
                Authorization: `Bearer ${storedData.token}`,
              },
            }),
          ]);

        const categoryMap = categoriesResponse.data.reduce((acc, category) => {
          acc[category.categoryId] = category.categoryName;
          return acc;
        }, {});

        const unitMap = unitsResponse.data.reduce((acc, unit) => {
          acc[unit.unitId] = unit.units;
          return acc;
        }, {});

        setCategories(categoryMap);
        setUnits(unitMap);
        setData(
          productsResponse.data.sort((a, b) => a.name.localeCompare(b.name))
        );

        if (storedData.branchId) {
          const fetchInventoryData = async () => {
            try {
              const response = await axios.get(
                `${API_ENDPOINTS.manager.inventory.inventoryResponse}/${storedData.branchId}`,
                {
                  headers: {
                    Authorization: `Bearer ${storedData.token}`,
                  },
                }
              );
              setInventoryData(response.data);
            } catch (error) {
              console.error("Error fetching inventory data:", error);
            }
          };

          fetchInventoryData();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data");
      }
    };

    fetchData();
  }, []);

  // Debounce logic for search input
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length >= 3 || searchTerm === "") {
        setDebouncedSearchTerm(searchTerm);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filterBySearchTerm = (row) => {
    const productName = row.name || "";
    return productName
      .toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase());
  };

  const filterByCategory = (row) => {
    return !selectedCategory || row.categoryId == selectedCategory;
  };

  const filteredData = data
    .filter((row) => filterBySearchTerm(row) && filterByCategory(row))
    .map((row) => ({
      id: row.productId,
      productCode: row.productId,
      productName: row.name,
      category: categories[row.categoryId],
      quantity:
        inventoryData.find((item) => item.productId === row.productId)
          ?.quantity ?? row.quantity,
      unit: units[row.unitOfMeasure],
    }));

  const handleProcessRowUpdate = (newRow) => {
    setUpdatedData((prev) => ({
      ...prev,
      [newRow.id]: { quantity: newRow.quantity },
    }));

    // Immediately update the local inventory data
    setInventoryData((prevData) =>
      prevData.map((row) =>
        row.productId === newRow.id
          ? { ...row, quantity: newRow.quantity }
          : row
      )
    );

    setHasChanges(true);
    return newRow;
  };

  return (
    <StyledBox>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label={t("inventory.label.inventory")} />
        <Tab label={t("inventory.label.receipts")} />
        <Tab label={t("inventory.label.orders")} />
        <Tab label={t("inventory.label.history")} />
      </Tabs>

      {value === 0 && (
        <>
          {error && <Alert severity="error">{error}</Alert>}
          {!error && (
            <>
              <ToastContainer />
              <StyledBox1>
                <StyledTextFieldSearch
                  label="Search by Product Name"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>
                    {t("inventory.text.filterByCategory")}
                  </InputLabel>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    label="Filter by Category"
                  >
                    <MenuItem value="">
                      <em>{t("inventory.text.all")}</em>
                    </MenuItem>
                    {Object.entries(categories).map(([id, name]) => (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {lastUpdated && (
                  <StyledTypography variant="body2">
                    {t("inventory.text.lastUpdated")} {lastUpdated}
                  </StyledTypography>
                )}
              </StyledBox1>

              <StyledDataGrid
                rows={filteredData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 25]}
                processRowUpdate={handleProcessRowUpdate}
              />

              <StyledBox3>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={!hasChanges}
                >
                  {t("inventory.text.saveChanges")}{" "}
                </Button>
              </StyledBox3>
            </>
          )}
        </>
      )}

      {value === 1 && <Receipt />}
      {value === 2 && <Orders />}
      {value === 3 && <History />}
    </StyledBox>
  );
}

export default Inventory;
