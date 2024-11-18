import { useLocation } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const PayPage = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  const { t } = useTranslation();

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {t("orders.orderPayment.text.paymentForOrder")}
      </Typography>
      {orderId && (
        <Typography variant="body1">
          {t("orders.orderPayment.text.processingPaymentForOrderId")} {orderId}
        </Typography>
      )}
      {/* Add your payment processing code here */}
    </Container>
  );
};

export default PayPage;
