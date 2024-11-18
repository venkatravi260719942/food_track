import { useState, useEffect } from "react";
import "../../../src/styles/manager/FloorLayoutAddTable.css";
import FloorNameDialog from "./FloorNameDialog"; // Adjust the path as needed
import { useNavigate } from "react-router-dom"; // Import useNavigate
import InitialFloorLayout from "./InitialFloorLayout";
import { Tabs, Tab, Box } from "@mui/material";
import { floorsToShow } from "../../config/constant";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";
const FloorNamesBox1 = styled(Box)({
  display: "flex",
  height: "75px",
  width: "1030px",
  bgcolor: "background.paper",
  border: "1px solid #5CA6FE",
});
const StyledTabs = styled(Tabs)(({ theme }) => ({
  display: "flex",
  width: "100%",
  "& .MuiTab-root": {
    // Custom styles for each tab if needed
    minWidth: 100, // Example: Set a minimum width for each tab
  },
}));
const StyledTab2 = styled(Tab)(({ theme, isActive }) => ({
  textTransform: "none",
  height: "75px",
  minWidth: 300, // Allow flexibility
  flexGrow: 1, // Allow Tabs to grow and fill available space
  backgroundColor: isActive ? "#5CA6FE" : "transparent",
  color: isActive ? "#FFFFFF" : "#000000",
  "&.Mui-selected": {
    backgroundColor: "#5CA6FE", // Blue background for selected tab
    color: "#FFFFFF", // White text for selected tab
  },
}));

function FloorLayout({ setFloorId, floors, defaultFloorId, refreshfloors }) {
  const { t } = useTranslation();

  const [activeFloorId, setActiveFloorId] = useState(defaultFloorId);
  const [isDialogOpen, setDialogOpen] = useState(false); // State to control dialog open/close
  const navigate = useNavigate(); // Initialize the navigate hook
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);

  const handleFloorClick = (floorId, fetchFloors) => {
    setActiveFloorId(floorId);
    setFloorId(floorId); // Notify parent of the selected floor
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleFloorAdded = () => {
    setDialogOpen(false); // Close the dialog after adding a floor
  };

  const handleTabChange = (event, newFloorId) => {
    setActiveFloorId(newFloorId); // Set the selected floorId directly
    setFloorId(newFloorId); // Notify parent of the selected floor
  };

  // Handle showing only 5 floors at a time
  const visibleFloors = floors.slice(
    visibleStartIndex,
    visibleStartIndex + floorsToShow
  );

  return (
    <>
      {floors.length > 0 ? (
        <div className="Floorname">
          <div>
            <Box className="floorNameContainer">
              {/* Prev and Next buttons for scrolling through floors */}
              <Box
                sx={{
                  display: "flex",
                  // alignItems: "center",
                  height: "75px",

                  width: "1030px",
                  bgcolor: "background.paper",
                  // justifyContent: "space-between",
                  border: "1px solid #5CA6FE",
                }}
              >
                <StyledTabs
                  value={activeFloorId}
                  onChange={handleTabChange}
                  variant="scrollable" // Optional: Make the Tabs scrollable if there are too many
                  scrollButtons="auto" // Optional: Show scroll buttons automatically when necessary
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: "#5CA6FE", // Change indicator color to blue if needed
                    },
                  }}
                >
                  {floors.map((floor) => (
                    <StyledTab2
                      key={floor.floorId}
                      label={floor.floorName}
                      value={floor.floorId}
                      isActive={activeFloorId === floor.floorId} // Pass active state as prop
                    />
                  ))}
                </StyledTabs>
              </Box>

              {/* Add Floor button */}
              <div className="addFloorButton">
                <button className="addfl" onClick={handleOpenDialog}>
                  {t("floorPlanning.buttons.addFloors")}
                </button>
              </div>

              {/* Include the dialog component and pass the open/close props */}
              <FloorNameDialog
                open={isDialogOpen}
                onClose={handleCloseDialog}
                onFloorAdded={handleFloorAdded} // Pass the callback to the dialog
                refreshfloors={refreshfloors}
              />
            </Box>
          </div>
        </div>
      ) : (
        <InitialFloorLayout />
      )}
    </>
  );
}

export default FloorLayout;
