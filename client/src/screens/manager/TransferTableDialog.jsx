import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import API_ENDPOINTS from "../../config/url.config";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TransferTableDialog = ({ open, onClose }) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedSeat, setSelectedSeat] = useState("");
  const { tableId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Uncomment to fetch tables from the API
  useEffect(() => {
    const cookiesData = Cookies.get();
    const fetchTables = async () => {
      try {
        // Define the query parameters
        const params = {
          branchId: cookiesData.branchId, // replace with actual branchId
          noOfChairs: selectedSeat, // replace with actual noOfChairs
          // floorId: "yourFloorId", // replace with actual floorId
        };
        const response = await axios.get(
          `${API_ENDPOINTS.manager.floorlayout.floorLayoutResponse}`,
          {
            headers: {
              Authorization: `Bearer ${cookiesData.token}`,
            },
            params: params,
          }
        );
        setTables(response.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };

    fetchTables();
  }, [selectedSeat]);

  const handleTransfer = async () => {
    try {
      const cookiesData = Cookies.get();
      const data = {
        tableId: parseInt(selectedTable),
      };

      await axios.put(
        `${API_ENDPOINTS.manager.diningOrder.transferTable}/${tableId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );
      navigate(`/manager/order_processing/${selectedTable}`);
      onClose();
    } catch (error) {
      console.error("Error transferring table:", error);
      // Optionally, show error message
    }
  };

  const handleClose = () => {
    // Reset selected states when closing the dialog
    setSelectedTable("");
    setSelectedSeat("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel id="selectSeatLabel">
            {t("orderProcessing.transferTable.text.noOfSeats")}
          </InputLabel>
          <Select
            labelId="selectSeatLabel"
            value={selectedSeat}
            onChange={(e) => setSelectedSeat(e.target.value)}
            label="No. of Seats"
          >
            {[2, 4, 6, 8].map((seat) => (
              <MenuItem key={seat} value={seat}>
                {`${seat} seater`}
              </MenuItem>
            ))}
          </Select>
          <br />
        </FormControl>
        {selectedSeat && (
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="selectTableLabel">
              {t("orderProcessing.transferTable.text.selectATable")}
            </InputLabel>
            <Select
              labelId="selectTableLabel"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              label="Select a table"
            >
              {tables.length === 0 ? (
                <MenuItem disabled>
                  {t("orderProcessing.transferTable.text.noTablesAvailable")}
                </MenuItem>
              ) : (
                tables.map((table) => (
                  <MenuItem key={table.tableId} value={table.tableId}>
                    {table.tableNumber}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleTransfer}
          color="primary"
          disabled={!selectedTable} // Disable if no table is selected
        >
          {t("orderProcessing.transferTable.button.transferTable")}
        </Button>
        <Button onClick={handleClose} color="primary">
          {t("orderProcessing.transferTable.button.cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferTableDialog;
