import { Navigate, Route, Routes } from "react-router-dom";
import { ListTypeMaintenancePage } from "../pages/ListTypeMaintenancePage";
import { CreateTypeMaintenancePage } from "../pages/CreateTypeMaintenancePage";
import { EditTypeMaintenancePage } from "../pages/EditTypeMaintenancePage";

export const TypeMaintenanceRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListTypeMaintenancePage />} />
            <Route path="create" element={<CreateTypeMaintenancePage/>} />
            <Route path="edit/:id" element={<EditTypeMaintenancePage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};