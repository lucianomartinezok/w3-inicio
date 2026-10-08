/**
 * PaginaDiccionario.jsx — ruta /diccionario
 * Diccionario completo de términos Web3 con búsqueda, filtros por categoría y deep-link por hash.
 * Estética neo-brutalista / cyber-clean, alta legibilidad y retorno directo al mapa.
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { diccionario, CATEGORIAS } from '../data/diccionario';
import { getGrafico } from '../components/graficos';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const CATEGORIA_ICONS = {
  fundamentos: '⛓️',
  identidad: '🔑',
  contratos: '📜',
  transacciones: '📨',
  costos: '⛽',
  infraestructura: '🌐',
};

export default function PaginaDiccionario() {
  useDocumentTitle('Glosario Web3');
  const [busqueda, setBusqueda] = useState('');
  const [catActiva, setCatActiva] = useState('Todos');
  const [expandido, setExpandido] = useState(() => window.location.hash.replace('#', '') || null);
  const entryRefs = useRef({});
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Deep link por hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        entryRefs.current[hash]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, []);

  const terminos = diccionario.filter((t) => {
    const q = busqueda.toLowerCase();
    const coincideBusqueda =
      !q || t.titulo.toLowerCase().includes(q) || t.definicion.toLowerCase().includes(q);
    const coincideCategoria = catActiva === 'Todos' || t.categoria === catActiva;
    return coincideBusqueda && coincideCategoria;
  });

  const categorias = ['Todos', ...Object.keys(CATEGORIAS)];

  return (
    <div className="min-h-dvh w-full bg-slate-100 text-slate-900 pb-12 select-text">
      <div className="w-full max-w-5xl mx-auto px-4 py-5 sm:px-6 lg:px-8">

        {/* CABECERA NEO-BRUTALISTA */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-900 pb-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate('/recorrido')}
              className="flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-slate-950 px-3.5 py-1.5 font-pixel text-[9px] uppercase text-cyan-300 font-bold shadow-[3px_3px_0_#0f172a] hover:bg-slate-800 hover:text-cyan-200 transition-colors active:translate-y-0.5"
            >
              <span>←</span>
              <span>VOLVER AL MAPA</span>
            </button>
            <span className="rounded border-2 border-slate-900 bg-fuchsia-200 px-2.5 py-1 font-pixel text-[9px] font-black uppercase text-slate-950 shadow-[2px_2px_0_#0f172a]">
              GLOSARIO TÉCNICO WEB3
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/teoria/web3')}
              className="rounded-lg border-2 border-slate-900 bg-white px-3 py-1 font-pixel text-[8.5px] uppercase font-bold text-slate-700 hover:bg-slate-100 transition-all"
            >
              Material 1
            </button>
            <button
              type="button"
              onClick={() => navigate('/teoria/conceptos')}
              className="rounded-lg border-2 border-slate-900 bg-white px-3 py-1 font-pixel text-[8.5px] uppercase font-bold text-slate-700 hover:bg-slate-100 transition-all"
            >
              Material 2
            </button>
            <button
              type="button"
              onClick={() => navigate('/demo')}
              className="rounded-lg border-2 border-slate-900 bg-cyan-400 px-3 py-1 font-pixel text-[8.5px] uppercase font-bold text-slate-950 shadow-[2px_2px_0_#0f172a] hover:bg-cyan-300 transition-all"
            >
              Laboratorio ↗
            </button>
          </div>
        </header>

        {/* TÍTULO Y PRESENTACIÓN */}
        <div className="mb-6 rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[6px_6px_0_#0f172a]">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-900 bg-fuchsia-300 text-2xl shadow-[2px_2px_0_#0f172a]">
              📖
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
                Glosario de Conceptos Blockchain
              </h1>
              <p className="text-sm text-slate-600 font-semibold mt-0.5">
                {diccionario.length} definiciones técnicas con analogías pedagógicas y ejemplos prácticos de aula.
              </p>
            </div>
          </div>
        </div>

        {/* BUSCADOR */}
        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-base">
            🔍
          </span>
          <input
            ref={searchRef}
            type="text"
            aria-label="Buscar en el glosario"
            placeholder="Buscá un término técnico... ej: gas, wallet, hash, firma, nonce"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setCatActiva('Todos');
            }}
            className="w-full rounded-xl border-2 border-slate-900 bg-white pl-11 pr-10 py-3 text-sm font-semibold text-slate-950 placeholder-slate-400 shadow-[4px_4px_0_#0f172a] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
          />
          {busqueda && (
            <button
              onClick={() => {
                setBusqueda('');
                searchRef.current?.focus();
              }}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded border border-slate-400 text-slate-600 hover:bg-slate-100 text-sm font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* FILTROS POR CATEGORÍA */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categorias.map((cat) => {
            const esActivo = catActiva === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCatActiva(cat);
                  setBusqueda('');
                }}
                className={`rounded-lg border-2 border-slate-900 px-3 py-1 font-pixel text-[8.5px] uppercase font-bold transition-all ${
                  esActivo
                    ? 'bg-cyan-400 text-slate-950 shadow-[2px_2px_0_#0f172a]'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat !== 'Todos' && CATEGORIA_ICONS[cat] && `${CATEGORIA_ICONS[cat]} `}
                {cat === 'Todos' ? 'Todos' : CATEGORIAS[cat]}
                {cat === 'Todos' && ` (${diccionario.length})`}
              </button>
            );
          })}
        </div>

        {/* LISTADO DE TÉRMINOS */}
        {terminos.length === 0 ? (
          <div className="rounded-2xl border-4 border-slate-900 bg-white p-12 text-center shadow-[6px_6px_0_#0f172a]">
            <p className="text-4xl mb-2">🔭</p>
            <p className="font-pixel text-xs uppercase text-slate-900 font-bold">Sin resultados</p>
            <p className="text-sm text-slate-600 font-medium mt-1">
              No encontramos coincidencias para &quot;{busqueda}&quot;. Probá con otro término técnico.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {terminos.map((termino) => {
              const estaExpandido = expandido === termino.id;
              const Grafico = termino.graficoId ? getGrafico(termino.graficoId) : null;

              return (
                <div
                  key={termino.id}
                  ref={(el) => {
                    if (el) entryRefs.current[termino.id] = el;
                  }}
                  id={termino.id}
                  className={`rounded-xl border-2 border-slate-900 bg-white transition-all shadow-[4px_4px_0_#0f172a] ${
                    estaExpandido ? 'ring-2 ring-cyan-400' : ''
                  }`}
                >
                  {/* Encabezado del término */}
                  <button
                    type="button"
                    onClick={() => {
                      setExpandido(estaExpandido ? null : termino.id);
                      window.history.replaceState(null, '', `/diccionario#${termino.id}`);
                    }}
                    className={`w-full flex items-center justify-between gap-4 p-4 text-left transition-colors ${
                      estaExpandido ? 'bg-cyan-50/70 border-b-2 border-slate-900' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-black text-slate-950 capitalize">
                          {termino.titulo}
                        </span>
                        {termino.categoria && (
                          <span className="rounded border border-slate-900 bg-slate-100 px-2 py-0.5 font-pixel text-[8px] font-bold text-slate-700 uppercase">
                            {CATEGORIA_ICONS[termino.categoria]} {CATEGORIAS[termino.categoria]}
                          </span>
                        )}
                      </div>
                      {!estaExpandido && (
                        <p className="mt-1 text-xs text-slate-600 truncate font-medium">
                          {termino.definicion}
                        </p>
                      )}
                    </div>
                    <span className={`text-slate-800 font-bold text-xl transition-transform ${estaExpandido ? 'rotate-180' : ''}`}>
                      ▾
                    </span>
                  </button>

                  {/* Cuerpo desplegable */}
                  {estaExpandido && (
                    <div className="p-5 space-y-4">
                      {/* Definición */}
                      <div>
                        <span className="font-pixel text-[8.5px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                          Definición técnica
                        </span>
                        <p className="text-sm text-slate-900 font-semibold leading-relaxed">
                          {termino.definicion}
                        </p>
                      </div>

                      {/* Analogía */}
                      {termino.analogia && (
                        <div className="rounded-lg border-2 border-slate-900 bg-amber-50 p-4 shadow-[2px_2px_0_#0f172a]">
                          <span className="font-pixel text-[8.5px] uppercase font-bold text-amber-800 block mb-1">
                            💡 Analogía pedagógica para el aula
                          </span>
                          <p className="text-xs text-amber-950 leading-relaxed font-semibold">
                            {termino.analogia}
                          </p>
                        </div>
                      )}

                      {/* Ejemplo */}
                      {termino.ejemplo && (
                        <div className="rounded-lg border-2 border-slate-900 bg-cyan-50 p-4 shadow-[2px_2px_0_#0f172a]">
                          <span className="font-pixel text-[8.5px] uppercase font-bold text-cyan-800 block mb-1">
                            🔍 Ejemplo de aplicación
                          </span>
                          <p className="text-xs text-cyan-950 leading-relaxed font-semibold">
                            {termino.ejemplo}
                          </p>
                        </div>
                      )}

                      {/* Gráfico interactivo */}
                      {Grafico && (
                        <div className="rounded-lg border-2 border-slate-900 bg-slate-50 p-4 shadow-[2px_2px_0_#0f172a]">
                          <span className="font-pixel text-[8.5px] uppercase font-bold text-slate-600 block mb-2 text-center">
                            Diagrama de Funcionamiento
                          </span>
                          <div className="flex justify-center p-2">
                            <Grafico />
                          </div>
                        </div>
                      )}

                      {/* Términos relacionados */}
                      {termino.relacionados?.length > 0 && (
                        <div className="border-t border-slate-200 pt-3">
                          <span className="font-pixel text-[8.5px] uppercase font-bold text-slate-500 block mb-2">
                            Términos relacionados
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {termino.relacionados.map((rel) => (
                              <button
                                key={rel}
                                type="button"
                                onClick={() => {
                                  setExpandido(rel);
                                  window.history.replaceState(null, '', `/diccionario#${rel}`);
                                  setTimeout(
                                    () =>
                                      entryRefs.current[rel]?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'center',
                                      }),
                                    100
                                  );
                                }}
                                className="rounded-md border border-slate-900 bg-slate-100 hover:bg-cyan-200 px-2.5 py-1 font-pixel text-[8px] uppercase font-bold text-slate-900 transition-colors"
                              >
                                {rel}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
