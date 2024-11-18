import {
  Dialog,
  Table,
  TableCell,
  TableRow,
  TableHead,
  TableBody,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Checkbox,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const OrderDetailsDialog = ({
  open,
  onClose,
  order,
  getSupplierName,
  isPending,
  checkboxStates,
  handleCheckboxChange,
}) => {
  if (!order) return null;
  const { t } = useTranslation();
  let productDetails = [];
  if (order.items) {
    try {
      const itemsArray = JSON.parse(order.items);
      productDetails = itemsArray.map((item, index) => {
        // Find the current item's status from checkboxStates
        const currentItemState = checkboxStates.find(
          (state) => state.productId === item.productId
        );

        return (
          <TableRow key={index}>
            {isPending && (
              <TableCell padding="checkbox">
                <Checkbox
                  checked={
                    currentItemState
                      ? currentItemState.itemStatus
                      : item.itemStatus
                  }
                  onChange={() => handleCheckboxChange(item.productId)}
                  disabled={!isPending}
                />
              </TableCell>
            )}
            <TableCell>{item.productName}</TableCell>
            <TableCell>{item.orderQuantity}</TableCell>
            <TableCell>{item.unitsOfMeasure}</TableCell>
          </TableRow>
        );
      });
    } catch (error) {
      console.error("Error parsing items:", error);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} sx={{ height: "100vh" }}>
      <DialogTitle>{getSupplierName(order.supplierId)}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle2">{`ODR${order.orderId}`}</Typography>
        <Table sx={{ width: "30vw" }}>
          <TableHead>
            <TableRow>
              {isPending && <TableCell></TableCell>}
              <TableCell>{t("orders.orderDetailsDialog.text.items")}</TableCell>
              <TableCell>
                {t("orders.orderDetailsDialog.text.orderQty")}
              </TableCell>
              <TableCell>{t("orders.orderDetailsDialog.text.unit")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{productDetails}</TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("orders.orderDetailsDialog.button.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
