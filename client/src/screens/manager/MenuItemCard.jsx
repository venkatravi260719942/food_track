import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import "../../styles/manager/MenuItemCard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAd,
  faAdd,
  faMinus,
  faRemove,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
const StyledCardMenuItem = styled(Card)(({ theme }) => ({
  position: "relative",
  height: "100px",
  marginBottom: "39px",
  boxShadow: "0px 3px 6px #00000029",
  border: "2px solid #707070",
  borderRadius: "10px",
}));

const CardContentMenuItem = styled(CardContent)(({ theme }) => ({
  padding: "0px",
  paddingLeft: "8px",
  paddingTop: "10px",
  // You can add more styles as needed
}));
const TypographyItemPrice = styled(Typography)(({ theme }) => ({
  fontSize: "14px",
  display: "flex",
  color: "#9B4702",
}));
const IconButtonRemove = styled(Button)(({ theme }) => ({
  width: "20px",
  height: "20px",
  boxShadow: "0px 3px 6px #00000029",
  backgroundColor: "#FFFFFF",
  borderRadius: "5px",
}));
const IconButtonAdd = styled(Button)(({ Button }) => ({
  width: "20px",
  height: "20px",
  boxShadow: "0px 3px 6px #00000029",
  borderRadius: "5px",
  backgroundColor: "#FFFFFF",
}));

const ButtonAdditem = styled(Button)(({ Button }) => ({
  display: "flex",
  justifyContent: "flex-start",
  width: "60px",
  height: "20px",
  backgroundcolor: "#1976D2",
  color: "#FFFFFF",
}));
const FoodCard = ({ item, quantity, onQuantityChange }) => {
  const { t } = useTranslation();

  const handleAdd = () => {
    onQuantityChange(item.itemId, quantity + 1);
  };
  const handleRemove = () => {
    if (quantity > 0) onQuantityChange(item.itemId, quantity - 1);
  };

  return (
    <StyledCardMenuItem>
      <div className="menuitem_card_content">
        <img
          component="img"
          style={{
            height: "100px",
            width: "35%",
            objectFit: "cover",
          }}
          src={item.itemImageUrl}
          alt={item.itemName}
        />
        <CardContentMenuItem>
          <Typography style={{ fontSize: "12px" }}>{item.itemName}</Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TypographyItemPrice style={{}}>
              ₹ {item.itemPrice}
            </TypographyItemPrice>
            <div style={{ position: "absolute", bottom: "13px" }}>
              {quantity > 0 ? (
                <div className="quanity_add_remove_button_content">
                  <IconButtonRemove onClick={handleRemove} style={{}}>
                    <FontAwesomeIcon
                      icon={faMinus}
                      style={{
                        fontSize: "9px",
                        color: "#000000",
                      }}
                    />
                  </IconButtonRemove>
                  <Typography>{quantity}</Typography>
                  <IconButtonAdd onClick={handleAdd} style={{}}>
                    <FontAwesomeIcon
                      icon={faAdd}
                      style={{
                        fontSize: "9px",
                        color: "#000000",
                      }}
                    />
                  </IconButtonAdd>
                </div>
              ) : (
                <ButtonAdditem onClick={handleAdd} variant="contained" sx={{}}>
                  {t("orderProcessing.button.add")}
                </ButtonAdditem>
              )}
            </div>
          </div>
        </CardContentMenuItem>
      </div>
    </StyledCardMenuItem>
  );
};

export default FoodCard;
