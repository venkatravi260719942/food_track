import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import "../../../styles/manager/FoodItem.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../../LanguageContext";
import API_ENDPOINTS from "../../../config/url.config";
import { styled } from "@mui/system";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  border: "1px solid #ccc",
  cursor: "pointer",
  "& .MuiDataGrid-cell": {
    borderTop: "none",
  },
  "& .MuiDataGrid-columnHeaderCheckbox": {
    backgroundColor: "rgba(242, 242, 242, 1)",
  },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "rgba(242, 242, 242, 1)",
  },
  "& .MuiDataGrid-filler": {
    backgroundColor: "rgba(242, 242, 242, 1)",
  },
  "& .MuiDataGrid-scrollbarFiller--header": {
    backgroundColor: "rgba(242, 242, 242, 1)",
  },
}));
function FoodItemsTableView({
  updateProductCount,
  searchQuery,
  selectedCategories,
  setSelectedProductsToDelete,
  deletedProduct,
  currentView,
  // handleRedirectFromEdit
}) {
  const [products, setProducts] = useState([]);
  const [cookiesData, setCookiesData] = useState();
  const [category, setCategory] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useLanguage();

  useEffect(() => {
    const id = toast.loading("Please wait...");
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const branchId = storedData.branchId;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_ENDPOINTS.manager.menuitems.branchItems}/${branchId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );
        const categoryResponse = await axios.get(
          `${API_ENDPOINTS.manager.menuitemscategory.itemCategoryData}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const productsWithId = response.data.map((product) => ({
          ...product,
          id: product.itemId,
          categoryId:
            categoryResponse.data.find(
              (category) => category.categoryId === product.categoryId
            )?.category || "Unknown",
        }));

        setProducts(productsWithId);
        setCategory(categoryResponse.data);
        updateProductCount(productsWithId.length);
        toast.dismiss(id);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.dismiss(id);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [deletedProduct]);

  // Filtering logic outside of useEffect
  const getFilteredProducts = () => {
    let filtered = products;

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.categoryId)
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.itemName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    updateProductCount(filtered.length);
    return filtered;
  };

  const toPascalCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  const capitalizeSentences = (str) => {
    return str.replace(/(^\s*\w|[.!?]\s*\w)/g, (txt) => txt.toUpperCase());
  };

  const columns = [
    {
      field: "sku",
      headerName: `${t("fooditems.tableheading.SKU")}`,
      width: 200,
      headerClassName: "header-grey",
    },
    {
      field: "itemName",
      headerName: `${t("fooditems.tableheading.ITEM NAME")}`,
      width: 240,
      headerClassName: "header-grey",
      sortable: false,
      renderCell: (params) => (
        <span style={{ textTransform: "capitalize" }}>{params.value}</span>
      ),
    },
    {
      field: "categoryId",
      headerName: `${t("fooditems.tableheading.CATEGORY")}`,
      width: 250,
      headerClassName: "header-grey",
      sortable: false,
    },
    {
      field: "itemDescription",
      headerName: `${t("fooditems.tableheading.DESCRIPTION")}`,
      width: 250,
      headerClassName: "header-grey",
      sortable: false,
      renderCell: (params) => capitalizeSentences(params.value),
    },
    {
      field: "itemPrice",
      headerName: `${t("fooditems.tableheading.PRICE")}`,
      width: 200,
      headerClassName: "header-grey",
    },
  ];

  const handleCheckboxChange = (newSelection) => {
    setSelectedProductsToDelete(newSelection);
  };

  const handleRowClick = (params) => {
    navigate(`editFoodItem/${params.id}`);
  };

  const customStyle = {
    fontSize: "16px",
    width: "100%",
    height: "100%",
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="FI_fooditemstable">
      <ToastContainer />
      <style>
        {`
          .header-grey {
            background-color: rgba(242, 242, 242, 1);
            color: #000000;
          }
          .no-data-message {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-size: 18px;
            color: #555;
          }
        `}
      </style>

      <div className="FI_producttable_header">
        {filteredProducts.length > 0 ? (
          <StyledDataGrid
            getRowHeight={() => "auto"}
            rows={filteredProducts}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 100]}
            checkboxSelection
            getRowClassName={() => "custom-row"}
            onRowSelectionModelChange={handleCheckboxChange}
            onRowClick={handleRowClick}
          />
        ) : (
          <div className="no-data-message">No data found!</div>
        )}
      </div>
    </div>
  );
}

export default FoodItemsTableView;
