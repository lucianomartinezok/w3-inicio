/** GraficoRedes — Mainnet vs Testnet (Sepolia) */
export default function GraficoRedes({ mini = false }) {
  const t = mini ? 'text-[9px]' : 'text-xs';
  return (
    <div className={`grid ${mini ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-4'} w-full`}>
      {/* Mainnet */}
      <div className="border border-red-500 bg-red-950/30 rounded-lg p-2">
        <div className={`font-bold text-red-400 ${mini ? 'text-[10px]' : 'text-sm'} mb-1`}>
          🌍 Mainnet
        </div>
        <div className="space-y-0.5">
          <div className={`text-slate-300 ${t}`}>💰 ETH real ($$)</div>
          <div className={`text-slate-300 ${t}`}>🏗️ Apps reales</div>
          <div className={`text-red-300 ${t}`}>❌ Errores = plata perdida</div>
          {!mini && <div className="text-slate-500 text-xs mt-1">chainId: 1 (0x1)</div>}
        </div>
      </div>

      {/* Sepolia */}
      <div className="border border-emerald-500 bg-emerald-950/30 rounded-lg p-2">
        <div className={`font-bold text-emerald-400 ${mini ? 'text-[10px]' : 'text-sm'} mb-1`}>
          🧪 Sepolia (testnet)
        </div>
        <div className="space-y-0.5">
          <div className={`text-slate-300 ${t}`}>🎁 ETH gratis (faucet)</div>
          <div className={`text-slate-300 ${t}`}>📚 Ideal para aprender</div>
          <div className={`text-emerald-300 ${t}`}>✅ Errores = 0 problema</div>
          {!mini && <div className="text-slate-500 text-xs mt-1">chainId: 11155111 (0xaa36a7)</div>}
        </div>
      </div>

      {!mini && (
        <div className="col-span-2 border border-indigo-700 bg-indigo-950/20 rounded-lg p-2 mt-1">
          <div className="text-indigo-300 text-xs font-semibold">Esta demo usa Sepolia</div>
          <div className="text-slate-400 text-xs mt-0.5">
            En v0 todo es simulado. En v1 vas a conectar tu MetaMask a Sepolia y las transacciones
            quedan grabadas en la blockchain real de pruebas.
          </div>
        </div>
      )}
    </div>
  );
}
