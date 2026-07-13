import { Navigate, Route, Routes } from "react-router-dom";
import { SlaDashboardPage } from "../pages/SlaDashboardPage";

export const SlaDashboardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<SlaDashboardPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};  