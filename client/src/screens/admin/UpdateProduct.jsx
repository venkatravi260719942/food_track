import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/Manage_single_product.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { API_ENDPOINTS } from "../../config/url.config";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../LanguageContext";
import { styled } from "@mui/system";

const UpdateProductIdTextField = styled(TextField)(({ theme }) => ({
  width: "30%",
  marginBottom: theme.spacing(2),
  "& input": {
    fontSize: "20px", // Adjust the input font size
  },
}));
const UpdateProductNameTextField = styled(TextField)(({ theme }) => ({
  width: "95%",
  height: "100%",
  marginBottom: theme.spacing(2),
}));
const UpdateCategorySelect = styled(Select)(({ theme }) => ({
  width: "95%",
  height: "100%",
  marginBottom: theme.spacing(2),
}));
const UpdateDescriptionTextField = styled(TextField)(({ theme }) => ({
  width: "95%",
  marginBottom: theme.spacing(2),
  "& textarea": {
    size: "20px",
  },
}));
const UpdateThresholdLimitTextField = styled(TextField)(({ theme }) => ({
  width: "95%",
  marginBottom: theme.spacing(2),
}));
const UpdateCostPriceTextField = styled(TextField)(({ theme }) => ({
  width: "95%",
  marginBottom: theme.spacing(2),
}));
const UpdateSalesPriceTextField = styled(TextField)(({ theme }) => ({
  width: "95%",
  marginBottom: theme.spacing(2),
}));
const SaveChangesButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1), // Using theme spacing for consistency
  backgroundColor: "#1976D2", // Custom background color
  color: "white",
  "&:hover": {
    backgroundColor: "#145A8D", // Darker shade for hover effect
  },
}));
function ProductDetails() {
  const [product, setProduct] = useState();
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [image, setImage] = useState("");
  const [clear, setClear] = useState(false);
  const [open, setOpen] = useState(false);
  const [cookiesData, setCookiesData] = useState();

  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    const id = toast.loading("Please wait...");
    const storedData = Cookies.get();
    setCookiesData(storedData);
    async function fetchData() {
      try {
        const productData = await axios.get(
          `${API_ENDPOINTS.productMangement.product}/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        setProduct(productData.data);
        formik.setValues(productData.data);
        setImage(productData.data.productImage || "");
        toast.dismiss(id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchUnits(storedData);
    fetchCategories(storedData);
    fetchData();
  }, [clear]);

  async function fetchCategories(data) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.productMangement.category}`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchUnits(data) {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.productMangement.unitofmeasure}`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );
      setUnits(response.data);
    } catch (error) {
      console.error("Error fetching units of measure:", error);
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const prepareData = (values) => {
    const { branchId, ...rest } = values;

    return {
      ...rest,
      tenantId: cookiesData.token,
      createdBy: cookiesData.username,
      updatedBy: cookiesData.username,
      updatedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
      productImage: image,
    };
  };

  const formik = useFormik({
    initialValues: {
      productId: "",
      name: "",
      categoryId: "",
      description: "",
      forSale: false,
      forPurchase: false,
      organisationId: "",
      createdBy: "",
      updatedBy: "",
      unitOfMeasure: "",
      costPrice: "",
      // salesPrice: "",
      tenantId: "",
      thresholdLimit: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Product name must be at least 3 characters")
        .required("Product name is required"),
      costPrice: Yup.number()
        .typeError("Cost price must be a number")
        .integer("Cost price must be an integer")
        .min(1, "Cost price must be greater than zero")
        .required("Cost price is required"),
      thresholdLimit: Yup.number()
        .typeError("ThresholdLimit price must be a number")
        .integer("ThresholdLimit price must be an integer")
        .min(1, "ThresholdLimit price must be greater than zero")
        .required("thresholdLimit price is required"),
      salesPrice: Yup.string(),
      // .typeError("Sales price must be a number")
      // .integer("Sales price must be an integer")
      // .min(0, "Sales price cannot be negative"),
      // .required("Sales price is required"),
      description: Yup.string()
        .trim()
        .matches(/^[A-Za-z0-9/., -]+$/, "Description has invalid format"),
    }),
    onSubmit: async (values, { setFieldError }) => {
      try {
        await formik.validateField("salesPrice");
        if (values.forSale) {
          if (values.salesPrice === "") {
            setFieldError("salesPrice", "Sales price is required");
            return;
          }
          if (values.salesPrice <= 0) {
            setFieldError("salesPrice", "Sales price cannot be negative or 0");
            return;
          }
        } else {
          values.salesPrice = 0;
        }

        values.salesPrice = parseInt(values.salesPrice);
        values.thresholdLimit = parseInt(values.thresholdLimit);
        setOpen(true);
      } catch {
        console.log("error");
      }
      try {
        setOpen(true);
      } catch (error) {
        toast.error("Error occurred while editing", {
          onClose: () => navigate("/admin/product_manage"),
        });
      }
    },
  });

  const handleClear = () => {
    setClear(!clear);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = async () => {
    try {
      const data = prepareData(formik.values);
      const response = await axios.put(
        `${API_ENDPOINTS.productMangement.product}/${productId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      if (response.status === 200) {
        setOpen(false);
        toast.success("Updated Successfully", {
          onClose: () => navigate("/admin/product_manage"),
        });
      }
    } catch (error) {
      toast.error("Error updating");
      setOpen(false);
    }
  };

  return (
    <div className="manage_single">
      <ToastContainer />
      <div
        className="headerEditProduct"
        onClick={() => {
          navigate("/admin/product_manage");
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon icon={faArrowLeft} size="lg" className="backArrow" />
          <span style={{ fontSize: "23px", alignItems: "center" }}>
            {t("product.text.edit")}
          </span>{" "}
        </span>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="toprow">
          <div className="manage1box">
            <div className="box1c">
              <UpdateProductIdTextField
                fullWidth
                size="small"
                label="Product Id"
                name="productId"
                value={formik.values.productId}
                disabled
              />
              <UpdateProductNameTextField
                fullWidth
                size="small"
                label={t("product.label.productName")}
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>{t("product.label.category")}</InputLabel>
                <UpdateCategorySelect
                  labelId="category-select-label"
                  name="categoryId"
                  size="small"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.categoryName}
                    </MenuItem>
                  ))}
                </UpdateCategorySelect>
              </FormControl>
              <UpdateDescriptionTextField
                fullWidth
                size="small"
                label={t("product.label.description")}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                data-testid="description-input1"
                multiline
                rows={4}
                error={
                  formik.touched.description && !!formik.errors.description
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />

              <div style={{ display: "flex", alignItems: "center" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="forPurchase"
                      checked={formik.values.forPurchase}
                      onChange={formik.handleChange}
                    />
                  }
                  label={t("product.text.canBePurchased")}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="forSale"
                      checked={formik.values.forSale}
                      onChange={formik.handleChange}
                    />
                  }
                  label={t("product.text.canBeSold")}
                />
              </div>
            </div>
          </div>
          <div className="imgctrl">
            <label htmlFor="productImage">
              <img
                src={image}
                alt="Product"
                style={{
                  marginTop: ".5px",
                  marginLeft: "0px",
                  cursor: "pointer",
                  width: "198px",
                  height: "198px",
                  objectFit: "cover",
                }}
              />
            </label>
            <input
              id="productImage"
              name="productImage"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>
        </div>
        <div className="box2">
          <div className="box2c">
            <div className="unitndthres" style={{ display: "flex" }}>
              <FormControl fullWidth margin="normal" required>
                <InputLabel>{t("product.label.unitOfMeasure")}*</InputLabel>
                <Select
                  size="small"
                  label="Unit of Measure"
                  name="unitOfMeasure"
                  value={formik.values.unitOfMeasure}
                  onChange={formik.handleChange}
                  sx={{ width: "250px" }}
                  data-testid="unitofmeasure1"
                >
                  {units.map((unit) => (
                    <MenuItem key={unit.unitId} value={unit.unitId}>
                      {unit.units}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <UpdateThresholdLimitTextField
                fullWidth
                size="small"
                label={t("product.label.thresholdLimit")}
                name="thresholdLimit"
                value={formik.values.thresholdLimit}
                onChange={formik.handleChange}
                data-testid="threshold-input"
                error={
                  formik.touched.thresholdLimit &&
                  !!formik.errors.thresholdLimit
                }
                helperText={
                  formik.touched.thresholdLimit && formik.errors.thresholdLimit
                }
              />
            </div>
            <div className="csproduct">
              <div className="costinput" style={{ marginRight: "20px" }}>
                <UpdateCostPriceTextField
                  fullWidth
                  label={t("product.label.costPrice")}
                  size="small"
                  type="number"
                  name="costPrice"
                  value={formik.values.costPrice}
                  onChange={formik.handleChange}
                  error={formik.touched.costPrice && !!formik.errors.costPrice}
                  helperText={
                    formik.touched.costPrice && formik.errors.costPrice
                  }
                />
              </div>
              <div>
                {formik.values.forSale && (
                  <UpdateSalesPriceTextField
                    fullWidth
                    size="small"
                    label={t("product.label.salesPrice")}
                    type="number"
                    name="salesPrice"
                    disabled={!formik.values.forSale}
                    value={formik.values.salesPrice}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.salesPrice && !!formik.errors.salesPrice
                    }
                    helperText={
                      formik.touched.salesPrice && formik.errors.salesPrice
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <SaveChangesButton variant="contained" type="submit">
          {t("product.buttons.saveChanges")}
        </SaveChangesButton>
        <Button
          variant="outlined"
          onClick={() => {
            handleClear();
            navigate("/admin/product_manage");
          }}
        >
          {t("product.buttons.cancel")}
        </Button>
      </form>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("product.text.areYouSureYouWantToSaveTheChanges")}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("product.text.yourChangesWillBeSaved")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            {t("product.buttons.cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="warning"
            autoFocus
          >
            {t("product.buttons.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProductDetails;
