/**
 * GraficoSmartContract.jsx
 * Visualizador interactivo de Smart Contracts: Código autónomo y Read vs Write.
 * Diseñado en estilo neo-brutalista adaptado a pantallas de 11 pulgadas.
 */
export default function GraficoSmartContract() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
        <span className="font-pixel text-[9px] font-black uppercase tracking-wider text-slate-700">
          📜 ANATOMÍA DE UN SMART CONTRACT Y SUS DOS MODOS DE OPERACIÓN
        </span>
        <span className="font-pixel text-[8px] text-cyan-800 font-bold hidden sm:inline">
          CODE IS LAW
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* OPERACIÓN 1: LECTURA */}
        <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👁️</span>
                <h4 className="font-black text-slate-950 text-base">Operación de Lectura (Call / Read)</h4>
              </div>
              <span className="rounded border border-emerald-800 bg-emerald-100 px-2 py-0.5 font-pixel text-[8px] font-black uppercase text-emerald-950">
                100% GRATIS
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-700 leading-relaxed font-medium">
              Consultar información que ya está almacenada en la blockchain (por ejemplo, leer el saldo o el mensaje actual).
            </p>

            <div className="mt-3.5 space-y-2 text-xs font-semibold text-slate-800">
              <div className="flex items-center gap-2 rounded bg-slate-50 border border-slate-200 p-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><b>Cero costo de gas:</b> No se paga nada.</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-slate-50 border border-slate-200 p-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><b>Sin firma de wallet:</b> No requiere autorizar ni abrir MetaMask.</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-slate-50 border border-slate-200 p-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><b>Respuesta instantánea:</b> Tu navegador consulta la copia local de un nodo.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 font-mono text-[10px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
            <code>function verMensaje() view returns (string)</code>
          </div>
        </div>

        {/* OPERACIÓN 2: ESCRITURA */}
        <div className="rounded-2xl border-4 border-slate-900 bg-amber-50/50 p-5 shadow-[4px_4px_0_#0f172a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✍️</span>
                <h4 className="font-black text-slate-950 text-base">Operación de Escritura (Transaction / Write)</h4>
              </div>
              <span className="rounded border border-amber-800 bg-amber-200 px-2 py-0.5 font-pixel text-[8px] font-black uppercase text-amber-950">
                REQUIERE FIRMA + GAS
              </span>
            </div>

            <p className="mt-3 text-xs text-slate-800 leading-relaxed font-medium">
              Modificar el estado de la blockchain (por ejemplo, publicar un mensaje nuevo o transferir valor).
            </p>

            <div className="mt-3.5 space-y-2 text-xs font-semibold text-slate-900">
              <div className="flex items-center gap-2 rounded bg-white border border-slate-300 p-2">
                <span className="text-amber-700 font-bold">●</span>
                <span><b>Consume Gas:</b> Paga el poder computacional de los mineros/validadores.</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-white border border-slate-300 p-2">
                <span className="text-amber-700 font-bold">●</span>
                <span><b>Firma obligatoria:</b> Tu wallet debe autorizar la transacción con tu clave privada.</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-white border border-slate-300 p-2">
                <span className="text-amber-700 font-bold">●</span>
                <span><b>Espera de confirmación:</b> Debe empaquetarse en un bloque minado por la red.</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-300 font-mono text-[10px] text-slate-800 bg-white p-2 rounded border border-slate-300">
            <code>function guardarMensaje(string memory nuevo) public</code>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-slate-900 bg-cyan-100/70 p-3.5 text-xs text-cyan-950 font-medium leading-relaxed">
        🧪 <b>Vivencial en el Taller:</b> En el <b>Nodo 07 (Laboratorio /demo)</b> vas a probar en vivo la diferencia exacta entre leer el mensaje sin costo y escribir uno nuevo autorizando tu firma en el simulador.
      </div>
    </div>
  );
}
