/**
 * PaginaDiccionario.jsx — ruta /diccionario
 * Diccionario completo de términos Web3 con búsqueda, filtros por categoría y deep-link por hash.
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { diccionario, CATEGORIAS } from '../data/diccionario';
import { getGrafico } from '../components/graficos';
import Sidebar from '../components/Sidebar';

const CATEGORIA_ICONS = {
  fundamentos: '⛓',
  identidad: '🔑',
  contratos: '📜',
  transacciones: '📨',
  costos: '⛽',
  infraestructura: '🌐',
};

export default function PaginaDiccionario() {
  const [busqueda, setBusqueda] = useState('');
  const [catActiva, setCatActiva] = useState('Todos');
  const [expandido, setExpandido] = useState(() => window.location.hash.replace('#', '') || null);
  const entryRefs = useRef({});
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
    const coincideBusqueda = !q || t.titulo.toLowerCase().includes(q) || t.definicion.toLowerCase().includes(q);
    const coincideCategoria = catActiva === 'Todos' || t.categoria === catActiva;
    return coincideBusqueda && coincideCategoria;
  });

  const categorias = ['Todos', ...Object.keys(CATEGORIAS)];

  return (
    <>
      {/* Sidebar sin pasoActual (estamos en diccionario) */}
      <Sidebar pasoActual={-1} />

      <div className="flex-1 min-w-0 overflow-y-auto">
        <div className="px-8 py-8 lg:px-12 xl:px-16 lg:py-10 max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-7 text-center">
            <button
              onClick={() => navigate('/teoria/web3')}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 fs-meta mb-5 transition-colors"
            >
              ← Volver a teoría
            </button>
            <h1 className="fs-h1 font-black text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              📖 Diccionario Web3
            </h1>
            <p className="text-slate-600 fs-lead mt-2">
              {diccionario.length} términos explicados con analogías y ejemplos reales.
            </p>
          </div>

          {/* Buscador */}
          <div className="relative mb-5">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 fs-meta">🔍</span>
            <input
              type="text"
              placeholder="Buscá un término... ej: gas, wallet, hash"
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setCatActiva('Todos'); }}
              className="w-full bg-white border border-slate-300 rounded-2xl pl-12 pr-4 py-4 fs-meta text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 shadow-sm transition-all"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-xl"
              >
                ×
              </button>
            )}
          </div>

          {/* Filtros categorías */}
          <div className="flex gap-2 flex-wrap mb-7 justify-center">
            {categorias.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCatActiva(cat); setBusqueda(''); }}
                className={`px-4 py-2 rounded-full fs-eyebrow font-semibold border transition-all ${
                  catActiva === cat
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {cat !== 'Todos' && CATEGORIA_ICONS[cat] && `${CATEGORIA_ICONS[cat]} `}
                {cat === 'Todos' ? 'Todos' : CATEGORIAS[cat]}
                {cat === 'Todos' && ` (${diccionario.length})`}
              </button>
            ))}
          </div>

          {/* Resultados */}
          {terminos.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-3">🔭</p>
              <p className="font-semibold">Sin resultados</p>
              <p className="text-sm mt-1">Probá otro término</p>
            </div>
          ) : (
            <div className="space-y-2">
              {terminos.map((termino) => {
                const estaExpandido = expandido === termino.id;
                const Grafico = termino.graficoId ? getGrafico(termino.graficoId) : null;

                return (
                  <div
                    key={termino.id}
                    ref={(el) => { if (el) entryRefs.current[termino.id] = el; }}
                    id={termino.id}
                    className={`bg-white rounded-2xl border shadow-sm transition-all ${
                      estaExpandido ? 'border-indigo-200' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Header término */}
                    <button
                      onClick={() => {
                        setExpandido(estaExpandido ? null : termino.id);
                        window.history.replaceState(null, '', `/diccionario#${termino.id}`);
                      }}
                      className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl text-left transition-all ${estaExpandido ? 'bg-indigo-50 rounded-b-none' : 'hover:bg-slate-50'}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 fs-h3 capitalize">{termino.titulo}</span>
                          {termino.categoria && (
                            <span className="fs-eyebrow bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-semibold">
                              {CATEGORIA_ICONS[termino.categoria]} {CATEGORIAS[termino.categoria]}
                            </span>
                          )}
                        </div>
                        {!estaExpandido && (
                          <p className="text-slate-500 fs-meta mt-1 truncate">{termino.definicion}</p>
                        )}
                      </div>
                      <span className={`text-slate-400 text-2xl transition-transform shrink-0 ${estaExpandido ? 'rotate-180' : ''}`}>
                        ▾
                      </span>
                    </button>

                    {/* Contenido expandido */}
                    {estaExpandido && (
                      <div className="px-6 pb-6 space-y-4 fade-in">
                        {/* Definición */}
                        <div>
                          <p className="text-slate-500 fs-eyebrow font-bold uppercase tracking-wider mb-1.5">Definición</p>
                          <p className="text-slate-700 fs-body leading-relaxed">{termino.definicion}</p>
                        </div>

                        {/* Analogía */}
                        {termino.analogia && (
                          <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4">
                            <p className="text-amber-700 fs-eyebrow font-bold mb-1.5 uppercase tracking-wide">💡 Analogía en el mundo real</p>
                            <p className="text-amber-900 fs-meta leading-relaxed">{termino.analogia}</p>
                          </div>
                        )}

                        {/* Ejemplo */}
                        {termino.ejemplo && (
                          <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4">
                            <p className="text-blue-700 fs-eyebrow font-bold mb-1.5 uppercase tracking-wide">🔍 Ejemplo</p>
                            <p className="text-blue-900 fs-meta leading-relaxed">{termino.ejemplo}</p>
                          </div>
                        )}

                        {/* Gráfico */}
                        {Grafico && (
                          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                            <p className="text-slate-500 fs-eyebrow font-bold uppercase tracking-wider mb-3">Diagrama</p>
                            <div className="flex justify-center">
                              <Grafico />
                            </div>
                          </div>
                        )}

                        {/* Términos relacionados */}
                        {termino.relacionados?.length > 0 && (
                          <div>
                            <p className="text-slate-500 fs-eyebrow font-bold uppercase tracking-wider mb-2">Relacionados</p>
                            <div className="flex flex-wrap gap-2">
                              {termino.relacionados.map((rel) => (
                                <button
                                  key={rel}
                                  onClick={() => {
                                    setExpandido(rel);
                                    window.history.replaceState(null, '', `/diccionario#${rel}`);
                                    setTimeout(() => entryRefs.current[rel]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                                  }}
                                  className="fs-eyebrow bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-full font-semibold transition-colors capitalize"
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

          <div className="h-8" />
        </div>
      </div>
    </>
  );
}
