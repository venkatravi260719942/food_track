import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  Checkbox,
  FormControl,
  ListItemText,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Backdrop,
  DialogContentText,
  TablePagination,
} from "@mui/material";
import API_ENDPOINTS from "../../config/url.config";
import userManageErrors from "../../errors/organisationErrors";
import "../../styles/admin/UserManage.css";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useLanguage } from "../../LanguageContext";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/material/styles";
const UserManagementText = styled(Typography)(({ theme }) => ({
  paddingLeft: "10px",
  paddingTop: "10px",
}));
const SearchUserTextField = styled(TextField)(({ theme }) => ({
  width: "200px",
  marginLeft: "10px",
}));
const StyledFormControlUserManagment = styled(FormControl)(({ theme }) => ({
  marginLeft: "10px",
  minWidth: "120px",
}));

const StyledSelectBranch = styled(Select)(({ theme }) => ({
  width: "150px",
}));
const StyledFormControlStatusFilter = styled(FormControl)(({ theme }) => ({
  marginLeft: "10px",
}));

const StyledSelectFilterlabel = styled(Select)(({ theme }) => ({
  width: "150px",
}));

const StyledButtonUserReset = styled(Button)(({ theme }) => ({
  textTransform: "none",
  width: "100%",
  justifyContent: "start",
  paddingLeft: "14px",
  ":hover": {
    backgroundColor: "transparent",
  },
}));
function UserManage() {
  // State variables
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [assignRole, setAssignRole] = useState([]);
  const [assignBranch, setAssignBranch] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [userDeactivate, setUserDeactivate] = useState(true);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [confirmAssignDialogOpen, setConfirmAssignDialogOpen] = useState(false);
  const [managerConflictOpen, setManagerConflictOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [roleBranchChanges, setRoleBranchChanges] = useState({});
  const [text, setText] = useState("");
  const [cookiesData, setCookiesData] = useState();
  const [selectedStatus, setSelectedStatus] = useState("");

  const params = useParams();

  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  // Fetch user data from API when component mounts
  useEffect(() => {
    const id = toast.loading("Please wait...");
    const allCookies = Cookies.get();
    setCookiesData(allCookies);

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.organisation.usersWithMatchingEmails}`,
          {
            headers: {
              Authorization: `Bearer ${allCookies.token}`,
            },
          }
        );

        const organisationBasedusers = (id) => {
          const requiredUsers = response.data.filter((userGroup) => {
            return userGroup.userBranchMap.some(
              (map) => map.organisationId == id
            );
          });

          return requiredUsers;
        };
        const requiredUsers = organisationBasedusers(allCookies.organisationId);
        setFilteredUsers(requiredUsers);
        setUsers(requiredUsers);

        const roleResponse = await axios.get(API_ENDPOINTS.organisation.roles, {
          headers: {
            Authorization: `Bearer ${allCookies.token}`,
          },
        });

        setRoles(roleResponse.data);

        const branchResponse = await axios.get(
          `${API_ENDPOINTS.adminDashboard.getBranchBasedOnOrganisationId}/${allCookies.organisationId}`,
          {
            headers: {
              Authorization: `Bearer ${allCookies.token}`,
            },
          }
        );
        setBranches(branchResponse.data);
        setAssignRole({});
        setAssignBranch({});
        setSelectedBranches([]);
        setSelectedRoles([]);
        toast.dismiss(id);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userDeactivate]);

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);

    const filteredUsers = users.filter((user) => {
      const matchesSearch = (user.firstName + user.lastName)
        ?.toLowerCase()
        .includes(value.toLowerCase());

      const matchesRole =
        selectedRoleIds.length === 0 ||
        user.userBranchMap.some((branch) =>
          selectedRoleIds.includes(branch.roleId)
        );

      const matchesBranch =
        selectedBranchIds.length === 0 ||
        user.userBranchMap.some((branch) =>
          selectedBranchIds.includes(branch.branchId)
        );

      const matchesStatus =
        selectedStatus === "" ||
        (selectedStatus === "assigned" && user.userBranchMap[0]?.roleId) ||
        (selectedStatus === "unassigned" &&
          user.userBranchMap[0]?.roleId == null);

      return matchesSearch && matchesRole && matchesBranch && matchesStatus;
    });
    if (value === "") {
      setFilteredUsers(users);
    } else {
      const filteredUsers = users.filter((user) =>
        (user.firstName + user.lastName)
          ?.toLowerCase()
          .includes(value.toLowerCase())
      );
      setFilteredUsers(filteredUsers);
    }

    setFilteredUsers(filteredUsers);
  };

  // Handler for updating selected role for a user
  const handleRoleChange = (email, roleId) => {
    setAssignRole({ ...assignRole, [email]: roleId });
    setRoleBranchChanges({ ...roleBranchChanges, [email]: true }); // Track changes
  };

  // Handler for updating selected branch for a user
  const handleBranchChange = (email, branchId) => {
    setAssignBranch({ ...assignBranch, [email]: branchId });
    setRoleBranchChanges({ ...roleBranchChanges, [email]: true }); // Track changes
  };
  // Handler for opening assign confirmation dialog
  const handleAssignClick = (email, text) => {
    setCurrentUser(email);
    setText(text);
    setConfirmAssignDialogOpen(true);
  };

  const openManagerConflictDialog = () => {
    setManagerConflictOpen(true);
  };

  const closeManagerConflictDialog = () => {
    setManagerConflictOpen(false);
    setConfirmAssignDialogOpen(false);
    setUserDeactivate(!userDeactivate);
  };

  const cancelConfirmAssign = () => {
    setCurrentUser(null);
    setConfirmAssignDialogOpen(false);
    setUserDeactivate(!userDeactivate);
  };

  // Handler for confirming role and branch assignment
  const handleConfirmAssign = async () => {
    try {
      // Find the user with the provided email
      const user = users.flat().find((u) => u.email === currentUser);
      if (!user) {
        console.error(`User with email ${currentUser} not found.`);
        return;
      }

      // Check if assignBranch or assignRole is undefined for the currentUser
      const branchId =
        assignBranch[user.email] ?? user.userBranchMap[0].branchId;
      const roleId = assignRole[user.email] ?? user.userBranchMap[0].roleId;
      const branchMapId = user.userBranchMap[0].branchMapId;

      // Dynamically find the manager roleId
      const managerRole = roles.find((role) => role.roleName === "Manager");
      if (!managerRole) {
        console.error("Manager role not found.");
        return;
      }
      const managerRoleId = managerRole.roleId;

      // Check if the role being assigned is a manager role
      if (roleId === managerRoleId) {
        // Check if a manager role already exists in the selected branch across all users
        let managerRoleExists = false;

        for (const userList of users) {
          for (const branch of userList.userBranchMap) {
            if (
              branch.branchId === branchId &&
              branch.roleId === managerRoleId
            ) {
              managerRoleExists = true;
              break;
            }
          }

          if (managerRoleExists) break;
        }

        if (managerRoleExists) {
          // Display a popup indicating that a manager role already exists for this branch
          openManagerConflictDialog();
          return;
        }
      }
      // Post selected role and branch to the backend for the user with the specified email

      const response = await axios.put(
        `${API_ENDPOINTS.userMangement.assignBranch}`,
        {
          email: currentUser,
          roleId: roleId,
          branchId: branchId,
          branchMapId: branchMapId,
        },
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );

      if (response.status == 200) {
        setConfirmAssignDialogOpen(false);
        setCurrentUser(null);
        setUserDeactivate(!userDeactivate);
      }
    } catch (error) {
      console.error("Error assigning role and branch:", error);
    }
  };

  const handleFilterChange = (roleId, roleName, branchId, branchName) => {
    let updatedSelectedRoles;

    if (roleName) {
      if (selectedRoles.includes(roleName)) {
        updatedSelectedRoles = selectedRoles.filter(
          (role) => role !== roleName
        );
      } else {
        updatedSelectedRoles = [...selectedRoles, roleName];
      }
    } else {
      updatedSelectedRoles = selectedRoles;
    }

    let updatedSelectedRoleIds;

    if (roleId) {
      if (selectedRoleIds.includes(roleId)) {
        updatedSelectedRoleIds = selectedRoleIds.filter((id) => id !== roleId);
      } else {
        updatedSelectedRoleIds = [...selectedRoleIds, roleId];
      }
    } else {
      updatedSelectedRoleIds = selectedRoleIds;
    }

    let updatedSelectedBranches;

    if (branchName) {
      if (selectedBranches.includes(branchName)) {
        updatedSelectedBranches = selectedBranches.filter(
          (name) => name !== branchName
        );
      } else {
        updatedSelectedBranches = [...selectedBranches, branchName];
      }
    } else {
      updatedSelectedBranches = selectedBranches;
    }

    let updatedSelectedBranchIds;

    if (branchId) {
      if (selectedBranchIds.includes(branchId)) {
        updatedSelectedBranchIds = selectedBranchIds.filter(
          (id) => id !== branchId
        );
      } else {
        updatedSelectedBranchIds = [...selectedBranchIds, branchId];
      }
    } else {
      updatedSelectedBranchIds = selectedBranchIds;
    }

    setSelectedRoleIds(updatedSelectedRoleIds);
    setSelectedRoles(updatedSelectedRoles);
    setSelectedBranches(updatedSelectedBranches);
    setSelectedBranchIds(updatedSelectedBranchIds);

    // Filter users based on the selected role(s) and branch(es)
    let filteredUsers;
    if (
      updatedSelectedRoles.length !== 0 &&
      updatedSelectedBranches.length !== 0
    ) {
      // Filter users by both roles and branches

      filteredUsers = filteredStatusData.filter((userData) =>
        userData.userBranchMap.some(
          (branch) =>
            updatedSelectedRoleIds.includes(branch.roleId) &&
            updatedSelectedBranchIds.includes(branch.branchId)
        )
      );
    } else if (updatedSelectedRoles.length !== 0) {
      // Filter users by roles only
      filteredUsers = filteredStatusData.filter((userData) =>
        userData.userBranchMap.some((branch) =>
          updatedSelectedRoleIds.includes(branch.roleId)
        )
      );
    } else if (updatedSelectedBranches.length !== 0) {
      // Filter users by branches only
      filteredUsers = filteredStatusData.filter((userData) =>
        userData.userBranchMap.some((branch) =>
          updatedSelectedBranchIds.includes(branch.branchId)
        )
      );
    } else {
      // If neither roles nor branches are selected, display all users
      filteredUsers = filteredStatusData;
    }

    setFilteredUsers(filteredUsers);
  };

  const handleRowSelect = (email) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(email)) {
        return prevSelectedRows.filter((row) => row !== email);
      } else {
        return [...prevSelectedRows, email];
      }
    });
  };

  const handleDeleteRows = () => {
    setConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmDeleteDialogOpen(false);
    try {
      // Filter out the selected users
      const emailsToDelete = selectedRows;

      // Delete each selected user
      await Promise.all(
        emailsToDelete.map(async (email) => {
          await axios.put(
            API_ENDPOINTS.userMangement.deleteUser,
            { email },
            {
              headers: {
                Authorization: `Bearer ${cookiesData.token}`,
              },
            }
          );
          console.log(`Deleting user with email ${email}`);
          // Update the state to remove the deleted user
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.email !== email)
          );
        })
      );

      setSelectedRows([]); // Clear selected rows after deletion
      setUserDeactivate(!userDeactivate);
    } catch (error) {
      console.error("Error deleting rows:", error);
    }
  };

  const resetBranchFilter = async () => {
    setSelectedBranches([]);
    setSelectedBranchIds([]);

    const filteredUsers = filteredStatusData.filter((userData) =>
      userData.userBranchMap.some((branch) =>
        selectedRoleIds.includes(branch.roleId)
      )
    );
    if (filteredUsers.length == 0) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(filteredUsers);
    }
  };

  const resetRoleFilter = async () => {
    setSelectedRoles([]);
    setSelectedRoleIds([]);
    const filteredUsers = filteredStatusData.filter((userData) =>
      userData.userBranchMap.some((branch) =>
        selectedBranchIds.includes(branch.branchId)
      )
    );
    if (filteredUsers.length == 0) {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(filteredUsers);
    }
  };

  const handleStatusFilter = (event) => {
    const selectedOption = event.target.value;
    setSelectedStatus(selectedOption);

    const filteredStatusData = users.filter((user) => {
      const roleId = user.userBranchMap[0].roleId;

      const matchesStatusFilter =
        !selectedOption ||
        (selectedOption === "assigned" &&
          roleId !== null &&
          roleId !== undefined) ||
        (selectedOption === "unassigned" && roleId == null);
      return matchesStatusFilter;
    });

    setFilteredUsers(filteredStatusData);
  };

  const handleStatusReset = () => {
    setSelectedStatus("");
    setFilteredUsers(users);
  };

  // Pagination state variables
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

  // Render the component
  return (
    <>
      <ToastContainer />
      <div className="overall_userManagement">
        {/* Title */}
        <UserManagementText variant="h5" gutterBottom data-testid="topContent">
          {t("userManagement.text.userManagement")}
        </UserManagementText>
        <div className="filter_bar">
          {/* Search input for filtering  */}
          <SearchUserTextField
            size="small"
            label={t("userManagement.label.search")}
            variant="outlined"
            data-testid="searchBar"
            id="searchBar"
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <StyledFormControlUserManagment size="small">
            <InputLabel id="branch-select-label">
              {t("userManagement.label.branch")}
            </InputLabel>
            <StyledSelectBranch
              data-testid="branchFilter"
              label="Branch"
              name="branch"
              variant="outlined"
              multiple
              value={selectedBranches}
              renderValue={(selected) => selected.join(", ")}
              className="dropdownSelect"
            >
              <Button onClick={resetBranchFilter}>Reset</Button>
              {branches.map((branch) => (
                <MenuItem
                  key={branch.branchId}
                  id={branch.branchId}
                  value={branch.branchName}
                >
                  <Checkbox
                    checked={selectedBranches.includes(branch.branchName)}
                    onChange={() =>
                      handleFilterChange(
                        null,
                        null,
                        branch.branchId,
                        branch.branchName
                      )
                    }
                  />
                  <ListItemText primary={branch.branchName} />
                </MenuItem>
              ))}
            </StyledSelectBranch>
          </StyledFormControlUserManagment>

          {/* Dropdown menu for filtering by role */}
          <FormControl sx={{ marginLeft: "10px" }} size="small">
            <InputLabel id="role-select-label">
              {t("userManagement.label.role")}
            </InputLabel>
            <Select
              data-testid="roleFilter"
              label="Role"
              name="role"
              variant="outlined"
              multiple
              value={selectedRoles}
              renderValue={(selected) => selected.join(", ")}
              style={{ width: "150px" }}
            >
              <Button onClick={resetRoleFilter}>Reset</Button>
              {roles.map((role) => (
                <MenuItem
                  key={role.roleId}
                  id={role.roleId}
                  value={role.roleName}
                >
                  <Checkbox
                    checked={selectedRoles.includes(role.roleName)}
                    onChange={() =>
                      handleFilterChange(role.roleId, role.roleName)
                    }
                  />
                  <ListItemText primary={role.roleName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <StyledFormControlStatusFilter size="small">
            <InputLabel id="status-filter-label">
              {t("userManagement.label.status")}
            </InputLabel>
            <StyledSelectFilterlabel
              labelId="status-filter-label"
              data-testid="statusFilter"
              label="Status"
              name="status"
              variant="outlined"
              value={selectedStatus}
              onChange={handleStatusFilter}
            >
              <MenuItem value="assigned">
                {t("userManagement.status.assigned")}
              </MenuItem>
              <MenuItem value="unassigned">
                {t("userManagement.status.unassigned")}
              </MenuItem>
              <StyledButtonUserReset onClick={handleStatusReset}>
                {t("userManagement.buttons.reset")}
              </StyledButtonUserReset>
            </StyledSelectFilterlabel>
          </StyledFormControlStatusFilter>

          <div className="delete_button">
            <Button
              variant="contained"
              color="secondary"
              data-testid="deleteRowButton"
              onClick={handleDeleteRows}
              disabled={selectedRows.length === 0} // Disable button if no rows are selected
            >
              {t("userManagement.buttons.delete")}
            </Button>
          </div>
        </div>

        {/* Confirmation dialog for deleting rows */}
        <Backdrop>
          <Dialog open={confirmDeleteDialogOpen}>
            <DialogTitle> {t("userManagement.text.confirmDel")}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t("userManagement.text.confirmDelDialg")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setConfirmDeleteDialogOpen(false)}>
                {t("userManagement.buttons.cancel")}
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={handleConfirmDelete}
              >
                {" "}
                {t("userManagement.buttons.delete")}
              </Button>
            </DialogActions>
          </Dialog>
        </Backdrop>

        {/* Confirmation dialog for assigning role and branch */}
        <Backdrop>
          <Dialog open={confirmAssignDialogOpen}>
            <DialogTitle>
              {t("userManagement.buttons.confirm")} {text.toLowerCase()}
            </DialogTitle>
            <DialogContent>
              <Typography>
                {t("userManagement.text.areYouSureAssignThisRoleAndBranch")}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  cancelConfirmAssign();
                }}
                variant="outlined"
              >
                {t("userManagement.buttons.cancel")}
              </Button>
              <Button
                id="assignUpdateConfirmButton"
                variant="contained"
                color="warning"
                onClick={() => {
                  handleConfirmAssign();
                }}
                sx={{ m: 2 }}
              >
                {text}
              </Button>
            </DialogActions>
          </Dialog>
        </Backdrop>

        <Backdrop>
          <Dialog open={managerConflictOpen}>
            <DialogTitle>{t("userManagement.text.conflict")}</DialogTitle>
            <DialogContent>
              <Typography>{t("userManagement.text.conflictDiag")}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeManagerConflictDialog}>
                {t("userManagement.buttons.close")}
              </Button>
            </DialogActions>
          </Dialog>
        </Backdrop>

        <div className="tableContent">
          {/* Table */}
          <TableContainer>
            <Table
              sx={{
                width: "79.8vw",
                marginLeft: "10px",
                border: "solid 1px lightgray",
                tableLayout: "fixed",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "70px" }}></TableCell>
                  <TableCell data-testid="usernameHeading">
                    {t("userManagement.tableHeading.username")}
                  </TableCell>
                  <TableCell data-testid="emailHeading">
                    {t("userManagement.tableHeading.emailAddress")}
                  </TableCell>
                  <TableCell data-testid="branchHeading">
                    {t("userManagement.tableHeading.branch")}
                  </TableCell>
                  <TableCell data-testid="roleHeading">
                    {t("userManagement.tableHeading.role")}
                  </TableCell>
                  <TableCell data-testid="actionHeading">
                    {t("userManagement.tableHeading.action")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ height: "10px" }}>
                {filteredUsers.length > 0 ? (
                  filteredUsers

                    .sort((a, b) => a.firstName.localeCompare(b.firstName))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Checkbox
                            data-testid="checkboxContent"
                            onChange={() => handleRowSelect(user.email)}
                          />
                        </TableCell>

                        <TableCell data-testid="usernameContent">{`${user.firstName}${user.lastName}`}</TableCell>

                        <TableCell data-testid="emailContent">
                          {user.email}
                        </TableCell>

                        <TableCell sx={{ width: "200px" }}>
                          <Select
                            sx={{ width: "10vw" }}
                            size="small"
                            data-testid="branchContent"
                            id="branchContent"
                            value={
                              assignBranch[user.email] ||
                              user.userBranchMap[0].branchId
                            }
                            onChange={(e) =>
                              handleBranchChange(user.email, e.target.value)
                            }
                          >
                            {branches.map((branch) => (
                              <MenuItem
                                key={branch.branchId}
                                id={branch.branchId}
                                name={branch.branchName}
                                value={branch.branchId}
                              >
                                {branch.branchName}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>

                        <TableCell>
                          <Select
                            sx={{ width: "10vw" }}
                            size="small"
                            data-testid="roleContent"
                            id="roleContent"
                            value={
                              assignRole[user.email] ||
                              user.userBranchMap[0].roleId
                            }
                            onChange={(e) =>
                              handleRoleChange(user.email, e.target.value)
                            }
                          >
                            {roles.map((role) => (
                              <MenuItem
                                key={role.roleId}
                                id={role.roleId}
                                value={role.roleId}
                                name={role.roleName}
                              >
                                {role.roleName}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>

                        <TableCell>
                          <Button
                            data-testid="assignUpdateButton"
                            id="assignUpdateButton"
                            sx={{
                              color: "#121212",
                            }}
                            onClick={() =>
                              handleAssignClick(
                                user.email,
                                user.userBranchMap[0].roleId != null
                                  ? "UPDATE"
                                  : "ASSIGN"
                              )
                            }
                            disabled={
                              user.userBranchMap[0].roleId != null
                                ? !assignRole[user.email] &&
                                  !assignBranch[user.email]
                                : !assignRole[user.email] ||
                                  !assignBranch[user.email]
                            }
                          >
                            {user.userBranchMap[0].roleId != null
                              ? "UPDATE"
                              : "ASSIGN"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6}>
                      {t("userManagement.text.notFound")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Show TablePagination only if data exists */}
            {filteredUsers.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            )}
          </TableContainer>
        </div>
      </div>
    </>
  );
}

export default UserManage;
