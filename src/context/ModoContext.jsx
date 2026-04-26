/**
 * ModoContext.jsx
 * Controla si la app está en modo Principiante o Técnico.
 *
 * - Principiante: solo muestra info en lenguaje humano.
 * - Técnico: muestra hex, wei, bytecalldata, detalles de Ethers.js.
 *
 * Se persiste en localStorage para que no se pierda al recargar.
 */

import { createContext, useContext, useState } from 'react';

const ModoContext = createContext(null);

export function ModoProvider({ children }) {
  const [modo, setModo] = useState(
    () => localStorage.getItem('web3demo_modo') || 'principiante'
  );

  const toggleModo = () => {
    setModo((prev) => {
      const next = prev === 'principiante' ? 'tecnico' : 'principiante';
      localStorage.setItem('web3demo_modo', next);
      return next;
    });
  };

  const esTecnico = modo === 'tecnico';

  return (
    <ModoContext.Provider value={{ modo, esTecnico, toggleModo }}>
      {children}
    </ModoContext.Provider>
  );
}

export function useModo() {
  const ctx = useContext(ModoContext);
  if (!ctx) throw new Error('useModo debe usarse dentro de ModoProvider');
  return ctx;
}
