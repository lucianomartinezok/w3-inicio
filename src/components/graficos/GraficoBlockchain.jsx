/**
 * GraficoBlockchain.jsx
 * Visualizador interactivo de bloques encadenados por hash con diseño neo-brutalista.
 * Totalmente adaptable a pantallas de netbooks escolares (11 pulgadas) y móviles.
 */
export default function GraficoBlockchain({ mini = false }) {
  const bloques = [
    { n: 1, hash: '0x4A1F...7E2', prev: '0x0000 (GÉNESIS)', txs: '3 txs', color: 'bg-cyan-50' },
    { n: 2, hash: '0x8B2C...3D1', prev: '0x4A1F...7E2', txs: '5 txs', color: 'bg-slate-50' },
    { n: 3, hash: '0xC3E4...9A0', prev: '0x8B2C...3D1', txs: '2 txs', color: 'bg-slate-50' },
    { n: 4, hash: '0xF9D0...1B8', prev: '0xC3E4...9A0', txs: '6 txs', color: 'bg-emerald-50' },
  ];

  if (mini) {
    return (
      <div className="w-full overflow-x-auto py-1">
        <div className="flex items-center gap-1.5 min-w-max">
          {bloques.map((b, i) => (
            <div key={b.n} className="flex items-center gap-1">
              <div className="rounded-lg border-2 border-slate-900 bg-white p-2 w-28 text-slate-950 shadow-[2px_2px_0_#0f172a]">
                <div className="font-pixel text-[8px] font-black uppercase text-cyan-800">Bloque #{b.n}</div>
                <div className="font-mono text-[8.5px] text-slate-800 font-bold truncate mt-0.5">Hash: {b.hash}</div>
                <div className="font-mono text-[7.5px] text-slate-500 truncate">Prev: {b.prev}</div>
              </div>
              {i < bloques.length - 1 && (
                <span className="font-pixel text-xs text-slate-900 font-bold">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Indicador de flujo */}
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
        <span className="font-pixel text-[9px] font-black uppercase tracking-wider text-slate-700">
          ⛓️ ENLACE CRIPTOGRÁFICO POR HASH (PREVIOUS HASH)
        </span>
        <span className="font-pixel text-[8px] text-cyan-800 font-bold hidden sm:inline">
          DIRECCIÓN DEL TIEMPO: 1 → 2 → 3 → 4
        </span>
      </div>

      {/* Cuadrícula adaptable de 4 bloques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {bloques.map((b, i) => (
          <div
            key={b.n}
            className={`rounded-xl border-2 border-slate-900 p-3.5 shadow-[3px_3px_0_#0f172a] flex flex-col justify-between ${b.color}`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-900/20 pb-2">
                <span className="font-pixel text-[8.5px] font-black uppercase text-slate-950">
                  {b.n === 1 ? 'BLOQUE #1 (GÉNESIS)' : `BLOQUE #${b.n}`}
                </span>
                <span className="rounded bg-white border border-slate-900 px-1.5 py-0.5 font-pixel text-[7.5px] font-bold text-slate-700">
                  {b.txs}
                </span>
              </div>

              <div className="mt-2.5 space-y-2">
                <div className="rounded-lg bg-white border border-slate-300 p-2 shadow-xs">
                  <span className="block font-pixel text-[7px] text-slate-500 uppercase font-bold">
                    HASH DEL BLOQUE (HUELLA)
                  </span>
                  <span className="block font-mono text-[10px] font-bold text-cyan-800 break-all mt-0.5">
                    {b.hash}
                  </span>
                </div>

                <div className="rounded-lg bg-white border border-slate-300 p-2 shadow-xs">
                  <span className="block font-pixel text-[7px] text-slate-500 uppercase font-bold">
                    ENLACE PREVIO (PREV HASH)
                  </span>
                  <span className="block font-mono text-[10px] font-bold text-slate-700 break-all mt-0.5">
                    {b.prev}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-300/80 flex items-center justify-between text-[8px] font-pixel text-slate-600 font-bold">
              <span>ESTADO: VÁLIDO</span>
              {i < bloques.length - 1 ? (
                <span className="text-cyan-700">ENLAZA AL #{b.n + 1} →</span>
              ) : (
                <span className="text-emerald-700">ÚLTIMO BLOQUE ✓</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border-2 border-slate-900 bg-amber-50 p-3.5 text-xs text-amber-950 font-medium leading-relaxed shadow-[2px_2px_0_#0f172a]">
        ⚠️ <b>¿Por qué es inmutable?</b> Cada bloque incluye en sus datos el hash exacto del bloque anterior. Si alguien intentara cambiar un solo dato del <b>Bloque #2</b>, su huella cambiaría por completo, dejaría de coincidir con el campo <i>Prev Hash</i> del <b>Bloque #3</b> y todos los nodos de la red rechazarían la cadena automáticamente.
      </div>
    </div>
  );
}
