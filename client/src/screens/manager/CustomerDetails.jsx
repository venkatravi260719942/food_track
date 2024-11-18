import {
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper as MuiPaper,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faAdd,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import API_ENDPOINTS from "../../config/url.config";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
const BoxCustomerDetails = styled(Box)({
  display: "flex",
  alignItems: "center",
  marginTop: 2,
});
function CustomerDetails({ setCustomerName }) {
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const [customerData, setCustomerData] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [addCustomerDetailsDialog, setAddCustomerDetailsDialog] =
    useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerContact, setNewCustomerContact] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [cookiesData, setCookiesData] = useState({});

  useEffect(() => {
    const fetchCustomer = async () => {
      const storedData = Cookies.get();
      setCookiesData(storedData);

      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.customer.getCustomerDetail}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        setCustomerData(response.data);
      } catch (error) {
        console.error(t("orderProcessing.customerDetails.toast.errorFetching"));
      }
    };
    fetchCustomer();
  }, [t]);

  const handleEditClick = () => {
    setOpenDialog(true);
  };

  const handleAddCustomerDetails = async () => {
    const loadingToastId = toast.loading(
      t("orderProcessing.customerDetails.toast.loading")
    );
    const errors = {};
    if (!newCustomerContact.trim()) {
      errors.contact = t(
        "orderProcessing.customerDetails.toast.contactRequired"
      );
      toast.dismiss(loadingToastId);
    } else if (!/^\d{10}$/.test(newCustomerContact)) {
      toast.dismiss(loadingToastId);
      errors.contact = t(
        "orderProcessing.customerDetails.toast.contactInvalid"
      );
    }

    setFormErrors(errors);

    // If there are errors, do not proceed
    if (Object.keys(errors).length > 0) return;

    try {
      const response = await axios.post(
        `${API_ENDPOINTS.manager.customer.addCustomerData}`,
        {
          customerName: newCustomerName,
          contactNumber: parseInt(newCustomerContact),
        },
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      setCustomerName(newCustomerName);
      setCustomerId(response.data.customerId);
      // Add the new customer to the customer data list
      setCustomerData([...customerData, response.data]);
      setNewCustomerName("");
      setNewCustomerContact("");
      setSearchQuery("");
      setAddCustomerDetailsDialog(false);
      toast.dismiss(loadingToastId);
      toast.success(t("orderProcessing.customerDetails.toast.success"));
    } catch (error) {
      toast.dismiss(loadingToastId);
      console.error(t("orderProcessing.customerDetails.toast.errorAdding"));
      toast.error(t("orderProcessing.customerDetails.toast.errorTryAgain"));
    }
  };

  return (
    <div>
      <FontAwesomeIcon
        icon={faPenToSquare}
        style={{ paddingLeft: "16px" }}
        onClick={handleEditClick}
      />

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSearchQuery("");
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t("orderProcessing.customerDetails.text.customerDetails")}
          <BoxCustomerDetails>
            <TextField
              variant="outlined"
              size="small"
              placeholder={t(
                "orderProcessing.customerDetails.text.searchCustomers"
              )}
              fullWidth
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <IconButton
              color="primary"
              sx={{ marginLeft: 1 }}
              onClick={() => {
                setAddCustomerDetailsDialog(true);
                setOpenDialog(false);
              }}
            >
              <FontAwesomeIcon icon={faAdd} />
            </IconButton>
          </BoxCustomerDetails>
        </DialogTitle>

        <DialogContent dividers style={{ height: "250px" }}>
          {customerData.length > 0 ? (
            <TableContainer
              component={MuiPaper}
              style={{
                maxHeight: "200px", // Fixed height for the table container
                overflowY: "auto", // Scrollable content
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      {t("orderProcessing.customerDetails.text.name")}
                    </TableCell>
                    <TableCell>
                      {t("orderProcessing.customerDetails.text.contactNumber")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerData
                    .filter((customer) => {
                      const searchLower = searchQuery.toLowerCase();
                      const customerName = customer.customerName || "";
                      const contactNumber = customer.contactNumber || "";

                      return (
                        customerName.toLowerCase().includes(searchLower) ||
                        String(contactNumber).includes(searchQuery)
                      );
                    })
                    .map((customer, index) => (
                      <TableRow
                        key={index}
                        hover
                        onClick={() => {
                          setCustomerName(customer.customerName);
                          setCustomerId(customer.customerId);
                          setOpenDialog(false);
                        }}
                      >
                        <TableCell>{customer.customerName || "N/A"}</TableCell>
                        <TableCell>{customer.contactNumber || "N/A"}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2">
              {t("orderProcessing.customerDetails.text.noCustomersAvailable")}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="error"
            style={{ backgroundColor: "#0A8CCD" }}
            onClick={() => {
              setOpenDialog(false);
              setSearchQuery("");
            }}
          >
            {t("orderProcessing.customerDetails.button.discard")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={addCustomerDetailsDialog}
        onClose={() => {
          setAddCustomerDetailsDialog(false);
          setNewCustomerName("");
          setNewCustomerContact("");
        }}
      >
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#666666",
            }}
          >
            {t("orderProcessing.customerDetails.text.addCustomer")}
            <IconButton
              onClick={() => {
                setAddCustomerDetailsDialog(false);
                setNewCustomerName("");
                setNewCustomerContact("");
              }}
              size="small"
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent
          style={{
            gap: "20px",
            width: "350px",
            display: "flex",
            flexDirection: "column",
            paddingTop: "30px",
          }}
        >
          <TextField
            fullWidth
            label={t("orderProcessing.customerDetails.text.name")}
            value={newCustomerName}
            onChange={(event) => setNewCustomerName(event.target.value)}
          />
          <TextField
            fullWidth
            label={t("orderProcessing.customerDetails.text.contactNumber")}
            value={newCustomerContact}
            onChange={(event) => setNewCustomerContact(event.target.value)}
            error={!!formErrors.contact}
            helperText={formErrors.contact}
          />
        </DialogContent>
        <DialogActions
          style={{
            justifyContent: "flex-start",
            display: "flex",
            marginLeft: "15px",
          }}
        >
          <Button
            onClick={handleAddCustomerDetails}
            style={{
              backgroundColor: "#0A8CCD",
              color: "#FFFFFF",
              padding: "8px 24px",
            }}
            autoFocus
          >
            {t("orderProcessing.customerDetails.button.add")}
          </Button>
          <Button
            onClick={() => {
              setAddCustomerDetailsDialog(false);
              setNewCustomerName("");
              setNewCustomerContact("");
            }}
            style={{ padding: "8px 24px" }}
          >
            {t("orderProcessing.customerDetails.button.discard")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CustomerDetails;
