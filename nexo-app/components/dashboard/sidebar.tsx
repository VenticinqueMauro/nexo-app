'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  CreditCard,
  Settings,
  Zap,
  LogOut,
} from 'lucide-react'
import { logoutAction } from '@/actions/auth'
import { getIndustryName } from '@/lib/industries'
import { isModuleEnabled } from '@/lib/modules'
import type { UserWithBusiness, NavigationItem } from '@/types/app.types'
import type { ModuleId } from '@/types/modules.types'

/**
 * Navigation items configuration
 * Each item optionally has a moduleId that determines visibility
 */
const navigationItems: (NavigationItem & { moduleId?: ModuleId })[] = [
  {
    title: 'Inicio',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
    moduleId: 'dashboard',
  },
  {
    title: 'Productos',
    href: '/dashboard/products',
    icon: Package,
    badge: null,
    moduleId: 'products',
  },
  {
    title: 'Clientes',
    href: '/dashboard/customers',
    icon: Users,
    badge: null,
    moduleId: 'customers',
  },
  {
    title: 'Pedidos',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    badge: null,
    moduleId: 'orders',
  },
  {
    title: 'Entregas',
    href: '/dashboard/deliveries',
    icon: Truck,
    badge: null,
    moduleId: 'deliveries',
  },
  {
    title: 'Cobros',
    href: '/dashboard/billing',
    icon: CreditCard,
    badge: null,
    moduleId: 'payments',
  },
]

export function DashboardSidebar({ user }: { user: UserWithBusiness }) {
  const pathname = usePathname()

  // Filter navigation items based on enabled modules
  const filteredNavigation = navigationItems.filter((item) => {
    if (!item.moduleId) return true
    return isModuleEnabled(user.business, item.moduleId)
  })

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">
              {user.business?.name || 'Nexo'}
            </p>
            <p className="text-xs text-muted-foreground">
              {getIndustryName(user.business?.industry)}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNavigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Configuración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/dashboard/settings'}>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Ajustes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={logoutAction}>
              <SidebarMenuButton type="submit" className="w-full">
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
