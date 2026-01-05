# CLAUDE.md

Instrucciones para Claude Code al trabajar en este repositorio.

---

## 📖 Contexto del Proyecto

### ¿Qué es Nexo?

**Nexo** es un sistema inteligente de gestión comercial multi-industria. Es un asistente conversacional que gestiona negocios de forma autónoma (distribuidoras, retail, almacenes, servicios).

**Documentos importantes:**
- **`nexo-app.md`** - Especificación completa del sistema (1100+ líneas)
  - Visión del producto
  - Arquitectura multi-industria
  - Modelo de datos
  - Roadmap completo
  - **LEER ESTE ARCHIVO PRIMERO** si no conoces el proyecto

- **`PROGRESS.md`** - Registro de progreso del desarrollo
  - Qué se ha completado
  - Qué está en progreso
  - Próximos pasos
  - Issues conocidos y resueltos
  - Decisiones técnicas importantes
  - **CONSULTAR AL INICIO DE CADA SESIÓN**

- **`README.md`** - Documentación de setup e instalación

---

## 🔄 Flujo de Trabajo (IMPORTANTE)

### Al Iniciar una Nueva Sesión

1. **Leer `PROGRESS.md`** para entender:
   - ✅ Qué está completado
   - 🚧 Qué está en progreso
   - 📋 Qué sigue en el roadmap

2. **Revisar el último commit** para ver el contexto:
   ```bash
   git log --oneline -5
   git show HEAD
   ```

3. **Consultar con el usuario** qué quiere hacer:
   - Continuar con lo que estaba en progreso
   - Empezar una nueva tarea del roadmap
   - Resolver un issue
   - Explorar/refactorizar

### Durante el Desarrollo

1. **Usar TodoWrite** para trackear tareas en progreso
2. **Consultar `nexo-app.md`** para decisiones de arquitectura
3. **Mantener coherencia** con el código existente
4. **NO sobre-diseñar** - solo lo que se pide

### Al Completar una Tarea

1. **Actualizar `PROGRESS.md`**:
   - Mover item de "Próximos Pasos" a "Completado"
   - Agregar fecha de sesión si es nueva
   - Documentar decisiones técnicas importantes
   - Agregar issues encontrados y soluciones

2. **Hacer commit con mensaje descriptivo**:
   ```bash
   git add .
   git commit -m "feat: descripción del cambio"
   ```

3. **Pushear al repo** si el usuario lo solicita

4. **Actualizar este archivo (CLAUDE.md)** si hay nuevas convenciones

---

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (new-york style)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **TypeScript**: Strict mode

### Patrones Clave

- **Path alias**: `@/*` maps to project root
- **Styling**: `cn()` utility from `lib/utils.ts` para classes
- **Multi-tenant**: Todas las queries filtran por `business_id`
- **RLS**: Row Level Security habilitado en todas las tablas
- **Modular**: Modulos se activan/desactivan por industria
- **Tipos centralizados**: `types/app.types.ts` para Business, User, Config, etc.
- **Constantes**: `lib/config.ts` para VALIDATION, UI breakpoints, industrias
- **Logger**: `lib/logger.ts` en lugar de console.error
- **Industrias**: `lib/industries.ts` para nombres y definiciones

### Estructura de Directorios

```
nexo-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Grupo de rutas de auth
│   ├── (dashboard)/       # Grupo de rutas protegidas
│   ├── layout.tsx         # Layout raiz
│   ├── page.tsx           # Pagina principal
│   └── globals.css        # Estilos globales
├── components/            # Componentes React
│   ├── dashboard/        # Componentes del dashboard
│   └── ui/               # shadcn/ui components
├── lib/                  # Utilidades y configuraciones
│   ├── supabase/        # Clientes de Supabase
│   ├── config.ts        # Constantes (VALIDATION, UI, industrias)
│   ├── industries.ts    # Definiciones de industrias
│   ├── logger.ts        # Sistema de logging
│   └── utils.ts         # Utilidades (cn, etc.)
├── types/               # TypeScript types
│   ├── app.types.ts     # Tipos de la app (Business, User, etc.)
│   └── database.types.ts # Tipos de Supabase (pendiente generar)
├── hooks/              # Custom React hooks
│   ├── use-mobile.ts   # Hook para detectar mobile
│   └── use-user.tsx    # UserProvider + useUser hook
├── actions/            # Server Actions
├── supabase/           # SQL migrations
└── scripts/            # Scripts de utilidad
```

---

## 🗄️ Base de Datos (Supabase)

### Conexión

Ver `lib/supabase/`:
- `client.ts` - Para Client Components
- `server.ts` - Para Server Components/Actions
- `middleware.ts` - Para proxy

### Modelo de Datos

**12 tablas principales** (ver `supabase/schema.sql`):

1. `businesses` - Multi-tenant root
2. `users` - Usuarios con roles
3. `products` - Productos (con/sin variantes)
4. `product_variants` - Variantes (talla, color)
5. `tiered_prices` - Precios escalonados
6. `customers` - Clientes
7. `orders` - Pedidos/Ventas
8. `order_items` - Items de pedidos
9. `payments` - Pagos
10. `stock_movements` - Movimientos de stock
11. `deliveries` - Entregas
12. `notifications` - Notificaciones

### Row Level Security (RLS)

- **TODAS** las tablas tienen RLS habilitado
- Aislamiento total entre `business_id`
- Roles: `owner`, `seller`, `warehouse`, `driver`
- Usar `get_user_business_id()` en policies

### Queries Importantes

```typescript
// Siempre filtrar por business_id del usuario actual
const { data } = await supabase
  .from('products')
  .select('*')
  // RLS hace el filtro automáticamente

// Para insertar, incluir business_id
const { data } = await supabase
  .from('products')
  .insert({
    business_id: user.business_id, // Obtener del usuario
    name: 'Producto',
    // ...
  })
```

---

## 🎨 UI y Componentes

### shadcn/ui

**Agregar componentes:**
```bash
npx shadcn@latest add button
npx shadcn@latest add form input label
npx shadcn@latest add card
```

**Estilo**: "new-york"
**Iconos**: lucide-react

### Tailwind CSS v4

- Configuración en `app/globals.css` con `@theme inline`
- Colores en OKLCH color space
- Variables CSS para theming
- Dark mode via clase `.dark`

**Utilidad cn():**
```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "base-classes",
  condition && "conditional-classes"
)} />
```

---

## 🔐 Autenticación

### Flow de Auth

1. Usuario hace signup/login
2. Supabase Auth crea usuario en `auth.users`
3. App crea registro en `public.users` con `business_id`
4. RLS usa `auth.uid()` para filtrar

### Obtener Usuario

```typescript
// En Server Component
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()

// En Client Component
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const { data: { user } } = await supabase.auth.getUser()
```

### Rutas Protegidas

El proxy (`proxy.ts`) maneja la autenticación automáticamente.

---

## 📝 Convenciones de Código

### TypeScript

- **Strict mode** habilitado
- Tipar todo explícitamente
- Usar tipos generados de Supabase (`Database`)

### Nomenclatura

- **Componentes**: PascalCase (`ProductCard.tsx`)
- **Archivos**: kebab-case (`product-list.tsx`)
- **Funciones**: camelCase (`getProducts()`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_ITEMS`)

### Componentes

```typescript
// Server Component (por defecto)
export default async function ProductsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*')
  return <div>{/* render */}</div>
}

// Client Component
'use client'

export default function ProductForm() {
  const [loading, setLoading] = useState(false)
  // ...
}
```

### Server Actions

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .insert({ /* ... */ })

  if (error) throw error

  revalidatePath('/dashboard/products')
  return data
}
```

---

## 🧪 Testing y Verificación

### Scripts Útiles

```bash
npm run dev           # Dev server
npm run build         # Build de producción
npm run verify-setup  # Verificar conexión a Supabase
```

### Verificar Base de Datos

```bash
npm run verify-setup
```

Esto verifica:
- ✅ Conexión a Supabase
- ✅ Todas las tablas creadas
- ✅ Datos de ejemplo (si existen)

---

## 🚨 Reglas Importantes

### ❌ NO Hacer

1. **NO** commitear `.env.local` (está en .gitignore)
2. **NO** hardcodear credenciales en el código
3. **NO** crear funciones en el schema `auth` de Supabase
4. **NO** sobre-diseñar o agregar features no pedidas
5. **NO** ignorar RLS - siempre está activo
6. **NO** usar `any` en TypeScript sin justificación
7. **NO** hacer queries sin considerar multi-tenancy

### ✅ SÍ Hacer

1. **SÍ** consultar `PROGRESS.md` al iniciar sesión
2. **SÍ** actualizar `PROGRESS.md` al completar tareas
3. **SÍ** usar TodoWrite para trackear tareas
4. **SÍ** hacer commits descriptivos y frecuentes
5. **SÍ** consultar `nexo-app.md` para decisiones de arquitectura
6. **SÍ** seguir los patrones existentes del código
7. **SÍ** preguntar al usuario si hay ambigüedad

---

## 🐛 Troubleshooting

### "Permission denied for schema auth"
- **Solución**: No crear funciones en `auth.*`, usar `public.*`

### "RLS policies blocking query"
- **Solución**: Verificar que el usuario esté autenticado y tenga `business_id`

### "Module not found: Can't resolve '@/...'"
- **Solución**: Verificar que la ruta exista y esté en el tsconfig paths

### Build fails con errores de tipos
- **Solución**: Regenerar tipos de Supabase:
  ```bash
  npx supabase gen types typescript --linked > types/database.types.ts
  ```

---

## 📚 Recursos

### Documentación Interna
- `nexo-app.md` - Especificación completa
- `PROGRESS.md` - Progreso y decisiones
- `supabase/README.md` - Setup de base de datos

### Documentación Externa
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🎯 Principios de Desarrollo

1. **Simple > Complejo** - No over-engineer
2. **Conversacional > Tradicional** - Nexo es un asistente, no un CRUD
3. **Seguro por diseño** - RLS, validaciones, tipos
4. **Multi-tenant first** - Siempre considerar aislamiento
5. **Modular** - Los módulos se activan según industria
6. **Documentado** - Mantener PROGRESS.md actualizado

---

**Ultima actualizacion:** 5 de Enero 2026
**Version:** 1.2.0
