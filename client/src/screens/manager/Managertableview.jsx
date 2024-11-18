import { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { TableCell, TableRow } from "@mui/material";
import "../../styles/manager/Managertableview.css";
import { API_ENDPOINTS } from "../../config/url.config";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../LanguageContext";

function Managertableview({
  updateProductCount,
  searchQuery,
  selectedCategories,
  setSelectedProductsToDelete,
  deletedProduct,
  setDeletedProduct,
}) {
  // State variables to hold product and category data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false); // State for confirmation dialog
  const [cookiesData, setCookiesData] = useState();
  const navigate = useNavigate();

  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  useEffect(() => {
    const id = toast.loading("Please wait...");
    const storedData = Cookies.get();
    setCookiesData(storedData);
    const organisationId = storedData.organisationId;

    const fetchData = async () => {
      try {
        // Fetch category data
        const categoryResponse = await axios.get(
          `${API_ENDPOINTS.productMangement.category}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        setCategories(categoryResponse.data);

        // Fetch product data
        const productResponse = await axios.get(
          `${API_ENDPOINTS.productMangement.product}/organisationId/${organisationId}`,
          {
            headers: {
              Authorization: `Bearer ${storedData.token}`,
            },
          }
        );

        const activeProducts = productResponse.data.filter(
          (product) => product.isActive === true
        );
        const productsWithId = activeProducts.map((product) => ({
          ...product,
          id: product.productId,
        }));

        // Filter products based on search query and selected category
        let filteredProducts = productsWithId;
        if (selectedCategories.length > 0) {
          filteredProducts = filteredProducts.filter((product) =>
            selectedCategories.includes(
              categories.find(
                (category) => category.categoryId === product.categoryId
              )?.categoryName
            )
          );
        }
        if (searchQuery) {
          filteredProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setProducts(filteredProducts);
        updateProductCount(filteredProducts.length);
        toast.dismiss(id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchQuery, selectedCategories, deletedProduct]);

  const columns = [
    {
      field: "productId",
      headerName: `${t("product.label.productId")}`,
      width: 250,
      headerClassName: "header-grey", // Add custom header class for grey color
    },
    {
      field: "name",
      headerName: `${t("product.label.productName")}`,
      width: 350,
      headerClassName: "header-grey", // Add custom header class for grey color
    },
    {
      field: "categoryName",
      headerName: `${t("product.label.category")}`,
      width: 300,
      headerClassName: "header-grey", // Add custom header class for grey color
    },
    {
      field: "costPrice",
      headerName: `${t("product.label.price")}`,
      width: 200,
      headerClassName: "header-grey", // Add custom header class for grey color
    },
  ];

  // Map category names to products
  const productsWithCategory = products.map((product) => ({
    ...product,
    categoryName: categories.find(
      (category) => category.categoryId === product.categoryId
    )?.categoryName,
  }));

  const handleCheckboxChange = (newSelection) => {
    setSelectedProductsToDelete(newSelection);
  };

  // const handleDeleteConfirmation = () => {
  //   setConfirmDeleteOpen(true);
  // };

  // const handleCloseConfirmation = () => {
  //   setConfirmDeleteOpen(false);
  // };

  const handleRowClick = (params) => {
    navigate(`/manager/edit_product/${params.id}`);
  };

  // const handleDeleteConfirmed = async () => {
  //   try {
  //     for (const productId of selectedProducts) {
  //       await axios.delete(`http://localhost:3000/api/v1/product/${productId}`);
  //     }

  //     const updatedProducts = products.filter(
  //       (product) => !selectedProducts.includes(product.id)
  //     );
  //     setProducts(updatedProducts);
  //     updateProductCount(updatedProducts.length);
  //     setSelectedProducts([]);
  //     setDeletedProduct(!deletedProduct);
  //     setConfirmDeleteOpen(false); // Close the confirmation dialog
  //   } catch (error) {
  //     console.error("Error deleting products:", error);
  //   }
  // };

  // Custom styles for DataGrid
  const customStyle = {
    fontSize: "16px",
    width: "100%",
    height: "100%", // Ensure DataGrid takes full height of its container
  };

  return (
    <div className="mtv_producttable">
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

      <div className="mtv_producttable_header">
        {productsWithCategory.length > 0 ? (
          <DataGrid
            rows={productsWithCategory}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10, 25, 100]}
            checkboxSelection
            onRowSelectionModelChange={handleCheckboxChange}
            style={customStyle}
            sx={{
              borderRadius: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid #ccc",
              cursor: "pointer",
              "& .MuiDataGrid-columnHeaderCheckbox": {
                backgroundColor: "rgba(242, 242, 242, 1)",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(242, 242, 242, 1)", // Set for other headers as well
              },
              "& .MuiDataGrid-filler": {
                backgroundColor: "rgba(242, 242, 242, 1)",
              },
              "& .MuiDataGrid-scrollbarFiller--header": {
                backgroundColor: "rgba(242, 242, 242, 1)",
              },
            }}
            onRowClick={handleRowClick}
          />
        ) : (
          <div> No data found!</div>
        )}
      </div>
    </div>
  );
}

export default Managertableview;
