import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import API_ENDPOINTS from "../../config/url.config";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const EditBankDetails = ({ supplierId, countryId }) => {
  const [bankDetails, setBankDetails] = useState({});
  const [initialBankDetails, setInitialBankDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankDetails = async () => {
      const storedData = Cookies.get();
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.bankDetails.bankDetail}/${supplierId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        const parsedBankDetails = JSON.parse(response.data.bankDetail);
        setBankDetails(parsedBankDetails);
        setInitialBankDetails(
          Object.fromEntries(
            Object.entries(parsedBankDetails).filter(([_, value]) => value)
          )
        );
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bank details:", error);
        setLoading(false);
      }
    };
    fetchBankDetails();
  }, [supplierId]);

  const validate = () => {
    const newErrors = {};
    Object.keys(initialBankDetails).forEach((key) => {
      if (!bankDetails[key]) {
        newErrors[key] = `${t(key)} ${t("is required")}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleOpenConfirmation = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
  };

  const handleSubmit = async () => {
    setUpdating(true);
    const storedData = Cookies.get();

    const data = JSON.stringify(bankDetails);
    const reqBody = { bankDetail: data };

    try {
      await axios.put(
        `${API_ENDPOINTS.bankDetails.bankDetail}/${supplierId}`,
        reqBody,
        {
          headers: {
            Authorization: `Bearer ${storedData.token}`,
          },
        }
      );

      setUpdating(false);
      toast.success("Bank Details Updated");
      navigate("/admin/supplier");
    } catch (error) {
      console.error("Error updating bank details:", error);
      setUpdating(false);
    }
  };

  const handleClear = () => {
    navigate("/admin/supplier");
  };

  const hasChanges =
    JSON.stringify(bankDetails) !== JSON.stringify(initialBankDetails);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Paper style={{ padding: 16, marginTop: 22 }}>
      <ToastContainer />
      <Typography variant="h6">{t("Edit Bank Details")}</Typography>
      <form onSubmit={handleOpenConfirmation}>
        {Object.entries(initialBankDetails).map(([key]) => (
          <TextField
            key={key}
            label={key}
            name={key}
            size="small"
            value={bankDetails[key] || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            error={!!errors[key]}
            helperText={errors[key]}
          />
        ))}
        <Box display="flex" sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!hasChanges || updating}
          >
            {updating ? (
              <CircularProgress size={24} />
            ) : (
              t("Update Bank Details")
            )}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClear}
            sx={{ ml: 2 }}
          >
            {t("Clear")}
          </Button>
        </Box>
      </form>

      <Dialog
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">
          {t("Confirmation")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            {t("Are you sure you want to update the bank details?")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} variant="outlined">
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="warning"
            autoFocus
            disabled={updating}
          >
            {updating ? <CircularProgress size={24} /> : t("Confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default EditBankDetails;
