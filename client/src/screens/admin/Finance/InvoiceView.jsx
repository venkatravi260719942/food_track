import {
  Box,
  Button,
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";

function InvoiceView() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="100vw">
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton>
          <ArrowBackIcon
            sx={{ color: "#000000" }}
            onClick={() => navigate("/admin/finance/Invoice")}
          />
        </IconButton>
        <Typography variant="h6">Invoice</Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ margin: "10px" }}>
              Invoice #
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
              <TableCell>PRODUCT NAME</TableCell>
              <TableCell>QUANTITY</TableCell>
              <TableCell>PRICE</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow></TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default InvoiceView;
