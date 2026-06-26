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
import { DeviceRouter } from "@/inventory/devices/routes/DevicesRouter";
import { MaintenanceRouter } from "@/inventory/maintenance/routes/MaintenancesRouter";
import { MaintenanceHistoryRouter } from "@/inventory/maintenanceHistory/routes/MaintenanceHistoryRouter";
import { DashboardLayoutSupport } from "@/support/supportMenu/DashoardLayoutSupport";
import { TicketRouter } from "@/support/tickets/routes/TicketRouter";
import { SoftwareSystemsRouter } from "@/support/softwareSystem/routes/SoftwareSystemRouter";
import { TypeErrorRouter } from "@/support/typeError/routes/TypeErrorRouter";
import { ResolutionRouter } from "@/support/resolutions/routes/ResolutionsRouter";
import { TicketHistoryRouter } from "@/support/ticketHistories/routes/TicketHistoryRouter";
import { SlaDashboardRouter } from "@/dashboard/slaDashboard/routes/SlaDashboardRouter";
import { LayoutDashboard } from "@/dashboard/dashboardMenu/DashboardLayout";
import { AgencyDashboardRouter } from "@/dashboard/agencyDashboard/routes/AgencyDashboardRouter";
import { AreaDashboardRouter } from "@/dashboard/areaDashboard/routes/AreaDashboardRouter";
import { TechnicialDashboardRouter } from "@/dashboard/PerfomanceDashboard/routes/TechnicianDashboardRouter";
import { DashboardLayoutNotifications } from "@/notifications/notificationMenu/DashboardLayoutNotifications";
import { NotificationsListPage } from "@/notifications/pages/NotificationsListPage";

export const DashBoardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="*" element={<Navigate to="" replace />} />
            <Route element={<DashboardLayout />}>
                {/* Rutas del modulo administrativo */}
                <Route path="organizations/*" element={<OrganizationsRouter />} />
                <Route path="agencies/*" element={<AgenciesRouter />} />
                <Route path="roles/*" element={<RolesRouter />} />
                <Route path="areas/*" element={<AreasRouter />} />
                <Route path="users/*" element={<UsersRouter />} />
                <Route path="logs/*" element={<AuditRouter />} />
            </Route>
            {/* Rutas del modulo de inventario */}
            <Route element={<DashboardLayoutInventory />}>
                <Route path="typedevice/*" element={<TypeDeviceRouter />} />
                <Route path="typemaintenance/*" element={<TypeMaintenanceRouter />} />
                <Route path="device/*" element={<DeviceRouter />} />
                <Route path="maintenance/*" element={<MaintenanceRouter />} />
                <Route path="maintenancehistory/*" element={<MaintenanceHistoryRouter />} />
            </Route>
            {/* Ruta del modulo de suporte */}
            <Route element={<DashboardLayoutSupport />}>
                <Route path="tickets/*" element={<TicketRouter />} />
                <Route path="softwaresystem/*" element={<SoftwareSystemsRouter />} />
                <Route path="typeerror/*" element={<TypeErrorRouter />} />
                <Route path="resolutions/*" element={<ResolutionRouter />} />
                <Route path="tickethistories/*" element={<TicketHistoryRouter />} />
            </Route>
            {/* Ruta de modulo de kpi´s */}
            <Route element={<LayoutDashboard />} >
                <Route path="sla/*" element={<SlaDashboardRouter />} />
                <Route path="agencieskpi/*" element={<AgencyDashboardRouter />} />
                <Route path="areaskpi/*" element={<AreaDashboardRouter />} />
                <Route path="technicialkpi/*" element={<TechnicialDashboardRouter />} />
            </Route>
            <Route element={<DashboardLayoutNotifications/>} >
            <Route path="notifications/*" element={<NotificationsListPage/>} />
            </Route>
        </Routes>
    );
};