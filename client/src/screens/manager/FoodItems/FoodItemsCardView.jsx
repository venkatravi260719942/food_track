import { useEffect, useState } from "react";
import { Paper, Typography, Checkbox, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../../styles/manager/FoodItem.css";
import { API_ENDPOINTS } from "../../../config/url.config";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../LanguageContext";
import FIplaceholder from "../../../assets/images/image-regular.svg";
import { styled } from "@mui/system";

const StyledGridContainer = styled(Grid)(({ theme }) => ({
  padding: "48px 0px 30px 35px",
  columnGap: "83px",
  rowGap: "28px",
}));
const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  width: "349px",
  height: "146px",
}));
const CheckboxFoodItems = styled(Checkbox)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
}));
const StyledLink = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
  backgroundColor: "transparent",
  padding: "21px 0px 21px 30px",
}));
function FoodItemsCardView({
  searchQuery,
  selectedCategories,
  deletedProduct,
  handleCheckboxChange,
  selectedProductsToDelete,
  currentView,
}) {
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [cookiesData, setCookiesData] = useState([]);
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    const id = toast.loading("Please wait...");
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const branchId = storedData.branchId;

    async function fetchData() {
      try {
        const productResponse = await axios.get(
          `${API_ENDPOINTS.manager.menuitems.branchItems}/${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const categoryResponse = await axios.get(
          `${API_ENDPOINTS.manager.menuitemscategory.itemCategoryData}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const productsWithCategory = productResponse.data.map((product) => ({
          ...product,
          id: product.itemId,
          category:
            categoryResponse.data.find(
              (category) => category.categoryId === product.categoryId
            )?.category || "Unknown",
        }));

        setProducts(productsWithCategory);
        toast.dismiss(id);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.dismiss(id);
        toast.error("Failed to fetch data");
      }
    }

    fetchData();
  }, [deletedProduct]);

  useEffect(() => {
    setSelectedProducts(selectedProductsToDelete);
  }, [selectedProductsToDelete]);

  const handleCardClick = (product) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(product.itemId)
        ? prevSelected.filter((id) => id !== product.itemId)
        : [...prevSelected, product.itemId]
    );
    handleCheckboxChange(product.itemId);
  };

  const filteredProducts = products
    .filter((product) =>
      selectedCategories.length > 0
        ? selectedCategories.includes(product.category)
        : true
    )
    .filter((product) =>
      product.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="FI_photoview">
      <ToastContainer />
      <StyledGridContainer container direction="row">
        {filteredProducts.map((product) => (
          <Grid key={product.itemId}>
            <StyledPaper variant="outlined">
              {/* Checkbox */}
              <CheckboxFoodItems
                data-testid="cb"
                checked={selectedProducts.includes(product.itemId)}
                onChange={() => handleCardClick(product)}
              />

              {/* Content */}
              <div className="FI_item_card">
                <StyledLink
                  to={`editFoodItem/${product.itemId}`}
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
                      product.itemImageUrl
                        ? product.itemImageUrl
                        : FIplaceholder
                    }
                    style={{
                      width: "117px",
                      height: "103px",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />

                  {/* Product Information */}
                  <div className="FI_gridContent">
                    <Typography variant="body" component="p">
                      {product.itemName}
                    </Typography>
                    <Typography variant="body" component="p">
                      {t("fooditems.tableheading.SKU")}: {product.sku}
                    </Typography>
                    <Typography variant="body" component="p">
                      Price: {product.itemPrice}
                    </Typography>
                  </div>
                </StyledLink>
              </div>
            </StyledPaper>
          </Grid>
        ))}
      </StyledGridContainer>
    </div>
  );
}

export default FoodItemsCardView;
