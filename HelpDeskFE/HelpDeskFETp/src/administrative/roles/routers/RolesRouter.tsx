import { Navigate, Route, Routes } from "react-router-dom";
import { ListRolesPage } from "../pages/ListRolesPage";

export const RolesRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListRolesPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};