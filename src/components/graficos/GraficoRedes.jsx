/**
 * GraficoRedes.jsx
 * Comparativa Mainnet vs Testnet con diseño neo-brutalista adaptado a netbooks de 11 pulgadas.
 */
export default function GraficoRedes({ mini = false }) {
  if (mini) {
    return (
      <div className="grid grid-cols-2 gap-2 w-full text-slate-950">
        <div className="rounded border-2 border-slate-900 bg-red-50 p-2 text-center">
          <b className="font-pixel text-[8px] text-red-950 uppercase block">🌍 Mainnet</b>
          <span className="text-[7.5px] text-slate-700 font-medium">Dinero real</span>
        </div>
        <div className="rounded border-2 border-slate-900 bg-emerald-50 p-2 text-center">
          <b className="font-pixel text-[8px] text-emerald-950 uppercase block">🧪 Testnet</b>
          <span className="text-[7.5px] text-slate-700 font-medium">Prueba libre</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
        <span className="font-pixel text-[9px] font-black uppercase tracking-wider text-slate-700">
          🌐 COMPARATIVA DE ENTORNOS: RED PRINCIPAL VS RED DE PRUEBAS
        </span>
        <span className="font-pixel text-[8px] text-cyan-800 font-bold hidden sm:inline">
          SEGURIDAD Y RIESGO
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mainnet */}
        <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌍</span>
                <h4 className="font-black text-slate-950 text-base">Mainnet (Red Principal)</h4>
              </div>
              <span className="rounded border border-red-700 bg-red-100 px-2 py-0.5 font-pixel text-[8px] font-black uppercase text-red-900">
                PRODUCCIÓN
              </span>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-800 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold shrink-0">✕</span>
                <span><b>Fondos reales:</b> Cada transacción de gas cuesta dinero real (dólares/pesos convertidos a ETH).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold shrink-0">✕</span>
                <span><b>Sin margen de error:</b> Si enviás una transacción a una dirección equivocada o con un bug, los fondos no se recuperan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-950 font-bold shrink-0">●</span>
                <span>Utilizada por usuarios reales, bancos, protocolos DeFi y aplicaciones comerciales en vivo.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 font-mono text-[9px] text-slate-500">
            Chain ID oficial de Ethereum: 1 (0x1)
          </div>
        </div>

        {/* Testnet */}
        <div className="rounded-2xl border-4 border-slate-900 bg-emerald-50/50 p-5 shadow-[4px_4px_0_#0f172a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧪</span>
                <h4 className="font-black text-slate-950 text-base">Testnet (Red de Prueba)</h4>
              </div>
              <span className="rounded border border-emerald-800 bg-emerald-200 px-2 py-0.5 font-pixel text-[8px] font-black uppercase text-emerald-950">
                EDUCATIVA / LAB
              </span>
            </div>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-900 font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold shrink-0">✓</span>
                <span><b>Tokens 100% gratuitos:</b> Se consiguen gratis en "faucets" (grifos públicos) para pruebas escolares.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold shrink-0">✓</span>
                <span><b>Cero riesgo:</b> Ideal para estudiantes: se pueden romper contratos, simular errores y experimentar sin miedo.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold shrink-0">✓</span>
                <span><b>Misma tecnología:</b> Corre exactamente las mismas reglas de consenso, firmas y smart contracts que la red real.</span>
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-300 font-mono text-[9px] text-emerald-900 font-bold">
            Red de prueba utilizada en este taller: Sepolia (11155111)
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-slate-900 bg-cyan-100/70 p-3.5 text-xs text-cyan-950 font-medium leading-relaxed shadow-[2px_2px_0_#0f172a]">
        🎓 <b>Aplicación en el taller:</b> Nuestro simulador en el <b>Laboratorio (/demo)</b> replica la red de prueba Sepolia para que puedas conectar, leer y firmar sin instalar extensiones ni arriesgar fondos reales.
      </div>
    </div>
  );
}
