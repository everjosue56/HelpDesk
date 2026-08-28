import { Navigate, Route, Routes } from "react-router-dom";
import { ListSupplierPage } from "../pages/ListSupplierPage";
import { CreateSupplierPage } from "../pages/CreateSupplierPage";
import { EditSupplierPage } from "../pages/EditSupplierPage";
import { SupplierDetailsPage } from "../pages/SupplierDetailsPage";

export const SupplierRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<ListSupplierPage />} />
      <Route path="create" element={<CreateSupplierPage />} />
      <Route path="edit/:id" element={<EditSupplierPage />} />
      <Route path="details/:id" element={<SupplierDetailsPage />} />
      <Route path="*" element={<Navigate to="." replace />} />
    </Routes>
  );
};
