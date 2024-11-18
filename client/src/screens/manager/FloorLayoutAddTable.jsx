import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableCardList from "./TableCardList";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  faPlus,
  faTrash,
  faCopy,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import {
  Dialog,
  InputLabel,
  MenuItem,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  FormControl,
  TextField,
} from "@mui/material";
import "../../../src/styles/manager/FloorLayoutAddTable.css";
import { ToastContainer, toast } from "react-toastify";
import { tableImages } from "../../config/constant";
import FloorNames from "./FloorNames";
import API_ENDPOINTS from "../../config/url.config";
import InitialFloorLayout from "./InitialFloorLayout";
import TableDeleteDialog from "./TableDeleteDialog";
import { useFetcher } from "react-router-dom";
import { useTranslation } from "react-i18next";

function FloorLayoutAddTable() {
  const { t } = useTranslation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State to control delete dialog

  const [tableData, setTableData] = useState([]);
  const [seats, setSeats] = useState("");
  const [selectedTable, setSelectedTable] = useState(null);
  const [cookiesData, setCookiesData] = useState({});
  const [activeFloorId, setActiveFloorId] = useState("");
  const [addedTableData, setAddedTableData] = useState([]);
  const [isdeleted, setIsDeleted] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [floors, setFloors] = useState([]);
  const [editingTableId, setEditingTableId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(null); // State to track the selected card
  const [newTableName, setNewTableName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false); // State to control dialog visibility

  const handleOpenDialog = () => {
    setIsEditable(true);
    setNewTableName(selectedTable.tableName); // Set the current table name in the input
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditable(false);
    setDialogOpen(false);
    setSelectedTable([]);
  };

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const setFloorId = (floorId) => {
    setActiveFloorId(floorId);
  };
  const fetchTableData = async () => {
    try {
      const storedData = Cookies.get();
      setCookiesData(storedData);
      if (activeFloorId) {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.tableLayout.tableLayoutResponse}/${activeFloorId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        console.log(response.data);
        setTableData(response.data);
        setSelectedTable(null);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [activeFloorId, isdeleted]);

  const fetchFloors = async () => {
    const storedData = Cookies.get();
    const branchId = storedData.branchId;
    const token = storedData.token;

    try {
      const response = await axios.get(
        `${API_ENDPOINTS.manager.floorlayout.floorLayoutResponse}/${branchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const floorData = response.data;
      setFloors(floorData);
      // Set the default floor if available
      if (floorData.length > 0 && activeFloorId === "") {
        const defaultFloorId = floorData[0].floorId;
        setActiveFloorId(defaultFloorId);
        setFloorId(defaultFloorId); // Notify parent of the default floor
        setSelectedTable(null);
      }
    } catch (error) {
      console.error("Error fetching floor data:", error);
    }
  };
  useEffect(() => {
    fetchFloors();
  }, [activeFloorId]);

  const handleAddTableClick = () => {
    const newTable = {
      numberOfChairs: seats,
      floorId: activeFloorId,
    };
    setTableData([...tableData, newTable]);
    setAddedTableData([...addedTableData, newTable]);
    setIsDialogOpen(false);
    setSelectedTable(newTable);
  };

  const handleSelectedCard = (table) => {
    setSelectedTable(table);
  };
  const handleEditClick = (table) => {
    setSelectedTable(table); // Set the selected table
    setEditingTableId(table.tableId);
    setNewTableName(table.tableName || ""); // Set current table name or empty if none
    setSelectedCardId(table.tableId); // Set the selected card's ID
  };

  const handleSave = async () => {
    try {
      const promises = addedTableData.map(async (table) => {
        const response = await axios.post(
          `${API_ENDPOINTS.manager.tableLayout.tableLayoutResponse}`,

          {
            numberOfChairs: table.numberOfChairs,
            floorId: table.floorId,
          },
          {
            headers: {
              Authorization: `Bearer ${cookiesData.token}`,
            },
          }
        );

        if (response.status === 200 || response.status === 201) {
          console.log("Table added successfully:", table);
          setSelectedTable(null);
          toast.success("Table added");
        }
      });

      // Wait for all requests to complete
      await Promise.all(promises);
      setSelectedCardId(null);
      setSelectedTable([]);
      setIsDeleted(!isdeleted);
      setAddedTableData([]);
    } catch (error) {
      console.error("Error saving tables:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log(selectedTable.tableId);
      await axios.delete(
        `${API_ENDPOINTS.manager.tableLayout.tableLayoutResponse}/${selectedTable.tableId}`,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      setIsDeleted(!isdeleted);
      setSelectedTable(null);
      setIsDeleteDialogOpen(false);

      toast.error("Table deleted");
    } catch {
      console.log("Error deleting table");
    }
  };
  const handleDelete = async () => {
    if (selectedTable && selectedTable.tableId) {
      setIsDeleteDialogOpen(true);
    }
  };
  const handleCopy = async () => {
    try {
      await axios.post(
        `${API_ENDPOINTS.manager.tableLayout.tableLayoutResponse}/`,

        {
          floorId: selectedTable.floorId,
          numberOfChairs: selectedTable.numberOfChairs,
        },
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      toast.success("Table Copied!");
      setIsDeleted(!isdeleted);
      setSelectedTable(null);
      setIsDeleteDialogOpen(false);
    } catch {
      console.log("Error duplicating table");
    }
  };

  const handleRename = async (tableId, newTableName) => {
    try {
      await axios.put(
        `${API_ENDPOINTS.manager.tableLayout}/${tableId}`,
        {
          tableName: newTableName, // Use the new table name
        },
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      setIsDeleted(!isdeleted); // Trigger re-fetch of data
      handleCloseDialog();
      setSelectedTable(null);
      setSelectedCardId(null);
      toast.success("Updated");
    } catch (error) {
      console.log("Error renaming table", error);
    }
  };

  const handleCardOnBlur = () => {
    setSelectedTable(null);
  };

  return (
    <>
      {floors.length > 0 ? (
        <div className="table-floor-card">
          <div className="toolbar">
            <div className="backarrowtable">
              <ToastContainer />
            </div>
            <div className="addcontent">
              <div
                className="icon-label"
                onClick={handleDialogOpen}
                style={{ cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faPlus} />
                <div className="icon-name">
                  {t("floorPlanning.label.table")}
                </div>
              </div>

              <div
                className="icon-label"
                onClick={() => {
                  handleDelete(selectedTable);
                }}
                style={{
                  cursor: addedTableData.length > 0 ? "not-allowed" : "pointer",
                }}
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className={
                    !selectedTable || addedTableData.length > 0
                      ? "icon-disabled"
                      : ""
                  }
                />
                <div className="icon-name">
                  {t("floorPlanning.label.delete")}
                </div>
              </div>
              <div
                className="icon-label"
                onClick={() => {
                  handleCopy();
                }}
                style={{
                  cursor: addedTableData.length > 0 ? "not-allowed" : "pointer", // Disable cursor for copy
                }}
              >
                <FontAwesomeIcon
                  icon={faCopy}
                  className={
                    !selectedTable || addedTableData.length > 0
                      ? "icon-disabled"
                      : ""
                  } // Disable copy button
                />
                <div className="icon-name">{t("floorPlanning.label.copy")}</div>
              </div>
              <div
                className="icon-label"
                onClick={() => {
                  handleOpenDialog();
                }}
                style={{
                  cursor: addedTableData.length > 0 ? "not-allowed" : "pointer", // Disable cursor for rename
                }}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className={
                    !selectedTable || addedTableData.length > 0
                      ? "icon-disabled"
                      : ""
                  } // Disable rename button
                />
                <div className="icon-name">
                  {t("floorPlanning.label.rename")}
                </div>
              </div>
            </div>

            <div className="tablesave-button">
              <button
                onClick={handleSave}
                disabled={!selectedTable || addedTableData.length === 0}
                style={{ cursor: "pointer" }}
              >
                {t("floorPlanning.buttons.save")}
              </button>
            </div>
          </div>

          <FloorNames
            setFloorId={setFloorId}
            floors={floors}
            defaultFloorId={activeFloorId}
            refreshfloors={fetchFloors}
          />
          <TableCardList
            tables={tableData}
            seatimage={tableImages[seats]}
            setselectedTable={handleSelectedCard}
            selectedCardId={selectedCardId}
            handleRename={handleRename}
            selectedTable={selectedTable}
            isEditable={isEditable}
            floors={floors}
            handleOnBlur={handleCardOnBlur}
            handleEditClick={handleEditClick} // Pass the function as a prop
          />

          <Dialog
            open={isDialogOpen}
            onClose={handleDialogClose}
            PaperProps={{
              style: {
                display: "flex",
                justifyContent: "flex-start",
                margin: "auto",
                width: "378px",
                height: "216px",
              },
            }}
          >
            <DialogTitle> {t("floorPlanning.buttons.save")}</DialogTitle>
            <DialogContent style={{ paddingTop: 11 }}>
              <FormControl fullWidth style={{ width: "330px", height: "48px" }}>
                <InputLabel id="seats-label">
                  {" "}
                  {t("floorPlanning.label.noOfSeats")}
                </InputLabel>
                <Select
                  labelId="seats-label"
                  id="seats"
                  value={seats}
                  onChange={(e) => setSeats(e.target.value)}
                  label="No of seats"
                  data-testid="no_of_seats"
                >
                  <MenuItem value={2}>
                    {t("floorPlanning.label.twoSeats")}
                  </MenuItem>
                  <MenuItem value={4}>
                    {t("floorPlanning.label.fourSeats")}
                  </MenuItem>
                  <MenuItem value={6}>
                    {t("floorPlanning.label.sixSeats")}
                  </MenuItem>
                  <MenuItem value={8}>
                    {t("floorPlanning.label.eightSeats")}
                  </MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: "flex-start", // Align content to flex start
                padding: "16px", // Optional: Add padding if needed
                marginLeft: 1,
              }}
            >
              <Button
                onClick={handleAddTableClick}
                style={{
                  width: "60px",
                  height: "36px",
                  backgroundColor: "#1976D2",
                  color: "#FFFFFF",
                }}
                data-testid="Add_table"
              >
                {t("floorPlanning.buttons.add")}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for editing table name */}
          <Dialog
            open={dialogOpen}
            onClose={handleCloseDialog}
            sx={{
              "& .MuiDialog-paper": {
                backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
                boxShadow: "none", // Remove shadow for a flat overlay look
              },
              "& .MuiBackdrop-root": {
                backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent backdrop
              },
            }}
          >
            <DialogTitle> {t("floorPlanning.label.editTableView")}</DialogTitle>
            <DialogContent>
              <TextField
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                label={t("floorPlanning.label.tableName")}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>
                {" "}
                {t("floorPlanning.buttons.cancel")}
              </Button>
              <Button
                onClick={() => {
                  handleRename(selectedTable.tableId, newTableName);
                }}
              >
                {t("floorPlanning.buttons.save")}
              </Button>
            </DialogActions>
          </Dialog>
          <TableDeleteDialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteConfirm}
            tableName={selectedTable?.tableName} // Pass the selected table name
          />
        </div>
      ) : (
        <InitialFloorLayout />
      )}
    </>
  );
}

export default FloorLayoutAddTable;
