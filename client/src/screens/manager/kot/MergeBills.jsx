import { Dialog, DialogTitle, DialogContent, Button } from "@mui/material";

const MergeBillsPopup = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Merge Bills</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to merge the bills?</p>
        <Button variant="contained" onClick={onClose}>
          Confirm
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          style={{ marginLeft: "10px" }}
        >
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default MergeBillsPopup;
