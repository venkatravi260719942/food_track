import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Dialog,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faCreditCard,
  faArrowsSplitUpAndLeft,
  faObjectUngroup,
  faPrint,
  faCheck,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import "../../../styles/manager/OrderSummary.css";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import SplitEquallyPopup from "./SplitEqually";
import MergeBillsPopup from "./MergeBills";
import API_ENDPOINTS from "../../../config/url.config";
import { ToastContainer, toast } from "react-toastify";

const OrderSummaryFullScreen = () => {
  const [cookiesData, setCookiesData] = useState({});
  const [voucher, setVoucher] = useState("");
  const [tip, setTip] = useState(0);
  const [tax, setTax] = useState("");
  const [splitDialogOpen, setSplitDialogOpen] = useState(false);
  const [splitEquallyOpen, setSplitEquallyOpen] = useState(false);
  const [mergeBillsOpen, setMergeBillsOpen] = useState(false);
  const [showPlusButton, setShowPlusButton] = useState(false);
  const [orderBilling, setOrderBilling] = useState([]);
  const [customerDetails, setCustomerDetails] = useState();
  const [singleItemName, setSingleItemName] = useState([]);
  const [orderSections, setOrderSections] = useState([]);
  const { orderId } = useParams();
  const [selectedValue, setSelectedValue] = useState(null);
  const [createdBillItems, setCreatedBillItems] = useState([]);
  const [splitBills, setSplitBills] = useState([]);
  const [billId, setBillId] = useState("");

  // Callback to handle value update from SplitEquallyPopup or MergeBillsPopup
  const handleSelectedValueChange = (value) => {
    setSelectedValue(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedData = Cookies.get();
      setCookiesData(storedData);

      try {
        const orderBilling = await axios.get(
          `${API_ENDPOINTS.manager.billing.orderBilling}/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        setOrderBilling(orderBilling.data);

        const taxData = await axios.get(
          `${API_ENDPOINTS.manager.billing.tax}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const singleItemName = await axios.get(
          `${API_ENDPOINTS.manager.billing.allMenuItems}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        setSingleItemName(singleItemName.data);

        const customerDetails = await axios.get(
          `${API_ENDPOINTS.manager.billing.customerDetails}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        const customerId = orderBilling.data.DiningOrder[0].customerId;
        const customer = customerDetails.data.find(
          (customer) => customer.customerId === customerId
        );

        if (customer) {
          setCustomerDetails(customer.customerName);
        }
        setBillId(orderBilling.data.billId);
        fetchSplitBills(orderBilling.data.billId);
        taxCalculate(orderBilling.data.totalAmount, taxData.data[0].taxRate);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchSplitBills = async (billId) => {
    const loadingToastId = toast.loading("Loading ...");
    const storedData = Cookies.get();
    setSplitBills([]);
    if (!billId) {
      toast.dismiss(loadingToastId);
      console.error("No bill ID provided");
      return;
    }

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.manager.billing.getSplitBills}/${billId}`,
        {
          headers: { Authorization: `Bearer ${storedData.token}` },
        }
      );
      setSplitBills(response.data);
    } catch (error) {
      console.error("Error fetching split bills:", error);
    } finally {
      toast.dismiss(loadingToastId);
    }
  };

  useEffect(() => {
    fetchSplitBills(billId);
  }, [createdBillItems]);

  const handleTip = (value) => {
    setTip(value);
  };

  const taxCalculate = (amount, tax) => {
    const taxAmount = (amount * tax) / 100;
    setTax(taxAmount);
  };

  const handleSplitDialog = (state) => {
    setSplitDialogOpen(state);
  };

  const handleOpenSplitEquallyPopup = () => {
    setSplitEquallyOpen(true);
    setSplitDialogOpen(false);
  };

  const handleCloseSplitEquallyPopup = () => {
    setSplitEquallyOpen(false);
  };

  const handleSplitUsingSelectedItems = () => {
    setShowPlusButton(true);
    setSplitDialogOpen(false);
  };

  // Functions to handle Merge Bills popup
  const handleMergeBills = (state) => {
    setMergeBillsOpen(state);
  };

  const handleAddOrderSection = () => {
    setOrderSections((prevSections) => [
      ...prevSections,
      {
        orderId: orderBilling?.orderId,
        totalAmount: orderBilling?.totalAmount,
        // Add more fields as needed
      },
    ]);
  };

  const handleRevertSplit = async () => {
    setSplitDialogOpen(false);
    const loadingToastId = toast.loading("Loading ...");
    const storedData = Cookies.get();
    try {
      await axios.delete(
        `${API_ENDPOINTS.manager.billing.revertSplits}/${billId}`,
        {
          headers: { Authorization: `Bearer ${storedData.token}` },
        }
      );
    } catch (error) {
      console.error("Error fetching split bills:", error);
    } finally {
      toast.dismiss(loadingToastId);
      setSplitBills({});
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="order-summary-fullscreen">
        {/* Left Section - Customer Info */}
        <div className="OS_name_table">
          <div className="OS_customer-info">
            <p className="OS_customer-name">
              Customer Name: <strong>{customerDetails}</strong>
            </p>
            <p className="OS_tableNO">
              Table Number:
              <strong>{orderBilling?.DiningOrder?.[0]?.tableId}</strong>
            </p>
          </div>
        </div>

        <div className="OS_left-section">
          {/* Cards Section for createdBillItems */}
          {splitBills.length > 0 ? (
            splitBills.map((section, index) => (
              <div className="OS_order-info" key={index}>
                <p style={{ padding: "18px 0 0 18px" }}>
                  {`${index + 1} of ${splitBills.length}`}
                </p>
                <div className="OS_left_total">
                  <p style={{ padding: "22px 0 0 18px" }}>Total</p>
                  <p style={{ padding: "22px 10px 0 0" }}>
                    {section.BillItems?.[0]?.amount || 0}
                  </p>
                </div>
                <div className="OS_left_total">
                  <p style={{ padding: "11px 0 0 18px" }}>Paid</p>
                  <p style={{ padding: "11px 10px 0 0" }}>0</p>
                </div>
                <div className="OS_left_total">
                  <p style={{ padding: "11px 0 0 18px" }}>Outstanding</p>
                  <p style={{ padding: "11px 10px 0 0" }}>0</p>
                </div>
              </div>
            ))
          ) : orderSections.length > 0 ? (
            orderSections.map((section, index) => (
              <div className="OS_order-info" key={index}>
                <p style={{ padding: "18px 0 0 18px" }}>{section.orderId}</p>
                <div className="OS_left_total">
                  <p style={{ padding: "22px 0 0 18px" }}>Total</p>
                  <p style={{ padding: "22px 10px 0 0" }}>
                    {section.totalAmount}
                  </p>
                </div>
                <div className="OS_left_total">
                  <p style={{ padding: "11px 0 0 18px" }}>Paid</p>
                  <p style={{ padding: "11px 10px 0 0" }}>100</p>
                </div>
                <div className="OS_left_total">
                  <p style={{ padding: "11px 0 0 18px" }}>Outstanding</p>
                  <p style={{ padding: "11px 10px 0 0" }}>100</p>
                </div>
              </div>
            ))
          ) : (
            <div className="OS_order-info">
              <p className="left_section_orderid">{orderBilling?.orderId}</p>
              <div className="OS_left_total">
                <p className="left_section_total_tag">Total</p>
                <p className="left_section_totalprice">
                  {orderBilling?.totalAmount}
                </p>
              </div>
              <div className="OS_left_total">
                <p className="left_section_paid_Outstanding_tag">Paid</p>
                <p className="left_section_paid_Outstanding">0</p>
              </div>
              <div className="OS_left_total">
                <p className="left_section_paid_Outstanding_tag">Outstanding</p>
                <p className="left_section_paid_Outstanding">0</p>
              </div>
            </div>
          )}
        </div>

        {/* Middle Section - Order Summary */}
        <div className="middle-section">
          <h2 className="middle_section_heading">
            Order Summary
            {showPlusButton && (
              <Button
                onClick={handleAddOrderSection}
                sx={{
                  color: "white",
                  marginLeft: "10px",
                  minWidth: "20px",
                  minHeight: "20px",
                  padding: "0px",
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </Button>
            )}
          </h2>
          <div className="OS_middle_section">
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {orderBilling?.MenuItemDiningOrder?.length > 0 ? (
                    orderBilling.MenuItemDiningOrder.map((item, index) => {
                      const menuItem = singleItemName?.find(
                        (menu) => menu.itemId === item.menuItemId
                      );

                      return (
                        <TableRow key={item.menuItemOrderId}>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {menuItem ? menuItem.itemName : ""}
                          </TableCell>
                          <TableCell>
                            {menuItem ? menuItem.itemPrice * item.quantity : ""}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} style={{ textAlign: "center" }}>
                        No items found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="OS-subtotal-area">
            <div className="OS_subtotal_heading">
              <p>Sub Total</p>
              <p>{orderBilling?.totalAmount}</p>
            </div>
            <div className="OS_voucher-input">
              <div>
                <label style={{ padding: "10px 26px 0 0px" }}>Voucher</label>
                <input
                  style={{
                    border: "1px solid #9e9e9e",
                    width: "141px",
                    height: "25px",
                    borderRadius: "5px",
                  }}
                  type="text"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                />
              </div>
              <div>
                <p style={{ padding: "5px 0 0 0 " }}>{voucher}</p>
              </div>
            </div>

            <div className="OS-tip-section">
              <div className="OS_tip_components">
                <label style={{ padding: "5px 57px 0px 0px" }}>Tip</label>
                <div className="OS_tip_buttons">
                  <div>
                    <button className="OS-tips" onClick={() => handleTip(10)}>
                      ₹10
                    </button>
                  </div>
                  <div>
                    <button className="OS-tips" onClick={() => handleTip(20)}>
                      ₹20
                    </button>
                  </div>
                  <div>
                    <button className="OS-tips" onClick={() => handleTip(50)}>
                      ₹50
                    </button>
                  </div>
                  <div>
                    <button className="OS-tips" onClick={() => handleTip(100)}>
                      ₹100
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <p style={{ padding: "5px 0 0 0 " }}>{tip}</p>
              </div>
            </div>

            <div className="OS-total-summary">
              <div className="OS_tax">
                <p>Tax</p>
                <p>{tax || 0}</p>
              </div>
              <div className="OS_totalamount">
                <h3>Total</h3>
                <h3>
                  {Math.max(orderBilling?.totalAmount + tax + tip - voucher)}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Payment Options */}
        <div className="right-section">
          <div className="OS-MarkAsPaid-button">
            <FontAwesomeIcon
              icon={faCheck}
              style={{ color: "#d0d02", padding: "40px 0px 5px 165px" }}
            />
            <p style={{ padding: "0px 120px 0px 120px" }}>MARK AS PAID</p>
          </div>
          <div className="OS_cash-card">
            <div className="OS-Cash-button">
              <FontAwesomeIcon
                icon={faMoneyBill}
                style={{ color: "#d0d02", padding: "40px 50px 5px 75px" }}
              />
              <p style={{ padding: "0px 0px 0px 60px" }}>CASH</p>
            </div>
            <div className="OS-Card-button">
              <FontAwesomeIcon
                icon={faCreditCard}
                style={{ color: "#d0d02", padding: "40px 50px 5px 75px" }}
              />
              <p style={{ padding: "0px 0px 0px 60px" }}>CARD</p>
            </div>
          </div>
          <div className="OS-Split-merge">
            <div
              className="OS-SplitBills-button"
              onClick={() => handleSplitDialog(true)}
            >
              <FontAwesomeIcon
                icon={faArrowsSplitUpAndLeft}
                style={{ color: "#d0d02", padding: "40px 50px 5px 75px" }}
              />
              <p style={{ padding: "0px 0px 0px 35px" }}>SPLIT BILLS</p>
            </div>
            <div
              className="OS-MergeBills-button"
              onClick={() => handleMergeBills(true)}
            >
              <FontAwesomeIcon
                icon={faObjectUngroup}
                style={{ color: "#d0d02", padding: "40px 50px 5px 75px" }}
              />
              <p style={{ padding: "0px 0px 0px 30px" }}>MERGE BILLS</p>
            </div>
          </div>
          <div className="OS-PrintReceipt">
            <div className="OS-PrintReceipt-button">
              <FontAwesomeIcon
                icon={faPrint}
                style={{ color: "#d0d02", padding: "40px 50px 5px 75px" }}
              />
              <p style={{ padding: "0px 0px 0px 22px" }}>PRINT RECEIPT</p>
            </div>
          </div>
        </div>

        <Dialog
          sx={{ padding: "220px 0 0 600px" }}
          open={splitDialogOpen}
          onClose={() => handleSplitDialog(false)}
        >
          <List sx={{ backgroundColor: "white" }}>
            <ListItem>
              <ListItemButton
                onClick={handleOpenSplitEquallyPopup}
                disabled={splitBills.length > 0} // Disable if splitBills.length > 0
              >
                <ListItemText primary="Split equally" />
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton
                onClick={handleSplitUsingSelectedItems}
                disabled={splitBills.length > 0} // Disable if splitBills.length > 0
              >
                <ListItemText primary="Split using selected items" />
              </ListItemButton>
            </ListItem>

            <ListItem>
              <ListItemButton
                onClick={handleRevertSplit}
                disabled={splitBills.length === 0} // Enable only if splitBills.length > 0
              >
                <ListItemText primary="Revert Split" />
              </ListItemButton>
            </ListItem>
          </List>
        </Dialog>

        {/* New Split Equally Popup */}
        <SplitEquallyPopup
          open={splitEquallyOpen}
          onClose={handleCloseSplitEquallyPopup}
          onValueChange={handleSelectedValueChange}
          setCreatedBillItems={setCreatedBillItems}
        />

        {/* Render the merge bills popup */}
        <MergeBillsPopup
          open={mergeBillsOpen}
          onClose={() => handleMergeBills(false)}
        />
      </div>
    </div>
  );
};

export default OrderSummaryFullScreen;
