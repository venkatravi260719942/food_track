import { useEffect, useState } from "react";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Box,
  Autocomplete,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../../styles/supplier.css";
import { ToastContainer, toast } from "react-toastify";
import BankDetails from "./BankDetails";
import Cookies from "js-cookie";
import API_ENDPOINTS from "../../config/url.config";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../LanguageContext";
import { styled } from "@mui/system";
const LinkToAdminFromSupplier = styled(FormControl)(({ theme }) => ({
  backgroundColor: "transparent",
  marginRight: 10,
}));
export default function Supplier() {
  const [supplierCategories, setSupplierCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [cookiesData, setCookiesData] = useState({});
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const organisationId = storedData.organisationId;

    axios
      .get(`${API_ENDPOINTS.supplierManagement.suppliercategory}`, {
        headers: {
          Authorization: `Bearer ${storedData.token}`,
        },
      })
      .then((response) => {
        setSupplierCategories(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the supplier categories!",
          error
        );
      });

    axios
      .get(`${API_ENDPOINTS.productMangement.category}`, {
        headers: {
          Authorization: `Bearer ${storedData.token}`,
        },
      })
      .then((response) => {
        setProductCategories(response.data);
      })
      .catch((error) => {
        console.error(
          "There was an error fetching the product categories!",
          error
        );
      });

    axios
      .get(
        `${API_ENDPOINTS.productMangement.product}/organisationId/${organisationId}`,
        {
          headers: {
            Authorization: `Bearer ${storedData.token}`,
          },
        }
      )
      .then((response) => {
        setAllProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });

    axios
      .get(`${API_ENDPOINTS.organisation.onlyCountry}`, {
        headers: {
          Authorization: `Bearer ${storedData.token}`,
        },
      })
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the locations!", error.data);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      supplierName: "",
      type: "",
      productId: [],
      email: "",
      contactNumber: "",
      address: "",
      countryId: "",
      productCategory: "",
    },
    validationSchema: Yup.object({
      supplierName: Yup.string()
        .required(`${t("Supplier.error.Supplier name is required")}`)
        .trim()
        .matches(/^[a-zA-Z][a-zA-Z0-9]*$/, "Enter a valid name"),
      type: Yup.string().required(
        `${t("Supplier.error.Supplier category is required")}`
      ),
      productId: Yup.array().min(
        1,
        `${t("Supplier.error.At least one product is required")}`
      ),
      email: Yup.string()
        .email(`${t("Supplier.error.Invalid email address")}`)
        .required(`${t("Supplier.error.Email is required")}`)
        .trim()
        .matches(
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          `${t("Supplier.error.Invalid email address")}`
        ),
      contactNumber: Yup.string()
        .required(`${t("Supplier.error.Phone number is required")}`)
        .matches(
          /^[6-9][0-9]{9}$/,
          `${t("Supplier.error.Enter a valid phone number")}`
        ),
      address: Yup.string()
        .required(`${t("Supplier.error.Enter your address")}`)
        .trim(),
      countryId: Yup.string().required(
        `${t("Supplier.error.Location is required")}`
      ),
    }),

    onSubmit: (values) => {
      if (values.countryId) {
        setShowBankDetails(true);
      } else {
        toast.error("Please select a valid location.");
      }
    },
  });

  useEffect(() => {
    if (formik.values.productCategory) {
      const filtered = allProducts.filter(
        (product) => product.categoryId === formik.values.productCategory
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [formik.values.productCategory, allProducts]);

  return (
    <Container>
      <div
        className="supplier_head"
        style={{ display: "flex", alignItems: "center" }}
      >
        <LinkToAdminFromSupplier to="/admin">
          <span id="leftarrow">
            <FontAwesomeIcon
              className="fa-fw"
              icon={faArrowLeft}
              size="xl"
              style={{ color: "#000000" }}
            />
          </span>
        </LinkToAdminFromSupplier>
        <h3>{t("Supplier.text.Add New Supplier")}</h3>
        <ToastContainer />
      </div>
      <div className="sborder">
        <div className="scontent">
          {showBankDetails ? (
            <BankDetails
              formik={formik}
              countryId={formik.values.countryId}
              setBankDetailsShow={setShowBankDetails}
            />
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  id="supplierName"
                  name="supplierName"
                  label={t("Supplier.label.Supplier Name")}
                  variant="outlined"
                  margin="normal"
                  data-testid="suppliername"
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
                <div className="nes">
                  <FormControl
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                    error={formik.touched.type && Boolean(formik.errors.type)}
                  >
                    <InputLabel id="supplier-category-label">
                      {t("Supplier.label.Supplier Category")}
                    </InputLabel>
                    <Select
                      size="small"
                      labelId="supplier-category-label"
                      id="type"
                      name="type"
                      data-testid="suppliercategory"
                      value={formik.values.type}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      label="Supplier Category"
                    >
                      <MenuItem value=""></MenuItem>
                      {supplierCategories.map((category) => (
                        <MenuItem
                          key={category.categoryId}
                          value={category.categoryId.toString()}
                        >
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.type && formik.errors.type && (
                      <div style={{ color: "#f44336", marginTop: "3px" }}>
                        {formik.errors.type}
                      </div>
                    )}
                  </FormControl>

                  <FormControl
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    size="small"
                  >
                    <InputLabel id="product-category-label">
                      {t("Supplier.label.Product Category")}
                    </InputLabel>
                    <Select
                      size="small"
                      labelId="product-category-label"
                      id="productCategory"
                      name="productCategory"
                      value={formik.values.productCategory}
                      onChange={(event) =>
                        formik.setFieldValue(
                          "productCategory",
                          event.target.value
                        )
                      }
                      label="Product Category"
                    >
                      <MenuItem value="">
                        <em>All Products</em>
                      </MenuItem>
                      {productCategories.map((category) => (
                        <MenuItem
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.categoryName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <Autocomplete
                  multiple
                  id="productId"
                  name="productId"
                  data-testid="producttest"
                  options={filteredProducts}
                  getOptionLabel={(option) => option.name}
                  value={formik.values.productId}
                  onChange={(event, value) =>
                    formik.setFieldValue("productId", value)
                  }
                  onBlur={formik.handleBlur}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={t("Supplier.label.Product")}
                      placeholder="Select Products"
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

                <div className="emailphone">
                  <TextField
                    fullWidth
                    size="small"
                    id="email"
                    name="email"
                    label={t("Supplier.label.Email")}
                    variant="outlined"
                    margin="normal"
                    data-testid="semail"
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
                    label={t("Supplier.label.Phone Number")}
                    variant="outlined"
                    margin="normal"
                    data-testid="cn"
                    value={formik.values.contactNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.contactNumber &&
                      Boolean(formik.errors.contactNumber)
                    }
                    helperText={
                      formik.touched.contactNumber &&
                      formik.errors.contactNumber
                    }
                  />
                </div>
                <TextField
                  fullWidth
                  size="small"
                  id="address"
                  name="address"
                  label={t("Supplier.label.Address")}
                  variant="outlined"
                  margin="normal"
                  data-testid="saddress"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
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
                  <InputLabel id="location-label">
                    {t("Supplier.label.Location")}
                  </InputLabel>
                  <Select
                    id="countryId"
                    name="countryId"
                    label={t("Supplier.label.Location")}
                    size="small"
                    data-testid="supplierlocation"
                    value={formik.values.countryId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value=""></MenuItem>
                    {locations.map((location) => (
                      <MenuItem
                        key={location.countryId}
                        value={location.countryId}
                      >
                        {location.countriesStateName}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.countryId && formik.errors.countryId && (
                    <div style={{ color: "#f44336", marginTop: "3px" }}>
                      {formik.errors.countryId}
                    </div>
                  )}
                </FormControl>

                <div className="supplierbutton">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    data-testid="nextbutton"
                  >
                    {t("Supplier.button.Next")}
                  </Button>
                </div>
              </Box>
            </form>
          )}
        </div>
      </div>
    </Container>
  );
}
