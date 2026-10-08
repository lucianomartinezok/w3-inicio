import { useState, useEffect } from 'react';

/* ==========================================================================
   AVISO PARA DISPOSITIVOS MÓVILES (TELÉFONOS)
   Informa al estudiante que la experiencia de laboratorio y mapa interactivo
   está optimizada exclusivamente para netbooks escolares (11"+ / 1366x768).
   ========================================================================== */

export default function AvisoNetbookMovil() {
  const [esPantallaPequena, setEsPantallaPequena] = useState(false);
  const [omitido, setOmitido] = useState(() => {
    try {
      return sessionStorage.getItem('omitir_aviso_movil') === 'true';
    } catch {
      return false;
    }
  });
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    const verificarTamano = () => {
      // Teléfonos y pantallas móviles estrechas (< 768px)
      setEsPantallaPequena(window.innerWidth < 768);
    };

    verificarTamano();
    window.addEventListener('resize', verificarTamano);
    return () => window.removeEventListener('resize', verificarTamano);
  }, []);

  const copiarEnlace = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Fallback si el portapapeles está bloqueado
      setCopiado(true);
    }
  };

  const ignorarAviso = () => {
    setOmitido(true);
    try {
      sessionStorage.setItem('omitir_aviso_movil', 'true');
    } catch {
      // Ignorar error de storage
    }
  };

  if (!esPantallaPequena || omitido) {
    return null;
  }

  return (
    <aside
      role="alertdialog"
      aria-modal="true"
      aria-label="Aviso de compatibilidad para dispositivos móviles"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md rounded-2xl border-2 border-cyan-400 bg-[#090b16] p-5 text-slate-100 shadow-[0_0_30px_rgba(0,240,255,0.25)]">
        {/* Cabecera con insignia */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-pixel text-[9px] uppercase tracking-wider text-amber-300">
              DISPOSITIVO NO RECOMENDADO
            </span>
          </div>
          <span className="rounded border border-slate-600 bg-slate-800 px-1.5 py-0.5 font-pixel text-[8px] text-cyan-200 font-bold">
            LAB WEB3
          </span>
        </div>

        {/* Gráfico Pixel-Art de Notebook Escolar */}
        <div className="my-4 flex justify-center">
          <svg className="h-20 w-28 text-cyan-400" viewBox="0 0 96 64" fill="none">
            {/* Pantalla de la notebook */}
            <rect x="14" y="6" width="68" height="42" rx="3" fill="#0f172a" stroke="#00f0ff" strokeWidth="2.5" />
            {/* Display interior */}
            <rect x="19" y="11" width="58" height="32" fill="#020617" />
            {/* Contenido en pantalla: bloques y circuitos */}
            <line x1="24" y1="18" x2="42" y2="18" stroke="#00ff9d" strokeWidth="2" />
            <line x1="24" y1="23" x2="36" y2="23" stroke="#00f0ff" strokeWidth="1.5" />
            <rect x="48" y="16" width="10" height="10" fill="#1e293b" stroke="#ff2a85" strokeWidth="1.5" />
            <rect x="62" y="16" width="10" height="10" fill="#1e293b" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="58" y1="21" x2="62" y2="21" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="24" y1="33" x2="72" y2="33" stroke="#334155" strokeWidth="1" strokeDasharray="3 2" />
            <circle cx="48" cy="28" r="1.5" fill="#00ff9d" className="animate-ping" />
            {/* Base del teclado */}
            <path d="M 6 48 L 14 48 L 82 48 L 90 48 L 86 56 H 10 Z" fill="#1e293b" stroke="#00f0ff" strokeWidth="2" />
            <line x1="38" y1="52" x2="58" y2="52" stroke="#64748b" strokeWidth="2" />
          </svg>
        </div>

        {/* Mensaje explicativo pedagógico */}
        <div className="space-y-2 text-center">
          <h2 className="font-pixel text-xs uppercase leading-snug text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.7)] font-black">
            Abrí esta app desde una notebook escolar
          </h2>
          <p className="text-xs leading-relaxed text-slate-200">
            Esta plataforma de incubación <b className="text-cyan-300">Blockchain</b> está diseñada para netbooks escolares (pantalla mínima de <b>11 pulgadas / 1366×768</b>).
          </p>
          <p className="text-[11px] leading-relaxed text-slate-300 font-medium">
            El laboratorio interactivo, la simulación de nodos y los diagramas técnicos requieren teclado físico y espacio horizontal para trabajar en parejas en el aula.
          </p>
        </div>

        {/* Acciones para el estudiante */}
        <div className="mt-5 space-y-2">
          {/* Botón primario: Copiar enlace */}
          <button
            type="button"
            onClick={copiarEnlace}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-cyan-300 bg-cyan-400 px-4 py-2.5 font-pixel text-[10px] uppercase text-slate-950 font-bold shadow-[0_0_15px_rgba(0,240,255,0.5)] transition-all hover:bg-cyan-200 active:translate-y-0.5"
          >
            {copiado ? '✓ ¡ENLACE COPIADO AL PORTAPAPELES!' : '📋 COPIAR ENLACE PARA TU NOTEBOOK'}
          </button>

          {/* Botón secundario: Continuar de todos modos */}
          <button
            type="button"
            onClick={ignorarAviso}
            className="w-full rounded-lg border border-slate-600 bg-slate-800/90 px-3 py-2 text-center text-xs font-bold text-slate-200 transition-colors hover:text-cyan-300"
          >
            Continuar de todos modos en celular (vista limitada)
          </button>
        </div>
      </div>
    </aside>
  );
}
