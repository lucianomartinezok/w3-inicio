/**
 * SeccionEducativa.jsx — Sección de conceptos base, diseño limpio
 */
import { useState } from 'react';
import Termino from './Termino';
import GraficoBlockchain from './graficos/GraficoBlockchain';
import GraficoWallet from './graficos/GraficoWallet';
import GraficoRedes from './graficos/GraficoRedes';

const BLOQUES = [
  {
    id: 'blockchain',
    icono: '⛓',
    titulo: '¿Qué es la Blockchain?',
    color: 'indigo',
    resumen: 'Una base de datos pública, compartida e inmutable.',
  },
  {
    id: 'wallet',
    icono: '👛',
    titulo: '¿Qué es una Wallet?',
    color: 'emerald',
    resumen: 'Tu identidad y llavero digital en Web3.',
  },
  {
    id: 'contrato',
    icono: '📜',
    titulo: '¿Qué es un Smart Contract?',
    color: 'amber',
    resumen: 'Código que vive y se ejecuta en la blockchain.',
  },
  {
    id: 'redes',
    icono: '🌐',
    titulo: 'Mainnet vs. Testnet',
    color: 'violet',
    resumen: 'La red real vs. la red de práctica (donde estamos).',
  },
];

const CONTENIDO = {
  blockchain: {
    Grafico: GraficoBlockchain,
    texto: (
      <>
        <p>
          Imaginá una hoja de cálculo compartida por millones de computadoras al mismo tiempo.
          Cada vez que alguien agrega una fila (<Termino id="transaccion">transacción</Termino>),
          todas las computadoras lo verifican y lo copian.
          Una vez anotado, <strong>nadie lo puede borrar</strong>.
        </p>
        <p className="mt-2">
          Eso es una <Termino id="blockchain">blockchain</Termino>: bloques de datos enlazados
          cronológicamente, verificados por toda la red (<Termino id="descentralizacion">descentralización</Termino>).
        </p>
      </>
    ),
  },
  wallet: {
    Grafico: GraficoWallet,
    texto: (
      <>
        <p>
          Una <Termino id="wallet">wallet</Termino> no guarda monedas: guarda tus{' '}
          <Termino id="clave-privada">claves privadas</Termino>.
          Es como un llavero: la llave pública (<Termino id="address">address</Termino>) la ven todos,
          la llave privada solo la tenés vos.
        </p>
        <p className="mt-2">
          MetaMask es la wallet más popular para desarrollo Web3. Al "conectarla",
          la app puede ver tu address pero <strong>nunca tu clave privada</strong>.
        </p>
      </>
    ),
  },
  contrato: {
    Grafico: null,
    texto: (
      <>
        <p>
          Un <Termino id="smart-contract">smart contract</Termino> es código{' '}
          <Termino id="solidity">Solidity</Termino> que se desplegó (publicó) en la blockchain
          y ahora vive ahí para siempre.
          Cualquiera puede leerlo, ejecutarlo o auditarlo.
        </p>
        <p className="mt-2">
          La función que usamos acá es <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">actualizarMensaje(string _nuevo)</code>:
          al llamarla, guarda tu texto en el contrato y emite un{' '}
          <Termino id="evento">evento</Termino> para notificar a quien esté escuchando.
        </p>
        <div className="mt-3 bg-slate-800 rounded-xl p-4">
          <pre className="text-emerald-400 text-xs font-mono leading-relaxed overflow-x-auto">{`function actualizarMensaje(string memory _nuevo) public {
    require(bytes(_nuevo).length > 0, "Vacio");
    mensaje = _nuevo;
    emit MensajeActualizado(msg.sender, _nuevo);
}`}</pre>
        </div>
      </>
    ),
  },
  redes: {
    Grafico: GraficoRedes,
    texto: (
      <>
        <p>
          La <Termino id="mainnet">mainnet</Termino> es la red real de Ethereum donde el{' '}
          <Termino id="ether">ETH</Termino> tiene valor real.
          La <Termino id="testnet">testnet</Termino> (usamos <strong>Sepolia</strong>) es idéntica técnicamente,
          pero el ETH no vale dinero. Es perfecta para aprender y testear.
        </p>
        <p className="mt-2">
          En un <Termino id="faucet">faucet</Termino> podés pedir ETH de prueba gratis.
          Todo lo que hagamos en esta demo usa Sepolia (o la simulación del v0).
        </p>
      </>
    ),
  },
};

const COLOR_MAP = {
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-100', icon: 'bg-indigo-100 text-indigo-600', text: 'text-indigo-700', hover: 'hover:bg-indigo-50' },
  emerald:{ bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-700', hover: 'hover:bg-emerald-50' },
  amber:  { bg: 'bg-amber-50', border: 'border-amber-100', icon: 'bg-amber-100 text-amber-600', text: 'text-amber-700', hover: 'hover:bg-amber-50' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-100', icon: 'bg-violet-100 text-violet-600', text: 'text-violet-700', hover: 'hover:bg-violet-50' },
};

export default function SeccionEducativa() {
  const [abierto, setAbierto] = useState(null);

  return (
    <div className="space-y-4">
      {/* Título */}
      <div>
        <h2 className="font-black text-slate-800 text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          🎓 Conceptos base
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Antes de tocar código, entendé qué está pasando. Hacé click en cada uno.
        </p>
      </div>

      {BLOQUES.map((bloque) => {
        const estaAbierto = abierto === bloque.id;
        const c = COLOR_MAP[bloque.color];
        const contenido = CONTENIDO[bloque.id];
        const Grafico = contenido?.Grafico;

        return (
          <div
            key={bloque.id}
            className={`bg-white rounded-2xl border transition-all shadow-sm ${estaAbierto ? c.border : 'border-slate-200 hover:border-slate-300'}`}
          >
            {/* Header */}
            <button
              onClick={() => setAbierto(estaAbierto ? null : bloque.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all ${estaAbierto ? c.bg : 'hover:bg-slate-50'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${c.icon}`}>
                {bloque.icono}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-sm">{bloque.titulo}</p>
                <p className="text-slate-500 text-xs truncate">{bloque.resumen}</p>
              </div>
              <span className={`text-slate-400 text-lg transition-transform ${estaAbierto ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>

            {/* Contenido */}
            {estaAbierto && (
              <div className="px-5 pb-5 space-y-4 fade-in">
                <div className="text-slate-600 text-sm leading-relaxed">
                  {contenido?.texto}
                </div>
                {Grafico && (
                  <div className={`${c.bg} rounded-xl border ${c.border} p-4`}>
                    <Grafico />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
