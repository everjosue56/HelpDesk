import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "../pages/HomePage"
import { OrganizationsRouter } from "@/administrative/organizations/routes/OrganizationsRouter";
import { DashboardLayout } from "@/administrative/administrativeMenu/DashboardLayoutAdministrative";
import { AgenciesRouter } from "@/administrative/agencies/routes/AgenciesRouter";
import { AreasRouter } from "@/administrative/areas/routes/AreasRouter";
import { RolesRouter } from "@/administrative/roles/routers/RolesRouter";
import { UsersRouter } from "@/administrative/users/routes/UsersRouter";
import { AuditRouter } from "@/administrative/audit/routes/AuditRouter";
import { TypeDeviceRouter } from "@/inventory/typeDevices/routes/TypeDeviceRouter";
import { DashboardLayoutInventory } from "@/inventory/inventoryMenu/DashboardLayoutInventory";
import { TypeMaintenanceRouter } from "@/inventory/typeMaintenance/routes/TypeMaintenanceRouter";
import { DeviceRouter } from "@/inventory/Devices/routes/DevicesRouter";
import { MaintenanceRouter } from "@/inventory/maintenance/routes/MaintenancesRouter";
import { MaintenanceHistoryRouter } from "@/inventory/maintenanceHistory/routes/MaintenanceHistoryRouter";

export const DashBoardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="*" element={<Navigate to="" replace />} />
            <Route element={<DashboardLayout />}>
            {/* Rutas del modulo administrativo */}
            <Route path="organizations/*" element={<OrganizationsRouter />} />
            <Route path="agencies/*" element={<AgenciesRouter/>} />
            <Route path="roles/*" element={<RolesRouter/>} />
            <Route path="areas/*" element={<AreasRouter/>} />
            <Route path="users/*" element={<UsersRouter/>} />
            <Route path="logs/*" element={<AuditRouter/>} />
            </Route>
            {/* Rutas del modulo de inventario */}
            <Route element={<DashboardLayoutInventory />}>
            <Route path="typedevice/*" element={<TypeDeviceRouter/>} />
            <Route path="typemaintenance/*" element={<TypeMaintenanceRouter/>} />
            <Route path="device/*" element={<DeviceRouter/>} />
            <Route path="maintenance/*" element={<MaintenanceRouter/>}  />
            <Route path="maintenancehistory/*" element={<MaintenanceHistoryRouter/>}  />
            </Route>
        </Routes>
    );
};