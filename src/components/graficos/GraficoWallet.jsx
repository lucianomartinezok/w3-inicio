/** GraficoWallet — muestra el árbol de derivación de claves */
export default function GraficoWallet({ mini = false }) {
  const t = mini ? 'text-[9px]' : 'text-xs';
  const nodes = [
    { id: 'seed', label: '🌱 Frase semilla', sub: '12 palabras secretas', color: 'border-yellow-500 bg-yellow-950 text-yellow-300' },
    { id: 'priv', label: '🔐 Clave privada', sub: '256 bits — NUNCA compartir', color: 'border-red-500 bg-red-950 text-red-300' },
    { id: 'pub', label: '📢 Clave pública', sub: 'derivada de la privada', color: 'border-blue-500 bg-blue-950 text-blue-300' },
    { id: 'addr', label: '🪪 Address', sub: '0xABC...123', color: 'border-emerald-500 bg-emerald-950 text-emerald-300' },
  ];
  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-1">
        {nodes.map((n, i) => (
          <div key={n.id} className="flex flex-col items-center">
            <div className={`border rounded-lg px-3 py-1.5 ${n.color} ${mini ? 'w-36' : 'w-52'} text-center`}>
              <div className={`font-semibold ${t}`}>{n.label}</div>
              <div className={`opacity-70 ${t}`}>{n.sub}</div>
            </div>
            {i < nodes.length - 1 && (
              <div className="text-slate-500 text-sm leading-none">↓</div>
            )}
          </div>
        ))}
      </div>
      {!mini && (
        <p className="text-slate-400 text-xs mt-3 italic text-center">
          La wallet NO guarda monedas. Guarda la clave que permite firmar operaciones.
          Tu saldo vive en la blockchain, no en la wallet.
        </p>
      )}
    </div>
  );
}
