import { Navigate, Route, Routes } from "react-router-dom";
import { ListMaintenancePage } from "../pages/ListMaintenancePage";
import { DetailsMaintenancePage } from "../pages/DetailsMaintenancePage";
import { CreateMaintenancePage } from "../pages/CreateMaintenancePage";
import { EditMaintenancePage } from "../pages/EditMaintenancePage";


export const MaintenanceRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListMaintenancePage />} />
            <Route path="details/:id" element={<DetailsMaintenancePage />} />
            <Route path="create" element={<CreateMaintenancePage />} />
            <Route path="edit/:id" element={<EditMaintenancePage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};  