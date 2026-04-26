/** GraficoLeerVsEscribir — el concepto más importante de Web3 */
export default function GraficoLeerVsEscribir({ mini = false }) {
  const t = mini ? 'text-[9px]' : 'text-xs';
  return (
    <div className={`grid ${mini ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-3'} w-full`}>
      {/* LEER */}
      <div className="border border-emerald-600 bg-emerald-950/40 rounded-lg p-2">
        <div className={`font-bold text-emerald-400 ${mini ? 'text-[10px]' : 'text-sm'} mb-1`}>
          📖 Leer (call)
        </div>
        <div className="flex flex-col items-center gap-1 my-2">
          <div className={`bg-indigo-900 border border-indigo-500 rounded px-2 py-0.5 ${t} text-indigo-200`}>App</div>
          <div className={`text-emerald-400 ${t}`}>↓ pregunta</div>
          <div className={`bg-slate-800 border border-slate-600 rounded px-2 py-0.5 ${t} text-slate-200`}>Contrato</div>
          <div className={`text-emerald-400 ${t}`}>↑ respuesta</div>
          <div className={`bg-indigo-900 border border-indigo-500 rounded px-2 py-0.5 ${t} text-indigo-200`}>App</div>
        </div>
        <div className="space-y-0.5">
          <div className={`text-emerald-300 ${t}`}>✅ Gratis</div>
          <div className={`text-emerald-300 ${t}`}>✅ Instantáneo</div>
          <div className={`text-emerald-300 ${t}`}>✅ Sin firma</div>
        </div>
      </div>

      {/* ESCRIBIR */}
      <div className="border border-amber-600 bg-amber-950/40 rounded-lg p-2">
        <div className={`font-bold text-amber-400 ${mini ? 'text-[10px]' : 'text-sm'} mb-1`}>
          ✍️ Escribir (transaction)
        </div>
        <div className="flex flex-col items-center gap-0.5 my-2">
          <div className={`bg-indigo-900 border border-indigo-500 rounded px-2 py-0.5 ${t} text-indigo-200`}>App</div>
          <div className={`text-amber-400 ${t}`}>↓ firma</div>
          <div className={`bg-yellow-900 border border-yellow-600 rounded px-2 py-0.5 ${t} text-yellow-200`}>Wallet</div>
          <div className={`text-amber-400 ${t}`}>↓ broadcast</div>
          <div className={`bg-purple-900 border border-purple-600 rounded px-2 py-0.5 ${t} text-purple-200`}>Red ETH</div>
          <div className={`text-amber-400 ${t}`}>↓ minado</div>
          <div className={`bg-slate-800 border border-slate-600 rounded px-2 py-0.5 ${t} text-slate-200`}>Contrato ✓</div>
        </div>
        <div className="space-y-0.5">
          <div className={`text-amber-300 ${t}`}>⛽ Cuesta gas</div>
          <div className={`text-amber-300 ${t}`}>⏳ Tarda ~12s</div>
          <div className={`text-amber-300 ${t}`}>✍️ Requiere firma</div>
        </div>
      </div>
    </div>
  );
}
