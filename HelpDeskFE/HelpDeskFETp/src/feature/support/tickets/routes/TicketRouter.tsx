import { Navigate, Route, Routes } from "react-router-dom";
import { ListTicketsPage } from "../pages/ListTicketsPage";
import { CreateTicketPage } from "../pages/CreateTicketPage";
import { EditTicketPage } from "../pages/EditTicketPage";
import { DetailsTicketPage } from "../pages/DetailsTicketPage";

export const TicketRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListTicketsPage />} />
            <Route path="create" element={<CreateTicketPage />} />
            <Route path="edit/:id" element={<EditTicketPage />} />
            <Route path="details/:id" element={<DetailsTicketPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};