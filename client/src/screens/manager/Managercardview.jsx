import { useEffect, useState } from "react";
import { Paper, Typography, Checkbox, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/manager/Managercardview.css";
import { API_ENDPOINTS } from "../../config/url.config";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import PRO_placeholder from "../../assets/images/image-regular.svg";
function Managercardview({
  searchQuery,
  selectedCategories,
  deletedProduct,
  handleCheckboxChange,
  selectedProductsToDelete,
}) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cookiesData, setCookiesData] = useState();
  useEffect(() => {
    const id = toast.loading("Please wait...");
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const organisationId = storedData.organisationId;
    const branchId = storedData.branchId;
    async function fetchData() {
      try {
        const productResponse = await axios.get(
          `${API_ENDPOINTS.productMangement.product}/organisationId/${organisationId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
            params: {
              branchId: branchId,
            },
          }
        );
        const productData = productResponse.data;

        const categoryResponse = await axios.get(
          `${API_ENDPOINTS.productMangement.category}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        const categoryData = categoryResponse.data;

        const productsWithCategory = productData.map((product) => ({
          ...product,
          category: categoryData.find(
            (category) => category.categoryId === product.categoryId
          ),
        }));

        setProducts(productsWithCategory);
        toast.dismiss(id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [deletedProduct]);
  useEffect(() => {
    setSelectedProducts(selectedProductsToDelete);
  }, [selectedProductsToDelete]);

  const handleCardClick = (product) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(product.productId)
        ? prevSelected.filter((id) => id !== product.productId)
        : [...prevSelected, product.productId]
    );
    handleCheckboxChange(product.productId);
  };

  return (
    <div className="photoview">
      <ToastContainer />
      <Grid
        container
        direction="row"
        sx={{
          padding: "48px 0px 30px 35px",
          columnGap: "83px",
          rowGap: "28px",
        }}
        data-testid="pgrid"
      >
        {products
          .filter((product) =>
            selectedCategories.length > 0
              ? selectedCategories.includes(product.category.categoryName)
              : true
          )
          .filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((product) => (
            <Grid key={product.productId}>
              <Paper
                variant="outlined"
                style={{
                  position: "relative",
                  width: "349px",
                  height: "146px",
                }}
              >
                {/* Checkbox */}
                <Checkbox
                  data-testid="checkbox"
                  checked={selectedProducts.includes(product.productId)}
                  onChange={() => handleCardClick(product)}
                  style={{ position: "absolute", top: 0, right: 0 }}
                />

                {/* Content */}
                <div className="product_card">
                  <Link
                    to={`/manager/edit_product/${product.productId}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textDecoration: "none",
                      color: "inherit",
                      backgroundColor: "transparent",
                      padding: "21px 0px 21px 30px",
                    }}
                  >
                    {/* Product Image */}
                    <img
                      src={
                        product.productImage
                          ? product.productImage
                          : PRO_placeholder
                      }
                      style={{
                        width: "117px",
                        height: "103px",
                        borderRadius: "10px",
                        objectFit: "cover",
                      }}
                    />

                    {/* Product Information */}
                    <div className="pro_gridContent">
                      <Typography variant="body" component="p">
                        {product.name}
                      </Typography>
                      <Typography variant="body" component="p">
                        Product ID: {product.productId}
                      </Typography>
                      <Typography variant="body" component="p">
                        Price: {product.costPrice}
                      </Typography>
                    </div>
                  </Link>
                </div>
              </Paper>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}

export default Managercardview;
