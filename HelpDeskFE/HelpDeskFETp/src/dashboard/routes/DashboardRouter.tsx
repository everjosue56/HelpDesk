import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage"
import { OrganizationsRouter } from "@/administrative/organizations/routes/OrganizationsRouter";
import { DashboardLayout } from "@/components/DashboardLayout";
import { AgenciesRouter } from "@/administrative/agencies/routes/AgenciesRouter";
import { AreasRouter } from "@/administrative/areas/routes/AreasRouter";
import { RolesRouter } from "@/administrative/roles/routers/RolesRouter";

export const DashBoardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="*" element={<Navigate to="" replace />} />
            <Route element={<DashboardLayout />}>
            <Route path="organizations/*" element={<OrganizationsRouter />} />
            <Route path="agencies/*" element={<AgenciesRouter/>} />
            <Route path="roles/*" element={<RolesRouter/>} />
            <Route path="areas/*" element={<AreasRouter/>} />
            </Route>
        </Routes>
    );
};