/**
 * NarradorContext.jsx
 * Registra y expone el log de eventos del flujo Web3 en tiempo real.
 * Cada evento tiene: tipo, mensaje humano, detalle técnico, timestamp y estado.
 *
 * Cualquier componente puede escribir eventos con useNarrador().log(...)
 * El PanelNarrador los muestra en vivo en la columna derecha.
 */

import { createContext, useContext, useState, useCallback } from 'react';

const NarradorContext = createContext(null);

// Tipos de evento con su configuración visual
export const TIPOS_EVENTO = {
  info:     { color: 'text-slate-300',  bg: 'bg-slate-800',   icono: 'ℹ️' },
  accion:   { color: 'text-indigo-300', bg: 'bg-indigo-950',  icono: '⚡' },
  espera:   { color: 'text-amber-300',  bg: 'bg-amber-950',   icono: '⏳' },
  exito:    { color: 'text-emerald-300',bg: 'bg-emerald-950', icono: '✅' },
  error:    { color: 'text-red-300',    bg: 'bg-red-950',     icono: '❌' },
  tecnico:  { color: 'text-purple-300', bg: 'bg-purple-950',  icono: '🔧' },
};

let _idCounter = 0;

export function NarradorProvider({ children }) {
  const [eventos, setEventos] = useState([]);

  const log = useCallback(({ tipo = 'info', humano, tecnico = null }) => {
    setEventos((prev) => [
      ...prev,
      {
        id: _idCounter++,
        tipo,
        humano,
        tecnico,
        timestamp: new Date(),
        expandido: false,
      },
    ]);
  }, []);

  const limpiar = useCallback(() => setEventos([]), []);

  const toggleExpandir = useCallback((id) => {
    setEventos((prev) =>
      prev.map((e) => (e.id === id ? { ...e, expandido: !e.expandido } : e))
    );
  }, []);

  return (
    <NarradorContext.Provider value={{ eventos, log, limpiar, toggleExpandir }}>
      {children}
    </NarradorContext.Provider>
  );
}

export function useNarrador() {
  const ctx = useContext(NarradorContext);
  if (!ctx) throw new Error('useNarrador debe usarse dentro de NarradorProvider');
  return ctx;
}
