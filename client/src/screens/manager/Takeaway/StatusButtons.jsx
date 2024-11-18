import { Button } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useTranslation } from "react-i18next"; // Import useTranslation hook
import "../../../styles/manager/StatusButtons.css";

const StatusButtons = ({ onButtonClick, selectedStatus }) => {
  const { t } = useTranslation(); // Initialize the translation hook

  // Translated button data
  const buttonsData = [
    { label: t("statusButtons.allOrder"), variant: "outlined", icon: null },
    { label: t("statusButtons.newOrder"), variant: "outlined", icon: null },
    {
      label: t("statusButtons.priority"),
      variant: "outlined",
      icon: <StarIcon />,
    },
    {
      label: t("statusButtons.inProgress"),
      variant: "outlined",
      icon: <AccessTimeIcon />,
    },
    {
      label: t("statusButtons.readyForPickup"),
      variant: "outlined",
      icon: <RestaurantIcon />,
    },
    {
      label: t("statusButtons.completed"),
      variant: "outlined",
      icon: <CheckCircleIcon />,
    },
  ];

  return (
    <div className="statusbuttons">
      {buttonsData.map((button, index) => (
        <Button
          key={index}
          variant={button.variant}
          onClick={() => onButtonClick(button.label)} // Call the function on click
          sx={{
            backgroundColor:
              selectedStatus === button.label ? "#1976D2" : "transparent", // Blue if selected
            color: selectedStatus === button.label ? "#fff" : "#000", // White if selected
          }}
        >
          {button.label}
          {button.icon}
        </Button>
      ))}
    </div>
  );
};

export default StatusButtons;
