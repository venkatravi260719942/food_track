import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Tabs, Tab, Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faArrowLeftLong,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_ENDPOINTS from "../../config/url.config";
import TakeawayOrders from "./Takeaway/TakeawayOrders";
import { numberofFloors, takeaway } from "../../config/constant";
import { tableImages } from "../../config/constant"; // Ensure this import is correct
import { styled } from "@mui/system";
const OrderProcessingTableBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
}));
const OrderProcessingTableTab = styled(Tab)(({ theme }) => ({
  textTransform: "capitalize",
  width: "280px",
  height: "75px",
  color: "#212121",
  fontSize: "18px",
}));
const StyledBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "80%",
  padding: theme.spacing(5), // This will apply 40px padding if your theme spacing is based on 8px
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "160px", // You can also use theme.spacing() if needed
}));
function OrderProcessingTableView() {
  const [layoutData, setLayoutData] = useState([]);
  const [selectedFloorId, setSelectedFloorId] = useState(null); // Tracks the currently selected floorId
  const [tableData, setTableData] = useState([]);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0); // Tracks start of visible floor tabs
  const [isTakeawayTabSelected, setIsTakeawayTabSelected] = useState(false);
  const [clickedTables, setClickedTables] = useState({}); // State to track clicked tables

  const navigate = useNavigate();

  // Fetch floors and initially load tables for the first floor
  useEffect(() => {
    const storedData = Cookies.get();

    const fetchData = async () => {
      try {
        toast.loading("Loading floor data...", { toastId: "load-floor" });
        const response = await axios.get(
          `${API_ENDPOINTS.manager.floorlayout.floorLayoutResponse}/${storedData.branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        const data = response.data;
        setLayoutData(data);

        // Fetch table data for the first floor initially
        if (data.length > 0) {
          setSelectedFloorId(data[0].floorId); // Set the first floor as default
          fetchTableData(data[0].floorId); // Fetch tables for the first floor
        }
      } catch (error) {
        toast.error(`Error loading data: ${error.message}`);
      } finally {
        toast.dismiss("load-floor");
      }
    };

    fetchData();
  }, []);

  // Function to fetch table data based on floorId
  const fetchTableData = async (floorId) => {
    setIsTakeawayTabSelected(false);
    const storedData = Cookies.get();
    try {
      toast.loading("Loading table data...", { toastId: "load-table" });
      const response = await axios.get(
        `${API_ENDPOINTS.manager.tableLayout.tableLayoutResponse}/${floorId}`,
        {
          headers: {
            Authorization: `Bearer ${storedData.token}`,
          },
        }
      );
      setTableData(response.data);
    } catch (error) {
      toast.error(`Error loading tables: ${error.message}`);
    } finally {
      toast.dismiss("load-table");
    }
  };

  // Function to handle tab change (floor selection) and fetch tables
  const handleTabChange = (event, newFloorId) => {
    if (newFloorId == `${takeaway}`) {
      setIsTakeawayTabSelected(true);
      setSelectedFloorId(newFloorId); // Set the selected floorId directly
      return;
    }
    setSelectedFloorId(newFloorId); // Set the selected floorId directly
    fetchTableData(newFloorId); // Fetch tables for the selected floor
  };

  // Handle showing only 5 floors at a time
  const floorsToShow = numberofFloors;
  const visibleFloors = layoutData.slice(
    visibleStartIndex,
    visibleStartIndex + floorsToShow
  );

  const handlePrevClick = () => {
    if (visibleStartIndex > 0) {
      const newStartIndex = visibleStartIndex - 1;
      setVisibleStartIndex(newStartIndex);
      const newFloorId = layoutData[newStartIndex].floorId; // Use new start index to get floorId
      setSelectedFloorId(newFloorId);
      fetchTableData(newFloorId); // Fetch table data for the new visible floor
    }
  };

  const handleNextClick = () => {
    if (visibleStartIndex + floorsToShow < layoutData.length) {
      const newStartIndex = visibleStartIndex + 1;
      setVisibleStartIndex(newStartIndex);
      const newFloorId = layoutData[newStartIndex].floorId; // Use new start index to get floorId
      setSelectedFloorId(newFloorId);
      fetchTableData(newFloorId); // Fetch table data for the new visible floor
    }
  };
  const handleTableClick = async (table) => {
    try {
      // Update the `isOccupied` status in the backend
      await axios.put(
        `${API_ENDPOINTS.manager.tableLayout.tableLayoutResponse}/${table.tableId}`,
        { isOccupied: true },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      // Update the local state to reflect the `isOccupied` status
      setTableData((prevTableData) =>
        prevTableData.map((t) =>
          t.tableId === table.tableId ? { ...t, isOccupied: true } : t
        )
      );

      // Navigate to the order processing page for the selected table
      navigate(`/manager/order_processing/${table.tableId}`);
    } catch (error) {
      toast.error(`Error updating table: ${error.message}`);
    }
  };

  return (
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
      {layoutData.length > 0 && (
        <OrderProcessingTableBox>
          <IconButton
            onClick={handlePrevClick}
            disabled={visibleStartIndex === 0}
          >
            <FontAwesomeIcon icon={faArrowLeftLong} />
          </IconButton>

          <Tabs
            value={selectedFloorId} // Directly set the value to selectedFloorId
            onChange={handleTabChange} // Handle the change by floorId
            variant="scrollable"
            scrollButtons="auto"
            aria-label="floor layout tabs"
          >
            <OrderProcessingTableTab
              key={`${takeaway}`}
              label={`${takeaway}`}
              value={`${takeaway}`}
            />
            {visibleFloors.map((floor) => (
              <Tab
                key={floor.floorId}
                label={floor.floorName}
                value={floor.floorId}
                style={{
                  textTransform: "capitalize",
                  width: "280px",
                  height: "75px",
                  color: "#212121",
                  fontSize: "18px",
                }}
              />
            ))}
          </Tabs>

          <IconButton
            onClick={handleNextClick}
            disabled={visibleStartIndex + floorsToShow >= layoutData.length}
          >
            <FontAwesomeIcon icon={faAngleRight} />
          </IconButton>
        </OrderProcessingTableBox>
      )}

      {/* Display table layout based on selected floor */}
      {!isTakeawayTabSelected ? (
        <StyledBox>
          {tableData.map((table) => (
            <div
              key={table.tableId}
              style={{
                position: "relative",
                // display: "flex",
                flexDirection: "column",

                cursor: "pointer", // Show a pointer cursor on hover
              }}
            >
              <img
                src={tableImages[table.numberOfChairs]} // Adjust based on how you have defined your images
                alt={`Table with ${table.numberOfChairs} chairs`}
                style={{
                  width: "120px",
                  height: "120px",
                  filter: table.isOccupied ? "hue-rotate(120deg)" : "none", // Apply green hue to the whole table
                  transition: "filter 0.3s ease", // Smooth transition
                }}
                onClick={() => handleTableClick(table)}
              />
              <p
                className="table-number-overlay"
                style={{
                  position: "absolute", // Position the number absolutely
                  top: "50%", // Center vertically
                  left: "50%", // Center horizontally
                  transform: "translate(-50%, -50%)", // Adjust position to center correctly
                  color: "black", // Adjust text color for contrast
                  fontWeight: "bold", // Optional: make it bold
                }}
              >
                T-{table.tableNumber}
              </p>
            </div>
          ))}
        </StyledBox>
      ) : (
        <TakeawayOrders />
      )}
    </div>
  );
}

export default OrderProcessingTableView;
