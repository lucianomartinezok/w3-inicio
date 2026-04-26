/**
 * VisualizarMensaje.jsx — Rediseño con detalles de la transacción
 */
import Termino from './Termino';
import { useModo } from '../context/ModoContext';
import { obtenerInfoContrato } from '../services/web3';

export default function VisualizarMensaje({ mensaje, ultimaTx }) {
  const { esTecnico } = useModo();
  const info = obtenerInfoContrato();

  if (!mensaje && !ultimaTx) return null;

  return (
    <div className="space-y-4">
      {/* El mensaje */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
        <p className="text-violet-500 text-xs font-semibold uppercase tracking-wide mb-2">
          💜 Mensaje guardado en la blockchain
        </p>
        <p className="text-violet-800 font-bold text-lg leading-relaxed">"{mensaje}"</p>
        <p className="text-violet-500 text-xs mt-2">
          Inmutable · Público · Para siempre
        </p>
      </div>

      {/* Detalles de la tx */}
      {ultimaTx && (
        <div className="space-y-2">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
            Detalles de la transacción
          </p>

          <TxRow
            label={<Termino id="hash">Hash</Termino>}
            value={
              <a
                href={`https://sepolia.etherscan.io/tx/${ultimaTx.hash}`}
                target="_blank" rel="noreferrer"
                className={`font-mono text-xs text-indigo-600 hover:underline break-all ${info.esMock ? 'line-through opacity-60' : ''}`}
              >
                {ultimaTx.hash}
              </a>
            }
            note={info.esMock ? 'hash simulado (no existe en Sepolia)' : null}
          />

          {ultimaTx.bloque && (
            <TxRow
              label={<Termino id="bloque">Bloque</Termino>}
              value={<span className="font-mono text-sm text-slate-700">#{ultimaTx.bloque}</span>}
            />
          )}

          {ultimaTx.gasUsado && (
            <TxRow
              label={<Termino id="gas">Gas usado</Termino>}
              value={<span className="text-sm text-slate-700">{Number(ultimaTx.gasUsado).toLocaleString()} unidades</span>}
            />
          )}

          {ultimaTx.desde && (
            <TxRow
              label="Firmado por"
              value={<span className="font-mono text-xs text-slate-600 break-all">{ultimaTx.desde}</span>}
            />
          )}

          {esTecnico && ultimaTx.nonce !== undefined && (
            <TxRow
              label={<Termino id="nonce">Nonce</Termino>}
              value={<span className="font-mono text-sm text-slate-700">{ultimaTx.nonce}</span>}
              note="Contador de transacciones de tu address"
            />
          )}
        </div>
      )}

      {/* Enlace a Etherscan */}
      {ultimaTx?.hash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${ultimaTx.hash}`}
          target="_blank" rel="noreferrer"
          className={`flex items-center justify-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
            info.esMock
              ? 'border-slate-200 text-slate-400 cursor-not-allowed'
              : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50'
          }`}
          onClick={info.esMock ? (e) => e.preventDefault() : undefined}
        >
          <span>🔍</span>
          <span>Ver en Etherscan</span>
          {info.esMock && <span className="text-slate-400 text-xs">(no disponible en simulación)</span>}
        </a>
      )}
    </div>
  );
}

function TxRow({ label, value, note }) {
  return (
    <div className="flex gap-3 items-start bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
      <span className="text-slate-500 text-xs font-semibold whitespace-nowrap pt-0.5 w-24 shrink-0">{label}</span>
      <div className="flex-1 min-w-0">
        <div>{value}</div>
        {note && <p className="text-slate-400 text-xs mt-0.5">{note}</p>}
      </div>
    </div>
  );
}
