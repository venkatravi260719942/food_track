import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";

function ReceiptView() {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = () => {
    console.log("Comment submitted:", comment);
    setOpen(false);
  };

  return (
    <Container maxWidth="10vw">
      <Box display="flex" alignItems="center" mb={2} sx={{ pt: "5px" }}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Receipt</Typography>
        <Box sx={{ marginLeft: "60vw", width: "12vw" }}>
          <Button sx={{ marginTop: "4px" }} onClick={handleClickOpen}>
            Comment
          </Button>
          <Button
            sx={{
              marginLeft: "16px",
              marginTop: "4px",
              backgroundColor: "#0A8CCD",
              color: "white",
              "&:hover": {
                backgroundColor: "#007BB5",
              },
            }}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ margin: "10px" }}>
              Receipt #
            </Typography>
            <Typography variant="body2" sx={{ margin: "10px" }}>
              Supplier name :
            </Typography>
            <Box display="flex" alignItems="center" sx={{ margin: "10px" }}>
              <PhoneIcon sx={{ color: "#0A8CCD" }} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Phone :
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" sx={{ margin: "10px" }}>
              <EmailIcon sx={{ color: "#0A8CCD" }} />
              <Typography variant="body2" sx={{ ml: 1 }}>
                Email :
              </Typography>
            </Box>
          </Box>
          <Box sx={{ paddingRight: "13%", paddingTop: "4%" }}>
            <Typography variant="body2" sx={{ margin: "10px" }}>
              Date :
            </Typography>
            <Typography variant="body2" sx={{ margin: "10px" }}>
              Time :
            </Typography>
            <Typography variant="body2" sx={{ margin: "10px" }}>
              Branch :
            </Typography>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL NO.</TableCell>
              <TableCell>PRODUCT CODE</TableCell>
              <TableCell>PRODUCT NAME</TableCell>
              <TableCell>QUANTITY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        sx={{
          backgroundColor: "#0A8CCD",
          color: "white",
          "&:hover": {
            backgroundColor: "#007BB5",
          },
        }}
      >
        Mark as Verified
      </Button>
      <Button>Flag for review</Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ width: "25vw" }}>Comment</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="comment"
            type="text"
            fullWidth
            onChange={handleCommentChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCommentSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ReceiptView;
