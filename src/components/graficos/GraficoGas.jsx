/** GraficoGas — cómo se calcula el costo de una transacción */
export default function GraficoGas({ mini = false }) {
  const t = mini ? 'text-[9px]' : 'text-xs';
  return (
    <div className="w-full">
      {/* Fórmula */}
      <div className="flex items-center justify-center gap-2 my-2 flex-wrap">
        <div className={`border border-indigo-500 bg-indigo-950 rounded-lg px-2 py-1 text-center ${t}`}>
          <div className="text-indigo-300 font-semibold">⛽ Gas usado</div>
          <div className="text-indigo-200 font-mono">~43.000 u</div>
          {!mini && <div className="text-slate-500">depende de la operación</div>}
        </div>
        <div className="text-slate-400 font-bold text-lg">×</div>
        <div className={`border border-amber-500 bg-amber-950 rounded-lg px-2 py-1 text-center ${t}`}>
          <div className="text-amber-300 font-semibold">💰 Precio gas</div>
          <div className="text-amber-200 font-mono">20 Gwei</div>
          {!mini && <div className="text-slate-500">sube con la demanda</div>}
        </div>
        <div className="text-slate-400 font-bold text-lg">=</div>
        <div className={`border border-emerald-500 bg-emerald-950 rounded-lg px-2 py-1 text-center ${t}`}>
          <div className="text-emerald-300 font-semibold">💸 Tarifa total</div>
          <div className="text-emerald-200 font-mono">0.00086 ETH</div>
          {!mini && <div className="text-slate-500">va al validador</div>}
        </div>
      </div>

      {/* Unidades */}
      {!mini && (
        <div className="mt-3 border border-slate-700 bg-slate-900 rounded-lg p-2">
          <div className="text-slate-400 text-xs font-semibold mb-1">Unidades de ETH</div>
          <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="text-center">
              <div className="text-purple-400 font-mono font-bold">1 ETH</div>
              <div className="text-slate-500">= 10^18 Wei</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-mono font-bold">1 Gwei</div>
              <div className="text-slate-500">= 10^9 Wei</div>
            </div>
            <div className="text-center">
              <div className="text-slate-300 font-mono font-bold">1 Wei</div>
              <div className="text-slate-500">unidad mínima</div>
            </div>
          </div>
        </div>
      )}

      {!mini && (
        <p className="text-slate-400 text-xs mt-2 italic">
          En Sepolia el gas es gratis (ETH sin valor). En Mainnet podría ser $0.50-$50 por tx.
        </p>
      )}
    </div>
  );
}
