import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";

import PropertyList from "../pages/properties/PropertyList";
import PropertyCreate from "../pages/properties/PropertyCreate";
import PropertyDetail from "../pages/properties/PropertyDetail";
import PropertyEdit from "../pages/properties/PropertyEdit";

import UnitList from "../pages/units/UnitList";
import UnitCreate from "../pages/units/UnitCreate";
import UnitDetail from "../pages/units/UnitDetail";
import UnitEdit from "../pages/units/UnitEdit";

import TenantList from "../pages/tenants/TenantList";
import TenantCreate from "../pages/tenants/TenantCreate";
import TenantDetail from "../pages/tenants/TenantDetail";
import TenantEdit from "../pages/tenants/TenantEdit";
import TenantDocuments from "../pages/tenants/TenantDocuments";

import TenancyList from "../pages/tenancies/TenancyList";
import TenancyCreate from "../pages/tenancies/TenancyCreate";
import TenancyDetail from "../pages/tenancies/TenancyDetail";
import TenancyEdit from "../pages/tenancies/TenancyEdit";

const AppRoutes = () => {
    const { isAuthenticated } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={
                        isAuthenticated
                            ? <Navigate to="/dashboard" replace />
                            : <Login />
                    }
                />

                <Route element={<ProtectedRoute />}>
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/* property */}
                        <Route path="/properties" element={<PropertyList />} />
                        <Route path="/properties/create" element={<PropertyCreate />} />
                        <Route path="/properties/:propertyId" element={<PropertyDetail />} />
                        <Route path="properties/:propertyId/edit" element={<PropertyEdit />} />
                        {/* units */}
                        <Route path="/units" element={<UnitList />} />
                        <Route path="/units/create" element={<UnitCreate />} />
                        <Route path="/units/:unitId" element={<UnitDetail />} />
                        <Route path="/units/:unitId/edit" element={<UnitEdit />} />
                        {/* tenants */}
                        <Route path="/tenants" element={<TenantList />} />
                        <Route path="/tenants/create" element={<TenantCreate />} />
                        <Route path="/tenants/:tenantId" element={<TenantDetail />} />
                        <Route path="/tenants/:tenantId/edit" element={<TenantEdit />} />
                        <Route path="/tenants/:tenantId/documents" element={<TenantDocuments />} />
                        {/* tenancies */}
                        <Route path="tenancies" element={<TenancyList />} />
                        <Route path="tenancies/create" element={<TenancyCreate />} />
                        <Route path="tenancies/:tenancyId" element={<TenancyDetail />} />
                        <Route path="tenancies/:tenancyId/edit" element={<TenancyEdit />} />
                    </Route>
                </Route>

                <Route path="/" element={<Navigate to="/dashboard" replace />} />             
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
