import { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Cookies from "js-cookie";
import API_ENDPOINTS from "../../config/url.config";
import "../../styles/manager/receipts.css";
import { ToastContainer, toast } from "react-toastify";
import { stockLevel } from "../../config/constant";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
const StyledBox = styled(Box)(({ theme }) => ({
  padding: "10px 0px 0px 20px", // padding: top, right, bottom, left
  display: "flex", // sets display to flex
}));
const StyledBox2 = styled(Box)(({ theme }) => ({
  width: "70%",
}));
const StyledBox3 = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));
const StyledFormControl = styled(FormControl)(({ theme }) => ({
  padding: "0 0 20px 0",
  display: "flex",
  width: "140px",
  alignContent: "flex-end",
}));
const StyledBox4 = styled(Box)(({ theme }) => ({
  height: "80vh", // Set height to 80vh
  marginLeft: theme.spacing(4), // Adds margin-left (using theme spacing)
  width: "30%", // Sets width to 30%
  backgroundColor: "#F9F9F9", // Sets background color to grey
  padding: theme.spacing(2), // Adds padding for internal spacing (using theme spacing)
}));
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  fontSize: "12px", // Set font size
  height: "72vh", // Set height to 72vh
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "black", // Header background color
    color: "white", // Header text color for contrast
  },
}));
const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2), // Adds space between cards
  backgroundColor: "white", // Light grey background for the card
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle shadow effect
}));
const Box5 = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  padding: "0px 5px 5px 0px",
}));
const StyledButtonOrder = styled(Button)(({ theme }) => ({
  fontSize: 12, // Set font size
  height: 30, // Set button height
  width: 91, // Set button width
}));
const Receipt = () => {
  const { t } = useTranslation();
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [orderQuantities, setOrderQuantities] = useState({});
  const [products, setProducts] = useState({});
  const [unitsOfMeasure, setUnitsOfMeasure] = useState({});
  const [suppliers, setSuppliers] = useState([]);
  const [cart, setCart] = useState([]); // Cart state to store added products
  const [cookiesData, setCookiesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stockeLevelFilter, setStockLevelFilter] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = Cookies.get();
        setCookiesData(storedData);
        const branchId = storedData.branchId;
        const organisationId = storedData.organisationId;

        const [
          inventoryResponse,
          productResponse,
          unitsResponse,
          supplierResponse,
        ] = await Promise.all([
          axios.get(
            `${API_ENDPOINTS.manager.inventory.inventoryResponse}/${branchId}`,
            {
              params: { stockLevel: stockeLevelFilter },
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          ),
          axios.get(`${API_ENDPOINTS.manager.homepage.productData}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }),
          axios.get(`${API_ENDPOINTS.productMangement.unitofmeasure}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }),
          axios.get(
            `${API_ENDPOINTS.supplierManagement.supplier}/${organisationId}`,
            {
              headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          ),
        ]);
        setLowStockProducts(inventoryResponse.data);

        setProducts(
          productResponse.data.reduce((acc, product) => {
            const { name, thresholdLimit, unitOfMeasure, productId } = product;
            acc[productId] = {
              name,
              thresholdLimit,
              unitOfMeasure,
              productId,
            };
            return acc;
          }, {})
        );
        setUnitsOfMeasure(
          unitsResponse.data.reduce((acc, unit) => {
            acc[unit.unitId] = unit.units;
            return acc;
          }, {})
        );
        setSuppliers(supplierResponse.data);

        setLoading(false);
      } catch (error) {
        setError("Error fetching data");
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [stockeLevelFilter]);

  const handleOrderQtyChange = (productId, value) => {
    const positiveValue = Math.abs(value); // Convert the value to a positive number
    setOrderQuantities({
      ...orderQuantities,
      [productId]: positiveValue,
    });
  };

  const handleAddToCart = (productId) => {
    const product = products[productId];
    const inventoryItem = lowStockProducts.find(
      (inventory) => inventory.productId === productId
    );
    const supplierId = inventoryItem?.selectedSupplier;
    const supplierName = suppliers.find(
      (supplier) => supplier.supplierId === supplierId
    )?.supplierName;

    if (
      !supplierId ||
      !orderQuantities[productId] ||
      orderQuantities[productId] <= 0
    ) {
      toast.error(
        !supplierId
          ? "Please select a supplier before adding to cart."
          : orderQuantities[productId] <= 0
          ? "Please enter a positive order quantity."
          : "Please enter a valid order quantity."
      );
      return;
    }

    const cartItem = {
      productId,
      productName: product.name,
      orderQuantity: orderQuantities[productId],
      supplierId,
      supplierName,
    };

    // Update the cart with the new item
    setCart([...cart, cartItem]);

    // Reset order quantities and supplier selection
    setOrderQuantities({
      ...orderQuantities,
      [productId]: "",
    });
    setLowStockProducts(
      lowStockProducts.map((inventory) =>
        inventory.productId === productId
          ? { ...inventory, selectedSupplier: "" }
          : inventory
      )
    );
  };

  const handlePlaceOrder = async (supplierId) => {
    // Filter cart items based on the supplier ID
    const itemsForSupplier = cart.filter(
      (item) => item.supplierId == supplierId
    );

    // Prepare the payload for the order
    const orderPayload = {
      supplierId: parseInt(supplierId),
      items: JSON.stringify(
        itemsForSupplier.map((item) => ({
          productId: item.productId,
          orderQuantity: item.orderQuantity,
          productName: item.productName,

          itemStatus: false, // Assuming itemStatus is part of the payload
        }))
      ),
      branchId: parseInt(cookiesData.branchId),
      orderedDate: new Date().toISOString(),
    };

    try {
      // Post the order data to the backend
      await axios.post(
        `${API_ENDPOINTS.manager.orders.orderResponse}`,
        orderPayload,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      toast.success(`Order placed successfully for Supplier ${supplierId}`);

      // Clear the cart for that supplier
      setCart([]);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place the order.");
    }
  };

  const columns = [
    {
      field: "productName",
      headerName: t("receipt.columns.productName"), // Use translation for header name
      width: 150,
      alignContent: "center",
    },
    {
      field: "selectedSupplier",
      headerName: t("receipt.columns.supplierName"), // Use translation for header name
      width: 170,
      renderCell: (params) => (
        <FormControl fullWidth sx={{ paddingTop: "10px" }}>
          <InputLabel>{t("receipt.labels.supplier")}</InputLabel>{" "}
          {/* Use translation for label */}
          <Select
            label={t("receipt.labels.supplier")}
            style={{
              height: 30,
              width: 156,
            }}
            value={params.value || ""}
            onChange={(e) =>
              handleSupplierChange(params.row.inventoryId, e.target.value)
            }
          >
            {suppliers.map((supplier) => (
              <MenuItem key={supplier.supplierId} value={supplier.supplierId}>
                {supplier.supplierName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "quantity",
      headerName: t("receipt.columns.currentQty"), // Use translation for header name
      width: 100,
    },
    {
      field: "orderQuantity",
      headerName: t("receipt.columns.orderQty"), // Use translation for header name
      width: 100,
      renderCell: (params) => (
        <TextField
          style={{ width: 70, marginTop: 3 }}
          type="number"
          size="small"
          value={orderQuantities[params.row.productId] || ""}
          onChange={(e) =>
            handleOrderQtyChange(params.row.productId, e.target.value)
          }
          inputProps={{ min: 0 }}
          required
        />
      ),
    },
    {
      field: "stockLevel",
      headerName: t("receipt.columns.stockLevel"), // Use translation for header name
      width: 150,
      renderCell: (params) => {
        const product = products[params.row.productId];
        const quantity = params.row.quantity;
        let label = "";
        let color = "";
        let borderColor = ""; // Border color to match the stock level background

        if (quantity === 0) {
          label = t("receipt.labels.outOfStock"); // Use translation for label
          color = "red";
          borderColor = "black"; // Optional: A darker red for the border
        } else if (quantity <= product.thresholdLimit / 2 && quantity > 0) {
          label = t("receipt.labels.criticalStock"); // Use translation for label
          color = "#F8D7D6";
          borderColor = "#D9534F"; // Optional: Border for critical stock
        } else if (
          quantity > product.thresholdLimit / 2 &&
          quantity < product.thresholdLimit
        ) {
          label = t("receipt.labels.lowStock"); // Use translation for label
          color = "#FBEEDF";
          borderColor = "#CD7014"; // Optional: Border for low stock
        }
        return (
          <Button
            style={{
              backgroundColor: color,
              color: "black", // Text color set to black
              fontSize: "9px",
              width: "90px",
              border: `2px solid ${borderColor}`, // Border added
            }}
          >
            {label}
          </Button>
        );
      },
    },
    {
      field: "action",
      headerName: t("receipt.columns.action"), // Use translation for header name
      width: 100,
      renderCell: (params) => (
        <Button
          sx={{ height: 30, fontSize: 12 }}
          variant="contained"
          color="primary"
          onClick={() => handleAddToCart(params.row.productId)}
        >
          {t("receipt.buttons.add")} {/* Use translation for button text */}
        </Button>
      ),
    },
  ];

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Group cart items by supplier
  const groupedCart = cart.reduce((acc, item) => {
    if (!acc[item.supplierId]) {
      acc[item.supplierId] = {
        supplierName: item.supplierName,
        items: [],
      };
    }
    acc[item.supplierId].items.push(item);
    return acc;
  }, {});
  const handleSupplierChange = (inventoryId, supplierId) => {
    // Update the state with the selected supplier for the specific inventory item
    setLowStockProducts((prevProducts) =>
      prevProducts.map((item) =>
        item.inventoryId === inventoryId
          ? { ...item, selectedSupplier: supplierId } // Update the selected supplier
          : item
      )
    );
  };

  return (
    <StyledBox>
      <StyledBox2>
        <StyledBox3>
          <Typography variant="h6">
            {t("receipt.text.lowStockProducts")}
          </Typography>{" "}
          {/* Low Stock Products */}
          <StyledFormControl size="small">
            <ToastContainer />
            <InputLabel>Stock</InputLabel>
            <Select
              value={stockeLevelFilter}
              label="Filter"
              onChange={(e) => setStockLevelFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value={stockLevel.LOW_STOCK}>
                {" "}
                {t("receipt.text.lowStock")}
              </MenuItem>
              <MenuItem value={stockLevel.CRITICAL_STOCK}>
                {t("receipt.text.criticalStock")}
              </MenuItem>
              <MenuItem value={stockLevel.OUT_OF_STOCK}>
                {" "}
                {t("receipt.text.outOfStock")}
              </MenuItem>
            </Select>
          </StyledFormControl>
        </StyledBox3>
        <StyledDataGrid
          rows={lowStockProducts.map((inventory) => ({
            id: inventory.productId, // productId as unique identifier
            ...inventory,
            productName: products[inventory.productId]?.name,
          }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          autoHeight={false} // Disable autoHeight for custom height control
        />
      </StyledBox2>
      <StyledBox4>
        <Typography variant="h6"> {t("receipt.text.cart")}</Typography>
        {Object.keys(groupedCart).length === 0 ? (
          <Typography> {t("receipt.text.noItemsInTheCart")}</Typography>
        ) : (
          Object.keys(groupedCart).map((supplierId) => (
            <StyledCard key={supplierId}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", marginBottom: 2 }}
                >
                  {groupedCart[supplierId].supplierName}
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {t("receipt.text.productName")}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {t("receipt.text.orderQty")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedCart[supplierId].items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.orderQuantity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <Box5>
                <StyledButtonOrder
                  variant="contained"
                  color="primary"
                  onClick={() => handlePlaceOrder(supplierId)}
                >
                  {t("receipt.buttons.order")}
                </StyledButtonOrder>
              </Box5>
            </StyledCard>
          ))
        )}
      </StyledBox4>
    </StyledBox>
  );
};

export default Receipt;
