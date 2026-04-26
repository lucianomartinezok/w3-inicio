/** GraficoFirma — qué significa firmar criptográficamente */
export default function GraficoFirma({ mini = false }) {
  const t = mini ? 'text-[9px]' : 'text-xs';
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-2">
        {/* Entradas */}
        <div className={`flex ${mini ? 'gap-3' : 'gap-6'} items-end`}>
          <div className="flex flex-col items-center gap-1">
            <div className={`border border-indigo-500 bg-indigo-950 rounded-lg px-2 py-1 ${t} text-indigo-300 text-center`}>
              <div className="font-semibold">📄 Datos tx</div>
              {!mini && <div className="opacity-70">destino, valor, data</div>}
            </div>
            <div className="text-slate-500 text-sm">↘</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className={`border border-red-500 bg-red-950 rounded-lg px-2 py-1 ${t} text-red-300 text-center`}>
              <div className="font-semibold">🔐 Clave privada</div>
              {!mini && <div className="opacity-70">solo la sabe tu wallet</div>}
            </div>
            <div className="text-slate-500 text-sm">↙</div>
          </div>
        </div>

        {/* Proceso */}
        <div className={`border border-purple-500 bg-purple-950 rounded-lg px-3 py-1.5 ${t} text-purple-300 text-center`}>
          <div className="font-semibold">⚙️ Algoritmo ECDSA</div>
          {!mini && <div className="opacity-70">secp256k1</div>}
        </div>

        <div className="text-slate-500 text-sm">↓</div>

        {/* Resultado */}
        <div className={`border border-emerald-500 bg-emerald-950 rounded-lg px-3 py-1.5 ${t} text-emerald-300 text-center`}>
          <div className="font-semibold">✅ Firma digital</div>
          <div className="font-mono opacity-70">0x1a2b3c4d...</div>
        </div>

        <div className="text-slate-500 text-sm">↓</div>

        {/* Verificación */}
        <div className={`border border-slate-600 bg-slate-800 rounded-lg px-3 py-1.5 ${t} text-slate-300 text-center`}>
          <div className="font-semibold">🌐 Red Ethereum</div>
          {!mini && <div className="opacity-70">verifica sin ver la clave privada</div>}
        </div>
      </div>
      {!mini && (
        <p className="text-slate-400 text-xs mt-3 italic text-center">
          Cualquiera puede verificar que la firma es tuya usando solo tu clave pública.
          Tu clave privada nunca sale de la wallet.
        </p>
      )}
    </div>
  );
}
