/** GraficoBlockchain — muestra 4 bloques encadenados por hash */
export default function GraficoBlockchain({ mini = false }) {
  const h = mini ? 'text-[9px]' : 'text-xs';
  const bloques = [
    { n: 1, hash: '0xAAA...', prev: '—' },
    { n: 2, hash: '0xBBB...', prev: '0xAAA...' },
    { n: 3, hash: '0xCCC...', prev: '0xBBB...' },
    { n: 4, hash: '0xDDD...', prev: '0xCCC...' },
  ];
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
      {!mini && (
        <p className="text-slate-400 text-xs mt-2 italic">
          Cada bloque guarda el hash del anterior. Si cambiás un bloque, su hash cambia
          y rompe todos los siguientes. Por eso la blockchain es inmutable.
        </p>
      )}
    </div>
  );
}
