import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Checkbox,
  TextField,
  IconButton,
  Card,
  CardContent,
  Container,
  Divider,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CategoryBar from "./FoodItemCategoryBar";
import FoodCard from "./MenuItemCard";
import Cookies from "js-cookie";
import OrderDetails from "./OrderDetails";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import API_ENDPOINTS from "../../config/url.config";
import "../../../src/styles/manager/OrderProcessing.css";
import TransferTableDialog from "./TransferTableDialog";
import CustomerDetails from "./CustomerDetails";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
const StyledBox1 = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flex: 2.5,
  height: "48px",
  // You can add additional styles here
}));
const StyledDivider = styled(Divider)(({ theme }) => ({
  backgroundColor: "#707070",
  width: "1px",
  height: "100%", // Example: make it extend to full height
  margin: theme.spacing(1), // Optional: add margin if needed
}));
const StyledBox2 = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: 1,
  alignItems: "center",
  flexDirection: "column",
}));
const StyledGrid1 = styled(Grid)(({ theme }) => ({
  width: "100%",
}));
const StyledGridItem = styled(Grid)(({ theme }) => ({
  padding: "10px",
}));
const StyledTypographyNoItemFound = styled(Typography)(({ theme }) => ({
  padding: "20px",
  textAlign: "center",
  width: "100%",
  // You can add more styles here if needed
}));

function OrderProcessing() {
  const { tableId } = useParams();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cookiesData, setCookiesData] = useState({});
  const [items, setItems] = useState([]);
  const [menuitems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [count, setCount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [searchDish, setSearchDish] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(""); // for debouncing the search
  const [filteredItems, setFilteredItems] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.menuitemscategory.itemCategoryData}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        setCategories(response.data);
        if (response.data.length > 0) {
          setSelectedCategory(response.data[0].categoryId);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.menuitems.branchItems}/${storedData.branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        setMenuItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchCategories();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (selectedCategory === null) return;

    const fetchItemsByCategory = async () => {
      // const loadingToastId = toast.loading("Loading menu item...");
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.menuitems.itemsData}/${selectedCategory}/${cookiesData.branchId}`,

          {
            headers: {
              Authorization: `Bearer ${cookiesData.token}`,
            },
          }
        );
        // toast.dismiss(loadingToastId);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchItemsByCategory();
  }, [selectedCategory]);

  useEffect(() => {
    if (isOrderPlaced) {
      setQuantities([]);
    }
  }, [isOrderPlaced]);

  const handleQuantityChange = (itemId, newQuantity) => {
    setCount(count + 1);
    if (newQuantity === 0) {
      // Remove item from quantities if quantity is 0
      setQuantities((prevQuantities) => {
        const newQuantities = { ...prevQuantities };
        delete newQuantities[itemId];
        return newQuantities;
      });
    } else {
      // Update item quantity
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [itemId]: newQuantity,
      }));
    }
  };

  const getItemsWithQuantities = () => {
    return menuitems
      .map((item) => {
        if (quantities[item.itemId] !== undefined) {
          return {
            ...item,
            quantity: quantities[item.itemId],
          };
        }
        return null;
      })
      .filter((item) => item !== null);
  };
  useEffect(() => {
    // Debounce search query by 2 seconds
    const handlerfordish = setTimeout(() => {
      setDebouncedQuery(searchDish);
    }, 2000);

    // Cleanup timeout if the effect is re-run (on query change)
    return () => {
      clearTimeout(handlerfordish);
    };
  }, [searchDish]);

  useEffect(() => {
    // Perform filtering whenever the debounced query changes
    const filtered = items.filter(
      (item) =>
        item.itemName &&
        item.itemName
          .toString()
          .toLowerCase()
          .includes(debouncedQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [debouncedQuery, items]);

  return (
    <div>
      <div style={{ display: "flex", paddingLeft: "20px" }}>
        {/* Customer Name, Table Number, Priority, and Search */}
        <StyledBox1>
          <div
            style={{
              display: "flex",
              border: "1px solid #707070",
              borderRadius: "5px",
              height: "38px",
              width: "80%",
            }}
          >
            <div
              style={{
                paddingLeft: "16px",
                paddingRight: "16px",
                alignItems: "center",
                display: "flex",
                minWidth: "max-content",
              }}
            >
              {t("orderProcessing.text.customerName")} {customerName || "N/A"}
              <CustomerDetails setCustomerName={setCustomerName} />
            </div>
            <StyledDivider orientation="vertical" flexItem />

            <div
              style={{
                display: "flex",
                paddingLeft: "16px",
                paddingRight: "16px",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div>
                {t("orderProcessing.text.tableNo")} {tableId}
              </div>
              <div>
                <Checkbox />
                <span> {t("orderProcessing.text.markPriority")}</span>
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid #707070",
              borderRadius: "5px",
              height: "38px",
              width: "19%",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Dishes Name"
              value={searchDish}
              onChange={(e) => setSearchDish(e.target.value)} // Update search query
            />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </div>
        </StyledBox1>

        {/* Internal Notes, Transfer Table, and Order Details */}
        <StyledBox2
          sx={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <div className="space_around">
            <div className="internal_notes">
              {t("orderProcessing.text.internalNotes")}
            </div>
            <div
              className="transfer_table"
              onClick={() => {
                if (isOrderPlaced) {
                  setIsTransferDialogOpen(true);
                }
              }}
              style={{
                cursor: isOrderPlaced ? "pointer" : "not-allowed",
              }}
              disabled={!isOrderPlaced}
            >
              {t("orderProcessing.text.transferTable")}
            </div>
          </div>
        </StyledBox2>
      </div>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 2.5, display: "flex" }}>
          <div
            style={{
              flex: 1,
              flexDirection: "row",
              display: "flex",
              paddingTop: "8px",
            }}
          >
            <CategoryBar
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
          <div style={{ flex: 8 }}>
            <StyledGrid1
              container
              sx={{
                width: "100%",
              }}
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <StyledGridItem
                    item
                    xs={2.4}
                    sm={2.4}
                    md={2.4}
                    key={item.itemId}
                  >
                    <FoodCard
                      item={item}
                      quantity={quantities[item.itemId] || 0}
                      onQuantityChange={handleQuantityChange}
                    />
                  </StyledGridItem>
                ))
              ) : (
                <StyledTypographyNoItemFound
                  variant="h6"
                  component="div"
                  sx={{ padding: "20px", textAlign: "center", width: "100%" }}
                >
                  {t("orderProcessing.text.noItemsFound")}
                </StyledTypographyNoItemFound>
              )}
            </StyledGrid1>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <OrderDetails
            itemsWithQuantities={getItemsWithQuantities()}
            setQuantities={handleQuantityChange}
            onQuantityChange={handleQuantityChange}
            quantities={quantities}
            count={count}
            menuitems={menuitems}
            clearQuantities={setQuantities}
            setIsOrderPlaced={setIsOrderPlaced}
          />
        </div>
      </div>
      <TransferTableDialog
        open={isTransferDialogOpen}
        onClose={() => setIsTransferDialogOpen(false)}
      />
    </div>
  );
}

export default OrderProcessing;
