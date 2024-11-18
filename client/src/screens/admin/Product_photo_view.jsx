import { useEffect, useState } from "react";
import { Paper, Typography, Checkbox, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../styles/Product_photo_view.css";
import { API_ENDPOINTS } from "../../config/url.config";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
const StyledPhotoviewPaper = styled(Paper)(({ theme }) => ({
  margin: "20px",
  padding: "10px",
  position: "relative",
  width: "80%",
  height: "60%",
}));
const StyledCadrdCheckbox = styled(Checkbox)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
}));
const StyledLinkEditProduct = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
  backgroundColor: "transparent",
}));
function ProductPhotoView({
  searchQuery,
  selectedCategories,
  deletedProduct,
  handleCheckboxChange,

  selectedProductsToDelete,
}) {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cookiesData, setCookiesData] = useState();
  useEffect(() => {
    const id = toast.loading("Please wait...");
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const organisationId = storedData.organisationId;
    async function fetchData() {
      try {
        const productResponse = await axios.get(
          `${API_ENDPOINTS.productMangement.product}/organisationId/${organisationId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
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
      <Grid container spacing={2} data-testid="pgrid">
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
            <Grid item xs={3} key={product.productId}>
              <StyledPhotoviewPaper elevation={0} variant="outlined">
                {/* Checkbox */}
                <StyledCadrdCheckbox
                  data-testid="cb"
                  checked={selectedProducts.includes(product.productId)}
                  onChange={() => handleCardClick(product)}
                />

                {/* Content */}
                <div className="product_card">
                  <StyledLinkEditProduct
                    to={`/admin/edit_product/${product.productId}`}
                  >
                    {/* Product Image */}
                    <img
                      src={product.productImage}
                      style={{
                        width: "30%",
                        height: "30%",
                        marginRight: "20px",
                      }}
                    />

                    {/* Product Information */}
                    <div style={{ flex: 1 }}>
                      <Typography variant="body" component="p">
                        {t("product.text.productName")}
                      </Typography>
                      <Typography variant="body" component="p">
                        {t("product.text.productId", {
                          id: product.productId,
                        })}
                      </Typography>
                      <Typography variant="body" component="p">
                        {t("product.text.price", {
                          price: product.costPrice,
                        })}
                      </Typography>
                    </div>
                  </StyledLinkEditProduct>
                </div>
              </StyledPhotoviewPaper>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}

export default ProductPhotoView;
