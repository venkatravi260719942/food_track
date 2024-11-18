import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  TextField,
} from "@mui/material";
import Cookies from "js-cookie";
import API_ENDPOINTS from "../../config/url.config";
import { useTranslation } from "react-i18next";

function Reports() {
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const branchId = Cookies.get("branchId");

        // Fetch inventory data
        const inventoryResponse = await axios.get(
          `${API_ENDPOINTS.manager.inventory}/${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        // Fetch product data including threshold limit
        const productResponse = await axios.get(
          `${API_ENDPOINTS.productMangement.product}`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        // Map product data by productId for easy lookup
        const productMap = productResponse.data.reduce((acc, product) => {
          acc[product.productId] = {
            name: product.name,
            thresholdLimit: product.thresholdLimit,
          };
          return acc;
        }, {});

        // Filter products where quantity is less than the threshold limit
        const lowStockProducts = inventoryResponse.data.filter(
          (product) =>
            product.quantity < productMap[product.productId]?.thresholdLimit
        );

        // Set product details and low stock products
        setProductDetails(productMap);
        setProducts(lowStockProducts);
        setLoading(false);
      } catch (error) {
        setError("Error fetching low stock products.");
        console.error("Error:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    productDetails[product.productId]?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getStockStatusColor = (quantity, thresholdLimit) => {
    if (quantity === 0) {
      return "#ffc9c9"; // red for "Out of Stock"
    } else if (quantity <= thresholdLimit / 2) {
      return "#ffd8a8 "; // orange for "Critical Stock"
    } else {
      return "#ffeb3b"; // yellow for "Low Stock"
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" component="h2">
          {t("reports.text.lowStocks")}
        </Typography>
        <TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{ maxWidth: 300 }}
        />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const bgColor = getStockStatusColor(
              product.quantity,
              productDetails[product.productId].thresholdLimit
            );

            return (
              <Card
                key={product.productId}
                sx={{
                  width: 150,
                  height: 70,
                  backgroundColor: bgColor,
                  color: "#000",
                }}
              >
                <CardContent>
                  <Typography variant="h6">
                    {productDetails[product.productId].name}
                  </Typography>
                  <Typography variant="body2">
                    {t("reports.text.quantity")} {product.quantity}
                  </Typography>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Typography>{t("Reports.text.noLowStockProducts")}</Typography>
        )}
      </Box>
    </Box>
  );
}

export default Reports;
