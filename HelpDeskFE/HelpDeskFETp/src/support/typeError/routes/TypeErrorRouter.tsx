import { Navigate, Route, Routes } from "react-router-dom";
import { ListTypeErrorPage } from "../pages/ListTypeErrorPage";
import { CreateTypeErrorPage } from "../pages/CreateTypeErrorPage";
import { EditTypeErrorPage } from "../pages/EditTypeErrorPage";

export const TypeErrorRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListTypeErrorPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
            <Route path="create/" element={<CreateTypeErrorPage/>} />
            <Route path="edit/:id" element={<EditTypeErrorPage />} />
        </Routes>
    );
};