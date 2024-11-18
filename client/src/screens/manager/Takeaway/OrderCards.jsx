import {
  Card,
  CardContent,
  Typography,
  Grid,
  Pagination,
  Box,
} from "@mui/material";
import {
  CheckCircle,
  HourglassEmpty,
  AccessTime,
  Star,
} from "@mui/icons-material";
import { styled } from "@mui/system";
import { ORDER_STATUSES } from "../../../config/constant";

const StyledOrdersCard = styled(Card)(
  ({ theme, orderStatus, borderColors }) => {
    return {
      width: 210,
      height: 112,
      minWidth: 200,
      cursor: "pointer",
      borderLeft: `5px solid ${
        orderStatus === ORDER_STATUSES.NEW_ORDER
          ? "#1976D2"
          : (borderColors = orderStatus)
      }`, // Apply border color based on status
      backgroundColor:
        orderStatus === ORDER_STATUSES.NEW_ORDER ? "#C8C8C8" : "white", // Grey background for new orders
    };
  }
);
const StyledBox = styled(Box)(({ theme }) => ({
  marginTop: "auto", // Set margin top to auto
  display: "flex", // Use flex display
  justifyContent: "center", // Center content
  paddingTop: theme.spacing(2), // Set padding top (using theme spacing)
}));
const StyledBox1 = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "64vh",
}));
const StyledGridContainer = styled(Grid)(({ theme }) => ({
  display: "flex",
  gap: "25px",
  flexWrap: "wrap", // This allows items to wrap if there are too many in a row
}));
const borderColors = {
  [ORDER_STATUSES.PENDING]: "red",
  [ORDER_STATUSES.IN_PROGRESS]: "orange",
  [ORDER_STATUSES.READY]: "#108BCF",
  [ORDER_STATUSES.COMPLETED]: "green",
};

// Map status icons based on order status
const statusIcons = {
  Priority: <Star style={{ color: "red", height: "20px" }} />,
  [ORDER_STATUSES.IN_PROGRESS]: (
    <HourglassEmpty style={{ color: "orange", height: "20px" }} />
  ),
  [ORDER_STATUSES.READY]: (
    <AccessTime style={{ color: "#108BCF", height: "20px" }} />
  ),
  [ORDER_STATUSES.COMPLETED]: (
    <CheckCircle style={{ color: "green", height: "20px" }} />
  ),
};

const OrderCard = ({ order, onClick }) => (
  <StyledOrdersCard
    onClick={() => onClick(order)}
    order={order}
    orderStatus={order.orderStatus}
  >
    <CardContent sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <Typography variant="h6">{`Order #${order.orderId}`}</Typography>
      <Typography variant="body2">{`Order Time: ${new Date(
        order.createdDate
      ).toLocaleTimeString()}`}</Typography>
      <Typography variant="body2" sx={{ display: "flex" }}>
        {`Status: ${order.orderStatus}`}
        {statusIcons[order.orderStatus] && (
          <span style={{ marginLeft: 4 }}>
            {statusIcons[order.orderStatus]}
          </span>
        )}
      </Typography>
    </CardContent>
  </StyledOrdersCard>
);

const OrdersGrid = ({ orders, onCardClick }) => {
  return (
    <StyledBox1>
      <Box>
        <StyledGridContainer container>
          {orders.map((order) => (
            <Grid item key={order.orderId}>
              <OrderCard order={order} onClick={onCardClick} />
            </Grid>
          ))}
        </StyledGridContainer>
      </Box>
      {/* Pagination */}
      <StyledBox>
        <Pagination count={10} page={1} />
      </StyledBox>
    </StyledBox1>
  );
};

export default OrdersGrid;
