/**
 * PaginaTeoria.jsx — rutas /teoria/:tema
 * Cada tema se renderiza como una página independiente dentro del container derecho.
 * Tipografía fluida (clamp) y centrado pensado para presentaciones en 15"/23"+.
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Termino from '../components/Termino';
import GraficoBlockchain from '../components/graficos/GraficoBlockchain';
import GraficoWallet from '../components/graficos/GraficoWallet';
import GraficoRedes from '../components/graficos/GraficoRedes';

const TEMAS_VALIDOS = ['web3', 'conceptos', 'v1'];

const CONCEPTOS = [
  {
    id: 'blockchain',
    icono: '⛓',
    titulo: 'Blockchain',
    resumen: 'Base de datos pública, compartida e inmutable.',
    color: 'indigo',
    Grafico: GraficoBlockchain,
    contenido: (
      <>
        <p>
          Imaginá una hoja de cálculo compartida por millones de computadoras. Cada vez que alguien
          agrega una fila (<Termino id="transaccion">transacción</Termino>), toda la red la verifica y la copia.
        </p>
        <p>
          Eso es una <Termino id="blockchain">blockchain</Termino>: bloques de datos enlazados en orden,
          validados por muchos participantes y muy difíciles de alterar.
        </p>
      </>
    ),
  },
  {
    id: 'wallet',
    icono: '👛',
    titulo: 'Wallet',
    resumen: 'Tu identidad y llavero digital en Web3.',
    color: 'emerald',
    Grafico: GraficoWallet,
    contenido: (
      <>
        <p>
          Una <Termino id="wallet">wallet</Termino> no guarda monedas: guarda tus{' '}
          <Termino id="clave-privada">claves privadas</Termino>. Es el llavero que te permite demostrar
          que sos dueño de una address.
        </p>
        <p>
          Al conectarla, la app puede ver tu <Termino id="address">address</Termino> pública, pero nunca
          tu clave privada. Para acciones importantes, la wallet te pide una firma.
        </p>
      </>
    ),
  },
  {
    id: 'contrato',
    icono: '📜',
    titulo: 'Smart Contract',
    resumen: 'Código que vive y se ejecuta en la blockchain.',
    color: 'amber',
    Grafico: null,
    contenido: (
      <>
        <p>
          Un <Termino id="smart-contract">smart contract</Termino> es un programa publicado en la blockchain.
          Cualquiera puede interactuar con él siguiendo sus reglas.
        </p>
        <p>
          En esta demo usamos una función simple: guardar un mensaje. Leer es gratis; escribir requiere firma
          porque modifica el estado del contrato.
        </p>
      </>
    ),
  },
  {
    id: 'redes',
    icono: '🌐',
    titulo: 'Mainnet vs Testnet',
    resumen: 'Red real contra red de práctica.',
    color: 'violet',
    Grafico: GraficoRedes,
    contenido: (
      <>
        <p>
          La <Termino id="mainnet">mainnet</Termino> es la red real, donde el ETH tiene valor. La{' '}
          <Termino id="testnet">testnet</Termino> funciona igual, pero usa fondos de prueba.
        </p>
        <p>
          Sepolia es ideal para aprender porque podés practicar deploys, firmas y transacciones sin arriesgar dinero real.
        </p>
      </>
    ),
  },
];

const CONCEPT_COLOR = {
  indigo:  'bg-indigo-50 border-indigo-100 text-indigo-700',
  emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
  amber:   'bg-amber-50 border-amber-100 text-amber-700',
  violet:  'bg-violet-50 border-violet-100 text-violet-700',
};

export default function PaginaTeoria() {
  const { tema = 'web3' } = useParams();
  const navigate = useNavigate();
  const temaActivo = TEMAS_VALIDOS.includes(tema) ? tema : 'web3';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [temaActivo]);

  return (
    <>
      <Sidebar pasoActual={-1} />

      <main className="flex-1 min-w-0 min-h-screen overflow-y-auto">
        <div className="min-h-screen w-full px-6 py-6 lg:px-10 lg:py-8 xl:px-14 flex">
          {temaActivo === 'web3' && (
            <TeoriaWeb3
              onSiguiente={() => navigate('/teoria/conceptos')}
              onIrDicc={() => navigate('/diccionario')}
            />
          )}
          {temaActivo === 'conceptos' && <TeoriaConceptos />}
          {temaActivo === 'v1' && <TeoriaV1 />}
        </div>
      </main>
    </>
  );
}

/* ──────────────────── Qué es la Web3 ──────────────────── */
function TeoriaWeb3({ onSiguiente, onIrDicc }) {
  return (
    <section className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 xl:gap-10 items-stretch">

        {/* Hero */}
        <div className="relative rounded-[2.5rem] border border-slate-200 bg-white p-7 xl:p-12 shadow-sm overflow-hidden flex flex-col justify-center">
          <div className="absolute -top-32 -right-24 h-80 w-80 rounded-full bg-indigo-200 blur-3xl opacity-60" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-cyan-200 blur-3xl opacity-50" />

          <div className="relative">
            <p className="fs-h2 text-slate-800 leading-tight max-w-2xl">
              Una forma de usar internet donde tu identidad y ciertas acciones importantes pueden
              verificarse <strong className="text-slate-950">fuera de una plataforma centralizada</strong>.
            </p>
            <p className="mt-4 fs-lead text-slate-600 leading-snug max-w-2xl">
              Tu <strong className="text-slate-900">wallet</strong> te representa y la{' '}
              <strong className="text-slate-900">blockchain</strong> deja registro público de lo que autorizás.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 max-w-2xl">
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4">
                <div className="fs-eyebrow font-bold uppercase tracking-wider text-slate-400">Web2</div>
                <p className="mt-1.5 fs-meta text-slate-600 leading-snug">
                  La plataforma guarda tu cuenta y define tus permisos.
                </p>
              </div>
              <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
                <div className="fs-eyebrow font-bold uppercase tracking-wider text-indigo-600">Web3</div>
                <p className="mt-1.5 fs-meta text-slate-700 leading-snug">
                  Tu wallet firma acciones y la red permite verificarlas.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={onSiguiente}
                className="rounded-2xl bg-slate-950 px-5 py-3 fs-meta font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
              >
                Seguir con conceptos base →
              </button>
              <button
                onClick={onIrDicc}
                className="rounded-2xl bg-white border border-slate-300 px-5 py-3 fs-meta font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Abrir glosario
              </button>
            </div>
          </div>
        </div>

        {/* Mapa mental */}
        <aside className="rounded-[2.5rem] border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 xl:p-8 flex flex-col justify-center">
          <div className="text-center">
            <h2 className="fs-eyebrow font-black uppercase tracking-widest text-indigo-700">Mapa mental</h2>
            <p className="mt-1.5 fs-h3 font-black text-slate-900">Las 4 piezas clave</p>
          </div>

          <div className="mt-5 grid gap-2.5">
            {[
              ['1', 'Wallet', 'Tu identidad y firma digital.'],
              ['2', 'Blockchain', 'El registro compartido y verificable.'],
              ['3', 'Smart contract', 'Reglas ejecutadas por código.'],
              ['4', 'dApp', 'La interfaz que conecta wallet y contratos.'],
            ].map(([numero, titulo, texto]) => (
              <div key={titulo} className="flex gap-3 rounded-2xl bg-white border border-white shadow-sm p-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 fs-meta font-black text-white">
                  {numero}
                </span>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 fs-meta leading-tight">{titulo}</p>
                  <p className="fs-eyebrow text-slate-500 mt-0.5 leading-snug">{texto}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ──────────────────── Conceptos base ──────────────────── */
function TeoriaConceptos() {
  const [activo, setActivo] = useState(CONCEPTOS[0].id);
  const concepto = CONCEPTOS.find((item) => item.id === activo) ?? CONCEPTOS[0];
  const Grafico = concepto.Grafico;

  return (
    <section className="flex-1 flex flex-col w-full max-w-7xl mx-auto">
      <div className="flex-1 min-h-[32rem] grid grid-cols-1 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,290px)_minmax(0,1fr)] gap-5 xl:gap-7">

        {/* Sidebar interno */}
        <nav className="rounded-3xl border border-slate-200 bg-white p-4 xl:p-5 shadow-sm overflow-y-auto">
          <p className="fs-eyebrow font-bold uppercase tracking-wider text-slate-400 px-2 mb-3">
            Elegí un concepto
          </p>
          <div className="space-y-2">
            {CONCEPTOS.map((item) => {
              const seleccionado = item.id === activo;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivo(item.id)}
                  className={`w-full rounded-2xl border p-3 xl:p-4 text-left transition-all ${
                    seleccionado
                      ? 'bg-slate-950 text-white border-slate-950 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                      seleccionado ? 'bg-white/10' : 'bg-white'
                    }`}>
                      {item.icono}
                    </span>
                    <div className="min-w-0">
                      <p className="fs-meta font-black truncate">{item.titulo}</p>
                      <p className={`fs-eyebrow leading-snug truncate ${seleccionado ? 'text-slate-300' : 'text-slate-500'}`}>
                        {item.resumen}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Detalle del concepto */}
        <article className="rounded-[2rem] border border-slate-200 bg-white p-7 xl:p-10 shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className={`inline-flex self-start items-center gap-2 rounded-full border px-4 py-1.5 fs-eyebrow font-bold ${CONCEPT_COLOR[concepto.color]}`}>
            <span className="text-base leading-none">{concepto.icono}</span> {concepto.titulo}
          </div>

          <div className="mt-4 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 xl:gap-10 items-stretch">
            <div className="flex flex-col justify-center min-h-0">
              <h2 className="fs-h1 font-black text-slate-950">{concepto.titulo}</h2>
              <div className="mt-4 space-y-4 fs-body text-slate-600 leading-relaxed">
                {concepto.contenido}
              </div>
            </div>

            <div className={`rounded-3xl border min-h-0 flex items-center justify-center overflow-hidden ${CONCEPT_COLOR[concepto.color]}`}>
              {Grafico ? (
                <div className="w-full h-full flex items-center justify-center p-3">
                  <div className="origin-center" style={{ transform: 'scale(clamp(0.55, 0.6vw + 0.4, 0.95))' }}>
                    <Grafico />
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center fs-body text-slate-700 leading-relaxed">
                  El contrato es el puente entre la interfaz y la blockchain: recibe llamadas, valida reglas y guarda estado.
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ──────────────────── V1 con blockchain real ──────────────────── */
function TeoriaV1() {
  const PASOS = [
    { pre: 'Instalá MetaMask desde', code: 'metamask.io', link: 'https://metamask.io' },
    { pre: 'Conseguí ETH de prueba en', code: 'sepoliafaucet.com', link: 'https://sepoliafaucet.com' },
    { pre: 'Abrí Remix, compilá y deployá en Sepolia', code: null, link: 'https://remix.ethereum.org' },
    { pre: 'Pegá la ABI en', code: 'src/abi/RegistroInmutable.json' },
    { pre: 'Creá', code: '.env', post: 'con VITE_CONTRACT_ADDRESS=0x...' },
    { pre: 'En', code: 'src/services/web3.js', post: "cambiá './web3Mock' por './web3Real'" },
    { pre: 'Ejecutá', code: 'npm install ethers && npm run dev' },
  ];

  return (
    <section className="flex-1 flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto rounded-[2.5rem] border border-slate-200 bg-white p-8 xl:p-12 shadow-sm">
        <header className="flex items-center gap-5">
          <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-3xl shrink-0">🚀</div>
          <p className="fs-h2 text-slate-800 leading-tight">
            Camino mínimo para salir del modo simulación y conectar{' '}
            <strong className="text-slate-950">MetaMask, Sepolia y un contrato real</strong>.
          </p>
        </header>

        <ol className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {PASOS.map((p, i) => (
            <li key={i} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex gap-4">
              <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white fs-meta font-black flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <p className="fs-meta leading-relaxed text-slate-700 min-w-0">
                {p.pre}{' '}
                {p.link
                  ? <a href={p.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-semibold break-words">{p.code}</a>
                  : p.code ? <code className="bg-white text-slate-800 px-2 py-0.5 rounded fs-eyebrow font-mono break-words">{p.code}</code>
                  : null}
                {p.post && <span> {p.post}</span>}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
