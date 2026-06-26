import { Navigate, Route, Routes } from "react-router-dom";
import { NotificationsListPage } from "../pages/NotificationsListPage";


export const TypeDeviceRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<NotificationsListPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};