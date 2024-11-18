import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import Cookies from "js-cookie";
import API_ENDPOINTS from "../../config/url.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "../../styles/manager/HomePage.css";
import { styled } from "@mui/system";
// function to captilize the first letter
function capitalizeFirstLetter(string) {
  if (string && typeof string === "string" && string.length > 0) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return "";
}
const HomePageBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
}));

function HomePage() {
  const { t } = useTranslation();

  const [branchData, setBranchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookiesData, setCookiesData] = useState("");
  const [username, setUsername] = useState("");
  const [totalProduct, setTotalProduct] = useState("");
  const [totalChefs, setTotalChefs] = useState("");

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const cookieName = Cookies.get("username");
    setUsername(cookieName);

    const fetchBranchData = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.homepage.branchData}/${storedData.branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        setBranchData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching branch data:", error);
        setLoading(false);
      }
    };
    const productDetails = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.homepage.productData}/${storedData.organisationId}/${storedData.branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        setTotalProduct(response.data.length);
      } catch (error) {
        console.error("Error fetching branch data:", error);
        setLoading(false);
      }
    };
    const noOfChefs = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.homepage.chefData}/${storedData.branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        setTotalChefs(response.data.length);
      } catch (error) {
        console.error("Error fetching branch data:", error);
        setLoading(false);
      }
    };
    noOfChefs();
    productDetails();
    fetchBranchData();
  }, []);

  if (loading) {
    return (
      <HomePageBox>
        <CircularProgress />
      </HomePageBox>
    );
  }

  return (
    <div
      style={{
        paddingLeft: "54px",
        paddingTop: "55px",
        backgroundColor: "#F1F1F7",
        minHeight: "90vh",
      }}
    >
      <span className="homePage_title" data-testid="location-display">
        {t("homepage.text.hello")},{" "}
        {username && capitalizeFirstLetter(username)}
      </span>

      <div>
        <div className="homePage_overview">
          <span>{t("homepage.text.overview")}</span>
        </div>
        <div style={{ display: "flex", gap: "37px", marginTop: "32px" }}>
          <div className="card">
            <div className="icon_card_1">
              <FontAwesomeIcon icon={faUser} className="fa-fw-3" />
            </div>
            <div className="card_content">
              <span className="card_title">{t("homepage.text.chefCount")}</span>
              <span className="card_value">{totalChefs}</span>
            </div>
          </div>
          <div className="card">
            <div className="icon_card_2">
              <FontAwesomeIcon icon={faShoppingBasket} className="fa-fw-3" />
            </div>
            <div className="card_content">
              <span className="card_title">
                {t("homepage.text.productCount")}
              </span>
              <span className="card_value">{totalProduct}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
