import { useState, useEffect } from "react";
import axios from "axios";
// import defaultImageURL from "../../assets/images/dashboard_bg.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faDownload } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/addProduct.css";
import { API_ENDPOINTS } from "../../config/url.config";
import { useFormik } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
const StyledProductNameField = styled(TextField)(({ theme }) => ({
  width: "100%",
  size: "small",
}));

// Styled FormControl for category
const StyledCategoryFormControl = styled(FormControl)(({ theme }) => ({
  width: "100%",
  margin: "normal",
  size: "small",
}));

// Styled Select for category
const StyledCategorySelect = styled(Select)(({ theme }) => ({
  size: "small",
}));

// Styled TextField for description
const StyledDescriptionField = styled(TextField)(({ theme }) => ({
  width: "100%",
  height: "150px",
  "& input": { size: "20px", height: "100px" },
}));

// Styled TextField for threshold limit
const StyledThresholdLimitField = styled(TextField)(({ theme }) => ({
  width: "250px",
  marginLeft: "20px",
  marginBottom: "8px",
}));

// Styled TextField for price
const StyledPriceField = styled(TextField)(({ theme }) => ({
  width: "250px",
}));

// Styled Button for Add and Cancel
const ProductAddCancelButton = styled(Button)(({ theme }) => ({
  margin: "8px",
}));
function AddProduct() {
  const [categories, setCategories] = useState([]);
  // const [submit, setSubmit] = useState(true);
  // const [forPurchase, setForPurchase] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [productImage, setProductImage] = useState();
  const [units, setUnits] = useState([]);
  const [unitOfMeasureError, setUnitOfMeasureError] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [open, setOpen] = useState(false);
  const [cookiesData, setCookiesData] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    async function fetchData() {
      try {
        const categoryResponse = await axios.get(
          `${API_ENDPOINTS.productMangement.category}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        if (categoryResponse.data && categoryResponse.data.length > 0) {
          setCategories(categoryResponse.data);
        }

        const unitResponse = await axios.get(
          `${API_ENDPOINTS.productMangement.unitofmeasure}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        if (unitResponse.data && unitResponse.data.length > 0) {
          setUnits(unitResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      salesPrice: "",
      costPrice: "",
      description: "",
      forSale: false,
      forPurchase: false,
      categoryId: "",
      unitOfMeasure: "",
      productImage: "",
      thresholdLimit: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required(`${t("product.errors.name.productNameIsRequired")}`)
        .trim()
        .matches(
          /^[a-zA-Z0-9]+$/,
          `${t(
            "product.errors.name.productNameCanOnlyContainLettersAndNumbers"
          )}`
        ),
      costPrice: Yup.number()
        .required(`${t("product.errors.costPrice.costPriceIsRequired")}`)
        .min(1, "Cost price cannot be negative"),
      salesPrice: Yup.number().min(1, "Sales price cannot be negative"),
      description: Yup.string()
        .trim()
        .matches(
          /^[a-zA-Z0-9]+$/,
          `${t(
            "product.errors.description.descriptionCanOnlyContainLettersAndNumbers"
          )}`
        ),
      categoryId: Yup.string().required(
        `${t("product.errors.categoryId.categoryIsRequired")}`
      ),
      unitOfMeasure: Yup.string().required(
        `${t("product.errors.unitOfMeasure.unitOfMeasureIsRequired")}`
      ),
      forPurchase: Yup.boolean(),
      thresholdLimit: Yup.number().min(1, "thresholdLimitCannotBeNegative"),
    }),
    onSubmit: async (values) => {
      try {
        const organisationId = cookiesData.organisationId;

        values.organisationId = parseInt(organisationId);
        values.salesPrice = parseInt(values.salesPrice);
        values.thresholdLimit = parseInt(values.thresholdLimit);

        const imageurl = await uploadImage();
        values.productImage = imageurl;

        if (!values.forSale && !values.forPurchase) {
          toast.error(
            'Either "Can be Purchased" or "Can be Sold" must be selected'
          );
        } else if (
          values.forSale &&
          (isNaN(values.salesPrice) || values.salesPrice <= 0)
        ) {
          toast.error(
            'Sales price must be a positive number when "For Sale" is selected'
          );
        } else {
          const payload = { ...values };
          if (!values.salesPrice) {
            delete payload.salesPrice;
          }
          const response = await axios.post(
            `${API_ENDPOINTS.productMangement.product}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${cookiesData.token}`,
              },
            }
          );

          if (response.status === 201) {
            toast.success(`${t("product.text.productsSuccessfullyAdded")}`);
            formik.resetForm();
          }
        }
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error(`${t("product.text.errorAddingProduct")}`);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProductImage(reader.result);
        setSelectedFile(file);
      };

      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      return;
    }
    // Create a FormData object to send the image file
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        `${API_ENDPOINTS.productMangement.product}/upload-product-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      setProductImage(null);
      setSelectedFile(null);
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    setProductImage(defaultImageURL);
  };

  const handleConfirm = async (values) => {
    const imageurl = await uploadImage();

    try {
      if (imageurl) {
        const response = await axios.post(
          `${API_ENDPOINTS.admin.product}`,
          values
        );
        if (response.status === 200 || response.status === 201) {
          toast.success("Product successfully added");
          setOpen(false);
          formik.resetForm();
        } else {
          console.error("Error adding product:", error);
          toast.error("Error adding product");
        }
      }
      setOpen(false);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product");
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProductImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="product_title">
          <Link
            to="/admin/product_manage"
            style={{ backgroundColor: "transparent" }}
          >
            <span id="leftarrow">
              <FontAwesomeIcon
                className="fa-fw"
                icon={faArrowLeft}
                size="xl"
                style={{ color: "#000000" }}
              />
            </span>
          </Link>
          <span className="addProductTitle">
            {t("product.buttons.addProducts")}{" "}
          </span>
        </div>

        <div className="imagep">
          <div className="product_body">
            <StyledProductNameField
              size="small"
              label={t("product.label.productName")}
              value={formik.values.name}
              name="name"
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              data-testid="product-name-input"
            />

            <StyledCategoryFormControl error={!!categoryError}>
              <InputLabel>{t("product.label.category")}*</InputLabel>
              <StyledCategorySelect
                label="Select category"
                value={formik.values.categoryId}
                name="categoryId"
                size="small"
                onChange={formik.handleChange}
                data-testid="category-select"
                error={
                  formik.touched.categoryId && Boolean(formik.errors.categoryId)
                }
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.categoryId}
                    value={category.categoryId}
                    data-testid={`category-${category.categoryName}`}
                  >
                    {category.categoryName}
                  </MenuItem>
                ))}
              </StyledCategorySelect>
              {formik.touched.categoryId && formik.errors.categoryId && (
                <FormHelperText>{formik.errors.categoryId}</FormHelperText>
              )}
            </StyledCategoryFormControl>

            <StyledDescriptionField
              label={t("product.label.description")}
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
              data-testid="description-input"
            />

            <div className="soldpurchasecb">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.forPurchase}
                    onChange={formik.handleChange}
                    name="forPurchase"
                  />
                }
                label={t("product.text.canBePurchased")}
                data-testid="can-be-purchased"
              />
              <FormControl
                error={formik.touched.forSale && Boolean(formik.errors.forSale)}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formik.values.forSale}
                      onChange={formik.handleChange}
                      name="forSale"
                      data-testid="can-be-sold"
                    />
                  }
                  label={t("product.text.canBeSold")}
                />
              </FormControl>
            </div>
          </div>
          <div className="product_image">
            <div
              data-testid="upload-area"
              className="productImgHolder"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {productImage ? (
                <img
                  src={productImage}
                  data-testid="image"
                  alt="Product"
                  style={{
                    cursor: "pointer",
                    width: "250px",
                    height: "250px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <>
                    <p className="imageText" data-testid="upload-text">
                      {t("product.text.dragImageHere")}
                    </p>
                    <br />
                    <p className="imageText" data-testid="upload-text">
                      or
                    </p>
                    <br />
                    <p
                      className="imageText"
                      data-testid="upload-text"
                      onClick={() =>
                        document.getElementById("fileuploader").click()
                      }
                    >
                      <span
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <FontAwesomeIcon icon={faDownload} />{" "}
                        {t("product.text.browseImage")}
                      </span>{" "}
                    </p>
                  </>
                </>
              )}
            </div>
            <input
              data-testid="product_image"
              type="file"
              id="fileuploader"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <div className="product_rightcontent">
          <div
            className="unitandthreshold"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <FormControl
              margin="normal"
              error={!!unitOfMeasureError}
              size="small"
            >
              <InputLabel>{t("product.label.unitOfMeasure")}</InputLabel>
              <Select
                label="Unit of Measure"
                data-testid="unitofmeasure"
                name="unitOfMeasure"
                size="small"
                value={formik.values.unitOfMeasure}
                onChange={formik.handleChange}
                error={
                  formik.touched.unitOfMeasure &&
                  Boolean(formik.errors.unitOfMeasure)
                }
                helperText={
                  formik.touched.unitOfMeasure && formik.errors.unitOfMeasure
                }
                sx={{ width: "250px" }}
              >
                {units.map((unit) => (
                  <MenuItem key={unit.unitId} value={unit.unitId}>
                    {unit.units}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.unitOfMeasure && formik.errors.unitOfMeasure && (
                <FormHelperText>{formik.errors.unitOfMeasure}</FormHelperText>
              )}
            </FormControl>
            <StyledThresholdLimitField
              size="small"
              label={t("product.label.thresholdLimit")}
              name="thresholdLimit"
              type="number"
              value={formik.values.thresholdLimit}
              onChange={formik.handleChange}
              error={
                formik.touched.thresholdLimit &&
                Boolean(formik.errors.thresholdLimit)
              }
              helperText={
                formik.touched.thresholdLimit && formik.errors.thresholdLimit
              }
              data-testid="thresholdLimit-input"
            />
          </div>
          <div className="csproduct">
            <div className="costinput">
              <StyledPriceField
                fullWidth
                size="small"
                label={t("product.label.price")}
                name="costPrice"
                type="number"
                value={formik.values.costPrice}
                onChange={formik.handleChange}
                error={
                  formik.touched.costPrice && Boolean(formik.errors.costPrice)
                }
                helperText={formik.touched.costPrice && formik.errors.costPrice}
                data-testid="cost-price-input"
              />
            </div>
            <StyledPriceField
              fullWidth
              required
              size="small"
              label={t("product.label.salesPrice")}
              name="salesPrice"
              type="number"
              value={formik.values.salesPrice}
              onChange={formik.handleChange}
              sx={{ width: "250px" }}
              error={
                formik.touched.salesPrice && Boolean(formik.errors.salesPrice)
              }
              helperText={formik.touched.salesPrice && formik.errors.salesPrice}
              disabled={!formik.values.forSale}
              data-testid="sales-price-input"
            />
          </div>

          <div></div>
        </div>
        <div className="addcancel">
          <ProductAddCancelButton
            data-testid="Add"
            type="submit"
            variant="contained"
            color="primary"
          >
            {t("product.buttons.add")}
          </ProductAddCancelButton>

          <Link to="/admin/product_manage" style={{ textDecoration: "none" }}>
            <ProductAddCancelButton
              color="primary"
              variant="outlined"
              style={{ backgroundColor: "transparent" }}
            >
              {t("product.buttons.cancel")}
            </ProductAddCancelButton>
          </Link>
        </div>
      </form>

      <ToastContainer />
    </>
  );
}

export default AddProduct;
