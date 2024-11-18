import { useEffect, useState } from "react";
import "../../styles/organisation.css";
import {
  TextField,
  Select,
  Button,
  InputLabel,
  FormControl,
  Box,
  MenuItem,
} from "@mui/material";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormHelperText from "@mui/material/FormHelperText";
import * as Yup from "yup";
import axios from "axios";
import API_ENDPOINTS from "../../config/url.config";
import errors from "../../errors/organisationErrors";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";

// To register an organisation
function Organisation() {
  // State variables to store data fetched from the API
  const [language, setLanguage] = useState([]);
  const [country, setCountry] = useState([]);
  const [states, setStates] = useState([]);
  const [primaryInterest, setPrimaryInterest] = useState([]);
  const [companySize, setCompanySize] = useState([]);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fetch data from the API when component mounts
  useEffect(() => {
    const getData = async () => {
      try {
        const storedToken = Cookies.get("token");
        setToken(storedToken);
        const name = Cookies.get("username");
        setUsername(name);
        const language = await axios.get(
          `${API_ENDPOINTS.organisation.language}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setLanguage(language.data);

        const country = await axios.get(
          `${API_ENDPOINTS.organisation.onlyCountry}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        setCountry(country.data);

        const interest = await axios.get(
          `${API_ENDPOINTS.organisation.primaryInterest}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setPrimaryInterest(interest.data);

        const companySize = await axios.get(
          `${API_ENDPOINTS.organisation.companySize}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
        setCompanySize(companySize.data);
      } catch (error) {
        console.error(error.response);
      }
    };
    getData();
  }, []);

  // Function to fetch states for a selected country
  const getState = async (id) => {
    const state = await axios.get(`${API_ENDPOINTS.organisation.states}/${id}`);
    setStates(state.data);
  };
  // Form data helper function
  const prepareData = (values) => {
    return {
      ...values, // Spread existing values
      tenantId: token,
      createdBy: username,
      updatedBy: username,
      updatedDate: new Date().toISOString(),
      createdDate: new Date().toISOString(),
    };
  };

  // Formik form handling
  const formik = useFormik({
    // Initial form values and validation schema
    initialValues: {
      email: "",
      companyName: "",
      contactNumber: "",
      state: "",
      country: "",
      language: "",
      companySize: "",
      primaryInterest: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Enter a valid Email"
        ),
      companyName: Yup.string()
        .matches(/^[A-Za-z0-9\/.,@#\- ]+$/, "invalid format")
        .required("Company name is required"),

      contactNumber: Yup.string()
        .matches(/^[6789]\d{9}$/, "Enter valid contact number")
        .required("Contact number is required"),
      state: Yup.string().required("State is required"),
      country: Yup.string().required("Country is required"),
      language: Yup.string().required("Language is required"),
      companySize: Yup.string().required("Company size is required"),
      primaryInterest: Yup.string().required("Primary interest is required"),
    }),
    // Form submission handler
    onSubmit: async (values) => {
      try {
        const id = toast.loading("Please wait...");
        // helper function
        const data = prepareData(values);
        // Check fields for duplication
        const response = await axios.post(
          `${API_ENDPOINTS.organisation.checkOrganisationFields}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        try {
          if (response.status === 200) {
            // If fields are available, register the organization
            const registerResponse = await axios.post(
              `${API_ENDPOINTS.organisation.postOrganisation}`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (registerResponse.status === 201) {
              toast.dismiss(id);
              // Reset form and show success message
              formik.resetForm();
              toast.success("Organisation registered successfully", {
                onClose: () => {
                  navigate("/admin");
                },
              });
            }
          }
        } catch (error) {
          console.log(error);
        }
      } catch (err) {
        // Handle errors from API
        if (err?.response?.data?.errors) {
          Object.keys(err.response.data.errors).forEach((field) => {
            formik.setFieldError(field, err.response.data.errors[field]);
          });
          console.error(errors[err.response.status]);
        }
      }
    },
  });

  return (
    <div className="Organisation_1st">
      <ToastContainer />
      <div className="header">
        {" "}
        <img
          className="side_logo"
          src="/src/assets/images/logo_bg.svg"
          alt="foodtracz"
        />
        <span className="welcome_box">
          Welcome <span className="usernameTitle">{username}</span>
        </span>
      </div>
      <div className="organisationForm">
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              background: "#fff",
              borderRadius: "5px",
              width: "60vw",
              margin: "10px",
              // border: "#ddd 2px solid",
              boxShadow: "5px 5px 50px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2 className="heading_2nd">Set up your Organisation profile</h2>
            <p className="heading_3rd">ORGANIZATION DETAILS</p>
            <div className="company_name_box">
              {/* Text field for company name */}
              <TextField
                label="Company name"
                size="small"
                name="companyName"
                id="companyName"
                data-testid="companyName"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.companyName &&
                  Boolean(formik.errors.companyName)
                }
                helperText={
                  formik.touched.companyName && formik.errors.companyName
                }
                sx={{ width: "22vw" }}
              />
            </div>
            <div className="Org_reg_content">
              {/* Text field for contact number */}
              <div>
                <TextField
                  label="Mobile number"
                  size="small"
                  value={formik.values.contactNumber}
                  name="contactNumber"
                  id="contactNumber"
                  data-testid="contactNumber"
                  variant="outlined"
                  onChange={(e) => {
                    const intValue = parseInt(e.target.value);
                    formik.handleChange(e);
                    formik.setFieldValue(
                      "contactNumber",
                      isNaN(intValue) ? "" : intValue
                    );
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.contactNumber &&
                    Boolean(formik.errors.contactNumber)
                  }
                  helperText={
                    formik.touched.contactNumber && formik.errors.contactNumber
                  }
                  sx={{ width: "22vw" }}
                />
                {/* <PhoneInput
                  country="US"
                  label="Mobile number"
                  size="small"
                  value={formik.values.contactNumber}
                  name="contactNumber"
                  id="contactNumber"
                  data-testid="contactNumber"
                  variant="outlined"
                  onChange={(e) => {
                    const intValue = parseInt(e.target.value);
                    formik.handleChange(e);
                    formik.setFieldValue(
                      "contactNumber",
                      isNaN(intValue) ? "" : intValue
                    );
                  }}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.contactNumber &&
                    Boolean(formik.errors.contactNumber)
                  }
                  helperText={
                    formik.touched.contactNumber && formik.errors.contactNumber
                  }
                /> */}
              </div>
              {/* Text field for email */}
              <div>
                <TextField
                  label="Email"
                  size="small"
                  value={formik.values.email}
                  name="email"
                  id="email"
                  data-testid="email"
                  variant="outlined"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{ width: "22vw" }}
                />
              </div>
              {/* Select dropdown for company size */}
              <FormControl
                size="small"
                error={
                  formik.touched.companySize &&
                  Boolean(formik.errors.companySize)
                }
              >
                <InputLabel id="company_size">Company size</InputLabel>
                <Select
                  label="Company Size"
                  name="companySize"
                  id="companySize"
                  data-testid="companySize"
                  variant="outlined"
                  value={formik.values.companySize}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.companySize &&
                    Boolean(formik.errors.companySize)
                  }
                  sx={{ width: "22vw" }}
                >
                  {/* Mapping company size options */}
                  {companySize.map((item) => {
                    return (
                      <MenuItem
                        id={item.companySize}
                        key={item.companySize}
                        value={item.companySize}
                      >
                        {item.companySize}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.touched.companySize && formik.errors.companySize && (
                  <FormHelperText id="companySize-helper-text">
                    {formik.errors.companySize}
                  </FormHelperText>
                )}
              </FormControl>
              {/* Select dropdown for primary interest */}
              <FormControl
                size="small"
                error={
                  formik.touched.primaryInterest &&
                  Boolean(formik.errors.primaryInterest)
                }
              >
                <InputLabel id="primary_interest-placeholder">
                  Primary Interest
                </InputLabel>
                <Select
                  label="Primary interest"
                  value={formik.values.primaryInterest}
                  name="primaryInterest"
                  id="primaryInterest"
                  data-testid="primaryInterest"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.primaryInterest &&
                    Boolean(formik.errors.primaryInterest)
                  }
                  helperText={
                    formik.touched.primaryInterest &&
                    formik.errors.primaryInterest
                  }
                  sx={{ width: "22vw" }}
                >
                  {/* Mapping primary interest options */}
                  {primaryInterest.map((item) => {
                    return (
                      <MenuItem
                        id={item.primaryInterest}
                        key={item.primaryInterest}
                        value={item.primaryInterest}
                      >
                        {item.primaryInterest}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.touched.primaryInterest &&
                  formik.errors.primaryInterest && (
                    <FormHelperText id="primaryInterest-helper-text">
                      {formik.errors.primaryInterest}
                    </FormHelperText>
                  )}
              </FormControl>
            </div>
            {/* Additional details section */}
            <p className="heading_4th">ADDITIONAL DETAILS</p>
            <div className="Org_reg_content">
              {/* Select dropdown for country */}
              <FormControl
                size="small"
                error={formik.touched.country && Boolean(formik.errors.country)}
              >
                <InputLabel id="country-placeholder">Country</InputLabel>
                <Select
                  label="Country"
                  value={formik.values.country}
                  name="country"
                  id="country"
                  data-testid="country"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.country && Boolean(formik.errors.country)
                  }
                  helperText={formik.touched.country && formik.errors.country}
                  sx={{ width: "22vw" }}
                >
                  {/* Mapping country options */}
                  {country.map((item) => {
                    return (
                      <MenuItem
                        id={item.countriesStateName}
                        key={item.countriesStateName}
                        value={item.countriesStateName}
                        onClick={() => {
                          getState(item.countryId);
                        }}
                      >
                        {item.countriesStateName}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.touched.country && formik.errors.country && (
                  <FormHelperText id="country-helper-text">
                    {formik.errors.country}
                  </FormHelperText>
                )}
              </FormControl>
              {/* Select dropdown for state */}
              <FormControl
                size="small"
                error={formik.touched.state && Boolean(formik.errors.state)}
                style={{
                  marginLeft: "60px",
                }}
              >
                <InputLabel id="state-placeholder">State</InputLabel>
                <Select
                  label="state"
                  value={formik.values.state}
                  name="state"
                  id="state"
                  data-testid="state"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.state && Boolean(formik.errors.state)}
                  helperText={formik.touched.state && formik.errors.state}
                  sx={{ width: "22vw" }}
                >
                  {/* Mapping state options */}
                  {states.map((item) => {
                    return (
                      <MenuItem
                        id={item.countriesStateName}
                        key={item.countriesStateName}
                        value={item.countriesStateName}
                      >
                        {item.countriesStateName}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.touched.state && formik.errors.state && (
                  <FormHelperText id="state-helper-text">
                    {formik.errors.state}
                  </FormHelperText>
                )}
              </FormControl>
              {/* Select dropdown for language */}
              <FormControl
                size="small"
                error={
                  formik.touched.language && Boolean(formik.errors.language)
                }
              >
                <InputLabel id="language-placeholder"> Language </InputLabel>
                <Select
                  label="Language"
                  name="language"
                  id="language"
                  data-testid="language"
                  value={formik.values.language}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.language && Boolean(formik.errors.language)
                  }
                  helperText={formik.touched.language && formik.errors.language}
                  sx={{ width: "22vw" }}
                >
                  {/* Mapping language options */}
                  {language.map((item) => {
                    return (
                      <MenuItem
                        id={item.languageName}
                        key={item.languageName}
                        value={item.languageName}
                      >
                        {item.languageName}
                      </MenuItem>
                    );
                  })}
                </Select>
                {formik.touched.language && formik.errors.language && (
                  <FormHelperText id="language-helper-text">
                    {formik.errors.language}
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            {/* Note about updating preferences */}
            <p className="text_content">
              *You can update some of the preferences from the settings
            </p>
            {/* Register button */}
            <div className="create_org_button">
              <Button
                className="Org_reg_button"
                type="submit"
                variant="contained"
                color="primary"
                id="Register_button"
                data-testid="Register_button"
              >
                Register
              </Button>
              {/* Back button */}
              <Button
                sx={{ marginLeft: "15px", width: "7vw" }}
                onClick={() => {
                  navigate("/overview");
                }}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </form>
      </div>
    </div>
  );
}

export default Organisation;
