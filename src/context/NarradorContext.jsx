/**
 * NarradorContext.jsx
 * Registra y expone el log de eventos del flujo Web3 en tiempo real.
 * Cada evento tiene: tipo, mensaje humano, detalle técnico, timestamp y estado.
 *
 * Cualquier componente puede escribir eventos con useNarrador().log(...)
 * El PanelNarrador los muestra en vivo en la columna derecha.
 */

import { useState, useCallback } from 'react';
import { NarradorContext } from './narradorContextBase';

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

