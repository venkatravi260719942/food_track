import { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/system";

import {
  TextField,
  Button,
  Alert,
  AlertTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API_ENDPOINTS from "../../config/url.config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../styles/addBranch.css";
import defaultImage from "../../assets/images/dashboard_bg.png";
import Cookies from "js-cookie";
import { useLanguage } from "../../LanguageContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const StyledArrowBackIcon = styled(ArrowBackIcon)({
  marginTop: "5px",
  cursor: "pointer", // Adding cursor pointer for better UX
});
const StyledaddBranchNameTextField = styled(TextField)(({ theme }) => ({
  margin: "20px",
  // You can add more custom styles here if needed
}));
const NoOfEmployeeTextField = styled(TextField)(({ theme }) => ({
  margin: "20px",
  // Additional styles can be added here
}));
const BranchOwnerNameTextField = styled(TextField)(({ theme }) => ({
  marginRight: "20px",
  marginBottom: "20px",
  marginLeft: "20px",
  // Additional styles can be added here
}));
const CountryLabel = styled(InputLabel)(({ theme, error }) => ({
  marginRight: "200px",
  marginTop: "15px",
  marginBottom: "20px",
  marginLeft: "20px",
  color: error ? "#d32f2f" : "default", // Conditional color based on error
}));
const CountrySelect = styled(Select)(({ theme }) => ({
  marginRight: "200px",
  marginTop: "20px",
  marginLeft: "20px",
  // Additional styles can be added here
}));
const CountryHelperText = styled(FormHelperText)(({ theme }) => ({
  marginLeft: "35px",
  // You can add more styles or logic here if needed
}));
const StyledContactNumberField = styled(TextField)(({ theme }) => ({
  margin: "20px",
}));

// Styled TextField for email
const StyledEmailField = styled(TextField)(({ theme }) => ({
  margin: "20px",
  marginTop: "20px",
}));

// Styled TextField for address
const StyledAddressField = styled(TextField)(({ theme }) => ({
  marginRight: "20px",
  marginBottom: "20px",
  marginLeft: "20px",
}));

// Styled TextField for notes
const StyledNotesField = styled(TextField)(({ theme }) => ({
  marginTop: "20px",
  marginBottom: "20px",
}));

// Styled Button for Add Branch button
const StyledAddBranchButton = styled(Button)(({ theme }) => ({
  marginLeft: "20px",
}));
function AddBranch() {
  const date = new Date().toISOString();
  const [selectedImage, setSelectedImage] = useState(defaultImage);

  const [cookiesData, setCookiesData] = useState();
  const [openModal, setOpenModal] = useState(false); // State for modal open/close
  const [file, setFile] = useState();
  const [countryData, setCountryData] = useState([]);
  const navigate = useNavigate();
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  useEffect(() => {
    const storedToken = Cookies.get();
    setCookiesData(storedToken);

    const fetchCountryData = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.organisation.onlyCountry}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken.token}`,
            },
          }
        );
        setCountryData(response.data);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };
    fetchCountryData();
  }, []);

  const formik = useFormik({
    initialValues: {
      // Initial form values
      branchName: "",
      address: "",
      contactNumber: "",
      createdDate: date,
      updatedDate: date,
      organisationId: "", // Parse organisationId to integer
      createdBy: "",
      updatedBy: "",
      isActive: true,
      branchOwnerName: "",
      noOfEmployees: "",
      countryId: "",
      email: "",
      notes: "",
      branchImage: "",
    },
    validationSchema: Yup.object({
      // Form validation schema
      branchName: Yup.string()
        .trim()
        .required(`${t("addBranch.errors.branchName.branchNameIsRequired")}`)
        .matches(
          /^[A-Za-z0-9/., -]+$/,
          `${t("addBranch.errors.branchName.invalidFormat")}`
        ),
      address: Yup.string()
        .trim()
        .required(`${t("addBranch.errors.address.addressIsRequired")}`)
        .matches(
          /^[A-Za-z0-9/., \n-]+$/,
          `${t("addBranch.errors.address.invalidFormat")}`
        ),
      contactNumber: Yup.string()
        .matches(
          /^[6789]\d{9}$/,
          `${t("addBranch.errors.contactNumber.invalidContactNumberFormat")}`
        )
        .required(
          `${t("addBranch.errors.contactNumber.contactNumberIsRequired")}`
        ),
      branchOwnerName: Yup.string()
        .trim()
        .required(
          `${t("addBranch.errors.branchOwnerName.branchOwnerNameIsRequired")}`
        )
        .matches(
          /^[A-Za-z0-9/., -]+$/,
          `${t("addBranch.errors.branchOwnerName.invalidFormat")}`
        ),
      noOfEmployees: Yup.number().required(
        `${t("addBranch.errors.noOfEmployees.numberOfEmployeesIsRequired")}`
      ),
      countryId: Yup.string().required(
        `${t("addBranch.errors.countryId.countryIsRequired")}`
      ),
      email: Yup.string()
        .email(`${t("addBranch.errors.email.invalidEmailFormat")}`)
        .required(`${t("addBranch.errors.email.emailIsRequired")}`)
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          `${t("addBranch.errors.email.invalidEmailFormat")}`
        ),
      notes: Yup.string(),
      branchImage: Yup.string(),
    }),
    onSubmit: async () => {
      try {
        setOpenModal(true);
      } catch (error) {
        console.error("Error adding branch:", error.message);
      }
    },
  });
  const handleConfirmSubmit = async (values) => {
    // const id = toast.loading("Adding new Branch...", {
    //   autoClose: false, // Keep the toast open until success or error
    //   closeButton: false, // No close button, it's handled internally
    // });
    try {
      // Parse contactNumber and noOfEmployees to integers
      values.contactNumber = parseInt(values.contactNumber);
      values.noOfEmployees = parseInt(values.noOfEmployees);
      values.countryId = parseInt(values.countryId);
      values.branchImage = (await uploadImage()) || defaultImage;
      values.organisationId = parseInt(cookiesData.organisationId);

      let postBranch = await axios.post(
        API_ENDPOINTS.adminDashboard.branch,
        values,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );

      setOpenModal(false);
      formik.setStatus({
        success: t("addBranch.text.branchAddedSuccessfully"),
      });
      setTimeout(() => {
        navigate("/admin");
      }, 3000);
    } catch (error) {
      console.error(error);
    }
  };
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

  // Function to upload the selected image to AWS S3
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

  return (
    <div>
      <div>
        {formik.isSubmitting && (
          <Alert severity="info">
            <AlertTitle>{t("addBranch.buttons.saveAlert")}</AlertTitle>
          </Alert>
        )}
        {formik.status?.success && (
          <Alert id="success_msg" severity="success">
            <AlertTitle>{t("addBranch.buttons.successAlert")}</AlertTitle>
            {formik.status.success}
          </Alert>
        )}
        {formik.status?.error && (
          <Alert severity="error">
            <AlertTitle>{t("addBranch.buttons.errorAlert")}</AlertTitle>
            {formik.status.error}
          </Alert>
        )}
        {formik.errors.submit && (
          <Alert severity="error">
            <AlertTitle>{t("addBranch.buttons.errorAlert")}</AlertTitle>
            {formik.errors.submit}
          </Alert>
        )}
        <div className="addBranch_heading" style={{ cursor: "pointer" }}>
          <StyledArrowBackIcon
            data-testid="back_button"
            id="back_button"
            onClick={() => {
              navigate("/admin");
            }}
          />
          <h4>{t("addBranch.text.addNewBranch")}</h4>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="column">
            <div className="first_column">
              <div className="branch_details_1">
                <StyledaddBranchNameTextField
                  className="branch_textfield"
                  label={t("addBranch.label.branchName")}
                  name="branchName"
                  id="branchName"
                  data-testid="branchName"
                  size="small"
                  value={formik.values.branchName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.branchName &&
                    Boolean(formik.errors.branchName)
                  }
                  helperText={
                    formik.touched.branchName && formik.errors.branchName
                  }
                />
                <NoOfEmployeeTextField
                  className="branch_textfield"
                  label={t("addBranch.label.numberOfEmployees")}
                  name="noOfEmployees"
                  id="noOfEmployees"
                  data-testid="noOfEmployees"
                  size="small"
                  value={formik.values.noOfEmployees}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.noOfEmployees &&
                    Boolean(formik.errors.noOfEmployees)
                  }
                  helperText={
                    formik.touched.noOfEmployees && formik.errors.noOfEmployees
                  }
                />

                <BranchOwnerNameTextField
                  className="branch_textfield"
                  label={t("addBranch.label.branchOwnerName")}
                  name="branchOwnerName"
                  id="branchOwnerName"
                  data-testid="branchOwnerName"
                  size="small"
                  value={formik.values.branchOwnerName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.branchOwnerName &&
                    Boolean(formik.errors.branchOwnerName)
                  }
                  helperText={
                    formik.touched.branchOwnerName &&
                    formik.errors.branchOwnerName
                  }
                />
              </div>
              <div className="branch_details_2">
                <FormControl fullWidth>
                  <CountryLabel
                    id="countryId-label"
                    error={
                      formik.touched.countryId &&
                      Boolean(formik.errors.countryId)
                    } // Pass error prop
                  >
                    {t("addBranch.label.country")}
                  </CountryLabel>
                  <CountrySelect
                    className="branch_textfield"
                    labelId="countryId-label"
                    name="countryId"
                    id="countryId"
                    data-testid="countryId"
                    size="small"
                    value={formik.values.countryId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.countryId &&
                      Boolean(formik.errors.countryId)
                    }
                  >
                    {countryData.map((country) => (
                      <MenuItem
                        id={country.countriesStateName}
                        key={country.countryId}
                        value={country.countryId}
                      >
                        {country.countriesStateName}
                      </MenuItem>
                    ))}
                  </CountrySelect>
                  {formik.touched.countryId && formik.errors.countryId && (
                    <CountryHelperText id="countryId-helper-text" error>
                      {formik.errors.countryId}
                    </CountryHelperText>
                  )}
                </FormControl>
                <StyledContactNumberField
                  className="branch_textfield"
                  label={t("addBranch.label.contactNumber")}
                  data-testid="contactNumber"
                  name="contactNumber"
                  id="contactNumber"
                  size="small"
                  value={formik.values.contactNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.contactNumber &&
                    Boolean(formik.errors.contactNumber)
                  }
                  helperText={
                    formik.touched.contactNumber && formik.errors.contactNumber
                  }
                />
                <StyledEmailField
                  className="branch_textfield"
                  label={t("addBranch.label.email")}
                  name="email"
                  id="email"
                  data-testid="email"
                  size="small"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <StyledAddressField
                  label={t("addBranch.label.address")}
                  name="address"
                  id="address"
                  data-testid="address"
                  multiline
                  rows={4}
                  className="large_textfield"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />
              </div>
            </div>
            <div className="second_column">
              <label htmlFor="fileInput">
                <img
                  className="image"
                  src={selectedImage}
                  alt="Branch"
                  id="branchImage"
                  data-testid="branchImage"
                  // onClick={() => document.getElementById("fileInput").click()}
                />
              </label>
              <input
                style={{ display: "none" }}
                data-testid="imageInput"
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleImageChange}
              />
              <StyledNotesField
                label={t("addBranch.label.notes")}
                name="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                data-testid="notes"
                id="notes"
                multiline
                rows={4}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </div>
          </div>
          <StyledAddBranchButton
            type="submit"
            variant="contained"
            id="AddBranchbutton"
            color="primary"
          >
            {t("addBranch.buttons.addBranch")}
          </StyledAddBranchButton>
        </form>
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle> {t("addBranch.buttons.modalboxTitle")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t("addBranch.buttons.modalboxContent")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              id="cancel_button"
              onClick={() => setOpenModal(false)}
              color="primary"
            >
              {t("addBranch.buttons.cancel")}
            </Button>
            <Button
              id="confirm_button"
              onClick={() => {
                handleConfirmSubmit(formik.values);
              }}
              variant="contained"
              color="warning"
            >
              {t("addBranch.buttons.save")}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default AddBranch;
