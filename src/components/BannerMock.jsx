/**
 * BannerMock.jsx
 * Banner amarillo visible solo en v0. Informa que todo es simulado.
 * Desaparece automáticamente cuando services/web3.js apunta a web3Real.
 */
import { useState } from 'react';
import { obtenerInfoContrato } from '../services/web3';

export default function BannerMock() {
  const [cerrado, setCerrado] = useState(false);
  const info = obtenerInfoContrato();

  if (!info.esMock || cerrado) return null;

  return (
    <div className="bg-amber-400 text-amber-950 px-4 py-2.5 flex items-center justify-between gap-4 text-sm font-medium">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xl">🧪</span>
        <span>
          <strong>Modo Simulación (v0)</strong> — Estás aprendiendo sin blockchain real.
          Ningún dato sale de tu computadora. Los hashes y bloques son inventados.
        </span>
        <a
          href="#v1"
          className="underline hover:no-underline font-bold"
          onClick={(e) => { e.preventDefault(); document.getElementById('seccion-v1')?.scrollIntoView({ behavior: 'smooth' }); }}
        >
          ¿Cómo conectar la blockchain real?
        </a>
      </div>
      <button
        onClick={() => setCerrado(true)}
        className="shrink-0 text-amber-800 hover:text-amber-950 text-xl font-bold leading-none"
        aria-label="Cerrar"
      >
        ×
      </button>
    </div>
  );
}
