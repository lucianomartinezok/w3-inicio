/**
 * ModoContext.jsx
 * Controla si la app está en modo Principiante o Técnico.
 *
 * - Principiante: solo muestra info en lenguaje humano.
 * - Técnico: muestra hex, wei, bytecalldata, detalles de Ethers.js.
 *
 * Se persiste en localStorage para que no se pierda al recargar.
 */

import { useState } from 'react';
import { ModoContext } from './modoContextBase';

export function ModoProvider({ children }) {
  const [modo, setModo] = useState(
    () => {
      try {
        return localStorage.getItem('web3demo_modo') || 'principiante';
      } catch {
        return 'principiante';
      }
    }
  );

  const toggleModo = () => {
    setModo((prev) => {
      const next = prev === 'principiante' ? 'tecnico' : 'principiante';
      try {
        localStorage.setItem('web3demo_modo', next);
      } catch {
        // El modo sigue activo durante la sesión aunque no pueda persistirse.
      }
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
