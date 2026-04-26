/**
 * Termino.jsx — Término del glosario con popover al click.
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { diccionarioPorId } from '../data/diccionario';
import { getGrafico } from './graficos';

export default function Termino({ id, children }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const dato = diccionarioPorId[id];

  if (!dato) return <span>{children}</span>;

  const Grafico = dato.graficoId ? getGrafico(dato.graficoId) : null;

  useEffect(() => {
    if (!abierto) return;
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [abierto]);

  return (
    <span className="relative inline-block" ref={ref}>
      <span
        className="termino"
        onClick={(e) => { e.stopPropagation(); setAbierto(!abierto); }}
        title={dato.def}
      >
        {children}
      </span>

      {abierto && (
        <div
          className="absolute z-50 left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 slide-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-indigo-50 rounded-t-2xl px-4 py-3 border-b border-indigo-100">
            <div className="flex items-center justify-between">
              <span className="font-black text-indigo-700 text-sm capitalize">{dato.nombre}</span>
              <button onClick={() => setAbierto(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">×</button>
            </div>
            {dato.categoria && (
              <span className="text-xs text-indigo-400 font-medium">{dato.categoria}</span>
            )}
          </div>

          <div className="px-4 py-3 space-y-3">
            {/* Definición */}
            <p className="text-slate-700 text-xs leading-relaxed">{dato.def}</p>

            {/* Analogía */}
            {dato.analogia && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                <p className="text-amber-600 text-xs font-semibold mb-0.5">💡 Analogía</p>
                <p className="text-amber-700 text-xs leading-relaxed">{dato.analogia}</p>
              </div>
            )}

            {/* Gráfico mini */}
            {Grafico && (
              <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                <Grafico mini />
              </div>
            )}

            {/* Ver más */}
            <button
              onClick={() => { setAbierto(false); navigate(`/diccionario#${id}`); }}
              className="w-full text-center text-indigo-500 hover:text-indigo-700 text-xs font-semibold py-1.5 hover:bg-indigo-50 rounded-xl transition-colors"
            >
              Ver en el diccionario →
            </button>
          </div>
        </div>
      )}
    </span>
  );
}
