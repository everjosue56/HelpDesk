import { Navigate, Route, Routes } from "react-router-dom";
import { ListAgenciesPage } from "../pages/ListAgencyPage";
import { DetailsAgencyPage } from "../pages/DetailsAgencyPage";
import { CreateAgencyPage } from "../pages/CreateAgencyPage";
import { EditAgencyPage } from "../pages/EditAgencyPage";

export const AgenciesRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListAgenciesPage />} />
            <Route path="details/:id" element={<DetailsAgencyPage />} />
            <Route path="create" element={<CreateAgencyPage/>}  />
            <Route path="edit/:id" element={<EditAgencyPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};