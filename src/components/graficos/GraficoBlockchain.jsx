/** GraficoBlockchain — muestra 4 bloques encadenados por hash */
export default function GraficoBlockchain({ mini = false }) {
  const h = mini ? 'text-[9px]' : 'text-xs';
  const bloques = [
    { n: 1, hash: '0xAAA...', prev: '—' },
    { n: 2, hash: '0xBBB...', prev: '0xAAA...' },
    { n: 3, hash: '0xCCC...', prev: '0xBBB...' },
    { n: 4, hash: '0xDDD...', prev: '0xCCC...' },
  ];

  if (!mini) {
    return (
      <div className="w-full max-w-2xl px-2 py-4">
        <div className="mb-3 flex items-center justify-center gap-2 font-mono text-xs font-black text-indigo-700" aria-label="Bloques encadenados del uno al cuatro">
          <span>1</span><span aria-hidden="true">→</span><span>2</span><span aria-hidden="true">→</span><span>3</span><span aria-hidden="true">→</span><span>4</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {bloques.map((b) => (
            <div key={b.n} className="min-w-0 rounded-xl border border-indigo-500 bg-indigo-950 p-3 shadow-sm">
              <div className="text-sm font-bold text-indigo-200">Bloque {b.n}</div>
              <div className="mt-1 break-all font-mono text-[11px] text-emerald-300">hash: {b.hash}</div>
              <div className="break-all font-mono text-[11px] text-slate-300">prev: {b.prev}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-indigo-950">
          Cada bloque guarda el hash del anterior. Si cambiás un bloque, su hash cambia
          y rompe todos los siguientes.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max py-2">
        {bloques.map((b, i) => (
          <div key={b.n} className="flex items-center gap-1">
            <div className={`bg-indigo-950 border border-indigo-500 rounded-lg p-2 ${mini ? 'w-20' : 'w-28'}`}>
              <div className={`font-bold text-indigo-300 ${h}`}>Bloque {b.n}</div>
              <div className={`text-emerald-400 font-mono ${h} mt-0.5`}>hash: {b.hash}</div>
              <div className={`text-slate-400 font-mono ${h}`}>prev: {b.prev}</div>
            </div>
            {i < bloques.length - 1 && (
              <div className="text-indigo-400 font-bold text-lg">→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
