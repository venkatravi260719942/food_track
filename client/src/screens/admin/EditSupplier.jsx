import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import Cookies from "js-cookie";
import {
  Container,
  TextField,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  CircularProgress,
  Box,
  Autocomplete,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import API_ENDPOINTS from "../../config/url.config";
import "../../styles/supplier.css";
import EditBankDetails from "./EditBankDetails";
import { styled } from "@mui/system";
const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
}));
const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const EditSupplier = () => {
  const { supplierId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    supplierName: "",
    email: "",
    contactNumber: "",
    address: "",
    type: "",
    productId: [],
    countryId: "",
  });
  const { t } = useTranslation();

  useEffect(() => {
    const fetchSupplierDetails = async () => {
      const storedData = Cookies.get();
      try {
        const supplierResponse = await axios.get(
          `${API_ENDPOINTS.supplierManagement.supplier}/supplierId/${supplierId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const categoriesResponse = await axios.get(
          `${API_ENDPOINTS.supplierManagement.suppliercategory}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const productsResponse = await axios.get(
          `${API_ENDPOINTS.productMangement.product}/organisationId/${storedData.organisationId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const locationsResponse = await axios.get(
          `${API_ENDPOINTS.organisation.onlyCountry}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        setAllProducts(productsResponse.data);
        setAllCategories(categoriesResponse.data);
        setLocations(locationsResponse.data);

        const supplierData = {
          supplierName: supplierResponse.data.supplierName,
          email: supplierResponse.data.email,
          contactNumber: supplierResponse.data.contactNumber,
          address: supplierResponse.data.address,
          type: supplierResponse.data.type,
          productId: JSON.parse(supplierResponse.data.productId),
          countryId: supplierResponse.data.countryId,
        };

        setInitialValues(supplierData);
        formik.setValues(supplierData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching supplier details:", error);
        setLoading(false);
      }
    };
    fetchSupplierDetails();
  }, [supplierId]);

  const validationSchema = Yup.object({
    supplierName: Yup.string()
      .required(t("supplier.error.supplierNameRequired"))
      .trim()
      .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, t("supplier.error.validName")),
    email: Yup.string()
      .email(t("supplier.error.invalidEmail"))
      .required(t("supplier.error.emailRequired"))
      .trim()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t("supplier.error.invalidEmail")),
    contactNumber: Yup.string()
      .required(t("supplier.error.phoneNumberRequired"))
      .matches(/^[6-9][0-9]{9}$/, t("supplier.error.validPhoneNumber")),
    address: Yup.string().required(t("supplier.error.addressRequired")).trim(),
    type: Yup.string().required(t("supplier.error.supplierCategoryRequired")),
    productId: Yup.array().min(1, t("supplier.error.atLeastOneProduct")),
    countryId: Yup.string().required(t("supplier.error.locationRequired")),
  });

  const formik = useFormik({
    initialValues: {
      supplierName: "",
      email: "",
      contactNumber: "",
      address: "",
      type: "",
      productId: [],
      countryId: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const storedData = Cookies.get();
      const data = {
        ...values,
        productId: JSON.stringify(values.productId),
      };

      try {
        await axios.put(
          `${API_ENDPOINTS.supplierManagement.supplier}/${supplierId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        toast.success("Updated");
        navigate("/admin/supplier");
      } catch (error) {
        console.error("Error updating supplier:", error);
      } finally {
        setSubmitting(false);
        setConfirmationOpen(false); // Close the confirmation dialog
      }
    },
  });

  const hasChanges =
    JSON.stringify(formik.values) !== JSON.stringify(initialValues);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleCancel = () => {
    navigate("/admin/supplier");
  };

  const handleOpenConfirmation = () => {
    setConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
  };

  return (
    <StyledPaper>
      <StyledBox>
        <IconButton onClick={() => navigate("/admin/supplier")}>
          <ArrowBack />
        </IconButton>

        <h4> {t("supplier.text.editSupplier")}</h4>
      </StyledBox>
      <Grid container spacing={1}>
        <Grid item xs={12} md={7}>
          <form onSubmit={formik.handleSubmit} className="edit-supplier-form">
            <Box
              sx={{
                mt: 3,
                p: 3,
                width: "190%",
                border: "2px ",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <ToastContainer />
              <TextField
                fullWidth
                size="small"
                id="supplierName"
                name="supplierName"
                label={t("supplier.label.supplierName")}
                variant="outlined"
                margin="normal"
                data-testid="supplierName"
                value={formik.values.supplierName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.supplierName &&
                  Boolean(formik.errors.supplierName)
                }
                helperText={
                  formik.touched.supplierName && formik.errors.supplierName
                }
              />
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                }}
              >
                <TextField
                  fullWidth
                  size="small"
                  id="email"
                  name="email"
                  label={t("supplier.label.email")}
                  variant="outlined"
                  margin="normal"
                  data-testid="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <TextField
                  fullWidth
                  size="small"
                  id="contactNumber"
                  name="contactNumber"
                  label={t("supplier.label.phoneNumber")}
                  variant="outlined"
                  margin="normal"
                  data-testid="contactNumber"
                  value={formik.values.contactNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.contactNumber &&
                    Boolean(formik.errors.contactNumber)
                  }
                  helperText={
                    formik.touched.contactNumber && formik.errors.contactNumber
                  }
                />
              </Box>
              <TextField
                fullWidth
                size="small"
                id="address"
                name="address"
                label={t("supplier.label.address")}
                variant="outlined"
                margin="normal"
                data-testid="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
              <FormControl
                fullWidth
                variant="outlined"
                margin="normal"
                size="small"
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <InputLabel id="supplier-category-label">
                  {t("supplier.label.supplierCategory")}
                </InputLabel>
                <Select
                  size="small"
                  labelId="supplier-category-label"
                  id="type"
                  name="type"
                  data-testid="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {allCategories.map((category) => (
                    <MenuItem key={category.category} value={category.category}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Autocomplete
                multiple
                size="small"
                id="productId"
                options={allProducts.map((product) => ({
                  value: product.productId,
                  label: product.productName,
                }))}
                data-testid="productId"
                getOptionLabel={(option) => option.label}
                value={formik.values.productId.map((productId) => {
                  const product = allProducts.find(
                    (product) => product.productId === productId
                  );
                  return {
                    value: product.productId,
                    label: product.productName,
                  };
                })}
                onChange={(event, value) =>
                  formik.setFieldValue(
                    "productId",
                    value.map((item) => item.value)
                  )
                }
                onBlur={formik.handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("supplier.label.product")}
                    error={
                      formik.touched.productId &&
                      Boolean(formik.errors.productId)
                    }
                    helperText={
                      formik.touched.productId && formik.errors.productId
                    }
                  />
                )}
              />
              <FormControl
                fullWidth
                variant="outlined"
                margin="normal"
                size="small"
                error={
                  formik.touched.countryId && Boolean(formik.errors.countryId)
                }
              >
                <InputLabel id="supplier-location-label">
                  {t("supplier.label.location")}
                </InputLabel>
                <Select
                  size="small"
                  labelId="supplier-location-label"
                  id="countryId"
                  name="countryId"
                  data-testid="countryId"
                  value={formik.values.countryId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  {locations.map((location) => (
                    <MenuItem
                      key={location.countryId}
                      value={location.countryId}
                    >
                      {location.countryName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "16px",
                }}
              >
                <Button
                  type="button"
                  variant="contained"
                  color="error"
                  onClick={handleCancel}
                >
                  {t("supplier.button.cancel")}
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  disabled={!hasChanges}
                  onClick={handleOpenConfirmation}
                >
                  {t("supplier.button.update")}
                </Button>
              </Box>
            </Box>
          </form>
        </Grid>
      </Grid>

      <Dialog
        open={confirmationOpen}
        onClose={handleCloseConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("supplier.dialog.confirmUpdate")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("supplier.dialog.updateMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmation} color="error">
            {t("supplier.button.cancel")}
          </Button>
          <Button
            onClick={formik.handleSubmit}
            disabled={formik.isSubmitting}
            color="primary"
            autoFocus
          >
            {t("supplier.button.update")}
          </Button>
        </DialogActions>
      </Dialog>
    </StyledPaper>
  );
};

export default EditSupplier;
