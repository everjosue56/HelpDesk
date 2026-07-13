import { Navigate, Route, Routes } from "react-router-dom";
import { ListAlertConfigPage } from "../pages/ListAlertConfigPage";
import { CreateAlertConfigPage } from "../pages/CreateAlertConfigPage";
import { EditAlertConfigPage } from "../pages/EditAlertConfigPage";
import { DetailsAlertConfigPage } from "../pages/DetailsAlertConfigPage";

export const AlertConfigurationRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListAlertConfigPage />} />
            <Route path="create" element={<CreateAlertConfigPage />} />
            <Route path="edit/:id" element={<EditAlertConfigPage />} />
            <Route path="details/:id" element={<DetailsAlertConfigPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};