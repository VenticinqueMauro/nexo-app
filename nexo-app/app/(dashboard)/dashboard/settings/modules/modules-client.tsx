'use client'

import { useState, useTransition } from 'react'
import { ModuleCard } from '@/components/settings/module-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { resetModulesToDefaultsAction } from '@/actions/modules'
import { toast } from 'sonner'
import {
  RotateCcw,
  Shield,
  Zap,
  Crown,
  Building2,
  Gem,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ModuleTier, ModuleMetadata } from '@/types/modules.types'
import type { IndustryType } from '@/types/app.types'
import { getIndustryName } from '@/lib/industries'

type ModuleWithEnabled = ModuleMetadata & { enabled: boolean }

type ModuleGroup = {
  tier: ModuleTier
  modules: ModuleWithEnabled[]
}

type ModulesPageClientProps = {
  modulesByTier: ModuleGroup[]
  businessIndustry: IndustryType
}

const tierInfo: Record<ModuleTier, {
  title: string
  description: string
  icon: React.ElementType
  gradient: string
  iconColor: string
}> = {
  core: {
    title: 'Módulos Esenciales',
    description: 'Funcionalidades base que siempre están activas',
    icon: Shield,
    gradient: 'from-slate-500/10 to-transparent',
    iconColor: 'text-slate-500',
  },
  free: {
    title: 'Plan Gratuito',
    description: 'Incluidos en tu plan actual',
    icon: Zap,
    gradient: 'from-emerald-500/10 to-transparent',
    iconColor: 'text-emerald-500',
  },
  pro: {
    title: 'Plan Pro',
    description: 'Funcionalidades avanzadas para crecer',
    icon: Crown,
    gradient: 'from-blue-500/10 to-transparent',
    iconColor: 'text-blue-500',
  },
  business: {
    title: 'Plan Business',
    description: 'Herramientas de IA y automatización',
    icon: Building2,
    gradient: 'from-purple-500/10 to-transparent',
    iconColor: 'text-purple-500',
  },
  enterprise: {
    title: 'Plan Enterprise',
    description: 'Para grandes operaciones',
    icon: Gem,
    gradient: 'from-amber-500/10 to-transparent',
    iconColor: 'text-amber-500',
  },
}

export function ModulesPageClient({ modulesByTier, businessIndustry }: ModulesPageClientProps) {
  const [isPending, startTransition] = useTransition()

  const handleResetToDefaults = () => {
    startTransition(async () => {
      const result = await resetModulesToDefaultsAction()

      if (result.success) {
        toast.success('Módulos restablecidos a valores por defecto')
        // Force a page refresh to get updated data
        window.location.reload()
      } else {
        toast.error(result.error || 'Error al restablecer módulos')
      }
    })
  }

  // Count enabled modules (excluding core)
  const enabledCount = modulesByTier
    .filter(g => g.tier !== 'core')
    .reduce((acc, group) => acc + group.modules.filter(m => m.enabled).length, 0)

  const totalToggleable = modulesByTier
    .filter(g => g.tier !== 'core')
    .reduce((acc, group) => acc + group.modules.length, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Módulos</h2>
          <p className="text-muted-foreground">
            Activa o desactiva funcionalidades según tus necesidades
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetToDefaults}
          disabled={isPending}
          className="shrink-0"
        >
          <RotateCcw className={cn('h-4 w-4 mr-2', isPending && 'animate-spin')} />
          Restablecer
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-6 p-4 rounded-xl bg-muted/50 border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold">{enabledCount}/{totalToggleable}</p>
            <p className="text-xs text-muted-foreground">Módulos activos</p>
          </div>
        </div>

        <div className="h-10 w-px bg-border" />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="h-4 w-4" />
          <span>
            Configuración para <strong className="text-foreground">{getIndustryName(businessIndustry)}</strong>
          </span>
        </div>

        <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-0">
          Modo Desarrollo
        </Badge>
      </div>

      {/* Module Groups */}
      <div className="space-y-10">
        {modulesByTier.map(({ tier, modules }, groupIndex) => {
          const info = tierInfo[tier]
          const Icon = info.icon

          return (
            <section
              key={tier}
              className="animate-slide-up"
              style={{ animationDelay: `${groupIndex * 100}ms` }}
            >
              {/* Tier Header */}
              <div className={cn(
                'flex items-center gap-4 mb-5 pb-4 border-b',
                'bg-gradient-to-r rounded-t-lg -mx-1 px-1',
                info.gradient
              )}>
                <div className={cn(
                  'h-10 w-10 rounded-lg flex items-center justify-center',
                  tier === 'core' ? 'bg-slate-100' : 'bg-white shadow-sm'
                )}>
                  <Icon className={cn('h-5 w-5', info.iconColor)} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{info.title}</h3>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {modules.filter(m => m.enabled).length} de {modules.length}
                </Badge>
              </div>

              {/* Module Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="animate-scale-in opacity-0"
                    style={{
                      animationDelay: `${(groupIndex * 100) + (index * 50) + 100}ms`,
                      animationFillMode: 'forwards',
                    }}
                  >
                    <ModuleCard
                      module={module}
                      enabled={module.enabled}
                    />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-12 p-6 rounded-xl border border-dashed border-primary/30 bg-primary/5">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">Modo Desarrollo Activo</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Todos los módulos están disponibles sin restricciones de plan.
              En producción, los módulos Pro, Business y Enterprise requerirán
              una suscripción activa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
