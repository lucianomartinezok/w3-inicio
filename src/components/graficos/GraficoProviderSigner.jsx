/** GraficoProviderSigner — los dos roles de Ethers.js */
export default function GraficoProviderSigner({ mini = false }) {
  const t = mini ? 'text-[9px]' : 'text-xs';
  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        {/* Provider */}
        <div className="border border-blue-500 bg-blue-950/40 rounded-lg p-2">
          <div className={`font-bold text-blue-400 ${mini ? 'text-[10px]' : 'text-sm'}`}>
            👁️ Provider (solo lee)
          </div>
          {!mini && <div className="text-slate-400 text-xs mt-0.5">new ethers.BrowserProvider(window.ethereum)</div>}
          <div className="flex items-center gap-2 mt-1">
            <div className={`bg-indigo-900 rounded px-1.5 py-0.5 ${t} text-indigo-200`}>App</div>
            <div className={`text-blue-400 ${t}`}>────── consulta gratuita ──────→</div>
            <div className={`bg-slate-800 rounded px-1.5 py-0.5 ${t} text-slate-200`}>Blockchain</div>
          </div>
          {!mini && <div className="text-slate-500 text-xs mt-1">Ej: leer mensaje, ver saldo, consultar bloque</div>}
        </div>

        {/* Signer */}
        <div className="border border-amber-500 bg-amber-950/40 rounded-lg p-2">
          <div className={`font-bold text-amber-400 ${mini ? 'text-[10px]' : 'text-sm'}`}>
            ✍️ Signer (firma y escribe)
          </div>
          {!mini && <div className="text-slate-400 text-xs mt-0.5">await provider.getSigner()</div>}
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            <div className={`bg-yellow-900 border border-yellow-600 rounded px-1.5 py-0.5 ${t} text-yellow-200`}>
              🔐 Wallet
            </div>
            <div className={`text-amber-400 ${t}`}>→</div>
            <div className={`bg-indigo-900 rounded px-1.5 py-0.5 ${t} text-indigo-200`}>App</div>
            <div className={`text-amber-400 ${t}`}>──tx firmada──→</div>
            <div className={`bg-slate-800 rounded px-1.5 py-0.5 ${t} text-slate-200`}>Blockchain</div>
          </div>
          {!mini && <div className="text-slate-500 text-xs mt-1">Ej: actualizarMensaje(), enviar ETH, deployar contrato</div>}
        </div>
      </div>

      {!mini && (
        <p className="text-slate-400 text-xs mt-2 italic">
          Ethers.js es la librería que conecta tu app React con la blockchain.
          Provider para leer, Signer para escribir.
        </p>
      )}
    </div>
  );
}
