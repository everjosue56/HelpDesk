import { Navigate, Route, Routes } from "react-router-dom";
import { ListTypeDevicesPage } from "../pages/ListTypeDevicesPage";
import { CreateTypeDevicePage } from "../pages/CreateTypeDevicePage";
import { EditTypeDevicePage } from "../pages/EditTypeDevicePage";

export const TypeDeviceRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListTypeDevicesPage />} />
            <Route path="create" element={<CreateTypeDevicePage />} />
            <Route path="edit/:id" element={<EditTypeDevicePage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};