import "../../styles/sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPeopleRoof,
  faReceipt,
  faBasketShopping,
  faFlag,
  faArrowRightFromBracket,
  faCubesStacked,
  faCoins,
  faFileInvoiceDollar,
  faCalendarDays,
  faAngleRight,
  faAngleDown,
  faCookieBite,
  faCartFlatbed,
  faCubes,
  faBowlFood,
  faCashRegister,
  faLayerGroup,
  faBellConcierge,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCreativeCommonsNd,
  faProductHunt,
} from "@fortawesome/free-brands-svg-icons";
import logo_bg from "../../assets/images/logo_bg.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import API_ENDPOINTS from "../../config/url.config";
import i18next from "i18next";
import { Trans, useTranslation } from "react-i18next";
import { useLanguage } from "../../LanguageContext";

function ManagerSidebar() {
  const navigate = useNavigate();
  const [promisePending, setPromisePending] = useState(false);
  const [logoutPopup, setLogoutPopup] = useState(false);

  // const { language, setLanguage } = useContext(LanguageContext);
  const location = useLocation();
  const [activePath, setActivePath] = useState(
    localStorage.getItem("activePath") || "/"
  );

  useEffect(() => {
    // Store the active path in local storage on change
    localStorage.setItem("activePath", location.pathname);
    setActivePath(localStorage.getItem("activePath"));
  }, [location.pathname]);

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
              <img alt="company_logo" src={logo_bg} />
            </div>

            <div
              className={`sideMenuItem ${
                activePath === "/manager" ? "active" : ""
              }`}
            >
              <Link to={"/manager"} className="side_home">
                <div
                  className={`side_icon ${
                    activePath === "/manager" ? "active" : ""
                  }`}
                >
                  <span>
                    <FontAwesomeIcon
                      className={`fa-fw-1 side_title ${
                        activePath === "/manager" ? "active" : ""
                      }`}
                      icon={faHome}
                    />
                  </span>
                </div>
                <div
                  className={`side_title ${
                    activePath === "/manager" ? "active" : ""
                  }`}
                >
                  <span data-testid="dashboard">{t("sidebar.dashboard")}</span>
                </div>
              </Link>
            </div>
            <div
              className={`sideMenuItem ${
                activePath === "/manager/operation" ? "active" : ""
              }`}
            >
              <Link to={"operation"} className="side_user">
                <div
                  className={`side_icon ${
                    activePath === "/manager/operation" ? "active" : ""
                  }`}
                >
                  <span>
                    <FontAwesomeIcon
                      className={`fa-fw-1 side_title ${
                        activePath === "/manager/operation" ? "active" : ""
                      }`}
                      icon={faCreativeCommonsNd}
                    />
                  </span>
                </div>
                <div
                  className={`side_title ${
                    activePath === "/manager/operation" ? "active" : ""
                  }`}
                >
                  <span> Operations</span>
                </div>
              </Link>
            </div>

            <div style={{ cursor: "pointer", marginTop: "3px" }}>
              <div className="sideMenuItem">
                <Link to={"raw-material"} className="side_user">
                  <div className="side_icon">
                    <span>
                      <FontAwesomeIcon
                        className="fa-fw-1 side_title"
                        icon={faBasketShopping}
                      />
                    </span>
                  </div>
                  <div className={`side_title `}>
                    <span>{t("sidebar.productManagement")}</span>
                  </div>
                </Link>
              </div>

              <div className="side_sub_items">
                <div
                  className={`sideSubMenuItem ${
                    activePath === "/manager/raw-material" ? "active" : ""
                  }`}
                >
                  <Link to={"raw-material"} className="side_sub_item">
                    <div
                      className={`side_sub_icon ${
                        activePath === "/manager/raw-material" ? "active" : ""
                      }`}
                    >
                      <span>
                        <FontAwesomeIcon
                          icon={faCubes}
                          className={`fa-fw-1 sidebar_icon ${
                            activePath === "/manager/raw-material"
                              ? "active"
                              : ""
                          }`}
                        />
                      </span>
                    </div>
                    <div
                      className={`side_sub_title  ${
                        activePath === "/manager/raw-material" ? "active" : ""
                      }`}
                    >
                      <span>{t("sidebar.rawMaterial")}</span>
                    </div>
                  </Link>
                </div>
                <div
                  className={`sideSubMenuItem ${
                    activePath === "/manager/foodItems" ? "active" : ""
                  }`}
                >
                  <Link to={"foodItems"} className="side_sub_item">
                    <div
                      className={`side_sub_icon ${
                        activePath === "/manager/foodItems" ? "active" : ""
                      }`}
                    >
                      <span>
                        <FontAwesomeIcon
                          icon={faBowlFood}
                          className={`fa-fw-1 sidebar_icon ${
                            activePath === "/manager/foodItems" ? "active" : ""
                          }`}
                        />
                      </span>
                    </div>
                    <div
                      className={`side_sub_title  ${
                        activePath === "/manager/foodItems" ? "active" : ""
                      }`}
                    >
                      <span>{t("sidebar.foodItems")}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div style={{ cursor: "pointer", marginTop: "3px" }}>
              <div className="sideMenuItem">
                <Link to={"tableLayout"} className="side_user">
                  <div className="side_icon">
                    <span>
                      <FontAwesomeIcon
                        className="fa-fw-1 side_title"
                        icon={faCashRegister}
                        style={{ color: "#666666" }}
                      />
                    </span>
                  </div>
                  <div className={`side_title `}>
                    <span>{t("sidebar.pos")}</span>
                  </div>
                </Link>
              </div>

              <div className="side_sub_items">
                <div
                  className={`sideSubMenuItem ${
                    activePath === "/manager/tableLayout" ? "active" : ""
                  }`}
                >
                  <Link to={"tableLayout"} className="side_sub_item">
                    <div
                      className={`side_sub_icon ${
                        activePath === "/manager/tableLayout" ? "active" : ""
                      }`}
                    >
                      <span>
                        <FontAwesomeIcon
                          className={`fa-fw-1 sidebar_icon ${
                            activePath === "/manager/tableLayout"
                              ? "active"
                              : ""
                          }`}
                          icon={faLayerGroup}
                        />
                      </span>
                    </div>
                    <div
                      className={`side_sub_title  ${
                        activePath === "/manager/tableLayout" ? "active" : ""
                      }`}
                    >
                      <span>{t("sidebar.floorPlanning")}</span>
                    </div>
                  </Link>
                </div>
                <div
                  className={`sideSubMenuItem ${
                    activePath === "/manager/order_processing" ? "active" : ""
                  }`}
                >
                  <Link to={"order_processing"} className="side_sub_item">
                    <div
                      className={`side_sub_icon ${
                        activePath === "/manager/order_processing"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span>
                        <FontAwesomeIcon
                          icon={faBellConcierge}
                          className={`fa-fw-1 sidebar_icon ${
                            activePath === "/manager/order_processing"
                              ? "active"
                              : ""
                          }`}
                        />
                      </span>
                    </div>
                    <div
                      className={`side_sub_title  ${
                        activePath === "/manager/order_processing"
                          ? "active"
                          : ""
                      }`}
                    >
                      <span>{t("sidebar.orderProcessing")}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div
              className={`sideMenuItem ${
                activePath === "/manager/reports" ? "active" : ""
              }`}
            >
              <Link to={"reports"} className="side_reports">
                <div
                  className={`side_icon ${
                    activePath === "/manager/reports" ? "active" : ""
                  }`}
                >
                  <span>
                    <FontAwesomeIcon
                      className={`fa-fw-1 side_title sidebar_icon ${
                        activePath === "/manager/reports" ? "active" : ""
                      }`}
                      icon={faFlag}
                    />
                  </span>
                </div>
                <div
                  className={`side_title ${
                    activePath === "/manager/reports" ? "active" : ""
                  }`}
                >
                  <span>{t("sidebar.reports")}</span>
                </div>
              </Link>
            </div>
          </div>
          <div className="side_bottom">
            <div className="side_logout">
              <div className="side_icon">
                <span>
                  <FontAwesomeIcon
                    className="fa-fw-1 side_title"
                    icon={faArrowRightFromBracket}
                    style={{ color: "#D4D4D5" }}
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
          <Button onClick={() => setLogoutPopup(false)}>Cancel</Button>
          <Button
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

export default ManagerSidebar;
