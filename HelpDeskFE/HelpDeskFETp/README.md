# 🎨 HelpDesk FE

> Interfaz de usuario moderna para la gestión de soporte técnico, inventario, administración y monitoreo de indicadores de TI.

HelpDesk FE es una aplicación web desarrollada con **React**, **TypeScript** y **Tailwind CSS** que funciona como la consola centralizada para la administración de tickets de soporte, automatización de procesos y visualización de métricas operativas.

La plataforma ofrece una experiencia de usuario moderna, responsive y optimizada, orientada a entornos institucionales donde la gestión eficiente del soporte técnico es un componente crítico.

---

# 🚀 Características

- 📊 Dashboard analítico con indicadores en tiempo real.
- 🎫 Gestión completa de tickets de soporte.
- 💻 Administración de inventario tecnológico.
- 👥 Gestión de usuarios, roles y permisos.
- 🔔 Sistema de notificaciones en tiempo real.
- 📈 Visualización de métricas mediante gráficos interactivos.
- ⚡ Alto rendimiento gracias a React + Vite.
- 🎯 Arquitectura modular y escalable.

---

# 📦 Módulos del Sistema

## 📊 Dashboard

Centro de monitoreo para indicadores y métricas del sistema.

### Funcionalidades

- Monitoreo de cumplimiento de ANS (SLA).
- Gráficos interactivos utilizando **Chart.js**.
- KPIs en tiempo real:
  - Incidentes reportados.
  - Tiempo promedio de resolución (MTTR).
  - Alertas de cumplimiento.
- Configuración dinámica de metas mensuales mediante modales.

---

## 🎫 Soporte

Módulo encargado de la administración del ciclo completo de incidencias.

### Funcionalidades

- Creación y seguimiento de tickets.
- Priorización por impacto y criticidad.
- Resolución de incidencias.
- Historial completo de cada ticket.
- Registro del tiempo invertido mediante **React Hook Form**.
- Conversión automática de minutos al formato requerido por el backend.

---

## 💻 Inventario

Administración de los activos tecnológicos de la organización.

### Funcionalidades

- Gestión de:
  - Servidores
  - Laptops
  - Switches
  - Impresoras
- Catálogo organizado por marca y código de activo.
- Historial de mantenimientos.
- Asociación entre equipos e incidencias.
- Consulta de la hoja de vida de cada activo.

---

## 👥 Administrativo

Módulo dedicado a la configuración y administración del sistema.

### Funcionalidades

- Administración de usuarios.
- Gestión de roles:
  - Administradores
  - Técnicos
  - Clientes
- Configuración general del sistema.
- Auditoría mediante registros (Logs).
- Monitoreo de actividad para fines de seguridad.

---

## 🔔 Notificaciones

Sistema de alertas en tiempo real.

### Funcionalidades

- Centro de notificaciones.
- Clasificación entre alertas leídas y pendientes.
- Notificaciones emergentes mediante **Sonner**.
- Feedback inmediato para operaciones exitosas y errores.

---

# 🏗️ Arquitectura

El proyecto sigue una arquitectura moderna basada en características (*Feature-Based Architecture*).

```
src/
│
├── auth/
├── dashboard/
├── support/
├── inventory/
├── administration/
├── notifications/
├── shared/
└── services/
```

## Principales características

### Feature-Based Directory

Organización del código por dominios de negocio para facilitar el mantenimiento y escalabilidad.

### TypeScript

Tipado estricto mediante interfaces y modelos para garantizar seguridad durante el desarrollo.

### React Hook Form

Gestión eficiente de formularios complejos evitando renderizados innecesarios.

### Axios

Cliente HTTP centralizado con:

- Interceptores
- Manejo global de errores
- Inyección automática de tokens
- Integración con DTOs del backend

### Paginación del lado del servidor

Compatible con endpoints paginados utilizando parámetros como:

- `PageNumber`
- `PageSize`

---

# 🛠️ Stack Tecnológico

| Tecnología | Descripción |
|------------|-------------|
| React 18/19 | Librería principal |
| TypeScript | Tipado estático |
| Vite | Bundler y servidor de desarrollo |
| Tailwind CSS | Framework CSS |
| React Hook Form | Manejo de formularios |
| Axios | Cliente HTTP |
| Chart.js | Visualización de datos |
| react-chartjs-2 | Integración de Chart.js con React |
| Lucide React | Iconografía |
| React Icons | Componentes de iconos |
| Sonner | Sistema de notificaciones |

---

# 🚀 Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/everjosue56/HelpDesk.git
```

## 2. Ingresar al proyecto

```bash
cd helpdesk-fe
```

## 3. Instalar dependencias

```bash
npm install
```

---

# ▶️ Ejecutar el proyecto

Inicie el servidor de desarrollo utilizando Vite:

```bash
npm run dev
```

Una vez iniciado, abra su navegador y acceda a:

```
http://localhost:5173
``

---


## 📄 Licencia

Este proyecto es de uso interno y pertenece al equipo de desarrollo de **System**.