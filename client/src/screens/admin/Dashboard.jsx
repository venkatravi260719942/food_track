import { useEffect, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { Card, CardContent, Typography, Button } from "@mui/material";
import API_ENDPOINTS from "../../config/url.config";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useLanguage } from "../../LanguageContext";
import { useTranslation } from "react-i18next";
import SalesForcast from "./SalesForecast";

// function to captilize the first letter
function capitalizeFirstLetter(string) {
  if (string && typeof string === "string" && string.length > 0) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return "";
}

function Dashboard() {
  const [organisationData, setOrganisationData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [tenantToken, setTenantToken] = useState("");
  const [username, setUsername] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const id = toast.loading("Please wait...");
    const tenant = Cookies.get("token");
    const cookieName = Cookies.get("username");
    setTenantToken(tenant);
    setUsername(cookieName);
    const getData = async () => {
      try {
        const organisationResponse = await axios.get(
          `${API_ENDPOINTS.organisation.getOrganisation}`,
          {
            headers: {
              Authorization: `Bearer ${tenant}`,
            },
          }
        );

        const checkBranch = organisationResponse.data.filter(
          (item) => item.tenantId === tenant
        );
        Cookies.set("organisationId", checkBranch[0].organisationId);
        setOrganisationData(checkBranch[0]);
        fetchBranches(checkBranch[0].organisationId, tenant);
        setLoading(false);
        toast.dismiss(id);
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching data");
        setLoading(false);
        toast.dismiss(id);
      }
    };
    getData();
  }, []);

  const fetchBranches = async (organisationId, tenantToken) => {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.adminDashboard.getBranchBasedOnOrganisationId}/${organisationId}`,
        {
          headers: {
            Authorization: `Bearer ${tenantToken}`,
          },
        }
      );
      setBranches(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching branches");
    }
  };
  const { language, changeLanguage } = useLanguage();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      {/* <ToastContainer position="top_right" /> */}
      <div className="dashboard_bg_overlay"></div>
      <div className="dashboard_admin_content" data-testid="dashboard">
        <h1 data-testid="userName">
          {t("dashboard.hello")}, {username && capitalizeFirstLetter(username)}
        </h1>
        {organisationData && (
          <h3 data-testid="companyName">
            {capitalizeFirstLetter(organisationData.companyName)}
          </h3>
        )}
        <div className="dashboardBody">
          {!loading && (
            <Card className="dash_card">
              <CardContent>
                <Typography variant="h2">
                  <Button
                    variant="contained"
                    data-testid="addbranch_button"
                    id="addbranch_button"
                    onClick={() => {
                      navigate(`/admin/add_branch`);
                    }}
                  >
                    <AddIcon />
                    {t("dashboard.button.addBranch")}
                  </Button>
                </Typography>
                <div className="branch_list">
                  {branches
                    .sort((a, b) => a.branchName.localeCompare(b.branchName)) // Sort the array alphabetically by branchName
                    .map((branch) => (
                      <Card
                        key={branch.branchId}
                        className="branch_item"
                        id={branch.branchId}
                        onClick={() => {
                          navigate(`/admin/edit_branch/${branch.branchId}`);
                        }}
                        style={{
                          backgroundImage: `url(${branch.branchImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          height: "20vh",
                          opacity: "0.9",
                        }}
                      >
                        <div
                          data-testid={branch.branchName}
                          name={branch.branchName}
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            padding: "8px 16px",
                            borderRadius: "4px",
                            color: "#fff",
                            opacity: "1",
                          }}
                        >
                          {capitalizeFirstLetter(branch.branchName)}
                        </div>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="demand_forecasting">
        <Card className="forecast_card">
          <SalesForcast />
        </Card>
      </div>
    </>
  );
}

export default Dashboard;
