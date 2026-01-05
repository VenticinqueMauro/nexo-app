'use client'

import { useState, useActionState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { completeOnboardingAction, type ActionState } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { INDUSTRIES } from '@/lib/industries'
import type { IndustryType } from '@/types/app.types'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryType | null>(null)
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    completeOnboardingAction,
    null
  )

  useEffect(() => {
    if (state?.error) {
      toast.error('Error al completar el onboarding', {
        description: state.error,
      })
    }
  }, [state])

  const selectedIndustryData = INDUSTRIES.find((i) => i.id === selectedIndustry)

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2 mb-3">
          <div
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              step >= 1 ? 'bg-primary' : 'bg-muted'
            )}
          />
          <div
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-300',
              step >= 2 ? 'bg-primary' : 'bg-muted'
            )}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          Paso {step} de 2
        </p>
      </div>

      {/* Step 1: Industry Selection */}
      {step === 1 && (
        <div className="space-y-8 animate-slide-up">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">
              ¿Qué tipo de negocio tienes?
            </h1>
            <p className="text-muted-foreground text-lg">
              Selecciona la industria que mejor describe tu negocio.
              Configuraremos Nexo para adaptarse a tus necesidades.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {INDUSTRIES.map((industry, index) => {
              const Icon = industry.icon
              const isSelected = selectedIndustry === industry.id
              return (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={cn(
                    'relative p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 animate-scale-in opacity-0',
                    isSelected
                      ? `${industry.borderColor} ${industry.bgColor}`
                      : 'border-border hover:border-primary/50 bg-card'
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle2 className={cn('h-6 w-6', industry.color)} />
                    </div>
                  )}
                  <div className="space-y-3">
                    <div
                      className={cn(
                        'h-12 w-12 rounded-lg flex items-center justify-center',
                        industry.bgColor
                      )}
                    >
                      <Icon className={cn('h-6 w-6', industry.color)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {industry.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {industry.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          <Button
            onClick={() => setStep(2)}
            disabled={!selectedIndustry}
            className="w-full h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.02] disabled:scale-100"
          >
            Continuar
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Step 2: Business Configuration */}
      {step === 2 && (
        <div className="space-y-8 animate-slide-up">
          <div className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(1)}
              className="mb-2 -ml-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <h1 className="text-4xl font-bold tracking-tight">
              Configura tu negocio
            </h1>
            <p className="text-muted-foreground text-lg">
              Cuéntanos un poco más sobre tu{' '}
              <span className="font-semibold text-foreground">
                {selectedIndustryData?.name}
              </span>
            </p>
          </div>

          {/* Selected industry badge */}
          {selectedIndustryData && (
            <div
              className={cn(
                'inline-flex items-center gap-3 px-4 py-3 rounded-lg',
                selectedIndustryData.bgColor
              )}
            >
              <selectedIndustryData.icon
                className={cn('h-5 w-5', selectedIndustryData.color)}
              />
              <span className="font-medium">{selectedIndustryData.name}</span>
            </div>
          )}

          {/* Business Form */}
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="industry" value={selectedIndustry || ''} />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium">
                  Nombre del negocio <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="businessName"
                  name="businessName"
                  type="text"
                  placeholder="Ej: Distribuidora El Sol"
                  required
                  className="h-11 transition-all duration-200 focus:scale-[1.01]"
                />
                <p className="text-xs text-muted-foreground">
                  El nombre de tu negocio tal como aparecerá en Nexo
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Teléfono <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+54 9 11 1234-5678"
                  className="h-11 transition-all duration-200 focus:scale-[1.01]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Dirección <span className="text-muted-foreground">(opcional)</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="Calle 123, Ciudad"
                  className="h-11 transition-all duration-200 focus:scale-[1.01]"
                />
              </div>
            </div>

            <SubmitButton />
          </form>
        </div>
      )}
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      className="w-full h-12 text-base font-semibold transition-all duration-200 hover:scale-[1.02] disabled:scale-100"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Completando configuración...
        </>
      ) : (
        <>
          Completar configuración
          <ArrowRight className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  )
}
