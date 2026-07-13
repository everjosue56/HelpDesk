import { Navigate, Route, Routes } from "react-router-dom";
import { ListMaintenanceHistoryPage } from "../pages/ListMaintenanceHistoryPage";
import { DetailsMaintenanceHistoryPage } from "../pages/DetailsMaintenanceHistoryPage";


export const MaintenanceHistoryRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListMaintenanceHistoryPage />} />
             <Route path="maintenancehistory/:id" element={<DetailsMaintenanceHistoryPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};