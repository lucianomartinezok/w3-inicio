/**
 * Sidebar.jsx — menú lateral fijo, escala fluida pensada para 15"/23"+ en presentación.
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useModo } from '../context/ModoContext';
import { obtenerInfoContrato } from '../services/web3';

const PASOS_MENU = [
  { id: 0, icono: '🦊', titulo: 'Conectar Wallet',    desc: 'Tu identidad en Web3',        color: 'indigo' },
  { id: 1, icono: '📖', titulo: 'Leer el contrato',   desc: 'Sin gastar gas',               color: 'emerald' },
  { id: 2, icono: '✍️', titulo: 'Escribir un mensaje',desc: 'Firmar y enviar',               color: 'amber' },
  { id: 3, icono: '✅', titulo: 'Confirmación',        desc: 'Dato on-chain para siempre',   color: 'violet' },
];

const COLOR_MAP = {
  indigo:  { active: 'bg-indigo-50 border-indigo-300 text-indigo-700',     icon: 'bg-indigo-100 text-indigo-600',    dot: 'bg-indigo-500'  },
  emerald: { active: 'bg-emerald-50 border-emerald-300 text-emerald-700',  icon: 'bg-emerald-100 text-emerald-600',  dot: 'bg-emerald-500' },
  amber:   { active: 'bg-amber-50 border-amber-300 text-amber-700',        icon: 'bg-amber-100 text-amber-600',      dot: 'bg-amber-500'   },
  violet:  { active: 'bg-violet-50 border-violet-300 text-violet-700',     icon: 'bg-violet-100 text-violet-600',    dot: 'bg-violet-500'  },
};

export default function Sidebar({ pasoActual = -1, onNavStep }) {
  const { modo, toggleModo } = useModo();
  const navigate = useNavigate();
  const location = useLocation();
  const info = obtenerInfoContrato();
  const path = location.pathname;
  const caminoActivo =
    path.startsWith('/demo') ? 'demo' :
    path.startsWith('/diccionario') ? 'diccionario' : 'teoria';

  const irADemoPaso = (id) => {
    if (caminoActivo !== 'demo') {
      navigate('/demo');
      setTimeout(() => onNavStep?.(id), 120);
      return;
    }
    onNavStep?.(id);
  };

  return (
    <aside
      className="shrink-0 h-screen sticky top-0 flex flex-col bg-slate-950 text-white overflow-hidden"
      style={{ width: 'clamp(15.5rem, 16vw, 20rem)' }}
    >

      {/* ── Logo ── */}
      <div className="px-5 pt-5 pb-4 shrink-0">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/teoria/web3')}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-400 to-fuchsia-500 flex items-center justify-center text-white text-lg font-black shadow-lg shadow-indigo-950/40">
            ⛓
          </div>
          <div>
            <div
              className="font-black text-white leading-tight fs-meta"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Demo Web3
            </div>
            <div className="text-slate-400 fs-eyebrow">Aprendé, probá, entendé</div>
          </div>
        </div>
      </div>

      {/* ── Switch caminos ── */}
      <div className="px-4 pb-4 shrink-0">
        <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-white/5 border border-white/10 p-1.5">
          {[
            { id: 'teoria', label: 'Teoría', icon: '✦', to: '/teoria/web3' },
            { id: 'demo', label: 'Demo', icon: '⚙', to: '/demo' },
            { id: 'diccionario', label: 'Glosario', icon: '⌘', to: '/diccionario' },
          ].map((tab) => {
            const activo = caminoActivo === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.to)}
                className={`rounded-xl px-2 py-2.5 text-center transition-all ${
                  activo
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="text-base leading-none">{tab.icon}</div>
                <div className="mt-1.5 fs-eyebrow font-bold">{tab.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Banner mock ── */}
      {info.esMock && (
        <div className="mx-4 bg-amber-400/10 border border-amber-300/20 rounded-2xl px-3 py-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm">🧪</span>
            <span className="text-amber-200 font-semibold fs-eyebrow">Modo Simulación</span>
          </div>
          <p className="text-amber-100/80 fs-eyebrow leading-snug mt-0.5">Sin blockchain real. Para aprender.</p>
        </div>
      )}

      <div className="px-4 pt-5 shrink-0">
        {caminoActivo === 'teoria' && (
          <>
            <p className="text-slate-500 fs-eyebrow font-bold uppercase tracking-wider px-2 mb-2.5">
              Teoría guiada
            </p>
            <nav className="space-y-1.5">
              {[
                { label: 'Qué es la Web3', desc: 'Portada conceptual', icon: '🌐', to: '/teoria/web3' },
                { label: 'Conceptos base', desc: 'Wallet, blockchain, contratos', icon: '🎓', to: '/teoria/conceptos' },
                { label: 'Pasar a v1 real', desc: 'MetaMask + Sepolia', icon: '🚀', to: '/teoria/v1' },
              ].map((item) => {
                const active = path === item.to;
                return (
                  <SidebarItem key={item.to} item={item} active={active} onClick={() => navigate(item.to)} />
                );
              })}
            </nav>
          </>
        )}

        {caminoActivo === 'demo' && (
          <>
            <p className="text-slate-500 fs-eyebrow font-bold uppercase tracking-wider px-2 mb-2.5">
              Demo técnica
            </p>
            <nav className="space-y-1.5">
              {PASOS_MENU.map((paso) => {
                const completado = pasoActual > paso.id;
                const activo = pasoActual === paso.id;
                const bloqueado = pasoActual < paso.id;
                const c = COLOR_MAP[paso.color];
                return (
                  <button
                    key={paso.id}
                    onClick={() => irADemoPaso(paso.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all border ${
                      activo ? `${c.active} border shadow-sm`
                      : completado ? 'bg-white/10 border-white/10 text-white hover:bg-white/15'
                      : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                      completado ? 'bg-emerald-400/20 text-emerald-200' :
                      activo ? c.icon : 'bg-white/5 text-slate-500'
                    }`}>
                      {completado ? '✓' : paso.icono}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`fs-meta font-bold truncate ${bloqueado && !activo ? 'text-slate-500' : ''}`}>
                        {paso.titulo}
                      </div>
                      <div className={`fs-eyebrow truncate ${activo ? 'text-current opacity-70' : 'text-slate-500'}`}>
                        {paso.desc}
                      </div>
                    </div>
                    {activo && <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />}
                  </button>
                );
              })}
            </nav>
          </>
        )}

        {caminoActivo === 'diccionario' && (
          <>
            <p className="text-slate-500 fs-eyebrow font-bold uppercase tracking-wider px-2 mb-2.5">
              Diccionario
            </p>
            <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
              <div className="w-11 h-11 rounded-2xl bg-indigo-400/20 flex items-center justify-center mb-3 text-lg">📖</div>
              <h2 className="fs-meta font-black text-white">Glosario Web3</h2>
              <p className="fs-eyebrow text-slate-400 mt-1.5 leading-relaxed">
                Buscá términos, abrí ejemplos y conectá conceptos mientras avanzás.
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Spacer ── */}
      <div className="flex-1 min-h-0" />

      {/* ── Toggle modo ── */}
      <div className="px-4 pb-5 pt-3 shrink-0">
        <button
          onClick={toggleModo}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl border transition-all ${
            modo === 'tecnico'
              ? 'bg-violet-400/15 border-violet-300/20 text-violet-100'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
            modo === 'tecnico' ? 'bg-violet-300/20' : 'bg-white/10'
          }`}>
            {modo === 'tecnico' ? '🔧' : '🎓'}
          </div>
          <div className="text-left min-w-0">
            <div className="fs-meta font-bold truncate">
              {modo === 'tecnico' ? 'Modo Técnico' : 'Modo Principiante'}
            </div>
            <div className="fs-eyebrow text-slate-500 leading-tight mt-0.5">
              {modo === 'tecnico' ? 'Detalles técnicos ON' : 'Click para activar'}
            </div>
          </div>
        </button>
      </div>

    </aside>
  );
}

function SidebarItem({ item, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all border ${
        active
          ? 'bg-white text-slate-950 border-white shadow-sm'
          : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
        active ? 'bg-slate-100' : 'bg-white/5'
      }`}>
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="fs-meta font-bold truncate">{item.label}</div>
        <div className={`fs-eyebrow truncate ${active ? 'text-slate-500' : 'text-slate-500'}`}>{item.desc}</div>
      </div>
      {active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
    </button>
  );
}
