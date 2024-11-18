import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
} from "@mui/material";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import API_ENDPOINTS from "../../config/url.config";
import { styled } from "@mui/system"; // Import styled from @mui/system

// Styled components
const StyledDialog = styled(Dialog)({
  "& .MuiPaper-root": {
    width: "378px",
    height: "216px",
    paddingTop: "24px",
    paddingLeft: "24px",
    borderRadius: "10px",
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  color: "#212121",
  fontSize: "24px",
  padding: "0px",
});

const StyledTextField = styled(TextField)({
  width: "330px",
  marginTop: "37px",
  height: "48px",
});

const StyledDialogActions = styled(DialogActions)({
  display: "flex",
  justifyContent: "flex-start",
});

// Main component
function FloorFormDialog({ open, onClose, refreshfloors }) {
  const [floorName, setFloorName] = useState("");
  const [cookiesData, setCookiesData] = useState({});
  const [floorNameError, setFloorNameError] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const storedData = Cookies.get();
    setCookiesData(storedData);
  }, []);

  const handleFloorNameChange = (event) => {
    if (event.target.value.trim() !== "") {
      setFloorNameError("");
    }
    setFloorName(event.target.value);
  };

  const handleSubmit = async () => {
    if (floorName.trim() === "") {
      setFloorNameError(t("floorPlanning.error.floorNameIsRequired"));
      return;
    }
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.manager.floorlayout.floorLayoutResponse}`,
        {
          floorName: floorName,
          branchId: parseInt(cookiesData.branchId),
          isActive: true,
          createdDate: new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${cookiesData.token}`,
          },
        }
      );

      console.log("Response:", response.data);
      onClose();
      setFloorName("");
      navigate("/manager/tableLayout");
      toast.success(t("floorPlanning.toast.tableAddedSuccessfully"));
      refreshfloors();
    } catch (error) {
      console.error("Error posting floor name:", error);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose}>
      <ToastContainer />
      <StyledDialogTitle>
        {t("floorPlanning.text.nameTheNewFloor")}
      </StyledDialogTitle>
      <DialogContent style={{ padding: "0px" }}>
        <Box component="form" sx={{ display: "flex", flexDirection: "column" }}>
          <StyledTextField
            label={t("floorPlanning.label.floorName")}
            variant="outlined"
            value={floorName}
            required
            onChange={handleFloorNameChange}
            error={!!floorNameError}
            helperText={floorNameError}
          />
        </Box>
      </DialogContent>
      <StyledDialogActions>
        <button onClick={handleSubmit} className="floor_add_buttonpop">
          {t("floorPlanning.buttons.add")}
        </button>
      </StyledDialogActions>
    </StyledDialog>
  );
}

export default FloorFormDialog;
