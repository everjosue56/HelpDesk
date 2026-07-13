import { Navigate, Route, Routes } from "react-router-dom";
import { ListResolutionPage } from "../pages/ListResolutionsPage";
import { DetailsResolutionPage } from "../pages/DetailsResolutionPage";
import { EditResolutionPage } from "../pages/EditResolutionPage";
import { CreateResolutionPage } from "../pages/CreateResolutionPage";


export const ResolutionRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListResolutionPage />} />
             <Route path="details/:id" element={<DetailsResolutionPage />} />
             <Route path="edit/:id" element={<EditResolutionPage />} />
             <Route path="create" element={<CreateResolutionPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};