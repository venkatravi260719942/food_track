import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "auto",
  width: "378px",
  height: "200px",
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  // Add any specific styles for the title if needed
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  textAlign: "center",
  paddingBottom: "16px",
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  width: "80px",
  height: "36px",
  ...(variant === "cancel" && {
    color: "#1976D2",
    marginRight: "8px",
  }),
  ...(variant === "confirm" && {
    backgroundColor: "#D32F2F",
    color: "#FFFFFF",
  }),
}));

function DeleteConfirmationDialog({ open, onClose, onConfirm, tableName }) {
  const { t } = useTranslation(); // Hook for translation

  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle>{t("deleteConfirmation.title")}</StyledDialogTitle>
      <StyledDialogContent>
        <Typography variant="body1">
          {t("deleteConfirmation.message", {
            tableName: tableName
              ? `"${tableName}"`
              : t("deleteConfirmation.defaultTable"),
          })}
        </Typography>
      </StyledDialogContent>
      <DialogActions>
        <StyledButton onClick={onClose} variant="cancel">
          {t("deleteConfirmation.cancelButton")}
        </StyledButton>
        <StyledButton
          onClick={onConfirm}
          variant="confirm"
          data-testid="delete_table"
        >
          {t("deleteConfirmation.deleteButton")}
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
}

export default DeleteConfirmationDialog;
