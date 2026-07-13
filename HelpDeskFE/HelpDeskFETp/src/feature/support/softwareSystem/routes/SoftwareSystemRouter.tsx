import { Navigate, Route, Routes } from "react-router-dom";
import { ListSoftwareSystemsPage } from "../pages/ListSoftwareSystemsPage";
import { CreateSoftwareSystemPage } from "../pages/CreateSoftwareSystemPage";
import { EditSoftwareSystemPage } from "../pages/EditSoftwareSystemPage";

export const SoftwareSystemsRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListSoftwareSystemsPage />} />
            <Route path="edit/:id" element={<EditSoftwareSystemPage />} />
            <Route path="create/" element={<CreateSoftwareSystemPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};