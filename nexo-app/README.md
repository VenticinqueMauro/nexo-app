# Nexo

> Sistema inteligente de gestión comercial multi-industria

Nexo es un asistente inteligente que gestiona negocios comerciales de forma autónoma. No es un panel de control tradicional donde el usuario debe buscar, clickear y cargar datos manualmente. Es un sistema que **trabaja solo**, entiende el negocio, anticipa problemas y ejecuta tareas con mínima intervención humana.

## Características Principales

- **Conversacional**: Se usa hablando, no clickeando
- **Proactivo**: Avisa antes de que haya problemas
- **Multi-industria**: Funciona para distribuidoras, retail, almacenes y servicios
- **Multi-tenant**: Arquitectura SaaS lista para escalar
- **Seguro**: Row Level Security con aislamiento completo de datos

## Stack Tecnológico

- **Frontend**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Bot**: Telegram (planned)
- **LLM**: Arquitectura híbrida (planned)

## Inicio Rápido

### Prerrequisitos

- Node.js 20+ instalado
- Una cuenta en [Supabase](https://supabase.com)

### Instalación

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase.

3. Configurar la base de datos:

Ver las instrucciones detalladas en [`supabase/README.md`](./supabase/README.md)

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del Proyecto

```
nexo-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Layout raíz
│   ├── page.tsx           # Página principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilidades y configuraciones
│   ├── supabase/        # Clientes de Supabase
│   │   ├── client.ts    # Cliente para componentes de cliente
│   │   ├── server.ts    # Cliente para componentes de servidor
│   │   └── middleware.ts # Cliente para middleware
│   └── utils.ts         # Utilidades generales (cn, etc.)
├── types/               # TypeScript types
│   └── database.types.ts # Tipos de la base de datos
├── supabase/           # Database migrations y seed
│   ├── schema.sql      # Esquema de la base de datos
│   ├── rls-policies.sql # Row Level Security policies
│   ├── seed.sql        # Datos de prueba
│   └── README.md       # Documentación de la base de datos
├── proxy.ts           # Next.js proxy (auth refresh middleware)
├── CLAUDE.md          # Instrucciones para Claude Code
└── nexo-app.md        # Documento de especificación completa
```

## Comandos Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Build para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
```

## Agregar Componentes shadcn/ui

```bash
npx shadcn@latest add <component-name>
```

Los componentes se instalan en `components/ui/` usando el estilo "new-york" con iconos lucide-react.

## Roadmap de Desarrollo

### ✅ Fase 1: Setup (Completado)
- [x] Configuración de Next.js + Supabase
- [x] Modelo de datos multi-tenant
- [x] Row Level Security policies
- [x] Clientes de Supabase para Next.js

### 🚧 Fase 2: MVP Core (En Progreso)
- [ ] Sistema de autenticación
- [ ] Onboarding por tipo de industria
- [ ] CRUD de productos (con/sin variantes)
- [ ] CRUD de clientes
- [ ] Gestión de pedidos/ventas
- [ ] Landing pública con catálogo

### 📋 Fase 3: Agente Conversacional
- [ ] Integración con LLM
- [ ] Bot de Telegram
- [ ] Clasificador de intenciones
- [ ] Carga de pedidos por chat
- [ ] Consultas por chat

### 📋 Fase 4: Automatización
- [ ] Resúmenes automáticos
- [ ] Alertas de stock bajo
- [ ] Recordatorios de deuda
- [ ] Detección de anomalías
- [ ] Gestión de entregas

## Arquitectura Multi-Tenant

Nexo usa una arquitectura multi-tenant donde:

- Todos los datos están particionados por `business_id`
- Row Level Security (RLS) garantiza aislamiento total de datos
- Cada usuario pertenece a un negocio
- Los usuarios solo pueden acceder a datos de su negocio

### Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **owner** | Acceso completo a todo |
| **seller** | Gestión de clientes, pedidos y cobros |
| **warehouse** | Gestión de stock y productos |
| **driver** | Solo sus entregas asignadas |

## Módulos por Industria

Cada negocio activa los módulos que necesita:

### Distribuidora
- Stock (sin variantes, con proyecciones)
- Pedidos recurrentes
- Precios escalonados
- Entregas con rutas propias
- Cuenta corriente

### Retail / Tienda
- Stock con variantes (talla, color)
- Ventas
- Cuenta corriente
- Sin entregas (retiro en local)

### Almacén / Kiosco
- Stock simple
- Ventas rápidas
- Cuenta corriente básica

## Documentación

- Ver [`nexo-app.md`](./nexo-app.md) para la especificación completa del sistema
- Ver [`supabase/README.md`](./supabase/README.md) para la documentación de la base de datos
- Ver [`CLAUDE.md`](./CLAUDE.md) para instrucciones de desarrollo

## Contribuir

Este es un proyecto en desarrollo activo. Ver el roadmap arriba para conocer las prioridades actuales.

## Licencia

Privado - Todos los derechos reservados

---

**Nexo** - El futuro son los agentes.
