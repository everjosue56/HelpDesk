# 🎫 HelpDesk

> Plataforma integral para la gestión de soporte técnico, inventario tecnológico y monitoreo de indicadores de TI.

HelpDesk es una solución Full Stack diseñada para centralizar la operación de mesas de ayuda en organizaciones e instituciones. La plataforma permite administrar el ciclo completo de las incidencias, controlar el inventario de activos tecnológicos, gestionar usuarios y visualizar métricas operativas desde una interfaz moderna y una API robusta.

El proyecto está dividido en dos componentes principales:

- **HelpDesk FE** → Aplicación web desarrollada con **React**, **TypeScript** y **Tailwind CSS**.
- **HelpDesk BE** → API REST desarrollada con **ASP.NET Core (.NET 10)** y **Entity Framework Core**.

---

# 🚀 Características

- 🎫 Gestión completa del ciclo de vida de tickets.
- 📊 Dashboard con métricas e indicadores (SLA, MTTR, KPIs).
- 💻 Administración del inventario tecnológico.
- 🔧 Historiales de mantenimiento preventivo y correctivo.
- 👥 Gestión de usuarios, roles y permisos.
- 🔔 Sistema de notificaciones en tiempo real.
- 📈 Reportes mediante gráficos interactivos.
- 🔍 Auditoría y trazabilidad mediante registros (Logs).
- ⚡ Arquitectura escalable basada en buenas prácticas modernas.

---

# 🏗️ Arquitectura del Proyecto

El repositorio se organiza en dos aplicaciones independientes.

```text
HelpDesk/
│
├── HelpDesk.FE/          # Aplicación React
│
├── HelpDesk.BE/          # API ASP.NET Core
│
└── README.md
```

## Frontend (HelpDesk FE)

Aplicación web responsable de la experiencia de usuario.

### Tecnologías

- React 18/19
- TypeScript
- Tailwind CSS
- React Hook Form
- Axios
- Chart.js
- react-chartjs-2
- Lucide React
- React Icons
- Sonner
- Vite

### Funcionalidades

- Dashboard analítico.
- Gestión de tickets.
- Administración de inventario.
- Gestión de usuarios.
- Notificaciones.
- Consumo centralizado de API.
- Paginación del lado del servidor.

---

## Backend (HelpDesk BE)

API REST responsable de la lógica de negocio y persistencia de datos.

### Tecnologías

- .NET 10
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server / PostgreSQL
- AutoMapper
- MailKit
- Swagger

### Funcionalidades

- Gestión de tickets.
- Administración de inventario.
- Historiales de mantenimiento.
- Gestión de usuarios.
- Sistema de notificaciones.
- Auditoría mediante Logs.
- Validación de DTOs.
- Respuestas estandarizadas.
- Paginación de datos.

---

# 📦 Módulos del Sistema

## 📊 Dashboard

Centro de monitoreo para indicadores operativos.

- Cumplimiento de SLA.
- KPIs en tiempo real.
- MTTR.
- Gráficos estadísticos.
- Configuración de objetivos mensuales.

---

## 🎫 Soporte

Gestión del ciclo de vida de incidencias.

- Registro de tickets.
- Priorización por impacto y criticidad.
- Seguimiento.
- Resolución.
- Historial completo.

---

## 💻 Inventario

Administración de infraestructura tecnológica.

- Servidores.
- Laptops.
- Switches.
- Impresoras.
- Historial de activos.
- Mantenimientos.
- Relación entre activos e incidencias.

---

## 👥 Administración

Configuración general del sistema.

- Usuarios.
- Roles.
- Permisos.
- Configuración.
- Auditoría.

---

## 🔔 Notificaciones

Sistema centralizado de alertas.

- Bandeja de notificaciones.
- Alertas en tiempo real.
- Estados leídas/no leídas.
- Feedback inmediato al usuario.

---

# 🏛️ Arquitectura de Software

El proyecto sigue principios modernos de desarrollo tanto en Frontend como Backend.

## Frontend

- Arquitectura basada en características (*Feature-Based*).
- Componentes reutilizables.
- TypeScript con tipado estricto.
- Formularios mediante React Hook Form.
- Axios con interceptores.
- Consumo desacoplado de API.

## Backend

- Repository Pattern.
- Service Pattern.
- DTOs para transferencia de datos.
- AutoMapper.
- Entity Framework Core.
- Validaciones mediante Data Annotations.
- Respuestas estandarizadas (`ResponseDto<T>` y `PagedResponseDto<T>`).

---

# 🛠️ Stack Tecnológico

## Frontend

| Tecnología | Uso |
|------------|-----|
| React | UI |
| TypeScript | Tipado |
| Tailwind CSS | Estilos |
| Vite | Bundler |
| React Hook Form | Formularios |
| Axios | Cliente HTTP |
| Chart.js | Gráficos |
| Sonner | Notificaciones |
| Orval | Genera Clientes |

## Backend

| Tecnología | Uso |
|------------|-----|
| .NET 10 | Framework |
| ASP.NET Core | API REST |
| Entity Framework Core | ORM |
| SQL Server / PostgreSQL | Base de datos |
| AutoMapper | Mapeo |
| MailKit | Correo |
| Swagger | Documentación |

---

# 🚀 Inicio Rápido

## Clonar el repositorio

```bash
git clone https://github.com/everjosue56/HelpDesk.git
```

---

## Backend

```bash
cd HelpDesk.BE

dotnet restore

dotnet run
```

La API quedará disponible en la URL configurada para el entorno de desarrollo.

---

## Frontend

```bash
cd HelpDesk.FE

npm install

npm run dev
```

Una vez iniciado Vite, abra el navegador en:

```
http://localhost:5173
```

---

# 🎯 Objetivos del Proyecto

- Centralizar la gestión del soporte técnico.
- Optimizar los tiempos de respuesta.
- Mejorar la trazabilidad de incidencias.
- Gestionar el ciclo de vida del inventario tecnológico.
- Automatizar procesos administrativos.
- Facilitar la toma de decisiones mediante indicadores.
- Proporcionar una arquitectura mantenible y escalable.

---

# 📈 Principales Características Técnicas

- Arquitectura modular.
- API REST desacoplada.
- Consumo mediante Axios.
- DTOs tipados.
- Paginación del lado del servidor.
- Validaciones automáticas.
- Componentes reutilizables.
- Dashboard analítico.
- Auditoría completa.
- Notificaciones en tiempo real.

---

# 📄 Documentación

Cada proyecto cuenta con su propia documentación técnica:

- 📁 `HelpDesk.FE/README.md`
- 📁 `HelpDesk.BE/README.md`

---

# 👨‍💻 Desarrollo

HelpDesk fue desarrollado siguiendo principios de ingeniería de software moderna, priorizando:

- Escalabilidad.
- Mantenibilidad.
- Rendimiento.
- Seguridad.
- Accesibilidad.
- Experiencia de usuario.
- Código limpio.
- Separación de responsabilidades.

---

## 📄 Licencia

© 2026 Ever Josue Garcia Leonor. Todos los derechos reservados.

Este software es propiedad intelectual del autor. Queda prohibida su reproducción, distribución, modificación o utilización total o parcial sin autorización previa y por escrito, salvo que se indique lo contrario.