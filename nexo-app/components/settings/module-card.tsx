'use client'

import { useState, useTransition } from 'react'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toggleModuleAction } from '@/actions/modules'
import { toast } from 'sonner'
import { Lock, Sparkles, Link2 } from 'lucide-react'
import type { ModuleMetadata, ModuleTier } from '@/types/modules.types'
import { MODULES } from '@/lib/modules'

type ModuleCardProps = {
  module: ModuleMetadata
  enabled: boolean
  onToggle?: (enabled: boolean) => void
}

const tierConfig: Record<ModuleTier, { label: string; color: string; bgColor: string }> = {
  core: { label: 'Core', color: 'text-slate-600', bgColor: 'bg-slate-100' },
  free: { label: 'Free', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  pro: { label: 'Pro', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  business: { label: 'Business', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  enterprise: { label: 'Enterprise', color: 'text-amber-600', bgColor: 'bg-amber-50' },
}

export function ModuleCard({ module, enabled, onToggle }: ModuleCardProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticEnabled, setOptimisticEnabled] = useState(enabled)
  const Icon = module.icon
  const tier = tierConfig[module.tier]
  const isCore = module.tier === 'core'
  const isPremium = ['pro', 'business', 'enterprise'].includes(module.tier)

  const handleToggle = (checked: boolean) => {
    if (isCore) return

    setOptimisticEnabled(checked)

    startTransition(async () => {
      const result = await toggleModuleAction(module.id, checked)

      if (!result.success) {
        setOptimisticEnabled(!checked) // Revert on error
        toast.error(result.error || 'Error al actualizar módulo')
      } else {
        toast.success(checked ? 'Módulo activado' : 'Módulo desactivado')
        onToggle?.(checked)
      }
    })
  }

  // Get dependency names
  const dependencyNames = module.dependencies?.map(depId => MODULES[depId]?.name).filter(Boolean)

  return (
    <div
      className={cn(
        'group relative rounded-xl border p-5 transition-all duration-300',
        optimisticEnabled
          ? 'border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-transparent shadow-sm'
          : 'border-border bg-card hover:border-border/80',
        isPending && 'opacity-70 pointer-events-none',
        isCore && 'bg-muted/30'
      )}
    >
      {/* Tier Badge - Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {module.badge && (
          <Badge variant="secondary" className="text-[10px] px-2 py-0 h-5 bg-primary/10 text-primary border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            {module.badge}
          </Badge>
        )}
        {isPremium && (
          <Badge
            variant="outline"
            className={cn('text-[10px] px-2 py-0 h-5 border-0', tier.bgColor, tier.color)}
          >
            {tier.label}
          </Badge>
        )}
      </div>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className={cn(
            'h-11 w-11 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300',
            optimisticEnabled
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'font-semibold transition-colors',
              optimisticEnabled ? 'text-foreground' : 'text-muted-foreground'
            )}>
              {module.name}
            </h3>
            {isCore && (
              <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {module.description}
          </p>

          {/* Dependencies */}
          {dependencyNames && dependencyNames.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/70">
              <Link2 className="h-3 w-3" />
              <span>Requiere: {dependencyNames.join(', ')}</span>
            </div>
          )}
        </div>

        {/* Toggle */}
        <div className="shrink-0 pt-1">
          {isCore ? (
            <div className="h-6 px-3 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center">
              Siempre activo
            </div>
          ) : (
            <Switch
              checked={optimisticEnabled}
              onCheckedChange={handleToggle}
              disabled={isPending}
              className="data-[state=checked]:bg-primary"
            />
          )}
        </div>
      </div>
    </div>
  )
}
