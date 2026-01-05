'use client'

import { useActionState, useEffect } from 'react'
import Link from 'next/link'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { signupAction, type ActionState } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const [state, formAction] = useActionState<ActionState | null, FormData>(
    signupAction,
    null
  )

  useEffect(() => {
    if (state?.error) {
      toast.error('Error al crear la cuenta', {
        description: state.error,
      })
    }
  }, [state])

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Comienza ahora
        </h1>
        <p className="text-muted-foreground text-lg">
          Crea tu cuenta y gestiona tu negocio de forma inteligente
        </p>
      </div>

      {/* Signup Form */}
      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Nombre completo
            </Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Juan Pérez"
              required
              autoComplete="name"
              className="h-11 transition-all duration-200 focus:scale-[1.01]"
            />
          </div>

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
            <Label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </Label>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Mínimo 8 caracteres"
              required
              autoComplete="new-password"
              minLength={8}
              className="h-11 transition-all duration-200 focus:scale-[1.01]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar contraseña
            </Label>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Repite tu contraseña"
              required
              autoComplete="new-password"
              minLength={8}
              className="h-11 transition-all duration-200 focus:scale-[1.01]"
            />
          </div>
        </div>

        {/* Password requirements */}
        <div className="rounded-lg bg-muted/50 p-4 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Tu contraseña debe tener:
          </p>
          <ul className="space-y-1.5">
            <PasswordRequirement text="Mínimo 8 caracteres" />
            <PasswordRequirement text="Letras y números (recomendado)" />
          </ul>
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
            ¿Ya tienes cuenta?
          </span>
        </div>
      </div>

      {/* Login link */}
      <div className="text-center">
        <Link href="/login">
          <Button
            variant="outline"
            className="w-full h-11 group transition-all duration-200 hover:scale-[1.02]"
            type="button"
          >
            Iniciar sesión
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      {/* Terms */}
      <p className="text-xs text-center text-muted-foreground">
        Al crear una cuenta, aceptas nuestros{' '}
        <Link href="/terms" className="underline hover:text-foreground">
          términos de servicio
        </Link>{' '}
        y{' '}
        <Link href="/privacy" className="underline hover:text-foreground">
          política de privacidad
        </Link>
      </p>
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
          Creando cuenta...
        </>
      ) : (
        <>
          Crear cuenta
          <ArrowRight className="ml-2 h-5 w-5" />
        </>
      )}
    </Button>
  )
}

function PasswordRequirement({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-2 text-sm text-muted-foreground">
      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
      <span>{text}</span>
    </li>
  )
}
