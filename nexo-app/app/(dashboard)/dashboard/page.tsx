import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Users, ShoppingCart, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get user data
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*, business:businesses(*)')
    .eq('id', user.id)
    .single<{ business_id: string; business: any; name: string }>()

  // Get basic metrics (these will return 0 for now as there's no data yet)
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', userData?.business_id || '')

  const { count: customersCount } = await supabase
    .from('customers')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', userData?.business_id || '')

  const { count: ordersCount } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', userData?.business_id || '')

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Bienvenido, {userData?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Aquí está un resumen de {userData?.business?.name}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Productos"
          value={productsCount || 0}
          description="En tu catálogo"
          icon={Package}
          trend={null}
          color="text-blue-500"
          bgColor="bg-blue-500/10"
        />
        <MetricCard
          title="Clientes"
          value={customersCount || 0}
          description="Clientes activos"
          icon={Users}
          trend={null}
          color="text-green-500"
          bgColor="bg-green-500/10"
        />
        <MetricCard
          title="Pedidos"
          value={ordersCount || 0}
          description="Este mes"
          icon={ShoppingCart}
          trend={null}
          color="text-purple-500"
          bgColor="bg-purple-500/10"
        />
        <MetricCard
          title="Facturación"
          value="$0"
          description="Este mes"
          icon={DollarSign}
          trend={null}
          color="text-orange-500"
          bgColor="bg-orange-500/10"
        />
      </div>

      {/* Getting Started Section */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">Comienza a usar Nexo</CardTitle>
              <CardDescription className="text-base">
                Para aprovechar al máximo Nexo, te recomendamos completar estos pasos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <GettingStartedItem
              title="Agregar productos"
              description="Crea tu catálogo de productos con precios y stock"
              completed={false}
              href="/dashboard/products"
            />
            <GettingStartedItem
              title="Agregar clientes"
              description="Registra a tus clientes para gestionar pedidos y cobros"
              completed={false}
              href="/dashboard/customers"
            />
            <GettingStartedItem
              title="Crear tu primer pedido"
              description="Comienza a gestionar ventas y pedidos"
              completed={false}
              href="/dashboard/orders"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Productos más vendidos</CardTitle>
            <CardDescription>Próximamente</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Alertas de stock</CardTitle>
            <CardDescription>Próximamente</CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">Cobros pendientes</CardTitle>
            <CardDescription>Próximamente</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color,
  bgColor,
}: {
  title: string
  value: string | number
  description: string
  icon: any
  trend: { value: number; isPositive: boolean } | null
  color: string
  bgColor: string
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`h-8 w-8 rounded-lg ${bgColor} flex items-center justify-center`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <p className="text-3xl font-bold">{value}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">{description}</p>
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {trend.isPositive ? '+' : ''}
                {trend.value}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function GettingStartedItem({
  title,
  description,
  completed,
  href,
}: {
  title: string
  description: string
  completed: boolean
  href: string
}) {
  return (
    <a
      href={href}
      className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
    >
      <div
        className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
          completed ? 'bg-primary border-primary' : 'border-muted-foreground/30'
        }`}
      >
        {completed && (
          <svg
            className="h-4 w-4 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium mb-1 group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </a>
  )
}
