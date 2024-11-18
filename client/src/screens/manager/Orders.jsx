import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import "../../styles/manager/Orders.css";
import API_ENDPOINTS from "../../config/url.config";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import OrderDetailsDialog from "../manager/OrderDetailsDialog";
import { ORDER_STATUS } from "../../config/constant";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
const StyledTypographyPedingOrders = styled(Typography)(({ theme }) => ({
  padding: "18px 0px 18px 16px", // Set padding
}));
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  borderRadius: "10px", // Set border radius for the DataGrid
  "& .MuiDataGrid-container--top [role=row]": {
    backgroundColor: "#F9F9F9", // Set background color for top rows
    borderTopRightRadius: "10px", // Set border radius for top right
    borderTopLeftRadius: "10px", // Set border radius for top left
  },
  "& .css-wop1k0-MuiDataGrid-footerContainer": {
    backgroundColor: "#F9F9F9", // Set background color for footer
    borderBottomRightRadius: "10px", // Set border radius for bottom right
    borderBottomLeftRadius: "10px", // Set border radius for bottom left
  },
}));
const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: "18px 0px 18px 15px", // Set padding
}));
const StyledDataGrid2 = styled(DataGrid)(({ theme }) => ({
  borderRadius: "10px", // Set border radius for the DataGrid
  "& .MuiDataGrid-container--top [role=row]": {
    backgroundColor: "#F9F9F9", // Set background color for top rows
    borderTopRightRadius: "10px", // Set border radius for top right
    borderTopLeftRadius: "10px", // Set border radius for top left
  },
  "& .css-wop1k0-MuiDataGrid-footerContainer": {
    backgroundColor: "#F9F9F9", // Set background color for footer
    borderBottomRightRadius: "10px", // Set border radius for bottom right
    borderBottomLeftRadius: "10px", // Set border radius for bottom left
  },
}));
const Orders = () => {
  const [cookiesData, setCookiesData] = useState({});
  const [pendingOrders, setPendingOrders] = useState([]);
  const [recentDeliveries, setRecentDeliveries] = useState([]);
  const [supplierResponse, setSupplierResponse] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [showAllDeliveries, setShowAllDeliveries] = useState(false);
  const [pendingRowsPerPage, setPendingRowsPerPage] = useState(5);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [orderResponse, setOrderResponse] = useState();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { t } = useTranslation();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const storedData = Cookies.get();
      setCookiesData(storedData);
      const branchId = storedData.branchId;
      const supplierId = storedData.organisationId;
      try {
        const orderResponse = await axios.get(
          `${API_ENDPOINTS.manager.orders.orderResponse}/${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const orders = orderResponse.data;
        setOrderResponse(orders);
        const pending = orders.filter((order) => !order.orderStatus);
        const delivered = orders.filter((order) => order.orderStatus);
        setPendingOrders(pending);
        setRecentDeliveries(delivered);

        // Initialize checkboxStates based on the orders fetched
        const initialCheckboxStates = {};
        pending.forEach((order) => {
          const itemsArray = JSON.parse(order.items);

          const allItemsReceived = itemsArray.every(
            (item) => item.itemStatus === true
          );
          const partiallyReceived = itemsArray.some(
            (item) => item.itemStatus === true
          );

          const orderStatus = allItemsReceived
            ? ORDER_STATUS.RECEIVED
            : partiallyReceived
            ? ORDER_STATUS.PARTIALLY_RECEIVED
            : ORDER_STATUS.PENDING;

          initialCheckboxStates[order.orderId] = {
            status: orderStatus,
            items: itemsArray.map((item) => ({
              productId: item.productId,
              itemStatus: item.itemStatus,
            })),
          };
        });

        setCheckboxStates(initialCheckboxStates);

        const suppliersResponse = await axios.get(
          `${API_ENDPOINTS.manager.orders.suppliersResponse}/${supplierId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        setSupplierResponse(suppliersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getSupplierName = (supplierId) => {
    const supplier = supplierResponse.find(
      (sup) => sup.supplierId === supplierId
    );
    return supplier
      ? supplier.supplierName
      : `${t("orders.text.unknownSupplier")}`;
  };

  const handleClickOpen = (order) => {
    setCurrentOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentOrder(null);
  };

  const handleConfirm = async (orderId) => {
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.manager.orders.orderResponse}/${orderId}`,
        { orderStatus: true },
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      setPendingOrders((prevOrders) =>
        prevOrders.filter((order) => order.orderId !== orderId)
      );
      const updatedOrder = pendingOrders.find(
        (order) => order.orderId === orderId
      );
      setRecentDeliveries((prevDeliveries) => [
        updatedOrder,
        ...prevDeliveries,
      ]);
      handleClose();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const toggleShowAllDeliveries = () => {
    setShowAllDeliveries(!showAllDeliveries);
  };

  const handlePay = (orderId) => {
    navigate("/manager/pay", { state: { orderId } });
  };

  const handleRowClick = (order) => {
    const rowResponse = orderResponse.find(
      (orderData) => orderData.orderId === order.orderId
    );
    setSelectedOrder(rowResponse);
    setDetailsOpen(true);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleCheckboxChange = async (orderId, itemId) => {
    setPendingOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) => {
        if (order.orderId === orderId) {
          const itemsArray = JSON.parse(order.items);
          const updatedItems = itemsArray.map((item) =>
            item.productId === itemId
              ? { ...item, itemStatus: !item.itemStatus }
              : item
          );

          const allItemsReceived = updatedItems.every(
            (item) => item.itemStatus === true
          );
          const partiallyReceived = updatedItems.some(
            (item) => item.itemStatus === true
          );

          const newStatus = allItemsReceived
            ? ORDER_STATUS.RECEIVED
            : partiallyReceived
            ? ORDER_STATUS.PARTIALLY_RECEIVED
            : ORDER_STATUS.PENDING;

          setCheckboxStates((prevStates) => ({
            ...prevStates,
            [orderId]: {
              status: newStatus,
              items: updatedItems.map((item) => ({
                productId: item.productId,
                itemStatus: item.itemStatus,
              })),
            },
          }));

          return {
            ...order,
            items: JSON.stringify(updatedItems),
            orderStatus: newStatus,
          };
        }
        return order;
      });

      const updatedOrder = updatedOrders.find(
        (order) => order.orderId === orderId
      );
      if (updatedOrder) {
        saveOrderStatusToBackend(updatedOrder);
      }

      return updatedOrders;
    });
  };

  const saveOrderStatusToBackend = async (order) => {
    try {
      const requestBody = {
        items: order.items,
      };

      const response = await axios.put(
        `${API_ENDPOINTS.manager.orders.orderResponse}/${order.orderId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      // Optionally update orderResponse or other states here
    } catch (error) {
      if (error.response) {
        console.error("Server responded with status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else {
        console.error("Error updating order status:", error);
      }
    }
  };

  const sortedRecentDeliveries = recentDeliveries
    .slice()
    .sort((a, b) => new Date(b.orderedDate) - new Date(a.orderedDate));

  const rows = pendingOrders.map((order) => {
    const items = JSON.parse(order.items);
    const allItemStatuses = items.every((item) => item.itemStatus);
    return {
      id: order.orderId,
      orderId: order.orderId,
      supplierName: getSupplierName(order.supplierId),
      orderedDate: order.orderedDate ? order.orderedDate.split("T")[0] : "",
      orderStatus: checkboxStates[order.orderId]?.status || "Pending",
      itemStatus: allItemStatuses,
    };
  });

  const columns = [
    { field: "orderId", headerName: "ORDER ID", width: 200 },
    {
      field: "supplierName",
      sortable: false,
      headerName: "SUPPLIER NAME",
      width: 250,
    },
    {
      field: "orderedDate",
      sortable: false,
      headerName: "ORDER DATE",
      width: 250,
    },
    {
      field: "orderStatus",
      sortable: false,
      headerName: "ORDER STATUS",
      width: 200,
      renderCell: (params) => {
        if (params.row.itemStatus) {
          return (
            <Button
              onClick={(event) => {
                event.stopPropagation(); // Prevents the row click event from firing
                handleClickOpen(params.row);
              }}
              data-testid={`received-button-${params.row.orderId}`}
            >
              {t("orders.button.received")}
            </Button>
          );
        }
        return params.value; // Display the status if not all items are received
      },
    },
  ];

  return (
    <div className="ordersPage" data-testid="orders-page">
      {/* Pending Orders DataGrid */}
      <div className="ordersPendingRecent">
        <div>
          <StyledTypographyPedingOrders
            variant="h6"
            data-testid="pending-orders-title"
          >
            {t("orders.text.pendingOrders")}
          </StyledTypographyPedingOrders>
          <div
            style={{
              height: 371,
              maxWidth: "1088px",
              padding: "0 0 0 16px",
            }}
          >
            <StyledDataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 }, // Initial page size
                },
              }}
              pageSizeOptions={[5, 10, 25]} // Options for page size
              onPageSizeChange={(newPageSize) =>
                setPendingRowsPerPage(newPageSize)
              } // Handle page size change
              onRowClick={(params) => {
                handleRowClick(params.row); // Handle row click
              }}
              data-testid="pending-orders-grid"
            />
          </div>
        </div>
        {/* Recent Deliveries Table */}
        <div className="recentDeliveriesDiv">
          <StyledTypography variant="h6" data-testid="recent-deliveries-title">
            {t("orders.text.recentDeliveries")}
          </StyledTypography>
          <div
            className="recentDeliveriesContainer"
            data-testid="recent-deliveries-container"
          >
            {sortedRecentDeliveries.slice(0, 4).map((delivery, index) => (
              <Paper
                className="deliveryCard"
                key={index}
                onClick={(event) => handleRowClick(delivery, event)}
              >
                <Typography variant="body1">
                  {t("orders.text.orderID")} {delivery.orderId}
                </Typography>
                <Typography variant="body2">
                  {t("orders.text.supplier")}
                  {getSupplierName(delivery.supplierId)}
                </Typography>
                <Typography variant="body2">
                  {t("orders.text.date")} {delivery.orderedDate.split("T")[0]}
                </Typography>
              </Paper>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={open} onClose={handleClose} data-testid="confirm-dialog">
        <DialogTitle sx={{ alignSelf: "start" }}>
          {t("orders.text.confirmReceipt")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("orders.text.confirmReceiptMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
            data-testid="cancel-button"
          >
            {t("orders.button.cancel")}
          </Button>
          <Button
            onClick={() => handleConfirm(currentOrder.row.orderId)}
            color="primary"
            autoFocus
            data-testid="confirm-button"
          >
            {t("orders.button.confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      {sortedRecentDeliveries.length >= 1 && (
        <div style={{ padding: "20px 0px 0px 16px" }}>
          <Button
            onClick={toggleShowAllDeliveries}
            variant="contained"
            color="primary"
            data-testid="toggle-deliveries-button"
          >
            {showAllDeliveries
              ? `${t("orders.text.toggleDeliveriesButtonHide")}`
              : `${t("orders.text.toggleDeliveriesButtonShow")}`}
          </Button>
        </div>
      )}
      {showAllDeliveries && (
        <div
          style={{
            height: 391,
            maxWidth: "931px",
            padding: "20px 0px 0px 16px",
          }}
        >
          <StyledDataGrid2
            rows={sortedRecentDeliveries.map((order) => ({
              id: order.orderId,
              orderId: order.orderId,
              supplierName: getSupplierName(order.supplierId),
              orderedDate: order.orderedDate.split("T")[0],
              payment: order.orderId, // You can map this to an ID if needed for the payment button
            }))}
            columns={[
              { field: "orderId", headerName: "ORDER ID", width: 200 },
              {
                field: "supplierName",
                headerName: "SUPPLIER NAME",
                width: 250,
                sortable: false,
              },
              {
                field: "orderedDate",
                headerName: "ORDER DATE",
                width: 250,
                sortable: false,
              },
              {
                field: "payment",
                headerName: "PAYMENT",
                width: 200,
                sortable: false,
                renderCell: (params) => (
                  <Button
                    onClick={(event) => {
                      event.stopPropagation(); // Prevents the row click event from firing
                      handlePay(params.value);
                    }}
                    data-testid={`pay-button-${params.value}`}
                  >
                    {t("orders.button.pay")}
                  </Button>
                ),
              },
            ]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5 }, // Initial page size
              },
            }}
            pageSizeOptions={[5, 10, 25]} // Options for page size
            onRowClick={(params) => {
              handleRowClick(params.row); // Handle row click
            }}
            data-testid="recent-deliveries-grid"
          />
        </div>
      )}

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        open={detailsOpen}
        onClose={handleDetailsClose}
        order={selectedOrder}
        getSupplierName={getSupplierName}
        isPending={
          !!selectedOrder &&
          pendingOrders.some((order) => order.orderId === selectedOrder.orderId)
        }
        checkboxStates={checkboxStates[selectedOrder?.orderId]?.items || []}
        handleCheckboxChange={(productId) =>
          handleCheckboxChange(selectedOrder.orderId, productId)
        }
      />
    </div>
  );
};

export default Orders;
