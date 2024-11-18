import Managersidebar from "../../components/Manager/managersidebar";
import Managertopbar from "../../components/Manager/managertopbar";
import "../../styles/manager/HomePage.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Homepage from "./Homepage";
import AddProduct from "./AddProduct";
import Inventory from "./Inventory";
import PayPage from "./OrderPayment";
import ManagerProductManage from "./ManagerProductManage";
import ManageProduct from "./ManageProduct";
import Reports from "./Reports";
import FloorLayoutAddTable from "./FloorLayoutAddTable";
import ManagerFoodItems from "./FoodItems/ManagerFoodItems";
import FoodItemForm from "./FoodItems/FoodItemsForms";
import OrderProcessing from "./OrderProcessing";
import OrderProcessingTableView from "./OrderProcessingTableView";
import BillingPage from "./kot/BillingPage";
function ManagerDashboard() {
  const [showSidebar, setShowSidebar] = useState(true);

  const location = useLocation();

  useEffect(() => {
    const HideRoutes = [
      "/manager/order_processing",
      "/manager/order_processing/:tableId",
    ];
    const shouldHide = HideRoutes.some((route) =>
      location.pathname.startsWith(route)
    );
    setShowSidebar(!shouldHide);
  }, [location.pathname]);

  return (
    <div className="dasboardHome">
      {showSidebar && (
        <div className="sideContent">
          <Managersidebar />
        </div>
      )}
      <div className="contentbar">
        <Managertopbar />
        <div className="dashboard_manager">
          <Routes>
            {/* Sidebar routes */}
            <Route path="" element={<Homepage />} />
            <Route path="operation" element={<Inventory />} />
            <Route path="pay" element={<PayPage />}></Route>
            <Route path="raw-material" element={<ManagerProductManage />} />
            <Route path="addproduct" element={<AddProduct />} />
            <Route path="edit_product/:productId" element={<ManageProduct />} />
            <Route path="reports" element={<Reports />} />
            <Route path="tableLayout" element={<FloorLayoutAddTable />} />
            <Route path="foodItems" element={<ManagerFoodItems />} />
            <Route
              path="foodItems/addFoodItem"
              element={<FoodItemForm isEdit={false} />}
            />
            <Route
              path="foodItems/editFoodItem/:id"
              element={<FoodItemForm isEdit={true} />}
            />
            <Route
              path="order_processing/:tableId"
              element={<OrderProcessing />}
            />
            <Route
              path="order_processing"
              element={<OrderProcessingTableView />}
            />
            <Route
              path="order_processing/order_billing/:orderId"
              element={<BillingPage />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;
