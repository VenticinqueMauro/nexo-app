'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export type ActionState = {
  error?: string
  success?: boolean
}

export async function loginAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email y contraseña son requeridos' }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: 'Email o contraseña incorrectos' }
    }

    if (!data.user) {
      return { error: 'Error al iniciar sesión' }
    }

    // Check if user has completed onboarding
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('business_id')
      .eq('id', data.user.id)
      .single<{ business_id: string | null }>()

    if (userError || !userData) {
      return { error: 'Error al obtener datos del usuario' }
    }

    revalidatePath('/', 'layout')

    // Redirect based on onboarding status
    if (!userData.business_id) {
      redirect('/onboarding')
    } else {
      redirect('/dashboard')
    }
  } catch (error) {
    // Next.js redirect() throws a NEXT_REDIRECT error which is expected behavior
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Login error:', error)
    return { error: 'Error inesperado al iniciar sesión' }
  }
}

export async function signupAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get('fullName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    return { error: 'Todos los campos son requeridos' }
  }

  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden' }
  }

  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres' }
  }

  try {
    const supabase = await createClient()

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return { error: 'Este email ya está registrado' }
      }
      return { error: authError.message }
    }

    if (!authData.user) {
      return { error: 'Error al crear la cuenta' }
    }

    // Note: User record in public.users is created automatically by database trigger
    // See: supabase/auth-user-trigger.sql

    // Check if email confirmation is required
    if (authData.session) {
      // Email confirmation is disabled, we have a session immediately
      // Session is already set from signUp(), just redirect
      await new Promise(resolve => setTimeout(resolve, 100))
      revalidatePath('/', 'layout')
      redirect('/onboarding')
    } else {
      // Email confirmation is enabled
      // User needs to verify their email before they can login
      return {
        error: 'Cuenta creada exitosamente. Por favor verifica tu email para continuar. Revisa tu bandeja de entrada y spam.',
      }
    }
  } catch (error) {
    // Next.js redirect() throws a NEXT_REDIRECT error which is expected behavior
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Signup error:', error)
    return { error: 'Error inesperado al crear la cuenta' }
  }
}

export async function completeOnboardingAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const industry = formData.get('industry') as string
  const businessName = formData.get('businessName') as string
  const phone = formData.get('phone') as string | null
  const address = formData.get('address') as string | null

  // Validation
  if (!industry || !businessName) {
    return { error: 'Industria y nombre del negocio son requeridos' }
  }

  const validIndustries = ['distributor', 'retail', 'grocery', 'service']
  if (!validIndustries.includes(industry)) {
    return { error: 'Industria no válida' }
  }

  try {
    const supabase = await createClient()

    // Get current user (to verify authentication)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { error: 'Usuario no autenticado' }
    }

    // Get default module configuration for the industry
    const defaultConfig = getDefaultConfig(industry)

    // Use the complete_onboarding RPC function
    // This function has SECURITY DEFINER and bypasses RLS
    // It creates the business AND updates the user in a single transaction
    const { data: businessId, error: rpcError } = await supabase.rpc(
      'complete_onboarding',
      {
        p_business_name: businessName,
        p_industry: industry,
        p_phone: phone || null,
        p_address: address || null,
        p_config: defaultConfig,
      }
    )

    if (rpcError) {
      console.error('Error in complete_onboarding:', rpcError)

      // Handle specific errors
      if (rpcError.message.includes('already has a business')) {
        return { error: 'Ya tienes un negocio configurado' }
      }
      if (rpcError.message.includes('not authenticated')) {
        return { error: 'Usuario no autenticado' }
      }
      if (rpcError.message.includes('Invalid industry')) {
        return { error: 'Industria no válida' }
      }

      return { error: 'Error al crear el negocio' }
    }

    if (!businessId) {
      return { error: 'Error al crear el negocio' }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
  } catch (error) {
    // Next.js redirect() throws a NEXT_REDIRECT error which is expected behavior
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error
    }
    console.error('Onboarding error:', error)
    return { error: 'Error inesperado al completar el onboarding' }
  }
}

function getDefaultConfig(industry: string) {
  const configs = {
    distributor: {
      modules: {
        stock: { enabled: true, variants: false, projections: true },
        orders: { enabled: true, recurring: true, tiered_pricing: true },
        deliveries: { enabled: true, type: 'own_routes' },
        billing: { enabled: true, current_account: true, auto_reminders: true },
      },
    },
    retail: {
      modules: {
        stock: { enabled: true, variants: true, projections: false },
        orders: { enabled: true, recurring: false, tiered_pricing: false },
        deliveries: { enabled: false },
        billing: { enabled: true, current_account: true, auto_reminders: true },
      },
    },
    grocery: {
      modules: {
        stock: { enabled: true, variants: false, projections: true },
        orders: { enabled: false },
        deliveries: { enabled: false },
        billing: { enabled: true, current_account: true, auto_reminders: false },
      },
    },
    service: {
      modules: {
        stock: { enabled: false },
        orders: { enabled: true, recurring: false, tiered_pricing: false },
        deliveries: { enabled: false },
        billing: { enabled: true, current_account: true, auto_reminders: true },
      },
    },
  }

  return configs[industry as keyof typeof configs] || configs.distributor
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
