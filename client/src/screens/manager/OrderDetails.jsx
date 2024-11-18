import {
  Container,
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Button,
  Select,
  IconButton,
  TextField,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faArrowLeftLong,
  faMinus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_ENDPOINTS from "../../config/url.config";
import { useTranslation } from "react-i18next";
import { status } from "../../config/constant";

const OrderDetails = ({
  itemsWithQuantities,
  setQuantities,
  quantities,
  count,
  menuitems,
  clearQuantities,
  setIsOrderPlaced,
}) => {
  const { tableId } = useParams();
  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [customerId, setCustomerId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [tableStatus, setTableStatus] = useState("Available");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [placedOrder, setplacedOrder] = useState([]);
  const [mappedOrderItems, setMappedOrderItems] = useState([]);
  const [cookiesData, setCookiesData] = useState({});
  const [comments, setComments] = useState({});
  const [clickedItemId, setClickedItemId] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Calculate total items by summing the quantities of all items
    const totalItems = itemsWithQuantities.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);
    setTotalItems(totalItems);
  }, [itemsWithQuantities]);

  const fetchPlacedOrderData = async () => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const response = await axios.get(
      `${API_ENDPOINTS.manager.diningOrder.getPlacedOrderData}/${tableId}`,
      {
        headers: {
          Authorization: `Bearer ${storedData.token}`,
        },
      }
    );
    setplacedOrder(response.data[0]);
  };
  useEffect(() => {
    fetchPlacedOrderData();
  }, []);

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => {
      const itemTotal = item.itemPrice * item.quantity;
      return total + itemTotal;
    }, 0); // Initial value of total is 0
  };
  useEffect(() => {
    // Map the placedOrder's menu items to the menuItems array
    if (menuitems.length > 0) {
      if (placedOrder) {
        setOrderId(placedOrder.orderId);
        setIsOrderPlaced(true);
        const mappedOrderItems = placedOrder.MenuItemDiningOrder.map(
          (orderItem) => {
            const menuItem = menuitems.find(
              (item) => item.itemId === orderItem.menuItemId
            );
            return {
              ...menuItem,
              quantity: orderItem.quantity,
              status: orderItem.KOTItems[0].status,
              KotItemId: orderItem.KOTItems[0].id,
            };
          }
        );
        const total = calculateTotalAmount(mappedOrderItems);
        setSubtotal(total);
        setMappedOrderItems(mappedOrderItems);
      }
    }
  }, [placedOrder]);

  const handlePlaceOrder = async () => {
    if (isSubmitting) return; // Prevent duplicate clicks
    setIsSubmitting(true);
    const menu_item = Object.keys(quantities).map((itemId) => ({
      itemId,
      quantity: quantities[itemId],
      comment: comments[itemId] || "", // Add the comment for each item
    }));
    // const loadingToastId = toast.loading("Placing order...");
    const data = {
      orderId: parseInt(orderId) || null,
      tableId: parseInt(tableId) || null,
      customerId: customerId || null,
      totalPrice: subtotal,
      menu_item: quantities,
      menu_item_comments: menu_item,
      orderStatus: parseInt(tableId)
        ? `${status.Pending}`
        : `${status.NewOrder}`,
      hasPriority: false,
      createdDate: new Date(),
      updatedDate: new Date(),
      createdBy: cookiesData.username,
      updatedBy: cookiesData.username,
      orderType: parseInt(tableId) ? "Dine-in" : "takeaway",
    };
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.manager.diningOrder.placeOrder}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      setOrderId(response.data);
      setIsOrderPlaced(true);
      setTableStatus("Reserved");
      // toast.dismiss(loadingToastId);
      setIsSubmitting(false);
      clearQuantities({});
      setComments("");
      fetchPlacedOrderData();
      toast.success("Order placed successfully!");
    } catch (error) {
      // toast.dismiss(loadingToastId);
      toast.error("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleAddItem = (item) => {
    setQuantities(item.itemId, item.quantity + 1);
  };
  const handleRemoveItem = (item) => {
    if (item.quantity > 0) {
      setQuantities(item.itemId, item.quantity - 1);
    }
  };

  const handleItemDelete = async (KotItemId) => {
    try {
      const params = {
        status: `${status.Cancelled}`,
      };
      await axios.delete(
        `${API_ENDPOINTS.manager.kotItems.deletePendingOrderItem}/${KotItemId}`,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
          params: params,
        }
      );
      fetchPlacedOrderData();
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error(
        "Error deleting item:",
        error?.response?.data || error.message
      );
      toast.error("Failed to delete item. Please try again.");
    }
  };

  const handleItemStatusUpdate = async (kotItemsId) => {
    try {
      const data = {
        status: `${status.Served}`,
      };
      await axios.put(
        `${API_ENDPOINTS.manager.kotItems.updatestatus}/${kotItemsId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      fetchPlacedOrderData();
      toast.success("Item status updated successfully");
    } catch (error) {
      console.error(
        "Error updating item status:",
        error?.response?.data || error.message
      );
      toast.error("Failed to update item status. Please try again.");
    }
  };

  const handleRowClick = (item) => {
    setClickedItemId(item.itemId); // Set clicked item ID
  };

  const handleCommentChange = (itemId, value) => {
    setComments((prev) => ({ ...prev, [itemId]: value }));
  };

  const gridRef = useRef(null);

  const handleClickOutside = (event) => {
    if (gridRef.current && !gridRef.current.contains(event.target)) {
      setClickedItemId(null); // Clear clickedItemId
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const allItemsServed =
    mappedOrderItems.length > 0 &&
    mappedOrderItems
      .filter((item) => item.status != `${status.Cancelled}`)
      .every((item) => {
        return item.status === `${status.Served}`;
      });

  const handleBillClick = async () => {
    try {
      const data = {
        orderStatus: `${status.Completed}`,
        bill: {
          orderId: orderId,
          totalAmount: subtotal,
          createdAt: new Date(),
        },
      };
      await axios.put(
        `${API_ENDPOINTS.manager.diningOrder.updateForBilling}/${orderId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      //Change this to actual route
      navigate(`/manager/order_processing/order_billing/${orderId}`);
    } catch (error) {
      console.error(
        "Error updating item status:",
        error?.response?.data || error.message
      );
      toast.error("Failed to update item status. Please try again.");
    }
  };

  return (
    <Container>
      <ToastContainer position="topRight" autoClose={5000} hideProgressBar />

      <Paper
        elevation={3}
        sx={{ p: "1%", mb: "1%" }}
        style={{
          border: "1px solid #707070",
          borderRadius: "10px",
          padding: "11px",
          marginBottom: "15px",
          height: "80vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "spaceBetween",
          }}
        >
          <div>
            <Box sx={{ mt: "1%", mb: "1%" }}>
              <div style={{ display: "flex", justifyContent: "spaceBetween" }}>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      paddingRight: "3%",
                      paddingTop: "8px",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faArrowLeftLong}
                      onClick={() => {
                        navigate("/manager/orderProcessing");
                      }}
                    />
                  </div>
                  <div style={{ minWidth: "maxContent" }}>
                    <Typography variant="h6">
                      {t("orderProcessing.orderDetails.text.orderDetails")}
                    </Typography>
                    {orderId && (
                      <div style={{ marginBottom: "15px" }}>
                        <Typography variant="subtitle1">
                          {`#ORD-${orderId}`}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ paddingTop: "5px" }}>
                  <Select style={{ height: "40px", width: "180px" }}></Select>
                </div>
              </div>
            </Box>
            {itemsWithQuantities.length == 0 &&
              count > 0 &&
              mappedOrderItems.length < 0 && (
                <div>
                  <Divider />
                  <h4
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      paddingTop: "20px",
                    }}
                  >
                    {t("orderProcessing.orderDetails.text.cartIsEmpty")}
                  </h4>
                </div>
              )}
            <Divider />

            <Box sx={{ mt: "1%", mb: "1%" }}>
              {mappedOrderItems.length > 0 &&
                mappedOrderItems
                  .filter((item) => item.status != `${status.cancelled}`)
                  .map((item) => (
                    <Box key={item.itemId}>
                      <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        padding="10px"
                      >
                        <Grid item xs={1}>
                          <div
                            style={{
                              border: "1px solid #707070",
                              width: "120%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {item.quantity}
                          </div>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            variant="body1"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {item.itemName}
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "right",
                            }}
                          >
                            {item.status === `${status.pending}` && (
                              <Typography
                                sx={{ color: "#FC9600", fontWeight: 600 }}
                              >
                                {t("orderProcessing.orderDetails.text.pending")}
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  style={{
                                    paddingLeft: "10px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => {
                                    handleItemDelete(item.kotItemId);
                                  }}
                                />
                              </Typography>
                            )}
                            {item.status === `${status.inProgress}` && (
                              <Typography
                                sx={{ color: "#03A9F4", fontWeight: 600 }}
                              >
                                {t(
                                  "orderProcessing.orderDetails.text.inProgress"
                                )}
                              </Typography>
                            )}
                            {item.status === `${status.served}` && (
                              <Typography
                                sx={{ color: "#4CAF50", fontWeight: 600 }}
                              >
                                {t("orderProcessing.orderDetails.text.served")}
                              </Typography>
                            )}
                            {item.status === `${status.waitingForPickup}` && (
                              <Button
                                sx={{
                                  display: "flex",
                                  textTransform: "none",
                                  color: "#fff",
                                  backgroundColor: "#1976D2",
                                  "&:hover": {
                                    backgroundColor: "#1565C0",
                                  },
                                }}
                                onClick={() => {
                                  handleItemStatusUpdate(item.kotItemId);
                                }}
                              >
                                {t(
                                  "orderProcessing.orderDetails.button.markPickedUp"
                                )}
                              </Button>
                            )}
                          </div>
                        </Grid>
                      </Grid>
                      <Divider />
                    </Box>
                  ))}

              {itemsWithQuantities.map((item) => (
                <Box
                  sx={{
                    border: "1px solid transparent",
                    "&:hover": {
                      backgroundColor: "#EDF9FA", // Background color on hover
                    },
                  }}
                  onClick={() => {
                    handleRowClick(item);
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    key={item.itemId}
                    alignItems="center"
                    marginBottom="15px"
                  >
                    <Grid item xs={8}>
                      <Typography
                        variant="body1"
                        style={{ textTransform: "capitalize" }}
                      >
                        {item.itemName}
                      </Typography>
                      <Typography variant="body2">
                        ₹ {item.itemPrice}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <div className="quanityAddRemoveButtonContent">
                        <IconButton
                          onClick={() => {
                            handleRemoveItem(item);
                          }}
                          style={{
                            width: "20px",
                            height: "20px",
                            boxShadow: "0px 3px 6px #00000029",
                            backgroundColor: "#FFFFFF",
                            borderRadius: "5px",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faMinus}
                            style={{
                              fontSize: "9px",
                              color: "#000000",
                            }}
                          />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          onClick={() => {
                            handleAddItem(item);
                          }}
                          style={{
                            width: "20px",
                            height: "20px",
                            boxShadow: "0px 3px 6px #00000029",
                            borderRadius: "5px",
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faAdd}
                            style={{
                              fontSize: "9px",
                              color: "#000000",
                            }}
                          />
                        </IconButton>
                      </div>
                    </Grid>
                    <Grid item xs={12} ref={gridRef}>
                      {clickedItemId === item.itemId ||
                      comments[item.itemId] ? (
                        <TextField
                          label={t(
                            "orderProcessing.orderDetails.label.internalComments"
                          )}
                          variant="outlined"
                          fullWidth
                          value={comments[item.itemId] || ""}
                          onChange={(e) =>
                            handleCommentChange(item.itemId, e.target.value)
                          }
                          size="small"
                          sx={{ backgroundColor: "#FFFFFF" }}
                        />
                      ) : null}
                    </Grid>
                  </Grid>
                  <Divider />
                </Box>
              ))}
            </Box>
          </div>

          {itemsWithQuantities.length > 0 && (
            <div>
              <Divider />
              <Box sx={{ mt: "1%" }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h6">
                      {t("orderProcessing.orderDetails.text.totalItems")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" align="right">
                      {totalItems}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ mt: "1%" }}>
                <Button
                  variant="contained"
                  disabled={isSubmitting}
                  onClick={handlePlaceOrder}
                  fullWidth
                  style={{
                    backgroundColor: isSubmitting ? "#00000029" : "#1976D2",
                    color: isSubmitting ? "#0F0F0F" : "#FFFFFF",
                  }}
                >
                  {t("orderProcessing.orderDetails.button.placeOrder")}
                </Button>
              </Box>
            </div>
          )}
          {allItemsServed && !itemsWithQuantities.length > 0 && (
            <Box sx={{ mt: "1%" }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => handleBillClick()}
                style={{
                  backgroundColor: "#1976D2",
                  color: "#FFFFFF",
                }}
              >
                {t("orderProcessing.orderDetails.button.bill")}
              </Button>
            </Box>
          )}
        </div>
      </Paper>
    </Container>
  );
};

export default OrderDetails;
