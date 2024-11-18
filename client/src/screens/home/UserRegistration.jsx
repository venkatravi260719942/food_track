import { useState } from "react";
import "../../styles/userRegistration.css";
import { TextField, Button, Alert, AlertTitle } from "@mui/material";
import axios from "axios";
import logoSvg from "../../assets/images/logo_bg.svg";
import API_ENDPOINTS from "../../config/url.config";
import { useFormik } from "formik";
import * as Yup from "yup";
import errorMessages from "../../errors/error";
import userRegistrationErrors from "../../errors/userRegistrationErrors";
import { Link, useNavigate } from "react-router-dom";

// function to register user
function UserRegistration() {
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  // formik for validation
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      contactNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      languageId: 1,
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim()
        .required(userRegistrationErrors.requiredField),
      lastName: Yup.string()
        .trim()
        .required(userRegistrationErrors.requiredField),
      contactNumber: Yup.string()
        .trim()
        .matches(
          /^[6789]\d{9}$/,
          userRegistrationErrors.invalidContactNumberFormat
        )
        .required(userRegistrationErrors.requiredField),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          userRegistrationErrors.invalidEmailFormat
        )
        .required(userRegistrationErrors.requiredField),
      password: Yup.string()
        .trim()
        .required(userRegistrationErrors.requiredField)
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
          userRegistrationErrors.invalidPasswordFormat
        ),
      confirmPassword: Yup.string()
        .trim()
        .required(userRegistrationErrors.requiredField)
        .oneOf(
          [Yup.ref("password"), null],
          userRegistrationErrors.passwordsDoNotMatch
        ),
    }),
    //post form data
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...postData } = values;
        postData.contactNumber = parseInt(postData.contactNumber, 10);
        const response = await axios.post(
          API_ENDPOINTS.auth.register,
          postData
        );

        if (response.status === 201) {
          formik.resetForm();
          setAlert({
            type: "success",
            message: "Registration successful!",
          });
          setTimeout(() => {
            setAlert(null);
            navigate("/");
          }, 3000);
        } else {
          console.error("Failed to post data:", response.statusText);
        }
      } catch (error) {
        const statusCode = error.response.status;

        if (errorMessages[statusCode]) {
          const errorMessage = String(error.response.data.error);
          setAlert({
            type: "error",
            message: errorMessages[statusCode](errorMessage).message,
          });
          setTimeout(() => {
            setAlert(null);
          }, 5000);
        }
      }
    },
  });

  return (
    <div className="background-picture">
      {alert && (
        <Alert severity={alert.type}>
          <AlertTitle data-testid="alert" id="alert">
            <span>{alert.message}</span>
          </AlertTitle>
        </Alert>
      )}
      <div className="reg_logo">
        <img src={logoSvg} alt="Logo" />
      </div>
      <div className="wrapper">
        <div className="reg_textbox">
          <div className="ur_quotebox">
            <div className="ur_quote1">
              <h5> Stay organised</h5>
              <p>Keep everything under control </p>
            </div>
            <div className="ur_quote2">
              <h5> Get your stats</h5>
              <p>All reports in one click</p>
            </div>
          </div>
        </div>
        <div className="reg_box">
          <div className="registration_form">
            <h2>Register</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="formField">
                {/* First name input field*/}
                <TextField
                  className="reg_textfield"
                  fullWidth
                  id="firstName"
                  data-testid="firstName"
                  label="First Name"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  size="small"
                  sx={{ marginRight: "25px" }}
                  error={
                    formik.touched.firstName && Boolean(formik.errors.firstName)
                  }
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                />
                {/* last name input field*/}
                <TextField
                  className="reg_textfield"
                  fullWidth
                  id="lastName"
                  data-testid="lastName"
                  label="Last Name"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  size="small"
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </div>
              <div className="formField">
                {/* email input field*/}
                <TextField
                  className="reg_textfield"
                  fullWidth
                  id="email"
                  data-testid="email"
                  label="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  size="small"
                  sx={{ marginRight: "25px" }}
                />
                {/* contact number input field*/}
                <TextField
                  className="reg_textfield"
                  fullWidth
                  type="tel"
                  id="contactNumber"
                  data-testid="contactNumber"
                  label="Contact Number"
                  value={formik.values.contactNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.contactNumber &&
                    Boolean(formik.errors.contactNumber)
                  }
                  helperText={
                    formik.touched.contactNumber && formik.errors.contactNumber
                  }
                  size="small"
                />
              </div>
              <div className="last_formField">
                {/* password input field*/}
                <TextField
                  fullWidth
                  type="password"
                  className="reg_textfield"
                  id="password"
                  data-testid="password"
                  label="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  size="small"
                  sx={{ marginRight: "25px" }}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
                {/* confirm password input field*/}
                <TextField
                  type="password"
                  fullWidth
                  className="reg_textfield"
                  id="confirmPassword"
                  data-testid="confirmPassword"
                  label="Confirm Password"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                  }
                  helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                  size="small"
                />
              </div>
              {/* Submit button */}
              <div className="ur_register_linktag">
                <div className="register_btn">
                  <Button
                    className="reg_button"
                    type="submit"
                    variant="contained"
                    style={{ backgroundColor: "#0A8CCD", color: "white" }}
                    data-testid="register_button"
                    id="register_button"
                  >
                    Register
                  </Button>
                </div>
                <div className="reg_signIn">
                  <Link
                    to={"/"}
                    style={{ textDecoration: "none" }}
                    id="login_redirect"
                  >
                    <p>I already have an account</p>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserRegistration;
