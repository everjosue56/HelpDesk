## ⚙️ Configuración y Ejecución del Proyecto

### Prerrequisitos
* SDK de .NET 8.0 instalado.
* Instancia de SQL Server o motor configurado corriendo de forma local.

### Pasos para iniciar el Backend
1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd HelpDeskBE/HelpDesk
    ```
2.  **Configurar la cadena de conexión:**
    Abre el archivo `appsettings.json` o `appsettings.Development.json` y configura tu propiedad `ConnectionStrings`:
    ```json
    "ConnectionStrings": {
      "DefaultConnection": "Server=TU_SERVIDOR;Database=HelpDeskDb;Trusted_Connection=True;TrustServerCertificate=True;"
    }
    ```
3.  **Ejecutar las Migraciones (Si aplica):**
    ```bash
    dotnet ef database update
    ```
4.  **Correr la aplicación:**
    ```bash
    dotnet run
    ```
5.  **Acceder a la documentación de la API:**
    Una vez que el servidor esté corriendo, abre tu navegador en la ruta local para interactuar con los endpoints mediante Swagger:
    ```text
    http://localhost:<puerto>/swagger
    ```

---

## 📝 Resumen de Endpoints Optimizados (Paginados)

| Módulo | Parámetros de Filtro Soportados | Tipo de Búsqueda |
| :--- | :--- | :--- |
| **`/api/users`** | `IdRol`, `IdAgency`, `IdArea`, `Keyword` | Coincidencia exacta en IDs; Barrido de texto en Nombres, User y Email. |
| **`/api/tickets`** | `IdUser`, `IdTypeError`, `IdArea`, `IdSoftwareSystem`, `IdImpact`, `IdPriority`, `DateFrom`, `DateTo`, `Keyword` | Multi-relacional con control de rango de fechas y texto. |
| **`/api/resolutions`** | `IdTicket`, `IdUser`, `IdSolutionStatus`, `IdDevice`, `IdPriority`, `DateFrom`, `DateTo`, `Keyword` | Carga profunda con Includes múltiples y búsqueda en descripción/diagnóstico. |
| **`/api/notifications/log`** | `IdNotification`, `DateFrom`, `DateTo` | Auditoría en cadena (`ThenInclude`) orientada a la bitácora del sistema. |
| **`/api/organizations`** | `Name` | Filtro de texto parcial (`Contains`) sobre catálogos paramétricos. |
