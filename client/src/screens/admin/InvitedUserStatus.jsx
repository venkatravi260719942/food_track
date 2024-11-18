// Import required modules and functions
import "../../styles/manageUsers.css";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { styled } from "@mui/system";
// Material UI components for table and filter option
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  TablePagination,
} from "@mui/material";
import Cookies from "js-cookie";
import { API_ENDPOINTS } from "../../config/url.config";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../LanguageContext";
const LinkGeneratlSetting = styled(Link)(({ theme }) => ({
  backgroundColor: "transparent",
  textDecoration: "none",
}));

const BackButton = styled("button")(({ theme }) => ({
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 0,
}));

const ArrowIconInviteUser = styled(FontAwesomeIcon)(({ theme }) => ({
  color: "#000000",
}));
const FormControlStatusFilter = styled(FormControl)(({ theme }) => ({
  m: 1,
  minWidth: 140,
}));
const SelectStatusFilter = styled(Select)(({ theme }) => ({
  borderRadius: "8px",
}));
const ButtonReset = styled(Button)(({ theme }) => ({
  textTransform: "none",
  width: "100%",
  justifyContent: "start",
  paddingLeft: "14px",
  ":hover": {
    backgroundColor: "transparent",
  },
}));
const TableHeadUserManagment = styled(TableHead)(({ theme }) => ({
  height: "50px",
  backgroundColor: "#F9FAFB",
}));
const TableRowUserManagment = styled(TableRow)(({ theme }) => ({
  height: "40px",
}));

const TableUserManagement = styled(Table)(({ theme }) => ({
  minWidth: 150,
  tableLayout: "fixed",
}));
function InvitedUserStatus() {
  // State variables for the component
  const [users, setUsers] = useState([]);
  const [sortedArray, setSortedArray] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isFocused, setIsFocused] = useState(false);
  const [cookiesData, setCookiesData] = useState();

  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  // Table headers
  const header = [
    t("generalSettings.text.name"),
    ,
    t("generalSettings.text.emailAddress"),
    ,
    t("generalSettings.text.language"),

    t("generalSettings.label.status"),
    t("generalSettings.text.authentication"),
  ];

  // Fetch user data on component mount
  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const fetchData = async () => {
      const response = await axios.get(
        `${API_ENDPOINTS.generalSettings.invitedStatus}/${storedData.organisationId}`,
        {
          headers: {
            Authorization: `Bearer ${storedData.token}`,
          },
        }
      );
      setUsers(response.data);
      setSortedArray(response.data);
    };

    fetchData();
  }, []);

  // Handle clicking on table headers for sorting
  const handleHeaderClick = (field) => {
    const direction =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);

    // Sort the user data based on the selected field and direction
    const sortedData = [...users].sort((a, b) => {
      if (a[field.toLowerCase()] < b[field.toLowerCase()]) {
        return direction === "asc" ? -1 : 1;
      } else if (a[field] > b[field]) {
        return direction === "asc" ? 1 : -1;
      } else {
        return 0;
      }
    });
    setSortedArray(sortedData); // Update the sorted array
  };

  // Filter data based on the status filter
  const handleFilter = (option) => {
    setStatusFilter(option);
    const filteredData = users.filter((user) => {
      const matchesStatusFilter =
        !option ||
        (option === "confirmed" && user.isAccepted) ||
        (option === "pending" && !user.isAccepted);
      return matchesStatusFilter;
    });

    setSortedArray(filteredData);
  };

  const handleReset = () => {
    setStatusFilter("");
    setSortedArray(users);
  };

  // Handle changes in the search input field
  const handleInputChange = (e) => {
    const searchTerm = e.target.value;

    const filteredData = users.filter((user) => {
      const matchesStatusFilter =
        !statusFilter ||
        (statusFilter === "confirmed" && user.isAccepted) ||
        (statusFilter === "pending" && !user.isAccepted);

      if (!matchesStatusFilter) {
        return false;
      }

      return (
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email
          .split("@")[0]
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    });

    setSortedArray(filteredData);
    setSearchTerm(searchTerm);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  return (
    <div>
      <div className="manage_titlebox">
        <div className="manage_title">
          <LinkGeneratlSetting to="/admin/general_setting">
            <BackButton aria-label="Go back to general settings">
              <ArrowIconInviteUser icon={faArrowLeft} size="xs" />
            </BackButton>
          </LinkGeneratlSetting>
          <span>{t("generalSettings.text.generalSettingsUsers")}</span>
        </div>
      </div>
      <div className="active_panel">
        <span>{t("generalSettings.text.activeUsers")} </span>
      </div>
      <div className="filter_data">
        <div
          className="search_box"
          style={{
            border: `1px solid ${isFocused ? "#0A8CCD" : "#858585"}`,
          }}
        >
          <input
            type="text"
            id="users_search_box"
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <button id="users_search_btn">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="lg"
              color={isFocused ? "#248CE7" : "#B7B4B4"}
            />
          </button>
        </div>
        <div className="status_filter">
          <FormControlStatusFilter size="small">
            <InputLabel id="status-filter-label">
              {t("generalSettings.label.status")}
            </InputLabel>
            <SelectStatusFilter
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              label="Status"
              onChange={(e) => handleFilter(e.target.value)}
            >
              <MenuItem id="Confirmed" value="confirmed">
                {t("generalSettings.statusDropdown.confirmed")}
              </MenuItem>
              <MenuItem id="Pending" value="pending">
                {t("generalSettings.statusDropdown.pending")}
              </MenuItem>
              <ButtonReset id="Reset" onClick={handleReset}>
                {t("generalSettings.buttons.reset")}
              </ButtonReset>
            </SelectStatusFilter>
          </FormControlStatusFilter>
        </div>
      </div>
      <div className="user_table">
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <TableUserManagement size="small" aria-label="simple table">
            <TableHeadUserManagment>
              <TableRow>
                {header.map((data) => (
                  <TableCell
                    align="center"
                    key={data}
                    onClick={() => handleHeaderClick(data)}
                  >
                    {data}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeadUserManagment>
            <TableBody>
              {/* Check if sortedArray has data */}
              {sortedArray.length > 0 ? (
                sortedArray
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <TableRowUserManagment key={user.branchMapId}>
                      <TableCell>{user.email.split("@")[0]}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell align="center">N/A</TableCell>
                      <TableCell align="center">
                        {user.updatedDate
                          ? new Date(user.updatedDate).toLocaleString()
                          : "Never"}
                      </TableCell>
                      {/* Format updatedDate or display "Never" */}
                      <TableCell align="center">
                        {user.isAccepted ? (
                          <span className="confirm">
                            {t("generalSettings.statusDropdown.confirmed")}
                          </span>
                        ) : (
                          <span className="pending">
                            {t("generalSettings.statusDropdown.pending")}
                          </span>
                        )}
                      </TableCell>
                    </TableRowUserManagment>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} size="medium" align="center">
                    ` {t("generalSettings.text.noDataFound!")} `{" "}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableUserManagement>
          {/* Show TablePagination only if data exists */}
          {sortedArray.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={sortedArray.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </TableContainer>
      </div>
    </div>
  );
}

// Export the required functions
export default InvitedUserStatus;
