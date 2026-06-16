import { Navigate, Route, Routes } from "react-router-dom";
import { AuditLogsPage } from "../pages/AuditLogsPage";

export const AuditRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<AuditLogsPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};