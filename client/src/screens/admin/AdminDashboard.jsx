import Sidebar from "../../components/Admin/sidebar";
import Topbar from "../../components/Admin/topbar";
import "../../styles/dashboard.css";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./Dashboard";
import UserManage from "./UserManage";
import ProductManage from "./ProductManage";
import SalesForecast from "./SalesForecast";
import Reports from "./Reports";
import AddBranch from "./AddBranch";
import GeneralSetting from "./GeneralSettings";
import Notification from "./Notification";
import Profile from "./Profile";
import EditBranch from "./EditBranch";
import ManageUsers from "./InvitedUserStatus";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import Supplier from "./Supplier";
import Invoice from "./Finance/Invoice";
import InvoiceView from "./Finance/InvoiceView";
import Receipt from "./Finance/Receipt";
import ReceiptView from "./Finance/ReceiptView";
import InventoryData from "./Inventory/InventoryData";
import ViewSupplier from "./ViewSupplier";
import EditSupplier from "./EditSupplier";

function AdminDashboard() {
  const [option, setOption] = useState("Home");

  return (
    <div className="dasboardHome">
      <div className="sideContent">
        <Sidebar option={option} setOption={setOption} />
      </div>
      <div className="contentbar">
        <Topbar option={option} setOption={setOption} />
        <div className="dashboard_admin">
          <Routes>
            {/* Sidebar routes */}
            <Route path="" element={<Dashboard />} />
            <Route path="user_manage" element={<UserManage />} />

            <Route path="product_manage" element={<ProductManage />} />
            <Route path="inventory" element={<InventoryData />}></Route>
            <Route path="sales_forecast" element={<SalesForecast />} />
            <Route path="reports" element={<Reports />} />
            <Route path="add_branch" element={<AddBranch />} />
            <Route path="edit_branch/:branchId" element={<EditBranch />} />
            <Route path="add_product" element={<AddProduct />} />
            <Route path="edit_product/:productId" element={<UpdateProduct />} />
            <Route path="supplier" element={<ViewSupplier />} />
            <Route
              path="edit_supplier/:supplierId"
              element={<EditSupplier />}
            />
            {/* Finance routes*/}
            {/* Receipts */}
            <Route path="finance/Receipt" element={<Receipt />} />
            <Route
              path="finance/Receipt/:ReceiptNo"
              element={<ReceiptView />}
            />

            {/* Invoice */}
            <Route path="finance/Invoice" element={<Invoice />} />
            <Route
              path="finance/Invoice/:invoiceNo"
              element={<InvoiceView />}
            />
            {/* <Route path="finance/Reports" element={<SalesForcast />} /> */}

            {/* Topbar routes */}
            <Route path="general_setting" element={<GeneralSetting />} />
            <Route path="notification" element={<Notification />} />
            <Route path="profile" element={<Profile />} />

            {/* Body routes */}
            <Route path="manage_users" element={<ManageUsers />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
