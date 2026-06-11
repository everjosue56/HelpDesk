import { Navigate, Route, Routes } from "react-router-dom";
import { OrganizationsPage } from "../pages/ListOrganizationsPage";
import { CreateOrganizationPage } from "../pages/CreateOrganizationPage";
import { EditOrganizationPage } from "../pages/EditOrganizationPage";


export const OrganizationsRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<OrganizationsPage />} />
            <Route path="/create" element={<CreateOrganizationPage/>} />
            <Route path="edit/:id" element={<EditOrganizationPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};