import { Navigate, Route, Routes } from "react-router-dom";
import { ListAreasPage } from "../pages/ListAreasPage";
import { EditAreaPage } from "../pages/EditAreaPage";
import { CreateAreaPage } from "../pages/CreateAreaPage";

export const AreasRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListAreasPage />} />
            <Route path="create" element={<CreateAreaPage/>}  />
            <Route path="edit/:id" element={<EditAreaPage/>}  />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};