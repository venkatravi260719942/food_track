import { useEffect, useState, useTransition } from "react";
import axios from "axios";
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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import API_ENDPOINTS from "../../config/url.config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../../styles/addBranch.css";
import errorMessages from "../../errors/error";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useLanguage } from "../../LanguageContext";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
const StyledArrowBackIcon = styled(ArrowBackIcon)(({ theme }) => ({
  paddingTop: "5px",
}));
const StyledEditBranchNameTextField = styled(TextField)(({ theme }) => ({
  margin: "20px",
}));
const NoOfEmployeeTextField = styled(TextField)(({ theme }) => ({
  margin: "20px",
}));
const ManagerTextField = styled(TextField)(({ theme }) => ({
  marginRight: "20px", // Consistent spacing
  marginBottom: "20px", // Consistent spacing
  marginLeft: "20px", // Consistent spacing
  "& .MuiInputBase-root": {
    borderRadius: "4px", // Customize border radius
    backgroundColor: "#f5f5f5", // Example background color
  },
}));
const BranchOwnerNameTextField = styled(TextField)(({ theme }) => ({
  marginRight: "20px",
  marginBottom: "20px",
  marginLeft: "20px",
}));
const StyledEmailTextField = styled(TextField)(({ theme }) => ({
  margin: "20px", // Consistent margin
}));
const StyledAddressTextField = styled(TextField)(({ theme }) => ({
  marginRight: "20px",
  marginBottom: "20px",
  marginLeft: "20px",
}));

const StyledNotesTextField = styled(TextField)(({ theme }) => ({
  marginTop: "20px",
  marginBottom: "20px",
}));
const StyledContactNumberTextField = styled(TextField)(({ theme }) => ({
  margin: "20px",
}));
const StyledEditSaveButton = styled(Button)(({ theme }) => ({
  marginLeft: "20px",
}));
const StyledEditCancelButton = styled(Button)(({ theme }) => ({
  marginLeft: "20px",
}));
const Contrylabel = styled(InputLabel)(({ theme }) => ({
  marginRight: "200px",
  marginTop: "15px",
  marginBottom: "20px",
  marginLeft: "20px",
}));
function EditBranch() {
  const { branchId } = useParams();
  const date = new Date().toISOString();
  const [uploadImage, setUploadImage] = useState(false);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [managerName, setManagerName] = useState("");
  const [cancel, setCancel] = useState(false);
  const [openModal, setOpenModal] = useState(false); // State for modal open/close
  const [selectedFile, setSelectedFile] = useState();
  const [countryData, setCountryData] = useState([]);
  const navigate = useNavigate();

  const [cookiesData, setCookiesData] = useState("");
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const prepareData = async (values) => {
    // if (selectedFile) {
    //   const imageUrl = await uploadImageToAws(selectedFile);
    //   values.branchImage = imageUrl;
    // }
    return {
      ...values, // Spread existing values
      createdBy: cookiesData.username,
      updatedBy: cookiesData.username,
      updatedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
    };
  };

  const formik = useFormik({
    initialValues: {
      // Initial form values
      branchName: "",
      address: "",
      contactNumber: "",
      branchId: parseInt(branchId),
      updatedBy: "",
      isActive: true,
      branchOwnerName: "",
      noOfEmployees: "",
      countryId: "",
      email: "",
      notes: "",
      managerName: "",
      updatedDate: date,
    },
    validationSchema: Yup.object({
      // Form validation schema
      contactNumber: Yup.string()
        .required(t("addBranch.validation.contactNumberRequired"))
        .matches(
          /^[6789]\d{9}$/,
          t("addBranch.validation.invalidContactNumber")
        ),
      branchOwnerName: Yup.string()
        .trim()
        .required(t("addBranch.validation.branchOwnerNameRequired"))
        .matches(
          /^[A-Za-z0-9/., -]+$/,
          t("addBranch.validation.invalidFormat")
        ),
      email: Yup.string()
        .trim()
        .required(t("addBranch.validation.emailRequired"))
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          t("addBranch.validation.invalidEmailFormat")
        ),
      branchImage: Yup.string(),
      noOfEmployees: Yup.string()
        .trim()
        .required(t("addBranch.validation.noOfEmployeesRequired"))
        .matches(/^\d+$/, t("addBranch.validation.invalidFormat")),
      notes: Yup.string()
        .trim()
        .matches(
          /^[A-Za-z0-9/., -]+$/,
          t("addBranch.validation.invalidFormat")
        ),
    }),
    onSubmit: async (values) => {
      try {
        setOpenModal(true);
      } catch (error) {
        const statusCode = error.response.status;
        if (errorMessages[statusCode]) {
          const errorMessage = String(error.response.data.error);
          formik.setStatus({
            error: errorMessages[statusCode](errorMessage).message,
          });
          setTimeout(() => {
            formik.setStatus(null);
          }, 3000);
        }
      }
    },
  });

  useEffect(() => {
    const id = toast.loading("Please wait...");
    const storedData = Cookies.get();
    setCookiesData(storedData);

    const fetchCountryData = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.organisation.onlyCountry}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        setCountryData(response.data);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };
    fetchCountryData();
    const fetchBranchDetails = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.adminDashboard.branch}/${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        formik.setValues(response.data);
        setImageUrl(response.data.branchImage);
        toast.dismiss(id);
      } catch (error) {
        console.error("Error fetching branch details:", error);
      }
    };
    fetchBranchDetails();

    // Fetch branch manager details
    const fetchBranchManagerDetails = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.adminDashboard.getBranchManagerDetails}/${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const manager = response.data.find(
          (item) => item.Role && item.Role.roleName === "Manager"
        );

        if (manager) {
          setManagerName(manager.User.firstName);
        }
      } catch (error) {
        console.error("Error fetching branch details:", error);
      }
    };
    fetchBranchManagerDetails();
  }, []);
  const handleConfirmSubmit = async (values) => {
    setOpenModal(false);
    // Parse strings to integers
    values.contactNumber = parseInt(values.contactNumber);
    values.noOfEmployees = parseInt(values.noOfEmployees);
    values.countryId = parseInt(values.countryId);

    if (selectedFile) {
      const imageUrl = await uploadImageToAws(selectedFile);
      values.branchImage = imageUrl;
    }
    const data = await prepareData(values);

    const response = await axios.put(
      `${API_ENDPOINTS.adminDashboard.branch}/${branchId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${cookiesData.token}`,
        },
      }
    );
    setOpenModal(false);
    formik.setStatus({ success: "Branch edited successfully" });
    setTimeout(() => {
      navigate("/admin");
    }, 3000);
  };

  // Function to handle file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setAlertOpen(false);
    setUploadImage(false);
    if (file) {
      if (file.size > 10240) {
        // Check if file size is greater than 10kb
        setAlertOpen(true);
        setUploadImage(true);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = (e) => {
        setSelectedFile(file);
        setImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to upload the selected image to AWS S3
  const uploadImageToAws = async (selectedFile) => {
    if (!selectedFile) {
      // formik.setStatus({ error: "Please select an image to upload" });
      // setTimeout(() => {
      //   formik.setStatus(null);
      // }, 3000);
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

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
      setImageUrl(imageUrl);
      formik.setStatus({ success: "Image uploaded successfully" });
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      formik.setStatus({ error: "Image upload failed" });
    }
  };

  const handleCancel = () => {
    setCancel(true);
    navigate("/admin");
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
    setUploadImage(false);
  };

  return (
    <div>
      <ToastContainer />
      <div>
        {uploadImage && (
          <Alert severity="error" onClose={handleCloseAlert} open={alertOpen}>
            {t("addBranch.alert.fileSizeError")}
          </Alert>
        )}

        {formik.isSubmitting && (
          <Alert severity="info">
            <AlertTitle>{t("addBranch.alert.saving")}</AlertTitle>
          </Alert>
        )}
        {formik.status?.success && (
          <Alert id="success_msg" severity="success">
            <AlertTitle>{t("addBranch.alert.success")}</AlertTitle>
            {formik.status.success || t("addBranch.alert.defaultSuccess")}
          </Alert>
        )}
        {formik.status?.error && (
          <Alert severity="error">
            <AlertTitle>{t("addBranch.alert.error")}</AlertTitle>
            {formik.status.error}
          </Alert>
        )}
        {formik.errors.submit && (
          <Alert severity="error">
            <AlertTitle>{t("addBranch.alert.error")}</AlertTitle>
            {t("addBranch.alert.submitError")}
          </Alert>
        )}
        <div
          className="addBranch_heading"
          onClick={() => {
            navigate("/admin");
          }}
        >
          <StyledArrowBackIcon id="back_button" data-testid="back_button" />
          <h4>{t("addBranch.text.manageBranch")}</h4>
        </div>
        <form>
          <div className="column">
            <div className="first_column">
              <div className="branch_details_1">
                <StyledEditBranchNameTextField
                  disabled
                  className="branch_textfield"
                  label={t("addBranch.label.branchName")}
                  name="branchName"
                  id="branchName"
                  data-testid="branchName"
                  size="small"
                  value={formik.values.branchName}
                  onChange={formik.handleChange}
                />
                <NoOfEmployeeTextField
                  className="branch_textfield"
                  label={t("addBranch.label.numberOfEmployees")}
                  name="noOfEmployees"
                  data-testid="noOfEmployees"
                  id="noOfEmployees"
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
                  data-testid="branchOwnerName"
                  id="branchOwnerName"
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
                <ManagerTextField
                  disabled
                  className="managerandtextfield" // API naming convention
                  label={t("addBranch.label.manager")} // Dynamic translation for the label
                  name="manager"
                  data-testid="managerandtextfield" // API naming convention
                  id="managerandtextfield" // API naming convention
                  size="small"
                  value={managerName}
                />
              </div>
              <div className="branch_details_2">
                <FormControl fullWidth>
                  <Contrylabel
                    id="country-label"
                    sx={{
                      color:
                        formik.touched.countryId && formik.errors.countryId
                          ? "#d32f2f"
                          : "default",
                    }}
                  >
                    {t("addBranch.label.country")}
                  </Contrylabel>
                  <Select
                    disabled
                    className="branch_textfield"
                    labelId="countryId-label"
                    label="countryId"
                    name="countryId"
                    id="countryId"
                    data-testid="countryId"
                    size="small"
                    sx={{
                      marginRight: "200px",
                      marginTop: "20px",
                      marginLeft: "20px",
                    }}
                    value={formik.values.countryId}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    {countryData.map((country) => (
                      <MenuItem
                        key={country.countryId}
                        value={country.countryId}
                      >
                        {country.countriesStateName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <StyledContactNumberTextField
                  className="branch_textfield" // Updated naming convention
                  label={t("addBranch.label.contactNumber")}
                  name="contactNumber"
                  data-testid="contactNumber"
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
                <StyledEmailTextField
                  className="branch_textfield"
                  label={t("addBranch.label.email")}
                  name="email"
                  data-testid="email"
                  id="email"
                  size="small"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <StyledAddressTextField
                  disabled
                  label={t("addBranch.label.address")}
                  name="address"
                  data-testid="address"
                  id="address"
                  multiline
                  rows={4}
                  className="large_textfield"
                  value={formik.values.address}
                />
              </div>
            </div>
            <div className="second_column">
              <label htmlFor="fileInput">
                <img
                  src={imageUrl}
                  alt="Branch"
                  data-testid="branchImage"
                  id="branchImage"
                  className="image"
                />
              </label>
              <input
                style={{ display: "none" }}
                type="file"
                data-testid="imageInput"
                id="fileInput"
                accept="image/*"
                onInputCapture={handleImageChange}
              />
              <StyledNotesTextField
                label={t("addBranch.label.notes")}
                name="notes"
                data-testid="notes"
                id="notes"
                value={formik.values.notes}
                onChange={formik.handleChange}
                multiline
                rows={4}
                error={formik.touched.notes && Boolean(formik.errors.notes)}
                helperText={formik.touched.notes && formik.errors.notes}
              />
            </div>
          </div>
          <StyledEditSaveButton
            variant="contained"
            color="primary"
            id="save_button"
            onClick={() => formik.handleSubmit()}
          >
            {t("addBranch.buttons.save")}
          </StyledEditSaveButton>
          <StyledEditCancelButton
            variant="outlined"
            color="primary"
            id="cancel_button"
            onClick={() => {
              handleCancel();
            }}
          >
            {t("addBranch.buttons.cancel")}
          </StyledEditCancelButton>
        </form>
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle>{t("addBranch.buttons.modalboxTitle")}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t("addBranch.buttons.modalboxeditContent")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              id="cancel_button"
              onClick={() => setOpenModal(false)}
              variant="outlined"
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

export default EditBranch;
