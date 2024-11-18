import { Box, Typography, Divider, Button } from "@mui/material";
import { formatDate, formatTime } from "../../../config/constant";
import { styled } from "@mui/system";
const OrderContainer = styled(Box)(({ theme }) => ({
  border: "1px solid white",
  height: "80vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

const OrderHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

const OrderInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  fontSize: "18px",
  rowGap: "8px",
  fontWeight: "bold",
}));

const OrderDetailsTitle = styled(Typography)(({ theme }) => ({
  padding: "20px 0 3px 150px",
  fontWeight: "bold",
  fontSize: "20px",
}));

const ItemDetails = styled(Box)(({ theme }) => ({
  padding: "10px 0",
  display: "flex",
  flexDirection: "column",
  rowGap: "4px",
}));

const BottomSection = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  marginTop: "auto",
}));
const OrderDetails = ({ order }) => {
  if (!order || !order[0]) return null; // Ensure the order has valid data
  const totalItems = order.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <OrderContainer>
      <Box>
        <OrderHeader>
          <OrderInfo>
            <Typography variant="p">{`Order Number: #${order[0].orderId}`}</Typography>
            <Typography variant="p">
              {`Order Date: ${formatDate(order[0].createdDate)}`}
            </Typography>
            <Typography variant="p">
              {`Order Time: ${formatTime(order[0].createdDate)}`}
            </Typography>
          </OrderInfo>
          <OrderInfo>
            <Typography variant="p">{`Staff Name: ${order[0].createdBy}`}</Typography>
            <Typography variant="p">{`Takeaway Method: ${order[0].DiningOrder.orderType}`}</Typography>
            <Typography variant="p">{`Status: ${order[0].DiningOrder.orderStatus}`}</Typography>
          </OrderInfo>
        </OrderHeader>

        <OrderDetailsTitle>ORDER DETAILS</OrderDetailsTitle>
        <Divider />

        {order.map((item, index) => (
          <ItemDetails key={index}>
            <Typography variant="body2">{`Menu Item: ${item.MenuItem.itemName}`}</Typography>
            <Typography variant="body2">{`Quantity: ${item.quantity}`}</Typography>
            {item.comments && (
              <Typography
                variant="body2"
                color="primary"
              >{`Comments: ${item.comments}`}</Typography>
            )}
            {index < order.length - 1 && <Divider />}
          </ItemDetails>
        ))}
        <Divider />
      </Box>

      {/* Bottom section for total and bill */}
      <BottomSection>
        <Typography variant="h6">{`Total Items: ${totalItems}`}</Typography>

        <Button variant="contained" disabled>
          Bill
        </Button>
      </BottomSection>
    </OrderContainer>
  );
};

export default OrderDetails;
