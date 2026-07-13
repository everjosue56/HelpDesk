import { Navigate, Route, Routes } from "react-router-dom";
import { TicketHistoryListPage } from "../pages/TicketHistoryListPage";
import { TicketHistoryDetailsPage } from "../pages/TicketHistoryDetailsPage";

export const TicketHistoryRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<TicketHistoryListPage />} />
            <Route path="details/:id" element={<TicketHistoryDetailsPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};