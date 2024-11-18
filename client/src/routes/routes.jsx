import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "../screens/admin/AdminDashboard";
import Login from "../screens/home/Login";
import Dashboard from "../screens/admin/Dashboard";
import UserRegistration from "../screens/home/UserRegistration";
import Organisation from "../screens/home/Organisation";
import Overview from "../screens/home/OverviewPage";
import ManagerDashboard from "../screens/manager/ManagerDashboard";
import ChefDashboard from "../screens/chef/ChefDashboard";
import OperatorDashboard from "../screens/operator/OperatorDashboard";

function routes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/userRegistration" element={<UserRegistration />} />
        <Route path="/Overview" element={<Overview />} />
        <Route path="/organisationRegistration" element={<Organisation />} />
        <Route path="/manager/*" element={<ManagerDashboard />} />
        <Route path="/chef/*" element={<ChefDashboard />} />
        <Route path="/operator/*" element={<OperatorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default routes;
