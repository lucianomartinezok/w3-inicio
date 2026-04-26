/** GraficoCicloTx — los 7 pasos de vida de una transacción */
export default function GraficoCicloTx({ mini = false, pasoActual = -1 }) {
  const t = mini ? 'text-[9px]' : 'text-xs';
  const pasos = [
    { n: 1, label: 'Crear', desc: 'App prepara los datos', icon: '📝' },
    { n: 2, label: 'Firmar', desc: 'Wallet firma con clave privada', icon: '✍️' },
    { n: 3, label: 'Broadcast', desc: 'Se envía a la red', icon: '📡' },
    { n: 4, label: 'Mempool', desc: 'Lista de espera', icon: '⏳' },
    { n: 5, label: 'Validador', desc: 'La incluye en un bloque', icon: '⛏️' },
    { n: 6, label: 'Bloque', desc: 'Agregado a la cadena', icon: '🧱' },
    { n: 7, label: 'Confirmada', desc: '¡Listo! Permanente', icon: '✅' },
  ];

  if (mini) {
    return (
      <div className="flex items-center gap-0.5 flex-wrap">
        {pasos.map((p, i) => (
          <div key={p.n} className="flex items-center gap-0.5">
            <div className={`rounded text-[8px] px-1 py-0.5 ${
              pasoActual === i ? 'bg-indigo-600 text-white' :
              pasoActual > i ? 'bg-emerald-800 text-emerald-300' :
              'bg-slate-800 text-slate-400'
            }`}>{p.icon}</div>
            {i < pasos.length - 1 && <span className="text-slate-600 text-[8px]">›</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-1">
        {pasos.map((p, i) => (
          <div key={p.n} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              pasoActual === i ? 'bg-indigo-600 text-white ring-2 ring-indigo-400' :
              pasoActual > i ? 'bg-emerald-700 text-emerald-200' :
              'bg-slate-700 text-slate-400'
            }`}>{p.n}</div>
            <div className="text-lg">{p.icon}</div>
            <div>
              <div className={`font-semibold ${t} ${
                pasoActual === i ? 'text-indigo-300' :
                pasoActual > i ? 'text-emerald-400' : 'text-slate-300'
              }`}>{p.label}</div>
              <div className={`text-slate-500 ${t}`}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-slate-400 text-xs mt-3 italic">
        Una vez que la tx llega al paso 6 (bloque), es prácticamente imposible revertirla.
      </p>
    </div>
  );
}
