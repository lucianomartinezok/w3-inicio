/**
 * RutaAprendizaje.jsx
 * Stepper horizontal que muestra el progreso del usuario en los 6 pasos del flujo.
 * Se actualiza automáticamente desde el pasoActual del hook useContrato.
 */
import { useState } from 'react';
import { PASOS } from '../hooks/useContrato';
import { getGrafico } from './graficos/index';

const CONFIG_PASOS = [
  {
    id: 'wallet',
    label: 'Wallet',
    desc: 'Conectá tu billetera digital',
    icono: '🦊',
    graficoId: 'GraficoWallet',
    tip: 'La wallet es tu identidad en Web3. No guarda monedas, guarda tu clave.',
  },
  {
    id: 'red',
    label: 'Red',
    desc: 'Verificar Sepolia testnet',
    icono: '🌐',
    graficoId: 'GraficoRedes',
    tip: 'Sepolia es la red de pruebas. El ETH aquí es gratis y sin valor real.',
  },
  {
    id: 'lectura',
    label: 'Lectura',
    desc: 'Leer sin gastar nada',
    icono: '📖',
    graficoId: 'GraficoLeerVsEscribir',
    tip: 'Leer datos de la blockchain es gratis. No requiere firma ni gas.',
  },
  {
    id: 'firma',
    label: 'Firma',
    desc: 'Autorizar escritura',
    icono: '✍️',
    graficoId: 'GraficoFirma',
    tip: 'Firmar = aprobar la transacción con tu clave privada. MetaMask lo hace por vos.',
  },
  {
    id: 'minado',
    label: 'Minado',
    desc: 'Esperar confirmación',
    icono: '⛏️',
    graficoId: 'GraficoCicloTx',
    tip: 'Los validadores agrupan tu tx en un bloque. Tarda ~12 segundos en Sepolia.',
  },
  {
    id: 'confirmacion',
    label: 'Confirmación',
    desc: 'Dato on-chain para siempre',
    icono: '✅',
    graficoId: 'GraficoBlockchain',
    tip: '¡Tu dato quedó grabado permanentemente! Nadie puede borrarlo.',
  },
];

export default function RutaAprendizaje({ pasoActual }) {
  const [tooltipAbierto, setTooltipAbierto] = useState(null);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
      <div className="text-slate-500 text-xs font-semibold mb-3 uppercase tracking-wide">
        Tu ruta de aprendizaje
      </div>
      <div className="flex items-center justify-between gap-1 relative">
        {/* Línea de fondo */}
        <div className="absolute top-4 left-8 right-8 h-0.5 bg-slate-700 -z-0" />

        {CONFIG_PASOS.map((paso, idx) => {
          const estado =
            idx < pasoActual ? 'completo' :
            idx === pasoActual ? 'actual' : 'pendiente';

          const Grafico = getGrafico(paso.graficoId);

          return (
            <div
              key={paso.id}
              className="flex flex-col items-center gap-1.5 relative z-10 flex-1"
              onMouseEnter={() => setTooltipAbierto(idx)}
              onMouseLeave={() => setTooltipAbierto(null)}
            >
              {/* Círculo */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                estado === 'completo' ? 'bg-emerald-600 border-2 border-emerald-400 shadow-emerald-900/50 shadow-lg' :
                estado === 'actual'   ? 'bg-indigo-600 border-2 border-indigo-400 ring-2 ring-indigo-500/30 shadow-indigo-900/50 shadow-lg animate-pulse' :
                'bg-slate-800 border-2 border-slate-600'
              }`}>
                {estado === 'completo' ? '✓' : paso.icono}
              </div>

              {/* Label */}
              <div className={`text-center transition-colors ${
                estado === 'completo' ? 'text-emerald-400' :
                estado === 'actual'   ? 'text-indigo-300 font-bold' :
                'text-slate-600'
              }`}>
                <div className="text-xs font-semibold leading-tight">{paso.label}</div>
                <div className="text-[9px] leading-tight hidden sm:block text-slate-600">{paso.desc}</div>
              </div>

              {/* Tooltip con gráfico */}
              {tooltipAbierto === idx && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs">
                  <div className="font-semibold text-white mb-1">{paso.icono} {paso.label}</div>
                  <p className="text-slate-400 mb-2">{paso.tip}</p>
                  {Grafico && (
                    <div className="bg-slate-950 rounded-lg p-2 overflow-hidden">
                      <Grafico mini />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
