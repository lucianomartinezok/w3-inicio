import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

const SECCIONES = [
  { to: '/recorrido', icono: '🧭', titulo: 'Plan', detalle: 'Recorrido guiado' },
  { to: '/teoria/web3', icono: '📚', titulo: 'Teoría', detalle: 'Conceptos base' },
  { to: '/demo', icono: '🧪', titulo: 'Laboratorio', detalle: 'Wallet y contrato' },
  { to: '/diccionario', icono: '📖', titulo: 'Glosario', detalle: 'Consulta rápida' },
];

export default function NavegacionPrincipal() {
  const [abierta, setAbierta] = useState(false);
  const panelRef = useRef(null);
  const abrirRef = useRef(null);
  const cerrarRef = useRef(null);

  useEffect(() => {
    if (!abierta) return undefined;

    const contenido = document.getElementById('contenido-principal');
    const disparador = abrirRef.current;
    contenido?.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
    cerrarRef.current?.focus();

    const gestionarTeclado = (evento) => {
      if (evento.key === 'Escape') {
        setAbierta(false);
        return;
      }
      if (evento.key !== 'Tab') return;

      const focos = panelRef.current?.querySelectorAll('a[href], button:not([disabled])');
      if (!focos?.length) return;
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', gestionarTeclado);
    return () => {
      contenido?.removeAttribute('inert');
      document.body.style.overflow = '';
      document.removeEventListener('keydown', gestionarTeclado);
      disparador?.focus();
    };
  }, [abierta]);

  return (
    <div className="navigation-layer fixed inset-0 pointer-events-none">
      <div className={`navigation-backdrop absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] transition-opacity duration-300 ${abierta ? 'pointer-events-auto opacity-100' : 'opacity-0'}`} aria-hidden="true" />

      <nav id="nav-principal" ref={panelRef} inert={!abierta} aria-hidden={!abierta} className={`navigation-drawer absolute inset-y-0 left-0 flex w-[min(22rem,88vw)] flex-col p-6 shadow-2xl transition-transform duration-300 ${abierta ? 'pointer-events-auto translate-x-0' : 'pointer-events-none -translate-x-full'}`} aria-label="Navegación principal" aria-modal="true" role="dialog">
        <div className="flex items-start gap-3 border-b border-white/10 pb-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/20 text-xl text-indigo-200">⛓</span>
          <div className="min-w-0 flex-1">
            <p className="text-lg font-black text-white">Desafío Blockchain</p>
            <p className="mt-0.5 text-sm text-slate-400">Plan, teoría y laboratorio</p>
          </div>
          <button ref={cerrarRef} type="button" onClick={() => setAbierta(false)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl font-bold text-white hover:bg-white/20" aria-label="Cerrar menú">×</button>
        </div>

        <div className="mt-6 flex flex-1 flex-col gap-3">
          {SECCIONES.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setAbierta(false)}
              className={({ isActive }) => `flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${isActive ? 'border-indigo-400/50 bg-indigo-500/20 text-white' : 'border-white/10 text-slate-200 hover:border-white/20 hover:bg-white/10'}`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">{item.icono}</span>
              <span>
                <span className="block text-base font-black">{item.titulo}</span>
                <span className="mt-0.5 block text-sm text-slate-400">{item.detalle}</span>
              </span>
            </NavLink>
          ))}
        </div>

        <p className="border-t border-white/10 pt-5 text-sm leading-relaxed text-slate-400">
          Cerrá este panel para volver a interactuar con la actividad.
        </p>
      </nav>

      <button
        type="button"
        ref={abrirRef}
        onClick={() => setAbierta(true)}
        aria-expanded={abierta}
        aria-controls="nav-principal"
        className={`navigation-trigger pointer-events-auto fixed left-0 top-1/2 flex h-20 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-r-xl text-3xl font-light text-white shadow-lg transition-transform duration-300 ${abierta ? '-translate-x-full' : 'translate-x-0'}`}
        aria-label="Abrir menú"
      >
        ›
      </button>
    </div>
  );
}
