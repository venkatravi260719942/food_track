import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  ListItemText,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faTableCellsLarge,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import "../../styles/manager/ManagerProductManage.css";
import { API_ENDPOINTS } from "../../config/url.config";
import { useLanguage } from "../../LanguageContext";
import { useTranslation } from "react-i18next";
import Managertableview from "./Managertableview";
import AddProduct from "./AddProduct";
import Managercardview from "./Managercardview";
import { styled } from "@mui/material/styles";
import { VIEW_TYPES } from "../../config/constant";
const StyleProductSearch = styled(TextField)(({ theme }) => ({
  width: "200px",
}));
const ProductCategorySelect = styled(Select)(({ theme }) => ({
  width: "200px",
  alignContent: "center",
}));
const ProductSelectAll = styled(Button)(({ theme }) => ({
  backgroundColor: "#1976D2",
  color: "white",
}));
const ProductDeSelectAll = styled(Button)(({ theme }) => ({
  backgroundColor: "#1976D2",
  color: "white",
}));
const ProductDeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#D32F2F",
  color: "white",
}));
const StyledFontAwesomeIconCell = styled(FontAwesomeIcon)(({ theme }) => ({
  fontSize: "1.3rem",
  cursor: "pointer",
  color: "black", // Set color to black
}));

const ProductCardButton = styled(Button)(({ theme }) => ({
  border: "1px solid black",
  minWidth: "36px",
  height: "36px",
}));
const ProductTableButton = styled(Button)(({ theme }) => ({
  border: "1px solid black",
  minWidth: "36px",
  height: "36px",
}));
const StyledLinkAddProduct = styled(Link)(({ theme }) => ({
  backgroundColor: "#1976D2",
  borderRadius: "5px",
  textDecoration: "none", // Ensure no underline for the link
}));
const StyledAddProductButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1976D2",
  color: "white",
}));
function ManagerProductManage() {
  // State variables
  const [viewProduct, setViewProduct] = useState("table");
  const [productCount, setProductCount] = useState(0); // State variable for product count
  const [searchQuery, setSearchQuery] = useState(""); // State variable for search query
  const [categories, setCategories] = useState([]); // State variable for categories
  const [selectedCategories, setSelectedCategories] = useState([]); // State variable for selected categories
  const [selectedProductsToDelete, setSelectedProductsToDelete] = useState([]); // State variable for selected products to delete
  const [confirmationOpen, setConfirmationOpen] = useState(false); // State variable for confirmation dialog
  const [successMessage, setSuccessMessage] = useState(""); // State variable for success message
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State variable for snackbar
  const [deletedProduct, setDeletedProduct] = useState(false); // State variable to trigger re-render
  const [products, setProducts] = useState([]);
  const [cookiesData, setCookiesData] = useState({});
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const [currentView, setCurrentView] = useState(VIEW_TYPES.TABLE);

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const organisationId = storedData.organisationId;
    const branchId = storedData.organisationId;
    const savedView = localStorage.getItem("currentView");
    if (savedView) {
      setCurrentView(savedView);
    } else {
      setCurrentView(VIEW_TYPES.TABLE);
      localStorage.setItem("currentView", VIEW_TYPES.TABLE);
    }
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

        setCategories(categoryData);

        const productsWithCategory = productData.map((product) => ({
          ...product,
          category: categoryData.find(
            (category) => category.categoryId === product.categoryId
          ),
        }));

        setProducts(productsWithCategory);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    if (organisationId) {
      fetchData();
    }
  }, [deletedProduct, currentView]);

  const updateProductCount = (count) => {
    setProductCount(count);
  };

  // Save view type in localStorage
  const productToggleView = () => {
    setViewProduct(viewProduct === "table" ? "photo" : "table");
  };

  // Function to handle search query change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle category selection
  const handleCategoryChange = (event) => {
    setSelectedCategories(event.target.value);
  };

  // Function to handle product deletion
  const handleProductDelete = async () => {
    if (!cookiesData) {
      console.error("Cookies data is not available");
      return;
    }
    try {
      for (const productId of selectedProductsToDelete) {
        const response = await axios.delete(
          `${API_ENDPOINTS.productMangement.product}/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${cookiesData.token}`,
            },
          }
        );

        if (response.status !== 204) {
          throw new Error(`Failed to delete product with ID ${productId}`);
        }
      }

      setSelectedProductsToDelete([]); // Clear selected products after deletion
      setSuccessMessage("Products deleted successfully");
      setSnackbarOpen(true);
      setConfirmationOpen(false);
      setDeletedProduct(!deletedProduct); // Trigger re-render by updating state variable
    } catch (error) {
      console.error("Error deleting products:", error);
    }
  };

  // Function to handle confirmation dialog open
  const handleConfirmationOpen = () => {
    setConfirmationOpen(true);
  };

  // Function to handle confirmation dialog close
  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
  };

  // Function to handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Function to handle checkbox change
  const handleCheckboxChange = (productId) => {
    setSelectedProductsToDelete((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  // Inside the ProductManage component
  const handleSelectAll = () => {
    const allProductIds = products.map((product) => product.productId);
    setSelectedProductsToDelete(allProductIds);
  };

  const handleDeselectAll = () => {
    setSelectedProductsToDelete([]);
  };

  // Render the component
  return (
    <div className="product_page">
      <div className="mpm_productPageTitle">
        <h2>
          {t("product.text.products")}
          {productCount > 0 && (
            <span>
              ({productCount} {t("product.text.products")})
            </span>
          )}
        </h2>
      </div>

      <div className="mpm_search_and_buttons">
        {/* Search bar */}
        <div className="mpm_search_content">
          <StyleProductSearch
            label={t("product.label.search")}
            variant="outlined"
            data-testid="psearch_content"
            fullWidth
            value={searchQuery}
            size="small"
            onChange={handleSearchChange}
          />
          <div className="category_dropdown">
            <FormControl fullWidth>
              <InputLabel id="category-label" size="small">
                {t("product.label.filterByCategory")}
              </InputLabel>
              <ProductCategorySelect
                labelId="category-label"
                id="category-select"
                label="Select Category"
                multiple
                data-testid="cdrop"
                size="small"
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
                      checked={selectedCategories.includes(
                        category.categoryName
                      )}
                    />
                    <ListItemText primary={category.categoryName} />
                  </MenuItem>
                ))}
              </ProductCategorySelect>
            </FormControl>
          </div>
          {viewProduct !== "table" &&
            (selectedProductsToDelete.length <= 0 ? (
              <ProductSelectAll
                onClick={handleSelectAll}
                data-testid="selectall"
              >
                {t("product.buttons.selectAll")}
              </ProductSelectAll>
            ) : (
              <ProductDeSelectAll
                style={{
                  backgroundColor: "#1976D2",
                  color: "white",
                  height: "40px",
                }}
                onClick={handleDeselectAll}
              >
                {t("Product.buttons.deselectAll")}
              </ProductDeSelectAll>
            ))}

          {selectedProductsToDelete.length !== 0 && (
            <ProductDeleteButton
              onClick={handleConfirmationOpen}
              data-testid="deleteb"
            >
              <FontAwesomeIcon
                icon={faTrash}
                size="s"
                style={{
                  cursor: "pointer",
                  color: "white",
                  padding: "0px 5px 2px 0px",
                }}
              />
              {t("Product.buttons.DELETE")}
            </ProductDeleteButton>
          )}
        </div>
        {/* Category dropdown */}
        <div className="mpm_view_buttons">
          <ProductCardButton data-testid="ttview">
            <StyledFontAwesomeIconCell
              icon={faTableCellsLarge}
              data-testid="tttview"
              onClick={productToggleView}
            />
          </ProductCardButton>
          <ProductTableButton data-testid="pview">
            <StyledFontAwesomeIconCell
              icon={faList}
              onClick={productToggleView}
              data-testid="ptview"
            />
          </ProductTableButton>
          <StyledLinkAddProduct
            to="/manager/addproduct"
            data-testid="addproduct"
          >
            <StyledAddProductButton>
              + {t("product.buttons.addProducts")}
            </StyledAddProductButton>
          </StyledLinkAddProduct>
        </div>
      </div>

      {/* Conditional rendering based on view state */}
      {viewProduct === "table" ? (
        <Managertableview
          data-testid="tview"
          updateProductCount={updateProductCount}
          searchQuery={searchQuery}
          selectedCategories={selectedCategories}
          setSelectedProductsToDelete={setSelectedProductsToDelete}
          handleCheckboxChange={handleCheckboxChange}
          deletedProduct={deletedProduct}
          setDeletedProduct={setDeletedProduct}
        />
      ) : (
        <Managercardview
          data-testid="pdview"
          updateProductCount={updateProductCount}
          searchQuery={searchQuery}
          deletedProduct={deletedProduct}
          setDeletedProduct={setDeletedProduct}
          selectedCategories={selectedCategories} // Pass selected categories to ProductPhotoView
          setSelectedProductsToDelete={setSelectedProductsToDelete} // Pass function to select products to delete
          handleCheckboxChange={handleCheckboxChange} // Pass function to handle checkbox change
          handleSelectAll={handleSelectAll}
          handleDeselectAll={handleDeselectAll}
          selectedProductsToDelete={selectedProductsToDelete}
        />
      )}

      {/* Confirmation dialog */}
      <Dialog
        data-testid="popup"
        open={confirmationOpen}
        onClose={handleConfirmationClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("product.text.confirmDelete")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("product.text.areYouSureYouWantToDeleteSelectedProducts")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleConfirmationClose}
            color="primary"
            variant="outlined"
          >
            {t("product.buttons.cancel")}
          </Button>
          <Button
            onClick={handleProductDelete}
            color="warning"
            variant="contained"
            autoFocus
          >
            {t("product.buttons.confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={successMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // Correct position
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "green",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default ManagerProductManage;
