/**
 * FormularioMensaje.jsx — Rediseño limpio
 */
import { useState } from 'react';
import Termino from './Termino';
import GraficoLeerVsEscribir from './graficos/GraficoLeerVsEscribir';
import { useModo } from '../context/ModoContext';

export default function FormularioMensaje({ cuenta, onEnviar, cargando, error }) {
  const [texto, setTexto] = useState('');
  const { esTecnico } = useModo();
  const disabled = !cuenta || cargando;

  return (
    <div className="space-y-5">
      {/* Diferencia clave */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <p className="text-slate-500 text-xs font-semibold mb-3 uppercase tracking-wide">
          La diferencia más importante en Web3
        </p>
        <GraficoLeerVsEscribir />
      </div>

      {/* Input */}
      <div>
        <label className="block text-slate-700 font-semibold text-sm mb-2">
          Tu mensaje para la blockchain
        </label>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribí lo que quieras guardar para siempre..."
          disabled={disabled}
          maxLength={200}
          rows={3}
          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all disabled:bg-slate-50 disabled:text-slate-400 text-sm resize-none"
        />
        <div className="flex justify-between items-center mt-1.5">
          <p className="text-slate-400 text-xs">
            Máx. 200 caracteres
          </p>
          <p className={`text-xs font-mono ${texto.length > 180 ? 'text-amber-500' : 'text-slate-400'}`}>
            {texto.length}/200
          </p>
        </div>
      </div>

      {/* Info gas */}
      {esTecnico && texto && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-xs">
          <p className="font-semibold mb-1">⛽ Estimación de gas:</p>
          <p>~43.000 unidades × ~20 Gwei = <strong>~0.00086 ETH de prueba</strong></p>
          <p className="font-mono mt-1 text-amber-500">await contract.actualizarMensaje("{texto.slice(0,20)}...")</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm flex gap-2">
          <span>⚠️</span><span>{error}</span>
        </div>
      )}

      <button
        onClick={() => onEnviar(texto)}
        disabled={disabled || !texto.trim()}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-amber-100"
      >
        {cargando
          ? <><span className="animate-spin inline-block">⏳</span> Esperando confirmación...</>
          : <><span>✍️</span> Firmar y enviar a la blockchain</>
        }
      </button>

      <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-xs text-amber-700">
        <span>🦊</span>
        <span>Va a aparecer un popup de MetaMask pidiendo tu firma</span>
      </div>
    </div>
  );
}
