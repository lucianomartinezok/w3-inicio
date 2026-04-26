/**
 * PanelNarrador.jsx — Drawer lateral flotante, no columna fija.
 * Muestra el log de eventos en tiempo real.
 */
import { useNarrador } from '../context/NarradorContext';
import { useModo } from '../context/ModoContext';

const TIPO_CONFIG = {
  info:    { bg: 'bg-blue-50',   border: 'border-blue-100',   icon: 'ℹ️',  text: 'text-blue-700' },
  exito:   { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: '✅', text: 'text-emerald-700' },
  error:   { bg: 'bg-red-50',    border: 'border-red-100',    icon: '❌', text: 'text-red-700' },
  espera:  { bg: 'bg-amber-50',  border: 'border-amber-100',  icon: '⏳', text: 'text-amber-700' },
  tecnico: { bg: 'bg-violet-50', border: 'border-violet-100', icon: '🔧', text: 'text-violet-700' },
};

export default function PanelNarrador({ onCerrar }) {
  const { eventos, limpiar } = useNarrador();
  const { esTecnico } = useModo();

  const eventosFiltrados = esTecnico
    ? eventos
    : eventos.filter(e => e.tipo !== 'tecnico');

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-base">📻</div>
        <div className="flex-1">
          <h3 className="font-bold text-slate-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Narrador en vivo
          </h3>
          <p className="text-slate-400 text-xs">Lo que está pasando en Web3</p>
        </div>
        <div className="flex gap-2">
          {eventos.length > 0 && (
            <button
              onClick={limpiar}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Limpiar
            </button>
          )}
          {onCerrar && (
            <button
              onClick={onCerrar}
              className="text-slate-400 hover:text-slate-600 w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-lg transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Lista de eventos */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {eventosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-center">
            <p className="text-3xl mb-2">😴</p>
            <p className="text-sm">Sin eventos aún.</p>
            <p className="text-xs mt-1">Conectá tu wallet para empezar.</p>
          </div>
        ) : (
          [...eventosFiltrados].reverse().map((ev) => {
            const cfg = TIPO_CONFIG[ev.tipo] || TIPO_CONFIG.info;
            return (
              <div
                key={ev.id}
                className={`${cfg.bg} ${cfg.border} border rounded-xl px-4 py-3 slide-in`}
              >
                <div className="flex gap-2 items-start">
                  <span className="text-sm shrink-0">{cfg.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${cfg.text} font-medium leading-tight`}>{ev.humano}</p>
                    {ev.tecnico && esTecnico && (
                      <p className="text-xs font-mono text-slate-500 mt-1.5 bg-white/60 rounded-lg px-2 py-1 break-all">
                        {ev.tecnico}
                      </p>
                    )}
                    <p className="text-slate-400 text-xs mt-1">
                      {new Date(ev.ts).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
