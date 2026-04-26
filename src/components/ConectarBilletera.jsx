/**
 * ConectarBilletera.jsx — Rediseño con fondo blanco y colores limpios
 */
import Termino from './Termino';
import GraficoConectar from './graficos/GraficoConectar';
import GraficoWallet from './graficos/GraficoWallet';
import { useModo } from '../context/ModoContext';

export default function ConectarBilletera({ cuenta, chainId, balance, onConectar, cargando, error }) {
  const { esTecnico } = useModo();

  if (cuenta) {
    return (
      <div className="space-y-4">
        {/* Estado conectado */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-700 font-semibold text-sm">Wallet conectada</span>
        </div>

        {/* Datos */}
        <div className="grid grid-cols-1 gap-3">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
            <p className="text-slate-400 text-xs font-medium mb-1 flex items-center gap-1">
              <Termino id="address">Tu Address</Termino>
              <span className="text-slate-300">— tu identidad pública</span>
            </p>
            <p className="font-mono text-indigo-600 text-sm break-all font-medium">{cuenta}</p>
            {esTecnico && (
              <p className="text-slate-400 text-xs mt-1.5 bg-slate-100 rounded-lg px-2 py-1 font-mono">
                // 42 chars hex derivados de clave pública
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
              <p className="text-slate-400 text-xs font-medium mb-1">
                <Termino id="chainId">Red</Termino>
              </p>
              <p className="text-emerald-600 font-semibold text-sm">Sepolia Testnet</p>
              {esTecnico && <p className="text-slate-400 text-xs font-mono mt-0.5">{chainId}</p>}
            </div>
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
              <p className="text-slate-400 text-xs font-medium mb-1">
                <Termino id="ether">Balance</Termino>
              </p>
              <p className="text-amber-600 font-semibold text-sm">{balance} ETH</p>
              <p className="text-slate-400 text-xs">de prueba</p>
            </div>
          </div>
        </div>

        {esTecnico && (
          <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 font-mono text-xs text-violet-700 space-y-1">
            <p className="text-violet-400">// Cómo Ethers.js lo obtuvo:</p>
            <p>const provider = new ethers.BrowserProvider(window.ethereum)</p>
            <p>const signer = await provider.getSigner()</p>
            <p>const cuenta = await signer.getAddress()</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-slate-600 text-sm leading-relaxed">
        Una <Termino id="wallet">wallet</Termino> es tu identidad en Web3. Es como un pasaporte digital:
        la app puede ver tu <Termino id="address">address</Termino> pública pero nunca tu{' '}
        <Termino id="clave-privada">clave privada</Termino>.
        Al hacer click abajo aparecerá un popup de autorización.
      </p>

      {/* Diagrama */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <p className="text-slate-500 text-xs font-semibold mb-3 uppercase tracking-wide">
          ¿Qué pasa cuando hacés click?
        </p>
        <GraficoConectar />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm flex gap-2">
          <span>⚠️</span><span>{error}</span>
        </div>
      )}

      <button
        onClick={onConectar}
        disabled={cargando}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-indigo-100"
      >
        {cargando
          ? <><span className="animate-spin inline-block">⏳</span> Conectando...</>
          : <><span>🦊</span> Conectar MetaMask</>
        }
      </button>

      {/* Gráfico wallet mini */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <p className="text-slate-500 text-xs font-semibold mb-3 uppercase tracking-wide">
          ¿Qué guarda una wallet?
        </p>
        <GraficoWallet mini />
      </div>
    </div>
  );
}
