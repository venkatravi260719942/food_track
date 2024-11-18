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
import { API_ENDPOINTS } from "../../../config/url.config";
import { useLanguage } from "../../../LanguageContext";
import { useTranslation } from "react-i18next";
import FoodItemsTableView from "./FoodItemsTableView";
import FoodItemsCardView from "./FoodItemsCardView";
import "../../../styles/manager/FoodItem.css";
import { VIEW_TYPES } from "../../../config/constant";

function ManagerFoodItems() {
  // State variables
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
    const branchId = storedData.branchId;
    const savedView = localStorage.getItem("currentView");
    if (savedView) {
      setCurrentView(savedView);
    } else {
      setCurrentView(VIEW_TYPES.TABLE);
      localStorage.setItem("currentView", VIEW_TYPES.TABLE);
    }

    async function fetchData() {
      try {
        const itemResponse = await axios.get(
          `${API_ENDPOINTS.manager.menuitems.branchItems}/${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const itemData = itemResponse.data;

        const categoryResponse = await axios.get(
          `${API_ENDPOINTS.manager.menuitemscategory.itemCategoryData}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        const categoryData = categoryResponse.data;
        setCategories(categoryData);
        const productsWithCategory = itemData.map((product) => ({
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

  const handleViewChange = (viewType) => {
    setCurrentView(viewType);
    localStorage.setItem("currentView", viewType); // Save view type in localStorage
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
      for (const itemId of selectedProductsToDelete) {
        const response = await axios.delete(
          `${API_ENDPOINTS.manager.menuitemdelete.itemDelete}/${itemId}`,
          {
            headers: {
              Authorization: `Bearer ${cookiesData.token}`,
            },
          }
        );

        if (response.status !== 204) {
          throw new Error(`Failed to delete product with ID ${itemId}`);
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
  const handleCheckboxChange = (itemId) => {
    setSelectedProductsToDelete((prevSelected) =>
      prevSelected.includes(itemId)
        ? prevSelected.filter((id) => id !== itemId)
        : [...prevSelected, itemId]
    );
  };

  const getFilteredProducts = () => {
    return products
      .filter((product) =>
        selectedCategories.length
          ? selectedCategories.includes(product.category?.category)
          : true
      )
      .filter((product) =>
        searchQuery
          ? product.itemName.toLowerCase().includes(searchQuery.toLowerCase())
          : true
      );
  };

  const handleSelectAll = () => {
    const filteredItemIds = getFilteredProducts().map(
      (product) => product.itemId
    );

    setSelectedProductsToDelete(filteredItemIds);
  };

  const handleDeselectAll = () => {
    setSelectedProductsToDelete([]);
  };

  // Render the component
  return (
    <div className="product_page">
      <div className="FI_productPageTitle">
        <h2 style={{ width: "250px", height: "37px" }}>
          {t("fooditems.text.foodItems")}
          {productCount > 0 && (
            <span style={{ height: "26px", width: "85px" }}>
              ({productCount} {t("fooditems.text.items")})
            </span>
          )}
        </h2>
      </div>

      <div className="FI_search_and_buttons">
        {/* Search bar */}
        <div className="FI_search_content">
          <div className="FI_searchTag">
            <TextField
              label={t("fooditems.text.typetosearch")}
              variant="outlined"
              value={searchQuery}
              size="small"
              onChange={handleSearchChange}
              sx={{
                width: "250px",
                height: "34px",
              }}
            />
          </div>
          <div className="category_dropdown">
            <FormControl>
              <InputLabel id="category-label" size="small">
                {t("fooditems.text.Category")}
              </InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                label="Select Category"
                multiple
                size="small"
                value={selectedCategories}
                onChange={handleCategoryChange}
                renderValue={(selected) => selected.join(", ")}
                sx={{
                  width: "144px",
                  alignContent: "center",
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category.categoryId} value={category.category}>
                    <Checkbox
                      checked={selectedCategories.includes(category.category)}
                    />
                    <ListItemText primary={category.category} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {currentView !== `${VIEW_TYPES.TABLE}` &&
            (selectedProductsToDelete.length <= 0 ? (
              <Button
                style={{
                  backgroundColor: "#1976D2",
                  color: "white",
                }}
                onClick={handleSelectAll}
              >
                {t("product.buttons.selectAll")}
              </Button>
            ) : (
              <Button
                style={{
                  backgroundColor: "#1976D2",
                  color: "white",
                }}
                onClick={handleDeselectAll}
              >
                {t("product.buttons.deselectAll")}
              </Button>
            ))}

          {selectedProductsToDelete.length !== 0 && (
            <Button
              style={{
                backgroundColor: "#D32F2F",
                color: "white",
              }}
              onClick={handleConfirmationOpen}
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
              {t("product.buttons.delete")}
            </Button>
          )}
        </div>
        {/* Category dropdown */}
        <div className="FI_view_buttons">
          <Button
            style={{
              border: "1px solid black",
              minWidth: "36px",
              height: "36px",
              backgroundColor:
                currentView === `${VIEW_TYPES.CARD}`
                  ? "#1976D2"
                  : "transparent",
            }}
            sx={{
              "&:hover": {
                backgroundColor: "lightblue",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              },
            }}
            disabled={currentView === `${VIEW_TYPES.CARD}`}
            className={` ${
              currentView === `${VIEW_TYPES.CARD}` ? "active" : ""
            }`}
            onClick={() => handleViewChange(VIEW_TYPES.CARD)}
          >
            <FontAwesomeIcon
              icon={faTableCellsLarge}
              style={{
                height: "20px",
                width: "20px",
                fontSize: "1.5rem",
                cursor: "pointer",
                color: currentView === `${VIEW_TYPES.CARD}` ? "white" : "black",
              }}
            />
          </Button>
          <Button
            style={{
              border: "1px solid black",
              minWidth: "36px",
              height: "36px",
              backgroundColor:
                currentView === `${VIEW_TYPES.TABLE}`
                  ? "#1976D2"
                  : "transparent",
            }}
            sx={{
              "&:hover": {
                backgroundColor: "lightblue",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
              },
            }}
            className={` ${
              currentView === `${VIEW_TYPES.TABLE}` ? "active" : ""
            }`}
            disabled={currentView === `${VIEW_TYPES.TABLE}`}
            onClick={() => handleViewChange(VIEW_TYPES.TABLE)}
          >
            <FontAwesomeIcon
              icon={faList}
              style={{
                height: "20px",
                width: "20px",
                fontSize: "1.5rem",
                cursor: "pointer",
                color:
                  currentView === `${VIEW_TYPES.TABLE}` ? "white" : "black",
              }}
            />
          </Button>
          <Link to="addFoodItem" style={{ backgroundColor: "transparent" }}>
            <button className="fooditem_add">
              + {t("fooditems.buttons.addItem")}
            </button>
          </Link>
        </div>
      </div>

      {/* Conditional rendering based on view state */}

      {currentView === `${VIEW_TYPES.TABLE}` && (
        <FoodItemsTableView
          updateProductCount={updateProductCount}
          searchQuery={searchQuery}
          selectedCategories={selectedCategories}
          setSelectedProductsToDelete={setSelectedProductsToDelete}
          handleCheckboxChange={handleCheckboxChange}
          deletedProduct={deletedProduct}
          setDeletedProduct={setDeletedProduct}
          currentView={currentView}
        />
      )}
      {currentView === `${VIEW_TYPES.CARD}` && (
        <FoodItemsCardView
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
          currentView={currentView}
        />
      )}

      {/* Confirmation dialog */}
      <Dialog
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
            {t(
              "fooditems.text.Are you sure you want to delete selected food items?"
            )}
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
          <Button onClick={handleProductDelete} variant="contained" autoFocus>
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

export default ManagerFoodItems;
