'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, Puzzle, Building2, Bell, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'

const settingsNavItems = [
  {
    title: 'General',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Configuración básica del negocio',
  },
  {
    title: 'Módulos',
    href: '/dashboard/settings/modules',
    icon: Puzzle,
    description: 'Activa o desactiva funcionalidades',
  },
  {
    title: 'Negocio',
    href: '/dashboard/settings/business',
    icon: Building2,
    description: 'Datos de tu empresa',
    disabled: true,
  },
  {
    title: 'Notificaciones',
    href: '/dashboard/settings/notifications',
    icon: Bell,
    description: 'Preferencias de alertas',
    disabled: true,
  },
  {
    title: 'Facturación',
    href: '/dashboard/settings/billing',
    icon: CreditCard,
    description: 'Plan y pagos',
    disabled: true,
  },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Configuración</h1>
        <p className="text-muted-foreground">
          Personaliza Nexo según las necesidades de tu negocio
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <nav className="lg:w-64 shrink-0">
          <div className="space-y-1">
            {settingsNavItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const isDisabled = item.disabled

              if (isDisabled) {
                return (
                  <div
                    key={item.href}
                    className="flex items-start gap-3 px-3 py-3 rounded-lg text-muted-foreground/50 cursor-not-allowed"
                  >
                    <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-sm font-medium block">{item.title}</span>
                      <span className="text-xs opacity-70">Próximamente</span>
                    </div>
                  </div>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-start gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className={cn(
                    'h-5 w-5 mt-0.5 shrink-0 transition-colors',
                    isActive && 'text-primary'
                  )} />
                  <div>
                    <span className="text-sm font-medium block">{item.title}</span>
                    <span className={cn(
                      'text-xs',
                      isActive ? 'text-primary/70' : 'text-muted-foreground/70'
                    )}>
                      {item.description}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Settings Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  )
}
