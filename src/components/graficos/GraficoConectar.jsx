/** GraficoConectar — diagrama de secuencia del flujo de conexión */
export default function GraficoConectar({ mini = false }) {
  const t = mini ? 'text-[9px]' : 'text-xs';
  const steps = [
    { from: '🌐 App', arrow: '→', to: '🦊 MetaMask', msg: 'eth_requestAccounts', color: 'text-indigo-400' },
    { from: '🦊 MetaMask', arrow: '→', to: '👤 Usuario', msg: '¿Autorizás esta app?', color: 'text-amber-400' },
    { from: '👤 Usuario', arrow: '→', to: '🦊 MetaMask', msg: 'Acepto ✓', color: 'text-emerald-400' },
    { from: '🦊 MetaMask', arrow: '→', to: '🌐 App', msg: 'address 0xABC...123', color: 'text-indigo-400' },
    { from: '🌐 App', arrow: '→', to: '🌐 App', msg: 'Muestra la UI conectada', color: 'text-slate-400' },
  ];
  return (
    <div className="w-full">
      <div className="space-y-1">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-2 ${t} font-mono`}>
            <span className="text-slate-300 min-w-[60px]">{s.from}</span>
            <span className="text-slate-500">{s.arrow}</span>
            <span className="text-slate-300 min-w-[60px]">{s.to}</span>
            <span className="text-slate-500">:</span>
            <span className={s.color}>{s.msg}</span>
          </div>
        ))}
      </div>
      {!mini && (
        <p className="text-slate-400 text-xs mt-3 italic">
          La app nunca ve tu clave privada. Solo recibe tu address pública.
          MetaMask actúa como intermediario seguro.
        </p>
      )}
    </div>
  );
}
