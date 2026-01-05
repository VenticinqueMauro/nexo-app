'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { loginAction, type ActionState } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    loginAction,
    null
  )

  useEffect(() => {
    if (state?.error) {
      toast.error('Error al iniciar sesión', {
        description: state.error,
      })
    }
  }, [state])

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Bienvenido de nuevo
        </h1>
        <p className="text-muted-foreground text-lg">
          Inicia sesión para continuar con tu negocio
        </p>
      </div>

      {/* Login Form */}
      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@email.com"
              required
              autoComplete="email"
              className="h-11 transition-all duration-200 focus:scale-[1.01]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <PasswordInput
              id="password"
              name="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="h-11 transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
        </div>

        <SubmitButton />
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-3 text-muted-foreground">
            ¿Nuevo en Nexo?
          </span>
        </div>
      </div>

      {/* Sign up link */}
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Crea una cuenta y empieza a gestionar tu negocio de forma inteligente
        </p>
        <Link href="/signup">
          <Button
            variant="outline"
            className="w-full h-11 group transition-all duration-200 hover:scale-[1.02]"
            type="button"
          >
            Crear cuenta
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
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
          Iniciando sesión...
        </>
      ) : (
        <>
          Iniciar sesión
          <ArrowRight className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  )
}
