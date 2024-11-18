import { useState, useEffect } from "react";
import { Button, TextField, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StatusButtons from "./StatusButtons";
import OrdersGrid from "./OrderCards"; // Make sure to update the import if necessary
import OrderDetails from "./OrderDetails";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import Cookies from "js-cookie";
import API_ENDPOINTS from "../../../config/url.config";
import { ORDER_STATUSES, statusFilters } from "../../../config/constant";
import "../../../styles/manager/TakeawayOrders.css";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
const StyledTextField = styled(TextField)({
  width: 127,
  height: 42,
});
const StyledButtonNewOrder = styled(Button)({
  backgroundColor: "#1976D2",
  width: 127,
  height: 42,
});
const TakeawayOrders = () => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]); // State to store filtered orders
  const [selectedStatus, setSelectedStatus] = useState([0]); // Track selected status

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]); // Add state to store orders
  const navigate = useNavigate(); // Initialize navigate
  const currentDate = new Date().toLocaleDateString();
  const [cookiesData, setCookiesData] = useState({});

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    // Fetch takeaway orders from API
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.diningOrder.placeOrder}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        setFilteredOrders(response.data); // Set initial filtered orders
        setOrders(response.data); // Set the orders from API response
      } catch (error) {
        console.error("Error fetching takeaway orders:", error);
      }
    };

    fetchOrders();
  }, []);
  useEffect(() => {
    const searchOrderId = setTimeout(() => {
      if (searchValue.trim() !== "") {
        const filtered = orders.filter((order) =>
          order.orderId.toString().includes(searchValue)
        );
        setFilteredOrders(filtered);
      } else {
        setFilteredOrders(orders); // Reset filtered orders if search is cleared
      }
    }, 3000); // 3-second debounce

    // Cleanup function to clear the timeout if the searchValue changes before 3 seconds
    return () => clearTimeout(searchOrderId);
  }, [searchValue, orders]);

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    const filtered = statusFilters[status](orders);
    setFilteredOrders(filtered);
  };

  const handleCardClick = async (order) => {
    try {
      // Fetch data from the specified endpoint
      const response = await axios.get(
        `${API_ENDPOINTS.manager.menuItemDiningOrder.getmenuItemDiningOrder}/${order.orderId}`, // Ensure this is the correct endpoint
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`, // Use token from cookies
          },
        }
      );
      setSelectedOrder(response.data); // Set the selected order along with the orderType
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  return (
    <div className="takeawayoverall">
      <div className="takeawayone">
        <div className="takeawaytwo">
          <div className="dateandsearchtw">
            <span className="date-display">{currentDate}</span>
            {/* Search Field */}
            <StyledTextField
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              variant="outlined"
              size="small"
              placeholder="Search"
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
            />
          </div>
          <div className="Neworderbutton">
            {/* New Order Button */}
            <StyledButtonNewOrder
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/manager/order_processing/takeaway"); // Navigate to the desired route
              }}
            >
              {t("statusButtons.newOrder")}
            </StyledButtonNewOrder>
          </div>
        </div>
        <div className="status-button">
          <StatusButtons
            onButtonClick={handleStatusClick}
            selectedStatus={selectedStatus}
          />
        </div>
        <div className="orders-grid">
          <OrdersGrid orders={filteredOrders} onCardClick={handleCardClick} />{" "}
          {/* Pass orders as a prop */}
        </div>
      </div>
      {selectedOrder && (
        <div className="order-details">
          <OrderDetails order={selectedOrder} orderDetail={orders} />
        </div>
      )}
    </div>
  );
};

export default TakeawayOrders;
