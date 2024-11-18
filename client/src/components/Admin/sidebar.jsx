import "../../styles/sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPeopleRoof,
  faReceipt,
  faBasketShopping,
  faFlag,
  faArrowRightFromBracket,
  faCoins,
  faFileInvoiceDollar,
  faCalendarDays,
  faAngleRight,
  faAngleDown,
  faCookieBite,
  faCartFlatbed,
} from "@fortawesome/free-solid-svg-icons";
import { faProductHunt } from "@fortawesome/free-brands-svg-icons";
import logo from "../../assets/images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Cookies from "js-cookie";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import API_ENDPOINTS from "../../config/url.config";
import i18next from "i18next";
import { Trans, useTranslation } from "react-i18next";
import { useLanguage } from "../../LanguageContext";

function sidebar({ option, setOption }) {
  const navigate = useNavigate();
  const [promisePending, setPromisePending] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);

  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isProductManageopen, setisProductManageopen] = useState(false);
  // const { language, setLanguage } = useContext(LanguageContext);

  
  const handleFinanceClick = () => {
    setIsFinanceOpen(!isFinanceOpen);
  };
  const handleProductManageClick = () => {
    setisProductManageopen(!isProductManageopen);
  };

  // Handle logout function
  const handleLogout = async () => {
    try {
      setLogoutPopup(false);
      setPromisePending(true);
      // Get token from cookies
      const token = Cookies.get("token");
      // Send http request with credentials
      axios.defaults.withCredentials = true;
      let logout = await axios.post(`${API_ENDPOINTS.auth.logout}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (logout.status == 204) {
        setTimeout(() => {
          const cookieNames = Cookies.get();
          // Iterate over cookie names and remove each cookie
          for (const cookieName in cookieNames) {
            Cookies.remove(cookieName);
          }
          sessionStorage.clear();
          setPromisePending(false);
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      setPromisePending(false);
      navigate("/");
    }
  };
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  return (
    <>
      <div className="sidebar">
        <div className="sidebar_content">
          <div className="side_top">
            <div className="side_logo">
              <img alt="company_logo" src={logo} />
            </div>

            <div className={`sideMenuItem ${option == "Home" ? "active" : ""}`}>
              <Link
                to={""}
                className="side_home"
                onClick={() => {
                  setOption("Home");
                }}
              >
                <div
                  className={`side_icon ${option == "Home" ? "active" : ""}`}
                >
                  <span>
                    <FontAwesomeIcon
                      className="fa-fw-1"
                      icon={faHome}
                      style={{ color: "#d0d02" }}
                    />
                  </span>
                </div>
                <div
                  className={`side_title ${option == "Home" ? "active" : ""}`}
                >
                  <span data-testid="dashboard">{t("sidebar.dashboard")}</span>
                </div>
              </Link>
            </div>
            <div className={`sideMenuItem ${option == "User" ? "active" : ""}`}>
              <Link
                to={"user_manage"}
                className="side_user"
                onClick={() => {
                  setOption("User");
                }}
              >
                <div
                  className={`side_icon ${option == "User" ? "active" : ""}`}
                >
                  <span>
                    <FontAwesomeIcon
                      className="fa-fw-1"
                      icon={faPeopleRoof}
                      style={{ color: "#d0d02" }}
                    />
                  </span>
                </div>
                <div
                  className={`side_title ${option == "User" ? "active" : ""}`}
                >
                  <span> {t("sidebar.userManagement")}</span>
                </div>
              </Link>
            </div>

            <div style={{ cursor: "pointer" }}>
              <div className="side_product" onClick={handleProductManageClick}>
                <div className="side_icon">
                  <span>
                    <FontAwesomeIcon
                      className="fa-fw-1"
                      icon={faBasketShopping}
                      style={{ color: "#d0d02" }}
                    />
                  </span>
                </div>
                <div className={`side_title `}>
                  <span>{t("sidebar.productManagement")}</span>
                </div>
                <div
                  className={`side_icon ${
                    option === "Product" ? "active" : ""
                  }`}
                >
                  <span>
                    {isProductManageopen ? (
                      <FontAwesomeIcon
                        className="fa-fw-1"
                        icon={faAngleDown}
                        style={{ color: "#d0d02" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="fa-fw-1"
                        icon={faAngleRight}
                        style={{ color: "#d0d02" }}
                      />
                    )}
                  </span>
                </div>
              </div>
              {isProductManageopen && (
                <div className="side_sub_items">
                  <div
                    className={`sideSubMenuItem ${
                      option == "Product" ? "active" : ""
                    }`}
                  >
                    <Link
                      to={"product_manage"}
                      className="side_sub_item"
                      onClick={() => {
                        setOption("Product");
                      }}
                    >
                      <div
                        className={`side_sub_icon ${
                          option === "Product" ? "active" : ""
                        }`}
                      >
                        <span>
                          <FontAwesomeIcon
                            className="fa-fw-1"
                            icon={faCookieBite}
                            style={{ color: "#d0d02" }}
                          />
                        </span>
                      </div>
                      <div
                        className={`side_sub_title  ${
                          option === "Product" ? "active" : ""
                        }`}
                      >
                        <span>{t("sidebar.product")}</span>
                      </div>
                    </Link>
                  </div>
                  <div
                    className={`sideSubMenuItem ${
                      option == "Inventory" ? "active" : ""
                    }`}
                  >
                    <Link
                      to={"inventory"}
                      className="side_sub_item"
                      onClick={() => {
                        setOption("Inventory");
                      }}
                    >
                      <div
                        className={`side_sub_icon ${
                          option === "Inventory" ? "active" : ""
                        }`}
                      >
                        <span>
                          <FontAwesomeIcon
                            className="fa-fw-1"
                            icon={faCartFlatbed}
                            style={{ color: "#d0d02" }}
                          />
                        </span>
                      </div>
                      <div
                        className={`side_sub_title  ${
                          option === "Inventory" ? "active" : ""
                        }`}
                      >
                        <span>{t("sidebar.inventory")}</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className={`sideMenuItem ${option == "Menu" ? "active" : ""}`}>
              <Link
                to={"supplier"}
                className="side_menu"
                onClick={() => {
                  setOption("Menu");
                }}
              >
                <div
                  className={`side_icon ${option === "Menu" ? "active" : ""}`}
                >
                  <span>
                    <FontAwesomeIcon
                      className="fa-fw-1"
                      icon={faReceipt}
                      style={{ color: "#d0d02" }}
                    />
                  </span>
                </div>
                <div
                  className={`side_title ${option === "Menu" ? "active" : ""}`}
                >
                  <span>{t("sidebar.supplierManagement")}</span>
                </div>
              </Link>
            </div>
            <div style={{ cursor: "pointer" }}>
              <div className="side_finance" onClick={handleFinanceClick}>
                <div
                  className={`side_icon ${
                    option === "Finance" ? "active" : ""
                  }`}
                >
                  <span>
                    <FontAwesomeIcon
                      className="fa-fw-1"
                      icon={faCoins}
                      style={{ color: "#d0d02" }}
                    />
                  </span>
                </div>
                <div
                  className={`side_title ${
                    option === "Finance" ? "active" : ""
                  }`}
                >
                  <span>{t("sidebar.finance")}</span>
                </div>
                <div
                  className={`side_icon ${
                    option === "Finance" ? "active" : ""
                  }`}
                >
                  <span>
                    {isFinanceOpen ? (
                      <FontAwesomeIcon
                        className="fa-fw-1"
                        icon={faAngleDown}
                        style={{ color: "#d0d02" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="fa-fw-1"
                        icon={faAngleRight}
                        style={{ color: "#d0d02" }}
                      />
                    )}
                  </span>
                </div>
              </div>
              {isFinanceOpen && (
                <div className="side_sub_items">
                  <div
                    className={`sideSubMenuItem ${
                      option == "Receipts" ? "active" : ""
                    }`}
                  >
                    <Link
                      to={"finance/Receipt"}
                      className="side_sub_item "
                      onClick={() => {
                        setOption("Receipts");
                      }}
                    >
                      <div
                        className={`side_sub_icon ${
                          option === "Receipts" ? "active" : ""
                        }`}
                      >
                        <span>
                          <FontAwesomeIcon
                            className="fa-fw-1"
                            icon={faReceipt}
                            style={{ color: "#d0d02" }}
                          />
                        </span>
                      </div>
                      <div
                        className={`side_sub_title  ${
                          option === "Receipts" ? "active" : ""
                        }`}
                      >
                        <span>{t("sidebar.receipts")}</span>
                      </div>
                    </Link>
                  </div>
                  <div
                    className={`sideSubMenuItem ${
                      option == "Invoice" ? "active" : ""
                    }`}
                  >
                    <Link
                      to={"finance/Invoice"}
                      className="side_sub_item"
                      onClick={() => {
                        setOption("Invoice");
                      }}
                    >
                      <div
                        className={`side_sub_icon ${
                          option === "Invoice" ? "active" : ""
                        }`}
                      >
                        <span>
                          <FontAwesomeIcon
                            className="fa-fw-1"
                            icon={faFileInvoiceDollar}
                            style={{ color: "#d0d02" }}
                          />
                        </span>
                      </div>
                      <div
                        className={`side_sub_title ${
                          option === "Invoice" ? "active" : ""
                        }`}
                      >
                        <span>{t("sidebar.invoice")}</span>
                      </div>
                    </Link>
                  </div>
                  <div
                    className={`sideSubMenuItem ${
                      option == "Monthly report" ? "active" : ""
                    }`}
                  >
                    <Link
                      to={"finance/reports"}
                      className="side_sub_item"
                      onClick={() => {
                        setOption("Monthly report");
                      }}
                    >
                      <div
                        className={`side_sub_icon ${
                          option === "Monthly report" ? "active" : ""
                        }`}
                      >
                        <span>
                          <FontAwesomeIcon
                            className="fa-fw-1"
                            icon={faCalendarDays}
                            style={{ color: "#d0d02" }}
                          />
                        </span>
                      </div>
                      <div
                        className={`side_sub_title ${
                          option === "Monthly report" ? "active" : ""
                        }`}
                      >
                        <span>{t("sidebar.monthlyReports")}</span>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="side_bottom">
            <div
              className={`sideMenuItem ${option == "Report" ? "active" : ""}`}
            >
              <Link
                to={"reports"}
                className="side_reports"
                onClick={() => {
                  setOption("Report");
                }}
              >
                <div
                  className={`side_icon ${option === "Report" ? "active" : ""}`}
                >
                  <span>
                    <FontAwesomeIcon
                      className="fa-fw-1"
                      icon={faFlag}
                      style={{ color: "#d0d02" }}
                    />
                  </span>
                </div>
                <div
                  className={`side_title ${
                    option === "Report" ? "active" : ""
                  }`}
                >
                  <span>{t("sidebar.reports")}</span>
                </div>
              </Link>
            </div>
            <div className="side_logout">
              <div className="side_icon">
                <span>
                  <FontAwesomeIcon
                    className="fa-fw-1"
                    icon={faArrowRightFromBracket}
                    style={{ color: "#d0d0d2" }}
                  />
                </span>
              </div>
              <div className="side_title">
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setLogoutPopup(true);
                  }}
                >
                  {t("sidebar.logout")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={logoutPopup}
        onClose={() => setLogoutPopup(false)}
        sx={{
          boxShadow: 1,
          borderRadius: 2,
          p: 5,
          minWidth: 400,
        }}
      >
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>Are you sure, Do you want to logout?</DialogContent>
        <DialogActions>
          <Button id="logout_cancel" onClick={() => setLogoutPopup(false)}>
            Cancel
          </Button>
          <Button
            id="logout_confirm"
            onClick={() => {
              handleLogout();
            }}
            variant="contained"
            color="error"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={promisePending}
      >
        <CircularProgress />
      </Backdrop>
    </>
  );
}

export default sidebar;
