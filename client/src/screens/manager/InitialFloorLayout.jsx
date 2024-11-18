import "../../styles/manager/FloorLayout.css";
import FloorNameDialog from "./FloorNameDialog";
import { useTranslation } from "react-i18next";
import { useState } from "react";
function InitialFloorLayout() {
  const { t } = useTranslation();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  return (
    <div className="floorLayout_page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          flexDirection: "column",
        }}
      >
        <div className="initial_floorLayout_text">
          {t("floorPlanning.text.emptyFloorMessage")}{" "}
        </div>
        <div
          data-testid="Add"
          className="floor_add_button"
          onClick={handleOpenDialog}
        >
          {t("floorPlanning.buttons.add")}
        </div>
      </div>
      <FloorNameDialog open={isDialogOpen} onClose={handleCloseDialog} />
    </div>
  );
}

export default InitialFloorLayout;
