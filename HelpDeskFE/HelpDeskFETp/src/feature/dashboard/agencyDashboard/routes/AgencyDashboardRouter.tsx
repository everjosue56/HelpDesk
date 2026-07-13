import { Navigate, Route, Routes } from "react-router-dom";
import { AgenciesDashboardPage } from "../pages/AgenciesDashboardPage";

export const AgencyDashboardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<AgenciesDashboardPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};  