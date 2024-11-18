import { useState, useEffect } from "react";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../../../config/url.config";
import FIplaceholder from "../../../assets/images/image-regular.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { useLanguage } from "../../../LanguageContext";
import { useTranslation } from "react-i18next";
import FormHelperText from "@mui/material/FormHelperText";
import "../../../styles/manager/FoodItem.css";
import { styled } from "@mui/system";
const StyledTextFieldsku = styled(TextField)(({ theme }) => ({
  width: 312,
  height: 48,
  "& .Mui-disabled": {
    backgroundColor: "#F5F5F5",
    fontStyle: "italic",
    borderRadius: "5px",
  },
}));
const TextFieldItemName = styled(TextField)(({ theme }) => ({
  width: 312,
  height: 48,
  "& .Mui-disabled": {
    backgroundColor: "#F5F5F5",
    fontStyle: "italic",
    borderRadius: "5px",
  },
}));

const FormControlItemPrice = styled(FormControl)(({ theme }) => ({
  "& .Mui-disabled": {
    backgroundColor: "#F5F5F5",
    fontStyle: "italic",
    borderRadius: "5px",
  },
}));

const TextFieldItemPrice = styled(TextField)(({ theme }) => ({
  width: 312,
  height: 48,
}));

const ButtonSave = styled(Button)(({ theme }) => ({
  marginRight: "10px",
}));
function FoodItemForm({ isEdit }) {
  const { id } = useParams(); // Get the ID from the URL params if in edit mode
  const [categories, setCategories] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [foodItem, setFoodItem] = useState(null); // Set to null initially
  const [cookiesData, setCookiesData] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState();
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const savedView = localStorage.getItem("currentView") || "table";

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);

    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.menuitemscategory.itemCategoryData}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.menuitems.singleItemData}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        const foodItemData = response.data;
        setFoodItem(foodItemData);
        setSelectedImage(foodItemData.itemImageUrl);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    if (isEdit && id) {
      fetchProductDetails();
    }
  }, [isEdit, id]);

  const prepareData = (values) => {
    return {
      ...values, // Spread existing values
      branchId: parseInt(cookiesData.branchId),
      createdBy: cookiesData.username,
      updatedBy: cookiesData.username,
      sku: values.sku.startsWith("SKU") ? values.sku : "SKU" + values.sku,
      updatedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
    };
  };

  const formik = useFormik({
    enableReinitialize: true, // Allows reinitializing the form when the initial values change
    initialValues: {
      itemName: foodItem?.itemName || "",
      categoryId: foodItem?.categoryId || "",
      itemPrice: foodItem?.itemPrice || "",
      itemDescription: foodItem?.itemDescription || "",
      sku: foodItem?.sku || "",
      itemImageUrl: foodItem?.itemImageUrl || "",
      menuItemInventoryId: foodItem?.menuItemInventoryId || "",
    },
    validationSchema: Yup.object({
      itemName: isEdit
        ? Yup.string()
        : Yup.string().required("Item Name is required"),
      categoryId: isEdit
        ? Yup.string()
        : Yup.string().required("Category is required"),
      itemPrice: Yup.number()
        .required("Price is required")
        .positive("Price must be above 0"),
      itemDescription: Yup.string().required("Description is required"),
      sku: isEdit
        ? Yup.string()
        : Yup.string()
            .matches(/^\d+$/, "Invalid SKU format, Only numbers")
            .required("SKU is required"),
    }),
    onSubmit: async (values) => {
      try {
        let newImageUrl =
          selectedImage !== foodItem?.itemImageUrl
            ? await uploadImage()
            : foodItem?.itemImageUrl;

        values.itemImageUrl = newImageUrl || "";

        const data = prepareData(values);
        if (isEdit && id) {
          // Update product
          await axios.put(
            `${API_ENDPOINTS.manager.menuitemsupdate.itemUpdate}/${id}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${cookiesData.token}`,
              },
            }
          );
        } else {
          // Add new product
          await axios.post(
            `${API_ENDPOINTS.manager.menuitems.itemsData}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${cookiesData.token}`,
              },
            }
          );
        }
        localStorage.setItem("currentView", savedView);

        setSuccessMessage(
          isEdit ? "Product updated successfully" : "Product added successfully"
        );
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate(`/manager/fooditems`);
        }, 2000);
      } catch (error) {
        console.error("Error saving product:", error);
      }
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      formik.setStatus({ error: `${t("addBranch.text.addImage")}` });
      setTimeout(() => {
        formik.setStatus(null);
      }, 3000);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        API_ENDPOINTS.adminDashboard.uploadImage,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      const imageUrl = response.data.imageUrl;

      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="food-item-form">
      <div className="FI_backarrowAndHeading">
        <div className="FI_backArrow">
          <ArrowBackIcon
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(-1)}
          ></ArrowBackIcon>
        </div>
        <div className="FI_heading">
          <h2>
            {isEdit
              ? t("fooditems.text.manageFoodItem")
              : t("fooditems.text.addNewFoodItem")}
          </h2>
        </div>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-container">
          <div className="image-upload">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className="FI_image_layout"
            >
              <label style={{ cursor: "pointer" }} htmlFor="fileInput">
                {selectedImage ? (
                  <img
                    className="FI_Item_image"
                    src={selectedImage}
                    alt="fooditem"
                    id="foodItemImage"
                  />
                ) : (
                  <div className="image-placeholder-text">
                    <img
                      className="FI_Add_manage_image"
                      style={{
                        padding: "20px 63px 0px 63px",
                      }}
                      src={FIplaceholder}
                    ></img>
                    <p
                      style={{
                        padding: "11px 18px 0px 22px",
                      }}
                    >
                      Drag image here.
                    </p>
                    <p
                      style={{
                        padding: "7px 71px 0px 70px",
                      }}
                    >
                      Or
                    </p>
                    <p
                      style={{
                        padding: "7px 28px 22px 30px",
                      }}
                    >
                      Browse image
                    </p>
                  </div>
                )}
              </label>
              <input
                style={{ display: "none" }}
                data-testid="imageInput"
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <div className="FI_form-fields">
            <div className="sku_itemname">
              <StyledTextFieldsku
                size="small"
                name="sku"
                label={t("fooditems.lables.sku")} // Corrected spelling from 'lables' to 'labels'
                value={formik.values.sku}
                onChange={formik.handleChange}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
                margin="normal"
                onBlur={formik.handleBlur}
                error={formik.touched.sku && Boolean(formik.errors.sku)}
                helperText={formik.touched.sku && formik.errors.sku}
                disabled={isEdit}
              />
              <TextFieldItemName
                label={t("fooditems.lables.itemName")}
                size="small"
                name="itemName"
                value={formik.values.itemName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                margin="normal"
                disabled={isEdit}
                error={
                  formik.touched.itemName && Boolean(formik.errors.itemName)
                }
                helperText={formik.touched.itemName && formik.errors.itemName}
              />
            </div>

            <div className="FI_item_price">
              <FormControlItemPrice
                margin="normal"
                size="small"
                disabled={isEdit}
              >
                <InputLabel> Category </InputLabel>
                <Select
                  sx={{
                    width: 312,
                    height: 42,
                  }}
                  label={t("fooditems.lables.category")}
                  name="categoryId"
                  size="small"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.categoryId &&
                    Boolean(formik.errors.categoryId)
                  }
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.categoryId} value={cat.categoryId}>
                      {cat.category}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.categoryId && formik.errors.categoryId && (
                  <FormHelperText
                    sx={{ color: "#D32F2F" }}
                    id="categoryId-helper-text"
                  >
                    {formik.errors.categoryId}
                  </FormHelperText>
                )}
              </FormControlItemPrice>
              <TextFieldItemPrice
                sx={{}}
                label={t("fooditems.lables.price")}
                size="small"
                type="number"
                name="itemPrice"
                value={formik.values.itemPrice}
                onChange={(e) => {
                  const value = e.target.value;
                  const numericValue = value === "" ? "" : parseInt(value, 10);
                  formik.setFieldValue(
                    "itemPrice",
                    isNaN(numericValue) ? "" : numericValue
                  );
                }}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
                inputProps={{ min: 0 }}
                onBlur={formik.handleBlur}
                margin="normal"
                error={
                  formik.touched.itemPrice && Boolean(formik.errors.itemPrice)
                }
                helperText={formik.touched.itemPrice && formik.errors.itemPrice}
              />
            </div>
            <TextField
              label={t("fooditems.lables.description")}
              fullWidth
              name="itemDescription"
              value={formik.values.itemDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              margin="normal"
              multiline
              rows={4}
              inputProps={{ maxLength: "250" }}
              error={
                formik.touched.itemDescription &&
                Boolean(formik.errors.itemDescription)
              }
              helperText={
                formik.touched.itemDescription && formik.errors.itemDescription
              }
            />
            <div className="FI_button-group">
              <ButtonSave
                variant="contained"
                color="primary"
                type="submit"
                onClick={() => localStorage.setItem("currentView", savedView)}
              >
                Save
              </ButtonSave>
              <Button
                variant="outlined"
                onClick={() => {
                  localStorage.setItem("currentView", savedView);
                  navigate(-1);
                }}
              >
                {t("fooditems.buttons.cancel")}
              </Button>
            </div>
          </div>
        </div>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={successMessage}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          "& .MuiSnackbarContent-root": {
            backgroundColor: "green",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default FoodItemForm;
