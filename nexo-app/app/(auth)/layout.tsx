import { Zap } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary/10 via-background to-primary/5 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Nexo</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Sistema inteligente de gestión comercial multi-industria
          </p>
        </div>

        <div className="relative z-10 space-y-8 animate-slide-up delay-200">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
              Gestiona tu negocio<br />
              de forma inteligente
            </h2>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Nexo es tu asistente conversacional que trabaja solo:
              gestiona stock, clientes, pedidos y cobros con mínima intervención.
            </p>
          </div>

          <div className="grid gap-4 max-w-md">
            <Feature
              title="Conversacional"
              description="Habla con Nexo como con un empleado de confianza"
            />
            <Feature
              title="Proactivo"
              description="Detecta problemas y sugiere acciones automáticamente"
            />
            <Feature
              title="Multi-industria"
              description="Se adapta a distribuidoras, retail, almacenes y servicios"
            />
          </div>
        </div>

        {/* Decorative gradient orb */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      </div>

      {/* Right side - Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-3 animate-slide-in-right opacity-0">
      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
      <div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
