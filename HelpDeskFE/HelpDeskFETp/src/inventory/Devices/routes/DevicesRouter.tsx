import { Navigate, Route, Routes } from "react-router-dom";
import { ListDevicesPage } from "../pages/ListDevicesPage";
import { DetailsDevicePage } from "../pages/DetailsDevicePage";
import { EditDevicePage } from "../pages/EditDevicePage";
import { CreateDevicePage } from "../pages/CreateDevicePage";


export const DeviceRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ListDevicesPage />} />
            <Route path="details/:id" element={<DetailsDevicePage />} />
            <Route path="create" element={<CreateDevicePage />} />
            <Route path="edit/:id" element={<EditDevicePage />} />
            <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
    );
};  