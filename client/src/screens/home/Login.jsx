import { useEffect, useState, useTransition } from "react";
import "../../styles/login.css";
import logo from "../../assets/images/logo_bg.svg";
import {
  TextField,
  Button,
  Box,
  FormControl,
  Alert,
  Stack,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import { useFormik } from "formik";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { Link, Routes, useNavigate } from "react-router-dom";
import API_ENDPOINTS from "../../config/url.config";
import errors from "./../../errors/loginError";
import i18next from "i18next";
import Cookies from "js-cookie";
import { Trans, useTranslation } from "react-i18next";

function Login() {
  const [loginError, setLoginError] = useState(false);

  const [promisePending, setPromisePending] = useState(false);
  const [error, setError] = useState();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.email) {
        errors.email = "Please enter valid email";
      }
      if (!values.password) {
        errors.password = "Please enter valid password";
      }

      return errors;
    },
    onSubmit: async (values) => {
      try {
        setPromisePending(true);
        const loginResponse = await axios.post(
          `${API_ENDPOINTS.auth.login}`,
          values
        );
        if (loginResponse.status === 200) {
          Cookies.set("token", loginResponse.data.user.token);
          Cookies.set("userId", loginResponse.data.user.id);

          // Store username in cookie
          const firstName = loginResponse.data.user.firstName || "";
          const lastName = loginResponse.data.user.lastName || "";
          Cookies.set("username", `${firstName} ${lastName}`.trim());
          setPromisePending(false);
          try {
            // Check if user is associated with any existing branch
            const branchResponse = await axios.get(
              `${API_ENDPOINTS.adminDashboard.branchMap}`,
              {
                headers: {
                  Authorization: `Bearer ${loginResponse.data.user.token}`,
                },
              }
            );
            const emailExists = branchResponse.data.some(
              (item) => item.email === values.email
            );
            // Check if user is associated with any existing organisation
            const organisationResponse = await axios.get(
              `${API_ENDPOINTS.organisation.getOrganisation}`,
              {
                headers: {
                  Authorization: `Bearer ${loginResponse.data.user.token}`,
                },
              }
            );
            const organisationEmailCheck = organisationResponse.data.some(
              (item) => item.tenantId === loginResponse.data.user.token
            );
            // Get user role
            const userRoleResponse = await axios.get(
              `${API_ENDPOINTS.auth.getRole}/${values.email}`,
              {
                headers: {
                  Authorization: `Bearer ${loginResponse.data.user.token}`,
                },
              }
            );

            const userRoles = userRoleResponse.data;

            if (emailExists) {
              Cookies.set("branchId", userRoles.branchId);
              Cookies.set("organisationId", userRoles.organisationId);
              if (userRoles.roleId) {
                const roleName = userRoles.Role.roleName;
                switch (roleName) {
                  case "Manager":
                    navigate("/manager");
                    break;
                  case "Chef":
                    navigate("/chef");
                    break;
                  case "Operator":
                    navigate("/operator");
                    break;
                }
              }
            } else {
              if (organisationEmailCheck) {
                navigate("/admin");
              } else {
                navigate("/overview");
              }
            }
          } catch (error) {
            console.error("Error fetching branch or organization data:", error);
          }
        }
      } catch (error) {
        setLoginError(true);
        setPromisePending(false);
        console.error(error);
        setError(errors[error.response.status]);
        setTimeout(() => {
          setLoginError(false);
        }, 10000);
      }
    },
  });

  return (
    <>
      <div className="home">
        <div className="loginText">
          <div className="login_side_logo">
            <img alt="foodtracz" src={logo} />
          </div>
          <div className="quote">
            <div className="login_qmain">
              <div className="login_quote1">
                <h5> Stay organised</h5>
                <p>Keep everything under control </p>
              </div>
              <div className="login_quote2">
                <h5> Get your stats</h5>
                <p>All reports in one click</p>
              </div>
            </div>
          </div>
        </div>

        <div className="loginModal">
          <div className="loginbox">
            <h2 className="titleText">Login</h2>
            <form onSubmit={formik.handleSubmit}>
              <Box noValidate autoComplete="off">
                <FormControl className="loginForm">
                  <div className="login_email_field">
                    <TextField
                      label={"Email"}
                      fullWidth
                      id="email"
                      name="email"
                      size="small"
                      variant="outlined"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                      data-testid="email"
                    />
                  </div>
                  <div className="login_password_field">
                    <TextField
                      label={"Password"}
                      fullWidth
                      type="password"
                      id="password"
                      name="password"
                      size="small"
                      variant="outlined"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      helperText={
                        formik.touched.password && formik.errors.password
                      }
                      data-testid="password"
                    />
                  </div>
                  {loginError ? (
                    <Stack sx={{ width: "100%" }} marginTop={2}>
                      <Alert id="errmsg" severity="error">
                        {error.message}
                      </Alert>
                    </Stack>
                  ) : null}

                  <div className="login_btn_text">
                    <div>
                      <Button
                        id="login"
                        name="login"
                        variant="contained"
                        type="submit"
                        data-testid="login"
                      >
                        Login
                      </Button>
                    </div>
                    <div className="login_btn_text-ptag">
                      <Link
                        to={"/userRegistration"}
                        style={{ textDecoration: "none" }}
                        id="register_redirect"
                      >
                        <p className="footerText">
                          Dont have an account? Register
                        </p>
                      </Link>
                    </div>
                  </div>
                  <div className="loginFooter">
                    <p className="footerText_ptag"> Forgot password?</p>
                  </div>
                </FormControl>
              </Box>
            </form>
          </div>
        </div>
      </div>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={promisePending}
      >
        <CircularProgress />
      </Backdrop>
    </>
  );
}

export default Login;
