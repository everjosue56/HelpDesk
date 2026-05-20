# 🛠️ HelpDesk BE — Sistema de Gestión de Incidencias y Mantenimiento

¡Bienvenido al repositorio del Backend de **HelpDesk BE**! Esta es una API Web robusta, escalable y de alto rendimiento desarrollada en **.NET 10** utilizando **Entity Framework Core**. El sistema ha sido diseñado específicamente para centralizar, automatizar y optimizar la gestión de soportes técnicos, control de infraestructura tecnológica (dispositivos y software) y bitácoras de mantenimiento en entornos institucionales complejos.

---

## 🚀 Solución Tecnológica y Valor Agregado

En organizaciones de gran escala, el tiempo de inactividad de los sistemas o equipos puede comprometer la continuidad de operaciones críticas. **HelpDesk** resuelve esta problemática transformando el soporte técnico reactivo en una operación fluida, auditable y basada en datos mediante las siguientes soluciones:

### 1. Gestión Integral del Ciclo de Vida del Ticket
* **Centralización del Reporte:** Permite registrar incidencias detallando el área afectada, el sistema de software comprometido, el tipo de error y el usuario solicitante.
* **Priorización Inteligente:** Clasifica de forma automática o administrativa la urgencia de los casos mediante matrices de **Impacto** y **Prioridad** (*Baja, Media, Alta, Crítica*), garantizando que los ingenieros de soporte atiendan primero los incidentes de mayor criticidad operativa.
* **Flujo de Resolución Transaccional:** Controla el proceso de cierre registrando diagnósticos técnicos, tiempos exactos de solución, costos asociados y estados intermedios.

### 2. Control de Inventario y Mantenimiento de Equipos
* **Hoja de Vida del Dispositivo:** Vincula directamente los tickets y mantenimientos a un inventario de hardware catalogado por tipo de dispositivo (*Laptops, Servidores, Switches, Impresoras*).
* **Mantenimiento Preventivo y Correctivo:** Administra las bitácoras e historiales de mantenimiento técnico programado, permitiendo auditar cuántas veces ha fallado un equipo específico para decisiones de reemplazo tecnológico.

### 3. Motor de Notificaciones y Auditoría Profunda
* **Bandeja de Entrada en Tiempo Real:** Cuenta con un módulo de notificaciones optimizado para alimentar la campana de alertas en la interfaz de usuario de React (clasificando estados leídos y no leídos).
* **Bitácoras Irreversibles (Logs):** Registra históricos profundos en cadena mediante la inclusión relacional de EF Core, asegurando trazabilidad forense sobre quién, cuándo y cómo modificó o cerró una alerta o ticket.

---

## 🏗️ Arquitectura del Software

El proyecto implementa las mejores prácticas de diseño de software y patrones de arquitectura empresarial en .NET:

* **Repository / Service Pattern:** Desacopla la lógica de acceso a datos de los controladores, facilitando el mantenimiento del código y las pruebas unitarias.
* **Mapeo Seguro de Datos (Data Transfer Objects):** Uso estricto de **AutoMapper** para transformar entidades físicas de la base de datos a DTOs planos de salida. Protege la integridad de la base de datos y optimiza los payloads JSON que viajan hacia React.
* **Validación Robusta (Data Annotations):** Los DTOs de entrada y creación están fuertemente tipados y validados en el ciclo de vida de la solicitud HTTP (utilizando anotaciones como `[Required]`, `[StringLength]`, `[EmailAddress]`, y expresiones regulares `[RegularExpression]`), devolviendo errores automáticos de esquema (`400 Bad Request`) si los datos de entrada son corruptos.
* **Estandarización de Respuestas:** Todas las peticiones al servidor responden bajo envoltorios genéricos unificados (`ResponseDto<T>` y `PagedResponseDto<T>`), asegurando consistencia en propiedades clave para el Frontend: `Status`, `StatusCode`, `Message`, `Data` y los metadatos de paginación (`CurrentPage`, `TotalItems`, `TotalPages`).

---

## 🛠️ Stack Tecnológico

* **Framework Principal:** .NET 10 (ASP.NET Core Web API)
* **ORM / Acceso a Datos:** Entity Framework Core (Code First / DbContext)
* **Base de Datos:** SQL Server / PostgreSQL (Consultas optimizadas relacionales)
* **Librerías de Utilidad:** AutoMapper (Mapeo de objetos), MailKit (Preparado para la infraestructura de correo SMTP)
* **Herramientas de Desarrollo:** Swagger (UI de documentación de API integrada), Git


---
*Desarrollado con pasión y excelencia técnica para la automatización operativa de TI.*