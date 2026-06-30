import { Navigate, Route, Routes } from "react-router-dom";
import { NotificationsListPage } from "../pages/NotificationsListPage";
import { DetailsNotificationPage } from "../pages/NotificationDetailsPage";


export const NotificationRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<NotificationsListPage />} />
             <Route path="details/:id" element={<DetailsNotificationPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};