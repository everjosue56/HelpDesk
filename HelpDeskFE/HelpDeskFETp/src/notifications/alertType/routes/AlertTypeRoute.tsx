import { Navigate, Route, Routes } from "react-router-dom";
import { AlertTypesListPage } from "../pages/ListAlertTypesPage";
import { CreateAlertTypePage } from "../pages/CreateAlertTypePage";
import { EditAlertTypePage } from "../pages/EditAlertTypePage";

export const AlertTypeRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<AlertTypesListPage />} />
             <Route path="create" element={<CreateAlertTypePage />} />
               <Route path="edit/:id" element={<EditAlertTypePage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};