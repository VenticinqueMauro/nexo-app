# Nexo

## Sistema inteligente de gestión comercial multi-industria

---

## 1. Visión General

### ¿Qué es Nexo?

Nexo es un asistente inteligente que gestiona negocios comerciales de forma autónoma. No es un panel de control tradicional donde el usuario debe buscar, clickear y cargar datos manualmente. Es un sistema que **trabaja solo**, entiende el negocio, anticipa problemas y ejecuta tareas con mínima intervención humana.

El nombre **Nexo** representa la conexión entre todas las partes del negocio: stock, clientes, pedidos, entregas y cobros, unificados en un solo punto de control inteligente.

### Filosofía Central

> "Si la app no hace el trabajo por el usuario, es una app del pasado."

El usuario **conversa** con Nexo como lo haría con un empleado de confianza. Nexo entiende, actúa y reporta. El dueño del negocio toma decisiones, no carga planillas.

### Diseño Multi-Industria

Nexo está diseñado desde su arquitectura para adaptarse a **múltiples tipos de negocio**:

| Industria | Ejemplo | Módulos Principales |
|-----------|---------|---------------------|
| **Distribuidora** | Bebidas, alimentos mayoristas | Stock, Pedidos recurrentes, Entregas con rutas, Cobros |
| **Retail** | Tienda de ropa, accesorios | Stock con variantes (talla/color), Ventas, Cobros |
| **Almacén/Kiosco** | Comercio de barrio | Stock, Ventas rápidas, Proveedores |
| **Servicios** | Lavandería, taller | Clientes, Órdenes de trabajo, Cobros |

Cada negocio activa los módulos que necesita. La experiencia se adapta automáticamente.

### ¿Para quién es?

- Comercios que manejan stock, clientes y cobranzas
- Dueños y empleados con poca experiencia tecnológica
- Equipos pequeños que necesitan hacer mucho con poco
- Negocios que quieren profesionalizarse sin complejidad

---

## 2. Principios de Diseño

### 2.1 Conversacional primero

Toda interacción puede hacerse hablando o escribiendo. El usuario no necesita navegar menús ni aprender una interfaz. Dice lo que necesita, Nexo lo resuelve.

**Ejemplos por industria:**

| Distribuidora | Tienda de Ropa |
|---------------|----------------|
| "¿Cómo estamos de Coca?" | "¿Tenemos la remera azul en M?" |
| "Cargame el pedido de Juan, lo de siempre" | "Vendí 2 jeans talle 40" |
| "¿Quién me debe plata?" | "¿Quién me debe plata?" |
| "Armá la ruta de mañana" | "¿Qué llegó del proveedor?" |

### 2.2 Proactivo, no reactivo

Nexo no espera que le pregunten. Detecta situaciones y actúa:

- Avisa que el stock está bajo **antes** de que se agote
- Recuerda cobrar deudas vencidas **sin que nadie lo pida**
- Sugiere acciones basadas en patrones del negocio
- Detecta anomalías (cliente que dejó de comprar, producto que no rota)

### 2.3 Simple pero potente

- Interfaz minimalista con botones grandes
- Máximo 3 toques para cualquier acción manual
- Sin jerga técnica ni menús complejos
- Funciona perfecto en celulares básicos

### 2.4 Confirmación antes de ejecución

Nexo **siempre pide confirmación** antes de ejecutar acciones que afectan el negocio:

- "Pedido armado: 10 Coca, 5 Sprite. Total $45.000. **¿Confirmo?**"
- "Voy a enviar recordatorio de deuda a 3 clientes. **¿Dale?**"

El usuario mantiene el control. Nexo es un asistente, no un piloto automático sin supervisión.

### 2.5 Transparente

El usuario siempre puede ver qué hizo Nexo y por qué:

- Historial de acciones
- Explicación de sugerencias
- Datos en los que se basó cada decisión

---

## 3. Arquitectura de Módulos

### Diseño Modular Configurable

Cada negocio tiene una **configuración de módulos** que define qué funcionalidades están activas:

```
┌─────────────────────────────────────────────────────────────┐
│                    CONFIGURACIÓN DE NEGOCIO                 │
├─────────────────────────────────────────────────────────────┤
│  industry: "distributor" | "retail" | "grocery" | "service" │
│                                                             │
│  modules: {                                                 │
│    stock: {                                                 │
│      enabled: true,                                         │
│      variants: false,        // true para ropa              │
│      projections: true       // días de stock restantes     │
│    },                                                       │
│    orders: {                                                │
│      enabled: true,                                         │
│      recurring: true,        // "lo de siempre"             │
│      tiered_pricing: true    // precios por cantidad        │
│    },                                                       │
│    deliveries: {                                            │
│      enabled: true,                                         │
│      type: "own_routes"      // o "third_party", "pickup"   │
│    },                                                       │
│    billing: {                                               │
│      enabled: true,                                         │
│      current_account: true,  // cuenta corriente            │
│      auto_reminders: true    // recordatorios automáticos   │
│    }                                                        │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

### Perfiles Pre-configurados

#### Distribuidora (Configuración completa)
```yaml
industry: distributor
modules:
  stock: { enabled: true, variants: false, projections: true }
  orders: { enabled: true, recurring: true, tiered_pricing: true }
  deliveries: { enabled: true, type: "own_routes" }
  billing: { enabled: true, current_account: true, auto_reminders: true }
```

#### Retail / Tienda de Ropa
```yaml
industry: retail
modules:
  stock: { enabled: true, variants: true, projections: false }
  orders: { enabled: true, recurring: false, tiered_pricing: false }
  deliveries: { enabled: false }
  billing: { enabled: true, current_account: true, auto_reminders: true }
```

#### Almacén / Kiosco
```yaml
industry: grocery
modules:
  stock: { enabled: true, variants: false, projections: true }
  orders: { enabled: false }
  deliveries: { enabled: false }
  billing: { enabled: true, current_account: true, auto_reminders: false }
```

---

## 4. Módulos Funcionales

### 4.1 Gestión de Stock

#### Funcionalidades Base (Todos los negocios)

- Catálogo de productos con categorías
- Control de inventario en tiempo real
- Alertas de stock bajo configurables
- Registro de entradas de mercadería
- Historial de movimientos

#### Funcionalidades Extendidas

| Función | Descripción | Activación |
|---------|-------------|------------|
| **Variantes** | Productos con talla, color, etc. | `variants: true` |
| **Proyección de días** | "Te quedan 12 para 2 días" | `projections: true` |
| **Stock mínimo inteligente** | Aprende del historial de ventas | Automático |

#### Interacciones por industria

**Distribuidora:**
```
Usuario: "¿Cómo estamos de stock?"
Nexo: "En general bien. Atención con Sprite 2.25, te quedan 12 packs, 
       alcanza para 2 días. ¿Querés que arme un pedido al proveedor?"

Usuario: "Entraron 200 packs de Coca"
Nexo: "Registrado. Stock de Coca 2.25L actualizado: 245 packs."
```

**Tienda de Ropa:**
```
Usuario: "¿Hay stock de la remera negra básica?"
Nexo: "Remera Negra Básica:
       - Talle S: 3 unidades
       - Talle M: 0 ⚠️ Sin stock
       - Talle L: 5 unidades
       - Talle XL: 2 unidades
       ¿Querés que avise cuando llegue talle M?"

Usuario: "Llegaron las remeras del pedido 45"
Nexo: "¿Cuántas por talle? Decime 'S:10, M:15, L:10' o similar."
```

---

### 4.2 Gestión de Clientes

#### Funcionalidades Base (Todos los negocios)

- Base de clientes con datos de contacto
- Historial de compras por cliente
- Notas y contexto relevante
- Clasificación por volumen de compra

#### Funcionalidades Extendidas

| Función | Descripción | Activación |
|---------|-------------|------------|
| **Pedido habitual** | Recuerda "lo de siempre" | `orders.recurring: true` |
| **Comportamiento de pago** | Clasifica por puntualidad | Automático |
| **Detección de inactividad** | Alerta clientes que dejaron de comprar | Automático |

#### Interacciones

```
Usuario: "¿Qué onda con el kiosco de la esquina?"
Nexo: "Kiosco López. Compra cada martes, promedio $35.000.
       Última compra hace 12 días. Paga siempre a 7 días.
       ¿Lo contacto para ver si necesita algo?"

Usuario: "Agregá un cliente nuevo, Almacén Don Pedro, 
          está en Av. Mitre 450"
Nexo: "Listo. ¿Tenés el teléfono? Así le puedo avisar 
       cuando tenga pedidos listos."
```

---

### 4.3 Gestión de Pedidos/Ventas

#### Funcionalidades Base

- Carga rápida de pedidos/ventas
- Cálculo automático de totales
- Descuento automático de stock
- Historial completo

#### Funcionalidades Extendidas

| Función | Descripción | Activación |
|---------|-------------|------------|
| **Pedidos recurrentes** | "Lo de siempre" | `orders.recurring: true` |
| **Precios escalonados** | Descuento por cantidad | `orders.tiered_pricing: true` |
| **Detección de anomalías** | "Juan nunca pidió más de 20" | Automático |

#### Interacciones por industria

**Distribuidora:**
```
Usuario: "Pedido de Almacén Pérez, lo de siempre"
Nexo: "Lo de siempre de Pérez: 20 Coca 2.25, 10 Sprite 2.25, 
       10 Fanta 2.25. Total $89.000. ¿Confirmo?"
Usuario: "Dale"
Nexo: "Pedido #234 confirmado. Stock actualizado. 
       ¿Para cuándo es la entrega?"
```

**Tienda de Ropa:**
```
Usuario: "Vendí remera negra M y jean azul 42"
Nexo: "Venta registrada:
       - Remera Negra Básica M: $15.000
       - Jean Clásico Azul 42: $35.000
       Total: $50.000. Stock actualizado.
       ¿Forma de pago?"
```

---

### 4.4 Gestión de Entregas

> ⚠️ **Módulo opcional** - Solo para negocios con logística propia

#### Funcionalidades

- Programación de entregas por fecha
- Armado de rutas optimizadas por zona
- Asignación a repartidores
- Notificaciones a clientes
- Seguimiento de estado

#### Tipos de entrega soportados

| Tipo | Descripción | Uso típico |
|------|-------------|------------|
| `own_routes` | Rutas propias con repartidores | Distribuidoras |
| `third_party` | Envío por correo/moto | E-commerce |
| `pickup` | Retiro en local | Retail |

#### Interacciones

```
Usuario: "¿Qué tenemos para mañana?"
Nexo: "12 entregas programadas. Te armé una ruta empezando 
       por zona norte, después centro, después sur. 
       Tiempo estimado: 4 horas. ¿La mando a los repartidores?"

[Al repartidor]
Nexo: "🚚 Tu ruta de hoy: 8 paradas. Primera: Kiosco López, 
       Av. Mitre 450. Pedido: 2 bultos. 
       [Ver mapa] [Marcar entregado]"
```

---

### 4.5 Gestión de Cobros y Cuenta Corriente

#### Funcionalidades Base

- Registro de pagos
- Estado de deuda por cliente
- Múltiples métodos de pago

#### Funcionalidades Extendidas

| Función | Descripción | Activación |
|---------|-------------|------------|
| **Cuenta corriente** | Saldo acumulado por cliente | `billing.current_account: true` |
| **Recordatorios automáticos** | Escalonados en tono | `billing.auto_reminders: true` |
| **Clasificación de deuda** | Por antigüedad | Automático |

#### Interacciones

```
Usuario: "¿Quién me debe?"
Nexo: "Deuda total: $280.000
       - Almacén Pérez: $120.000 (vencido hace 20 días) ⚠️
       - Kiosco López: $80.000 (vencido hace 5 días)
       - Don Mario: $80.000 (vence mañana)
       ¿Mandamos recordatorio a los vencidos?"

Usuario: "Pérez me pagó 50 lucas"
Nexo: "Registrado. Deuda de Pérez actualizada: $70.000 pendientes."
```

#### Sistema de recordatorios automáticos

```
[Día 1 de vencimiento - tono suave]
→ Cliente: "Hola, te recordamos que tenés un saldo 
            pendiente de $80.000. ¿Podés pasar a regularizar?"

[Día 15 - tono firme]
→ Cliente: "Tu cuenta tiene un saldo vencido de $80.000 
            hace 15 días. Contactanos para coordinar el pago."

[Día 30 - escalada al dueño]
→ Dueño: "⚠️ Deuda crítica: Almacén X debe $80.000 hace 30 días. 
          No respondió a recordatorios. ¿Dejamos de enviarle? 
          ¿O lo llamás vos?"
```

---

### 4.6 Catálogo y Precios

#### Funcionalidades Base

- Catálogo visual con fotos
- Categorías y subcategorías
- Precios actualizables
- Vista pública para clientes

#### Funcionalidades Extendidas

| Función | Descripción | Activación |
|---------|-------------|------------|
| **Precios escalonados** | Por cantidad | `orders.tiered_pricing: true` |
| **Variantes con precio** | Precio por talle/color | `stock.variants: true` |

#### Interacciones

```
Usuario: "Subí el precio de la Coca a $5.000"
Nexo: "Actualizado. Precio de Coca 2.25L: $5.000 (1-10 packs), 
       $4.500 (11-50), $4.000 (50+). ¿Ajusto los escalonados también?"

Usuario: "Mostrá el catálogo"
Nexo: [Muestra catálogo visual con categorías, fotos, precios]
```

---

### 4.7 Reportes y Análisis

#### Funcionalidades (Todos los negocios)

- Resúmenes diarios automáticos (mañana y noche)
- Detección de anomalías
- Métricas de ventas, stock, cobranza
- Respuestas en lenguaje natural

#### Interacciones

```
[Automático - resumen matutino]
Nexo: "☀️ Buenos días. Tu día:
       - 8 entregas programadas
       - Stock bajo: Sprite (12 packs)
       - Deuda vencida: $180.000 de 3 clientes
       - Ayer facturaste $320.000
       ¿Algo que necesites antes de arrancar?"

Usuario: "¿Cómo venimos este mes?"
Nexo: "Vas $2.8M facturados, 15% arriba del mes pasado.
       Mejor cliente: Almacén Pérez ($450k).
       Producto estrella: Coca 2.25L (340 packs).
       Preocupación: la deuda creció 20%. ¿Querés que apriete 
       un poco con los recordatorios?"
```

---

## 5. Canales de Interacción

### 5.1 App Móvil (PWA)

- Interfaz principal del sistema
- Chat con Nexo
- Visualización de datos (stock, pedidos, entregas)
- Funciona offline para consultas básicas
- Se instala como app sin pasar por stores

### 5.2 Telegram

Canal principal de mensajería por sus ventajas:

**¿Por qué Telegram?**
- API de bots gratuita y sin restricciones
- Sin costos por mensaje (WhatsApp Business API es pago)
- Bots potentes con botones inline, menús, y más
- Grupos y canales para equipos
- Funciona en cualquier dispositivo

**Usos:**
- Mismo asistente, mismo cerebro que la app
- Notificaciones y alertas
- Interacción rápida para usuarios que prefieren no abrir la app
- Bot para clientes (consultar pedidos, ver catálogo)
- Grupos internos (equipo de reparto, depósito)

### 5.3 Web Pública

- Landing page con catálogo
- Clientes pueden ver productos y pedir
- Formulario de contacto/registro
- Información del negocio

### 5.4 Voz (futuro)

- Comandos por voz en la app
- Ideal para el depósito (manos ocupadas)
- "Nexo, entraron 50 Coca"

---

## 6. Roles de Usuario

### 6.1 Dueño / Administrador

**Acceso:** Todo

**Experiencia:**
- Recibe resúmenes diarios automáticos
- Toma decisiones estratégicas
- Aprueba acciones importantes
- Ve métricas y análisis del negocio

### 6.2 Vendedor

**Acceso:** Clientes, pedidos/ventas, catálogo, stock (solo lectura)

**Experiencia:**
- Carga pedidos/ventas rápidamente
- Consulta disponibilidad
- Accede a info de clientes

### 6.3 Depósito

**Acceso:** Stock completo, pedidos pendientes (solo lectura)

**Experiencia:**
- Registra entradas y salidas de mercadería
- Ve qué pedidos hay que preparar
- Reporta roturas o vencimientos

### 6.4 Repartidor (solo si módulo entregas activo)

**Acceso:** Sus entregas del día

**Experiencia:**
- Ve su ruta optimizada
- Navega a cada punto de entrega
- Marca entregas como completadas

### 6.5 Cliente (externo)

**Acceso:** Catálogo, sus pedidos, su cuenta

**Experiencia:**
- Ve catálogo con precios
- Hace pedidos desde la web/Telegram
- Recibe notificaciones de entrega
- Ve su cuenta corriente

---

## 7. Comportamiento del Agente

### 7.1 Personalidad

Nexo es:
- **Confiable:** Hace lo que dice, no inventa datos
- **Proactivo:** Anticipa, no solo reacciona
- **Claro:** Habla simple, sin rodeos
- **Respetuoso:** Pide confirmación, no impone
- **Paciente:** No importa cuántas veces pregunten lo mismo

Nexo no es:
- Robótico ni frío
- Condescendiente ni paternalista
- Lento ni burocrático
- Invasivo ni molesto

### 7.2 Personalidad Configurable por Industria

El agente adapta su vocabulario y ejemplos según la industria:

```typescript
const agentPersonality = {
  distributor: {
    stockTerm: "packs",
    orderTerm: "pedido",
    clientTerm: "cliente",
    exampleProducts: ["Coca 2.25L", "Sprite 1.5L", "cerveza"]
  },
  retail: {
    stockTerm: "unidades",
    orderTerm: "venta",
    clientTerm: "cliente",
    exampleProducts: ["remera", "jean", "zapatillas"]
  },
  grocery: {
    stockTerm: "unidades",
    orderTerm: "venta",
    clientTerm: "cliente",
    exampleProducts: ["galletitas", "leche", "pan"]
  }
}
```

### 7.3 Tono de Comunicación

**Con el dueño:**
Directo, informativo, orientado a decisiones.
"Tenés 3 deudas vencidas. ¿Mando recordatorios?"

**Con vendedores:**
Práctico, rápido, enfocado en la tarea.
"Pedido cargado. ¿Algo más?"

**Con repartidores:**
Súper simple, instrucciones claras.
"Siguiente: Kiosco López, Av. Mitre 450. 2 bultos."

**Con clientes:**
Amable, profesional, servicial.
"Hola, tu pedido está en camino. Llega en ~45 minutos."

### 7.4 Manejo de Errores

Cuando Nexo no entiende:
"No entendí bien. ¿Querés cargar un pedido, consultar stock, o algo más?"

Cuando hay un problema:
"No puedo completar el pedido porque no hay stock de Sprite. ¿Lo cargo sin Sprite o esperamos?"

Cuando el usuario se equivoca:
"Ese cliente no existe. ¿Quisiste decir Almacén Pérez o es uno nuevo?"

### 7.5 Límites Claros

Nexo siempre:
- Pide confirmación antes de acciones que afectan datos
- Muestra de dónde sacó la información
- Admite cuando no sabe algo
- Escala al humano cuando es necesario

Nexo nunca:
- Ejecuta acciones financieras sin confirmación
- Inventa datos que no tiene
- Toma decisiones estratégicas solo
- Contacta clientes sin permiso (la primera vez)

---

## 8. Modelo de Datos

### 8.1 Esquema Base Multi-Industria

```sql
-- Negocio (tenant)
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL, -- 'distributor', 'retail', 'grocery', 'service'
  config JSONB NOT NULL DEFAULT '{}', -- Configuración de módulos
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Productos con variantes opcionales
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  base_price DECIMAL(12,2),
  has_variants BOOLEAN DEFAULT false, -- true para ropa, false para bebidas
  min_stock INTEGER DEFAULT 0,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Variantes de producto (talla, color, etc.)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE,
  attributes JSONB NOT NULL, -- {"talla": "M", "color": "Rojo"}
  price_override DECIMAL(12,2), -- Si difiere del precio base
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- Precios escalonados (opcional)
CREATE TABLE tiered_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  max_quantity INTEGER,
  price DECIMAL(12,2) NOT NULL
);

-- Clientes
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  usual_order JSONB, -- "Lo de siempre"
  payment_behavior TEXT, -- 'excellent', 'good', 'regular', 'bad'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos/Ventas
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  order_number SERIAL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'delivered', 'cancelled'
  delivery_type TEXT, -- 'own_routes', 'third_party', 'pickup', null
  delivery_date DATE,
  total DECIMAL(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items del pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id), -- null si no tiene variantes
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL
);

-- Cuenta corriente / Pagos
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  order_id UUID REFERENCES orders(id),
  amount DECIMAL(12,2) NOT NULL,
  method TEXT, -- 'cash', 'transfer', 'card', 'mercadopago'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Movimientos de stock
CREATE TABLE stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  quantity INTEGER NOT NULL, -- positivo = entrada, negativo = salida
  type TEXT NOT NULL, -- 'purchase', 'sale', 'adjustment', 'loss'
  reference_id UUID, -- order_id si es venta
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Entregas (solo si módulo activo)
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  driver_id UUID REFERENCES users(id),
  route_order INTEGER,
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  completed_at TIMESTAMPTZ,
  notes TEXT
);

-- Usuarios del sistema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL, -- 'owner', 'seller', 'warehouse', 'driver'
  name TEXT NOT NULL,
  phone TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.2 Row Level Security (RLS)

Cada usuario solo accede a datos de su negocio:

```sql
-- Ejemplo: productos
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_isolation ON products
  USING (business_id = current_setting('app.current_business_id')::uuid);
```

---

## 9. Arquitectura del Agente

### 9.1 Flujo de Procesamiento

```
┌─────────────────────────────────────────────────────────────┐
│                    ENTRADA DE MENSAJE                        │
│            (Telegram / App / Web)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               CLASIFICADOR DE INTENCIÓN                      │
│     (Regex + keywords + embeddings si es necesario)         │
│                                                              │
│  Salida: { intent, entities, confidence }                   │
│  Ej: { intent: "stock_query", entities: {producto: "coca"}} │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│   ALTA CONFIANZA     │        │   BAJA CONFIANZA     │
│   (>0.8)             │        │   (<0.8)             │
│                      │        │                      │
│ Ejecutar función     │        │ Llamar LLM para      │
│ directamente         │        │ clarificar           │
└──────────────────────┘        └──────────────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    EJECUTOR DE ACCIONES                      │
│                                                              │
│  - stock_check(producto) → consulta DB                      │
│  - stock_add(producto, cantidad) → update DB                │
│  - order_create(cliente, items) → insert DB                 │
│  - payment_register(cliente, monto) → update DB             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  GENERADOR DE RESPUESTA                      │
│                                                              │
│  - Templates para respuestas comunes (90% de casos)         │
│  - LLM para respuestas complejas/conversacionales           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      RESPUESTA                               │
│              (Telegram / App / Web)                          │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 Herramientas del Agente (Tools)

```typescript
const tools = {
  // STOCK
  stock_check: {
    description: "Consultar stock de un producto",
    params: { producto: "string", variante?: "object" },
    handler: async (params, config) => { /* query DB */ }
  },
  stock_add: {
    description: "Agregar stock (entrada de mercadería)",
    params: { producto: "string", cantidad: "number", variante?: "object" },
    requiresConfirmation: true,
    handler: async (params) => { /* update DB */ }
  },
  stock_low_alert: {
    description: "Obtener productos con stock bajo",
    params: {},
    handler: async () => { /* query DB */ }
  },

  // CLIENTES
  client_search: {
    description: "Buscar cliente por nombre",
    params: { query: "string" },
    handler: async (params) => { /* query DB */ }
  },
  client_info: {
    description: "Obtener info completa de un cliente",
    params: { cliente_id: "string" },
    handler: async (params) => { /* query DB */ }
  },

  // PEDIDOS (condicional según módulo)
  order_create: {
    description: "Crear un pedido",
    params: { cliente_id: "string", items: "array" },
    requiresConfirmation: true,
    enabledIf: (config) => config.modules.orders.enabled,
    handler: async (params) => { /* insert DB, update stock */ }
  },
  order_usual: {
    description: "Obtener pedido habitual de un cliente",
    params: { cliente_id: "string" },
    enabledIf: (config) => config.modules.orders.recurring,
    handler: async (params) => { /* query DB */ }
  },

  // ENTREGAS (condicional según módulo)
  delivery_route: {
    description: "Generar ruta de entregas",
    params: { fecha: "date" },
    enabledIf: (config) => config.modules.deliveries.enabled,
    handler: async (params) => { /* query + optimize */ }
  },

  // COBROS
  debt_check: {
    description: "Ver deudas pendientes",
    params: { cliente_id?: "string" },
    handler: async (params) => { /* query DB */ }
  },
  payment_register: {
    description: "Registrar un pago",
    params: { cliente_id: "string", monto: "number", metodo: "string" },
    requiresConfirmation: true,
    handler: async (params) => { /* insert DB */ }
  },

  // REPORTES
  report_daily: {
    description: "Generar reporte del día",
    params: { fecha?: "date" },
    handler: async (params) => { /* aggregate queries */ }
  }
}
```

### 9.3 Tareas Programadas (Cron Jobs)

| Tarea | Frecuencia | Descripción |
|-------|------------|-------------|
| Resumen matutino | 7:00 AM | Envía resumen del día al dueño |
| Resumen nocturno | 9:00 PM | Envía cierre del día |
| Alertas de stock | Cada 4 horas | Revisa stock bajo |
| Recordatorios de deuda | 10:00 AM | Envía recordatorios a clientes |
| Detección de inactivos | Semanal | Detecta clientes que dejaron de comprar |
| Backup de datos | Diario | Backup incremental |

---

## 10. Stack Tecnológico

| Componente | Tecnología | Razón |
|------------|------------|-------|
| **Frontend** | Next.js 14+ (App Router) | SSR, PWA ready, React ecosystem |
| **Estilos** | Tailwind CSS | Desarrollo rápido, responsive |
| **Base de datos** | Supabase (PostgreSQL) | Auth, Realtime, RLS, gratuito para empezar |
| **Bot Telegram** | grammy.js o Telegraf | Librerías maduras, bien documentadas |
| **Hosting** | Vercel | Deploy simple, integrado con Next.js |
| **LLM** | Arquitectura híbrida | Ver sección 10.1 |

### 10.1 Estrategia de LLM (Costos Optimizados)

**Arquitectura híbrida:**

1. **Clasificador de intención** → Modelo pequeño/gratis (Llama 8B, regex, o embeddings)
   - Detecta: ¿es consulta de stock? ¿pedido? ¿cobro?
   
2. **Ejecución de acción** → Lógica determinística (código)
   - La mayoría de acciones no necesitan LLM
   
3. **Generación de respuesta** → Modelo barato (Gemini Flash, GPT-4o-mini)
   - Solo para respuestas complejas
   - Cachear respuestas comunes

4. **Análisis/resúmenes** → Modelo capaz (Claude Haiku)
   - Se ejecuta 1-2 veces al día

**Estimación de costos:**
- 100 usuarios activos, ~50 interacciones/día promedio
- ~80% resueltas sin LLM potente
- **Costo estimado: $5-20/mes**

---

## 11. Notificaciones y Alertas

### 11.1 Tipos de Notificaciones

**Urgentes (inmediatas):**
- Stock agotado de producto importante
- Deuda muy vencida (30+ días)
- Entrega fallida
- Error en el sistema

**Importantes (mismo día):**
- Stock bajo
- Pedido nuevo de la web
- Deuda recién vencida
- Cliente inactivo detectado

**Informativas (resúmenes):**
- Resumen matutino
- Cierre del día
- Resumen semanal

### 11.2 Canales

- Push en la app (PWA)
- Telegram (canal principal)
- Email (para resúmenes, opcional)

### 11.3 Control del Usuario

El usuario puede:
- Silenciar notificaciones por horario
- Elegir qué alertas recibir por cada canal
- Pausar recordatorios a clientes específicos

---

## 12. Seguridad

- **Auth:** Supabase Auth con Row Level Security
- **Telegram:** Verificar chat_id antes de ejecutar acciones
- **Roles:** Cada usuario solo ve/modifica lo que su rol permite
- **Logs:** Registrar todas las acciones para auditoría
- **Confirmaciones:** Siempre pedir confirmación para acciones destructivas
- **Multi-tenant:** Aislamiento completo de datos entre negocios

---

## 13. Integraciones Futuras

### 13.1 Proveedores
- Pedidos automáticos cuando el stock baja
- Seguimiento de entregas de proveedores

### 13.2 Contabilidad
- Exportación de datos para contador
- Integración con sistemas de facturación (AFIP)

### 13.3 Pagos Digitales
- MercadoPago / Transferencias
- Confirmación automática de pagos

### 13.4 Logística Externa
- Integración con servicios de delivery
- Tracking en tiempo real

---

## 14. Métricas de Éxito

### Para el negocio:
- Reducción de tiempo en tareas administrativas
- Disminución de stockouts
- Mejora en cobranza (días de deuda)
- Aumento de clientes activos

### Para el usuario:
- Tiempo promedio de tarea < 30 segundos
- Tasa de comprensión del agente > 95%
- Satisfacción con respuestas del asistente
- Frecuencia de uso diario

---

## 15. Principios Innegociables

1. **Privacidad:** Los datos del negocio son sagrados. Nunca se comparten entre tenants.

2. **Disponibilidad:** Nexo tiene que funcionar siempre. Offline si es necesario.

3. **Simplicidad:** Si la abuela del dueño no puede usarlo, está mal diseñado.

4. **Honestidad:** Nexo nunca miente ni infla números.

5. **Control humano:** El usuario siempre tiene la última palabra.

6. **Adaptabilidad:** El sistema se adapta al negocio, no al revés.

---

## 16. Roadmap de Desarrollo

### Fase 1: MVP Core (Semanas 1-4)

- [ ] Setup proyecto Next.js + Supabase
- [ ] Modelo de datos multi-tenant
- [ ] Auth y roles básicos
- [ ] Sistema de configuración por industria
- [ ] CRUD de productos (con/sin variantes)
- [ ] CRUD de clientes
- [ ] Carga de pedidos/ventas (manual)
- [ ] Landing pública con catálogo

### Fase 2: Agente Conversacional (Semanas 5-8)

- [ ] Clasificador de intenciones
- [ ] Integración con LLM
- [ ] Carga de pedidos por chat
- [ ] Consultas de stock/clientes/deudas por chat
- [ ] Confirmaciones antes de acciones
- [ ] Bot de Telegram básico

### Fase 3: Automatización (Semanas 9-12)

- [ ] Resúmenes automáticos (mañana/noche)
- [ ] Alertas de stock bajo
- [ ] Recordatorios de deuda
- [ ] Detección de anomalías básica
- [ ] Gestión de entregas (módulo opcional)

### Fase 4: Optimización (Semanas 13-16)

- [ ] PWA con soporte offline
- [ ] Optimización de rutas (si aplica)
- [ ] Reportes avanzados
- [ ] Multi-usuario con roles completos
- [ ] Refinamiento del agente
- [ ] Onboarding por industria

---

## 17. Resumen Ejecutivo

**Nexo** es un asistente inteligente multi-industria que transforma la gestión de comercios. En lugar de paneles complejos y carga manual de datos, ofrece una experiencia conversacional donde el usuario dice lo que necesita y el sistema lo resuelve.

**Diseño Multi-Industria:**
- Arquitectura modular desde el día 1
- Configuración por tipo de negocio
- Misma base, diferentes experiencias

**Diferenciadores clave:**
- Conversacional: se usa hablando, no clickeando
- Proactivo: avisa antes de que haya problemas
- Simple: diseñado para gente que no usa tecnología
- Completo: stock, pedidos, entregas, cobros, todo integrado
- Inteligente: aprende del negocio y mejora con el tiempo
- Económico: arquitectura optimizada para bajo costo de LLM
- Escalable: multi-tenant listo para SaaS

**El futuro son los agentes.** Nexo no es una app que el usuario opera. Es un empleado digital que trabaja 24/7 para que el dueño se enfoque en hacer crecer su negocio.

---

*Documento de especificaciones v2.0*
*Nombre: Nexo*
*Stack: Next.js + Supabase + Telegram + LLM híbrido*
*Arquitectura: Multi-industria, Multi-tenant*
*Última actualización: Enero 2025*