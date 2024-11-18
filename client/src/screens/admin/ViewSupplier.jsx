import { useState, useEffect } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import API_ENDPOINTS from "../../config/url.config";
import Supplier from "./Supplier";
import "../../styles/supplier.css";
import { styled } from "@mui/system";
const FormControlViewSupplier = styled(FormControl)(({ theme }) => ({
  marginLeft: 20,
  minWidth: 200,
}));
const ViewSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [cookiesData, setCookiesData] = useState({});
  const { t } = useTranslation();
  const [redirectToSupplier, setRedirectToSupplier] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierCategories, setSupplierCategories] = useState([]);
  //   const [supplierid, setSupplierid] = useState([params.row]);
  const navigate = useNavigate();
  const columns = [
    {
      field: "supplierId",
      headerName: t("supplier.tableHeading.supplierId"),
      width: 150,
    },
    {
      field: "supplierName",
      headerName: t("supplier.tableHeading.supplierName"),
      width: 250,
    },
    {
      field: "email",
      headerName: t("supplier.tableHeading.email"),
      width: 250,
    },
    {
      field: "contactNumber",
      headerName: t("supplier.tableHeading.contactNumber"),
      width: 200,
    },
    {
      field: "categoryName",
      headerName: t("supplier.tableHeading.categoryName"),
      width: 250,
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      const storedData = Cookies.get();
      setCookiesData(storedData);
      const organisationId = storedData.organisationId;
      try {
        const suppliersResponse = await axios.get(
          `${API_ENDPOINTS.supplierManagement.supplier}/${organisationId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const categoriesResponse = await axios.get(
          `${API_ENDPOINTS.supplierManagement.suppliercategory}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        const categoriesMap = {};
        categoriesResponse.data.forEach((category) => {
          categoriesMap[category.categoryId] = category.categoryName;
        });

        const suppliersWithCategoryNames = suppliersResponse.data.map(
          (supplier) => ({
            ...supplier,
            categoryName: categoriesMap[supplier.type] || "Unknown",
          })
        );

        setSuppliers(suppliersWithCategoryNames);

        setSupplierCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleBackClick = () => {
    // Handle navigation logic for back button
  };

  const handleAddSupplierClick = () => {
    setRedirectToSupplier(true);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleCategoryFilterChange = (event) => {
    setCategoryFilter(event.target.value);
  };
  const handleViewSupplierClick = (params) => {
    const supplierId = params.row.supplierId;
    navigate(`/admin/edit_supplier/${supplierId}`);
  };
  let filteredSuppliers = suppliers;
  if (searchInput) {
    filteredSuppliers = filteredSuppliers.filter((supplier) =>
      supplier.supplierName.toLowerCase().includes(searchInput.toLowerCase())
    );
  }

  if (categoryFilter) {
    filteredSuppliers = filteredSuppliers.filter(
      (supplier) => supplier.type === categoryFilter
    );
    console.log(filteredSuppliers);
  }

  if (redirectToSupplier) {
    return <Supplier />;
  }

  return (
    <Container>
      <div className="vsupplier_head">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/admin"
            style={{ backgroundColor: "transparent", marginRight: 10 }}
          >
            <span id="leftarrow">
              <FontAwesomeIcon
                className="fa-fw"
                icon={faArrowLeft}
                size="xl"
                style={{ color: "#000000" }}
              />
            </span>
          </Link>
          <h3>{t("supplier.text.viewSuppliers")}</h3>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FontAwesomeIcon icon={faPlus} />}
          onClick={handleAddSupplierClick}
        >
          {t("supplier.button.addSupplier")}
        </Button>
      </div>
      <div className="searchandcategoryfilter" style={{ marginBottom: "10px" }}>
        <FormControlViewSupplier>
          <TextField
            id="search-input"
            label="Search Suppliers"
            variant="outlined"
            size="small"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </FormControlViewSupplier>
        <FormControlViewSupplier>
          <InputLabel id="category-filter-label">Filter by Category</InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            label="Filter by Category"
            value={categoryFilter}
            size="small"
            onChange={handleCategoryFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            {supplierCategories.map((category) => (
              <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </FormControlViewSupplier>
      </div>
      <div className="suppliertable" style={{ height: 480, width: "105%" }}>
        <style>
          {`
          .MuiDataGrid-columnHeader, .MuiDataGrid-cell {
            font-size: 14px;
            padding: 8px;
            text-align: center;
            overflow-wrap: anywhere;
          }
          
          .header-grey {
            background-color: rgba(242, 242, 242, 1);
            color: #000000;
          }
        `}
        </style>

        <DataGrid
          rows={filteredSuppliers}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
          getRowId={(row) => row.supplierId}
          components={{
            Toolbar: GridToolbarContainer,
            ToolbarExport: GridToolbarExport,
            ToolbarColumns: GridToolbarColumnsButton,
            ToolbarFilter: GridToolbarFilterButton,
          }}
          classes={{
            columnHeader: "header-grey", // Apply grey color to column headers
          }}
          onRowClick={handleViewSupplierClick}
        />
      </div>
    </Container>
  );
};

export default ViewSupplier;
