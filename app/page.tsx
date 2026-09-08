import Link from "next/link"
import {
  ArrowUpRight,
  BarChart3,
  Check,
  Dumbbell,
  LayoutDashboard,
  Users,
} from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0d0c] text-[#f4f3ed]">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#c8f169] text-[#0b0d0c]">
            <Dumbbell className="size-5" />
          </span>
          GYM<span className="text-[#c8f169]">APP</span>
        </Link>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <Link href="/login" className="hidden px-4 py-2 text-[#b8bdb5] transition hover:text-white sm:block">
            Iniciar sesión
          </Link>
          <Link href="/signup" className="rounded-full bg-[#c8f169] px-4 py-2.5 text-sm font-bold text-[#0b0d0c] transition hover:bg-white">
            Crear cuenta
          </Link>
        </div>
      </nav>

      <section className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-20 pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-28 lg:pt-20">
        <div className="relative z-10">
          <p className="mb-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#c8f169]"><span className="size-2 rounded-full bg-[#c8f169]" /> El sistema operativo de tu gimnasio</p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-[6.5rem]">Tu gym.<br /><span className="text-[#c8f169]">Sin límites.</span></h1>
          <p className="mt-8 max-w-lg text-lg leading-8 text-[#aeb4ac]">Deja de perseguir hojas de cálculo. Administra miembros, membresías, pagos, inventario y ventas desde un solo lugar que trabaja tan duro como tú.</p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/signup" className="group flex items-center justify-center gap-3 rounded-full bg-[#c8f169] px-6 py-4 font-bold text-[#0b0d0c] transition hover:scale-[1.02] hover:bg-white">Empieza a crecer <ArrowUpRight className="size-5 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>
            <Link href="/login" className="flex items-center justify-center rounded-full border border-[#3a403a] px-6 py-4 font-bold text-white transition hover:border-[#c8f169]">Ya tengo una cuenta</Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#899087]">
            {['Clientes bajo control', 'Membresías sin fugas', 'Decisiones con datos'].map((item) => <span key={item} className="flex items-center gap-2"><Check className="size-4 text-[#c8f169]" />{item}</span>)}
          </div>
        </div>

        <div className="relative lg:pl-8">
          <div className="absolute -right-24 -top-32 size-96 rounded-full bg-[#c8f169]/15 blur-3xl" />
          <div className="relative rotate-2 rounded-[2rem] border border-white/10 bg-[#151a16] p-3 shadow-2xl shadow-black/50 transition hover:rotate-0">
            <div className="rounded-[1.5rem] bg-[#202720] p-5 text-[#f4f3ed] sm:p-7">
              <div className="mb-8 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#899087]">Resumen del gym</p><h2 className="mt-1 text-2xl font-black">Buenos días, Alex</h2></div><div className="flex size-10 items-center justify-center rounded-full bg-[#c8f169] text-sm font-black text-[#0b0d0c]">AG</div></div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#c8f169] p-4 text-[#0b0d0c]"><Users className="mb-5 size-5" /><p className="text-3xl font-black">1,248</p><p className="mt-1 text-xs font-bold text-[#0b0d0c]">Miembros activos</p></div><div className="rounded-2xl bg-[#2a332a] p-4"><BarChart3 className="mb-5 size-5" /><p className="text-3xl font-black">$18.4k</p><p className="mt-1 text-xs font-bold text-[#899087]">Ingresos este mes</p></div><div className="col-span-2 rounded-2xl bg-[#151a16] p-4 text-[#f4f3ed] sm:col-span-1"><LayoutDashboard className="mb-5 size-5 text-[#c8f169]" /><p className="text-3xl font-black">+24%</p><p className="mt-1 text-xs font-bold text-[#aeb4ac]">Crecimiento</p></div></div>
              <div className="mt-4 rounded-2xl border border-[#3a403a] p-5"><div className="mb-5 flex justify-between"><p className="font-bold">Rendimiento mensual</p><span className="text-xs font-bold text-[#899087]">2024</span></div><div className="flex h-28 items-end gap-2 sm:gap-4">{[35, 52, 43, 70, 58, 82, 96, 76, 100, 88, 94, 100].map((height, index) => <div key={index} className={`flex-1 rounded-t-md ${index > 8 ? 'bg-[#c8f169]' : 'bg-[#3a403a]'}`} style={{ height: `${height}%` }} />)}</div></div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-5 rounded-2xl border border-white/10 bg-[#202720] px-5 py-4 shadow-xl sm:-left-8"><p className="text-[10px] font-bold uppercase tracking-widest text-[#899087]">Check-ins hoy</p><p className="mt-1 text-2xl font-black text-[#c8f169]">286 <span className="text-sm text-white">+18%</span></p></div>
        </div>
      </section>
      <div className="border-t border-white/10 bg-[#111511] px-6 py-5 text-center text-sm font-semibold text-[#899087]">Todo lo que necesitas para convertir la operación en crecimiento.</div>
    </main>
  )
}
