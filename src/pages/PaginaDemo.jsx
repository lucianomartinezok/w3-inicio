/**
 * PaginaDemo.jsx — ruta /demo
 * Demo técnica con narrador como panel deslizable desde la derecha.
 */
import { useState } from 'react';
import { useContrato } from '../hooks/useContrato';
import ConectarBilletera from '../components/ConectarBilletera';
import FormularioMensaje from '../components/FormularioMensaje';
import VisualizarMensaje from '../components/VisualizarMensaje';
import PanelNarrador from '../components/PanelNarrador';
import Sidebar from '../components/Sidebar';

export default function PaginaDemo() {
  const [narradorAbierto, setNarradorAbierto] = useState(false);
  const {
    cuenta, chainId, balance,
    conectar, leerMensaje, enviarMensaje,
    mensajeActual, ultimaTx,
    cargando, pasoActual, error,
  } = useContrato();

  const pasoSidebar =
    pasoActual <= 0 ? 0 :
    pasoActual === 1 ? 0 :
    pasoActual === 2 ? 1 :
    pasoActual <= 4 ? 2 : 3;

  const irAPaso = (paso) => {
    document.getElementById(`paso-demo-${paso}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Sidebar pasoActual={pasoSidebar} onNavStep={irAPaso} />

      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="px-8 py-8 lg:px-12 xl:px-16 lg:py-10 space-y-7 max-w-4xl mx-auto">

          <div id="demo-tecnica" className="text-center">
            <span className="fs-eyebrow font-bold uppercase tracking-widest text-indigo-600">Demo técnica</span>
            <h2 className="fs-h1 font-black text-slate-900 mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Tu primera transacción en Web3
            </h2>
            <p className="text-slate-600 mt-3 fs-lead leading-relaxed max-w-3xl mx-auto">
              Este camino es práctico: conectás wallet, leés un contrato y simulás una escritura on-chain con narrador en vivo.
            </p>
          </div>

          <div id="paso-demo-0">
          <StepCard numero={1} titulo="Conectar Wallet" color="indigo"
            desc="Antes de interactuar con la blockchain necesitás una identidad digital."
            completado={!!cuenta}
          >
            <ConectarBilletera
              cuenta={cuenta} chainId={chainId} balance={balance}
              onConectar={conectar}
              cargando={cargando && !cuenta}
              error={!cuenta ? error : null}
            />
          </StepCard>
          </div>

          <div id="paso-demo-1">
          <StepCard numero={2} titulo="Leer el contrato" color="emerald"
            desc="Consultá el mensaje guardado. Es gratis: no requiere firma ni gas."
            bloqueado={!cuenta} completado={pasoActual >= 2}
          >
            <LeerCard
              mensajeActual={mensajeActual}
              onLeer={leerMensaje}
              cargando={cargando && !!cuenta}
              bloqueado={!cuenta}
            />
          </StepCard>
          </div>

          <div id="paso-demo-2">
          <StepCard numero={3} titulo="Escribir un mensaje" color="amber"
            desc="Guardá texto en la blockchain. Esto sí requiere tu firma y un poco de gas."
            bloqueado={!cuenta}
          >
            <FormularioMensaje
              cuenta={cuenta}
              onEnviar={enviarMensaje}
              cargando={cargando && !!cuenta}
              error={cuenta ? error : null}
            />
          </StepCard>
          </div>

          {ultimaTx && (
            <div id="paso-demo-3">
            <StepCard numero={4} titulo="¡Confirmado!" color="violet"
              desc="Tu mensaje quedó grabado para siempre en la blockchain."
              completado={true}
            >
              <VisualizarMensaje mensaje={mensajeActual} ultimaTx={ultimaTx} />
            </StepCard>
            </div>
          )}

          <div className="h-6" />
        </div>
      </div>

      {/* ── Botón narrador: centrado verticalmente a la derecha ── */}
      <button
        onClick={() => setNarradorAbierto(true)}
        className={`fixed top-1/2 -translate-y-1/2 right-0 z-40 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all duration-300 flex flex-col items-center gap-1.5 px-2 py-4 rounded-l-2xl ${narradorAbierto ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        title="Abrir narrador"
      >
        <span className="text-base">📻</span>
        <span
          className="text-xs font-semibold tracking-wide"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
        >
          Narrador
        </span>
      </button>

      {/* ── Panel narrador: slide desde la derecha ── */}
      <>
        {/* Overlay oscuro */}
        <div
          className={`fixed inset-0 bg-black/20 z-40 transition-opacity duration-300 ${narradorAbierto ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setNarradorAbierto(false)}
        />
        {/* Panel */}
        <div
          className={`fixed top-0 right-0 h-screen w-80 bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${narradorAbierto ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <PanelNarrador onCerrar={() => setNarradorAbierto(false)} />
        </div>
      </>
    </>
  );
}

/* ── StepCard ── */
function StepCard({ numero, titulo, desc, color, bloqueado, completado, children }) {
  const COLORS = {
    indigo:  { badge: 'bg-indigo-600',  light: 'bg-indigo-50',  border: 'border-indigo-100',  text: 'text-indigo-700'  },
    emerald: { badge: 'bg-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700' },
    amber:   { badge: 'bg-amber-500',   light: 'bg-amber-50',   border: 'border-amber-100',   text: 'text-amber-700'   },
    violet:  { badge: 'bg-violet-600',  light: 'bg-violet-50',  border: 'border-violet-100',  text: 'text-violet-700'  },
  };
  const c = COLORS[color] || COLORS.indigo;

  return (
    <div className={`bg-white rounded-2xl border shadow-sm transition-all ${
      bloqueado ? 'border-slate-200 opacity-60' : 'border-slate-200 hover:border-slate-300'
    }`}>
      <div className={`flex items-center gap-4 px-6 py-5 rounded-t-2xl ${completado ? c.light : 'bg-white'} border-b ${c.border}`}>
        <div className={`w-11 h-11 rounded-full flex items-center justify-center fs-meta font-black text-white shrink-0 ${completado ? 'bg-emerald-500' : c.badge}`}>
          {completado ? '✓' : numero}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-slate-800 fs-h3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {titulo}
          </h2>
          <p className="text-slate-500 fs-meta mt-1 leading-snug">{desc}</p>
        </div>
        {bloqueado && (
          <span className="text-slate-500 fs-eyebrow font-semibold bg-slate-100 px-3 py-1.5 rounded-full shrink-0">
            🔒 Paso anterior
          </span>
        )}
        {completado && !bloqueado && (
          <span className={`fs-eyebrow px-3 py-1.5 rounded-full font-semibold shrink-0 ${c.light} ${c.text}`}>
            Completado
          </span>
        )}
      </div>
      {!bloqueado && <div className="p-6">{children}</div>}
    </div>
  );
}

/* ── LeerCard ── */
function LeerCard({ mensajeActual, onLeer, cargando, bloqueado }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-xl border border-slate-200 px-5 py-4">
        <p className="text-slate-500 fs-eyebrow mb-1.5 font-semibold uppercase tracking-wide">Mensaje actual en el contrato</p>
        <p className="text-slate-800 font-semibold fs-meta min-h-[1.5rem]">
          {mensajeActual
            ? `"${mensajeActual}"`
            : <span className="text-slate-400 italic font-normal">(sin mensaje todavía)</span>
          }
        </p>
      </div>
      <button
        onClick={onLeer}
        disabled={bloqueado || cargando}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 fs-meta"
      >
        {cargando ? <><span className="animate-spin inline-block">⏳</span> Leyendo...</> : <>📖 Leer mensaje del contrato</>}
      </button>
      <p className="text-emerald-700 bg-emerald-50 fs-eyebrow px-3 py-2 rounded-lg border border-emerald-100">
        ✅ Operación <strong>gratuita</strong> — no requiere firma ni gas
      </p>
    </div>
  );
}
