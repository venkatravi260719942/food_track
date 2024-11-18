import { Dialog, DialogContent, Button, TextField } from "@mui/material";
import { useState } from "react";
import "../../../styles/manager/OrderSummary.css";
import { useParams } from "react-router-dom";
import { splitType } from "../../../config/constant";
import Cookies from "js-cookie";
import axios from "axios";
import API_ENDPOINTS from "../../../config/url.config";

const SplitEquallyPopup = ({
  open,
  onClose,
  onValueChange,
  setCreatedBillItems,
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { orderId } = useParams();
  const handleFocus = () => setIsTyping(true);
  const handleBlur = () => setIsTyping(false);

  const handleNumberClick = (value) => {
    setSelectedValue((prevValue) => prevValue + value);
  };

  const handleClearClick = () => {
    setSelectedValue((prevValue) => prevValue.slice(0, -1));
  };

  const splitEqually = async () => {
    const storedData = Cookies.get();
    const data = {
      bill: {
        splitType: splitType.EQUAL,
        numberOfSplits: parseInt(selectedValue),
      },
    };
    const createdBillItemsRes = await axios.put(
      `${API_ENDPOINTS.manager.billing.splitBillEqually}/${orderId}`,
      data,
      {
        headers: { Authorization: `Bearer ${storedData.token}` },
      }
    );
    console.log(createdBillItemsRes.data.createdBillItems);
    setCreatedBillItems(createdBillItemsRes.data.createdBillItems);
  };

  const handleChange = () => {
    // Call the parent's function to pass the value
    onClose();
    onValueChange(selectedValue);
    setSelectedValue("");
    splitEqually();
  };
  const numberRows = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
  ]; // Defining numbers in rows to maintain CSS layout

  return (
    <Dialog open={open} onClose={onClose} className="split-popup">
      <p style={{ padding: "24px 13px 0px 13px", fontWeight: "bold" }}>
        How would you like to divide the receipt?
      </p>
      <DialogContent>
        <div className="keypad-container">
          <TextField
            value={selectedValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            sx={{
              border: isTyping ? "1px solid transparent" : "1px solid black",
              borderRadius: "5px",
              width: "100%",
            }}
          />
          <div className="SE-calc">
            <div className="SE-calc-buttons">
              {numberRows.map((row, rowIndex) => (
                <div key={rowIndex} className="keypad-row">
                  {row.map((number) => (
                    <Button
                      key={number}
                      sx={{ border: "1px solid black", color: "black" }}
                      className="keypad-btn"
                      onClick={() => handleNumberClick(number)}
                    >
                      {number}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
            <div className="SE-cancel-button">
              <Button
                sx={{ border: "1px solid black", color: "black" }}
                className="keypad-btn delete-btn"
                onClick={handleClearClick}
              >
                ✕
              </Button>
            </div>
          </div>
          <div className="keypad-row">
            <div className="SE-calc-buttons">
              <Button
                key={0}
                sx={{ border: "1px solid black", color: "black" }}
                className="keypad-btn"
                onClick={() => handleNumberClick(0)}
              >
                {0}
              </Button>
            </div>
            <Button
              sx={{ border: "1px solid black", color: "black" }}
              className="based-on-seats-btn"
              onClick={() => handleChange()}
            >
              Based on seats
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SplitEquallyPopup;
