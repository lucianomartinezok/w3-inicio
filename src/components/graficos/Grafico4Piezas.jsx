/**
 * Grafico4Piezas.jsx
 * Visualizador interactivo de las 4 piezas clave de Web3 con su flujo de interacción.
 * Adaptable a netbooks escolares de 11 pulgadas y móviles.
 */
export default function Grafico4Piezas() {
  const piezas = [
    {
      num: '1',
      icono: '👛',
      nombre: 'Wallet',
      sub: 'Tu Identidad y Llavero',
      rol: 'Guarda tus claves privadas. Firma y autoriza cada acción sin entregar tus contraseñas a nadie.',
      color: 'bg-emerald-50 border-slate-900',
      badge: 'FIRMA Y SOBERANÍA',
    },
    {
      num: '2',
      icono: '🌐',
      nombre: 'dApp',
      sub: 'La Aplicación Web',
      rol: 'La interfaz gráfica en el navegador que usás para interactuar con la red y visualizar información.',
      color: 'bg-cyan-50 border-slate-900',
      badge: 'INTERFAZ DE USUARIO',
    },
    {
      num: '3',
      icono: '📜',
      nombre: 'Smart Contract',
      sub: 'El Programa Autónomo',
      rol: 'Código inmutable publicado en la red que ejecuta las reglas convenidas sin intermediarios humanos.',
      color: 'bg-amber-50 border-slate-900',
      badge: 'LÓGICA INMUTABLE',
    },
    {
      num: '4',
      icono: '⛓️',
      nombre: 'Blockchain',
      sub: 'El Registro Distribuido',
      rol: 'La red de computadoras (nodos) que almacena, valida y garantiza que nada pueda ser borrado o alterado.',
      color: 'bg-purple-50 border-slate-900',
      badge: 'CONSENSO Y MEMORIA',
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
        <span className="font-pixel text-[9px] font-black uppercase tracking-wider text-slate-700">
          🧩 CÓMO CONVIVEN LAS 4 PIEZAS EN UNA OPERACIÓN REAL
        </span>
        <span className="font-pixel text-[8px] text-cyan-800 font-bold hidden sm:inline">
          ARQUITECTURA WEB3
        </span>
      </div>

      {/* Tarjetas de las 4 piezas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
        {piezas.map((p) => (
          <div
            key={p.nombre}
            className={`rounded-xl border-2 border-slate-900 p-4 shadow-[3px_3px_0_#0f172a] flex flex-col justify-between ${p.color}`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-900/20 pb-2">
                <span className="text-2xl">{p.icono}</span>
                <span className="flex h-5 w-5 items-center justify-center rounded border border-slate-900 bg-white font-pixel text-[9px] font-black">
                  {p.num}
                </span>
              </div>
              <h4 className="mt-2.5 font-black text-slate-950 text-base">
                {p.nombre}
              </h4>
              <p className="font-pixel text-[8px] text-slate-600 font-bold mt-0.5">
                {p.sub}
              </p>
              <p className="mt-2 text-xs text-slate-800 leading-relaxed font-medium">
                {p.rol}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-900/10">
              <span className="font-pixel text-[7.5px] font-black uppercase text-slate-800 block">
                {p.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Flujo paso a paso en una sola tira horizontal clara */}
      <div className="rounded-xl border-2 border-slate-900 bg-white p-3.5 shadow-[2px_2px_0_#0f172a] space-y-2">
        <span className="font-pixel text-[8px] uppercase tracking-wider text-slate-500 font-bold block">
          EL CIRCUITO EN ACCIÓN:
        </span>
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs font-semibold text-slate-800">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 w-full md:w-auto">
            <span>1. Entrás a la <b>dApp</b></span>
          </div>
          <span className="text-slate-400 font-bold hidden md:inline">→</span>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 w-full md:w-auto">
            <span>2. Conectás tu <b>Wallet</b></span>
          </div>
          <span className="text-slate-400 font-bold hidden md:inline">→</span>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 w-full md:w-auto">
            <span>3. Firmás con tu clave privada</span>
          </div>
          <span className="text-slate-400 font-bold hidden md:inline">→</span>
          <div className="flex items-center gap-1.5 bg-cyan-100 border border-slate-900 rounded px-2.5 py-1.5 w-full md:w-auto font-bold text-slate-950">
            <span>4. El <b>Smart Contract</b> lo graba en la <b>Blockchain</b></span>
          </div>
        </div>
      </div>
    </div>
  );
}
