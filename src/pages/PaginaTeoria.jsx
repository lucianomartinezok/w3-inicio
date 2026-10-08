/**
 * PaginaTeoria.jsx — rutas /teoria/:tema
 * Material 1 (Web3 y Confianza) y Material 2 (Las 4 Piezas Clave y Conceptos Técnicos).
 * Estética neo-brutalista / cyber-clean, fondos blancos, contraste alto y adaptación
 * total a pantallas desde 11 pulgadas (netbooks escolares).
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import Termino from '../components/Termino';
import GraficoBlockchain from '../components/graficos/GraficoBlockchain';
import GraficoWallet from '../components/graficos/GraficoWallet';
import GraficoRedes from '../components/graficos/GraficoRedes';
import Grafico4Piezas from '../components/graficos/Grafico4Piezas';
import GraficoSmartContract from '../components/graficos/GraficoSmartContract';

const TEMAS_VALIDOS = ['web3', 'conceptos', 'v1'];

export default function PaginaTeoria() {
  const { tema = 'web3' } = useParams();
  const navigate = useNavigate();
  const temaActivo = TEMAS_VALIDOS.includes(tema) ? tema : 'web3';

  const titulos = {
    web3: 'Material 1: Qué es Web3 y la Confianza',
    conceptos: 'Material 2: Las 4 Piezas y Conceptos Técnicos',
    v1: 'Conexión a Blockchain Real',
  };
  useDocumentTitle(titulos[temaActivo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [temaActivo]);

  return (
    <div className="min-h-dvh w-full bg-slate-100 text-slate-900 pb-12 select-text">
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* CABECERA GENERAL DE NAVEGACIÓN */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-900 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/recorrido')}
              className="flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-slate-950 px-3.5 py-1.5 font-pixel text-[8.5px] uppercase text-cyan-300 font-bold shadow-[3px_3px_0_#0f172a] hover:bg-slate-800 hover:text-cyan-200 transition-all active:translate-y-0.5"
            >
              <span>←</span>
              <span>VOLVER AL MAPA</span>
            </button>
            <span className="rounded-lg border-2 border-slate-900 bg-cyan-200 px-2.5 py-1 font-pixel text-[8.5px] font-black uppercase text-slate-950 shadow-[2px_2px_0_#0f172a]">
              {temaActivo === 'web3'
                ? 'MATERIAL 1 · CLASE 1'
                : temaActivo === 'conceptos'
                ? 'MATERIAL 2 · CLASE 2'
                : 'CONEXIÓN REAL V1'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/teoria/web3')}
              className={`rounded-xl border-2 border-slate-900 px-3 py-1.5 font-pixel text-[8.5px] uppercase font-bold transition-all ${
                temaActivo === 'web3'
                  ? 'bg-cyan-400 text-slate-950 shadow-[3px_3px_0_#0f172a]'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Material 1: Web3
            </button>
            <button
              type="button"
              onClick={() => navigate('/teoria/conceptos')}
              className={`rounded-xl border-2 border-slate-900 px-3 py-1.5 font-pixel text-[8.5px] uppercase font-bold transition-all ${
                temaActivo === 'conceptos'
                  ? 'bg-cyan-400 text-slate-950 shadow-[3px_3px_0_#0f172a]'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              Material 2: Conceptos
            </button>
            <button
              type="button"
              onClick={() => navigate('/diccionario')}
              className="rounded-xl border-2 border-slate-900 bg-white px-3 py-1.5 font-pixel text-[8.5px] uppercase font-bold text-slate-800 hover:bg-slate-50 shadow-[2px_2px_0_#cbd5e1] transition-all"
            >
              Glosario ↗
            </button>
          </div>
        </header>

        {/* CONTENIDO SEGÚN EL TEMA ACTIVO */}
        {temaActivo === 'web3' && (
          <TeoriaWeb3
            onSiguiente={() => navigate('/teoria/conceptos')}
            onIrDicc={() => navigate('/diccionario')}
          />
        )}
        {temaActivo === 'conceptos' && <TeoriaConceptos />}
        {temaActivo === 'v1' && <TeoriaV1 />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MATERIAL 1: QUÉ ES WEB3, LA EVOLUCIÓN Y EL PROBLEMA DE LA CONFIANZA
   ───────────────────────────────────────────────────────────────────────── */
function TeoriaWeb3({ onSiguiente, onIrDicc }) {
  return (
    <section className="w-full space-y-6">
      {/* 1. HERO PRINCIPAL */}
      <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 sm:p-7 lg:p-9 shadow-[6px_6px_0_#0f172a]">
        <div className="inline-flex items-center gap-1.5 rounded border border-slate-900 bg-cyan-100 px-2.5 py-0.5 font-pixel text-[8.5px] font-black text-slate-950 uppercase mb-3 shadow-xs">
          🌐 MATERIAL 1 · FUNDAMENTOS TEÓRICOS
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 leading-tight">
          ¿Qué es la Web3 y por qué surge una red descentralizada?
        </h1>
        <p className="mt-3.5 text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
          Internet nació para conectar computadoras y compartir información. Sin embargo, a medida que creció, el control digital se concentró en pocas empresas intermediarias. <b className="text-slate-950 font-bold">Web3 es el cambio de paradigma</b>: una internet abierta donde tus datos, tu identidad y tus acuerdos se verifican mediante matemática y criptografía, <span className="underline decoration-cyan-400 decoration-3 font-bold">sin intermediarios corporativos obligatorios</span>.
        </p>
      </div>

      {/* 2. LA EVOLUCIÓN DE INTERNET: WEB1 vs WEB2 vs WEB3 */}
      <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 sm:p-7 shadow-[6px_6px_0_#0f172a] space-y-4">
        <div className="border-b-2 border-slate-900 pb-2.5">
          <span className="font-pixel text-[8px] font-black uppercase text-cyan-800">LÍNEA DE TIEMPO</span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-0.5">
            Las 3 Generaciones de la Web
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 items-stretch">
          {/* WEB 1 */}
          <div className="rounded-xl border-2 border-slate-900 bg-slate-50 p-4 shadow-[3px_3px_0_#0f172a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                <span className="font-pixel text-[9px] font-black uppercase text-slate-700">WEB 1.0 (1990 - 2004)</span>
                <span className="text-xl">📖</span>
              </div>
              <h3 className="mt-2 text-base font-black text-slate-950">Solo Lectura</h3>
              <p className="mt-1 text-xs text-slate-700 leading-relaxed font-medium">
                Páginas estáticas. Unos pocos publicaban información y la gran mayoría solo consumía contenidos. No había perfiles, ni interactividad, ni aplicaciones en línea.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-200 font-pixel text-[7.5px] font-bold text-slate-500 uppercase">
              Ej: Enciclopedias web, portales de noticias
            </div>
          </div>

          {/* WEB 2 */}
          <div className="rounded-xl border-2 border-slate-900 bg-amber-50/70 p-4 shadow-[3px_3px_0_#0f172a] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-amber-300 pb-2">
                <span className="font-pixel text-[9px] font-black uppercase text-amber-950">WEB 2.0 (2004 - HOY)</span>
                <span className="text-xl">📱</span>
              </div>
              <h3 className="mt-2 text-base font-black text-slate-950">Lectura + Escritura</h3>
              <p className="mt-1 text-xs text-slate-800 leading-relaxed font-medium">
                Redes sociales y apps colaborativas. Los usuarios crean contenido, pero <b>los servidores, las cuentas y los datos pertenecen a empresas privadas (Big Tech)</b> que controlan y monetizan tu actividad.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-300 font-pixel text-[7.5px] font-bold text-amber-900 uppercase">
              Control: Centralizado en plataformas privadas
            </div>
          </div>

          {/* WEB 3 */}
          <div className="rounded-xl border-2 border-slate-900 bg-cyan-100/60 p-4 shadow-[3px_3px_0_#0f172a] flex flex-col justify-between ring-1 ring-cyan-500">
            <div>
              <div className="flex items-center justify-between border-b border-cyan-400 pb-2">
                <span className="font-pixel text-[9px] font-black uppercase text-cyan-950">WEB 3.0 (PRESENTE)</span>
                <span className="text-xl">⛓️</span>
              </div>
              <h3 className="mt-2 text-base font-black text-slate-950">Lectura + Escritura + Propiedad</h3>
              <p className="mt-1 text-xs text-slate-900 leading-relaxed font-medium">
                Redes distribuidas. <b>Sos dueño de tu identidad y de tus activos</b> mediante criptografía. Las aplicaciones corren en código auditable y las transacciones no pueden ser censuradas arbitrariamente.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-cyan-400 font-pixel text-[7.5px] font-black text-cyan-950 uppercase">
              Control: Soberano, público y descentralizado
            </div>
          </div>
        </div>
      </div>

      {/* 3. EL PROBLEMA CENTRAL: LA CONFIANZA Y EL REGISTRO COMPARTIDO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 sm:p-7 shadow-[5px_5px_0_#0f172a] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-2.5">
              <span className="text-2xl">🧩</span>
              <h3 className="text-lg font-black text-slate-950">El Problema de la Confianza</h3>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              En el mundo físico, si le entregás una fotocopia de un examen a un compañero, vos ya no tenés ese papel. Pero en el mundo digital tradicional, <b>cualquier archivo se puede copiar infinitas veces</b> (el problema del <i>doble gasto</i>).
            </p>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              Hasta ahora, para evitar fraudes, recurríamos a un <b>árbitro central</b> (un banco, un servidor escolar, un registro civil). Pero un servidor central tiene graves debilidades:
            </p>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-800 font-semibold list-disc list-inside">
              <li><b>Punto único de falla:</b> Si el servidor se apaga o se daña, nadie puede operar.</li>
              <li><b>Alteración secreta:</b> Quien administra la base de datos puede modificarla sin aviso.</li>
              <li><b>Censura:</b> Una empresa puede bloquear o borrar tu cuenta unilateralmente.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border-4 border-slate-900 bg-cyan-50/70 p-5 sm:p-7 shadow-[5px_5px_0_#0f172a] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-2.5">
              <span className="text-2xl">🤝</span>
              <h3 className="text-lg font-black text-slate-950">La Solución: El Registro Distribuido</h3>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              En vez de confiar en un solo servidor, en Web3 <b>cientos o miles de computadoras (nodos) guardan una copia idéntica y sincronizada del registro</b>.
            </p>
            <p className="mt-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              Para agregar un nuevo dato (un bloque de transacciones), los nodos ejecutan un <b>algoritmo de consenso</b>:
            </p>
            <div className="mt-3 rounded-xl border-2 border-slate-900 bg-white p-3 space-y-1.5 text-xs font-medium text-slate-800">
              <p>✓ Cada participante verifica las firmas matemáticas de los cambios.</p>
              <p>✓ Si un atacante intenta alterar una transacción en su propia computadora, los demás nodos detectan que no coincide con la mayoría y <b>rechazan el intento automáticamente</b>.</p>
              <p>✓ El consenso matemático reemplaza la necesidad de confiar a ciegas en una empresa.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SOBERANÍA DIGITAL: FIRMAS CRIPTOGRÁFICAS */}
      <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 sm:p-7 shadow-[6px_6px_0_#0f172a] space-y-3">
        <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-2.5">
          <span className="text-2xl">🔐</span>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-950">
              Soberanía Digital: Llaves en lugar de Usuario y Contraseña
            </h3>
            <span className="text-xs text-slate-600 font-medium">
              Cómo nos identificamos en una red sin pedirle permiso a nadie
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="rounded-xl border-2 border-slate-900 bg-slate-50 p-3.5">
            <span className="font-pixel text-[8.5px] font-black uppercase text-slate-600 block">EN WEB2 TRADICIONAL</span>
            <p className="mt-1 text-xs text-slate-800 font-medium leading-relaxed">
              Ingresás con un email y contraseña que quedan guardados en los servidores de la empresa. La empresa tiene la potestad de suspender tu cuenta, leer tus mensajes o perder tu clave en una filtración.
            </p>
          </div>
          <div className="rounded-xl border-2 border-slate-900 bg-emerald-50 p-3.5">
            <span className="font-pixel text-[8.5px] font-black uppercase text-emerald-950 block">EN WEB3</span>
            <p className="mt-1 text-xs text-slate-900 font-medium leading-relaxed">
              Generás un par de <b>claves criptográficas</b> en tu propio dispositivo. Tu <b>clave pública</b> es tu dirección visible, y tu <b>clave privada</b> es tu firma matemática. Nadie en el mundo puede firmar en tu nombre sin tu clave.
            </p>
          </div>
        </div>
      </div>

      {/* BOTONES DE AVANCE AL FINAL */}
      <div className="rounded-2xl border-4 border-slate-900 bg-slate-950 p-5 sm:p-6 text-white shadow-[6px_6px_0_#0f172a] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-pixel text-[8.5px] text-cyan-300 uppercase font-black tracking-wider block">
            SIGUIENTE PASO PEDAGÓGICO
          </span>
          <h4 className="text-base sm:text-lg font-black text-white mt-0.5">
            Material 2: Las 4 Piezas Clave y Conceptos Técnicos
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Explorá cómo interactúan las Wallets, la Blockchain, los Smart Contracts y las dApps.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={onSiguiente}
            className="w-full sm:w-auto rounded-xl border-2 border-cyan-400 bg-cyan-400 hover:bg-cyan-300 text-slate-950 px-5 py-3 font-pixel text-[9.5px] uppercase font-black shadow-[3px_3px_0_#00f0ff] transition-all active:translate-y-0.5 text-center"
          >
            IR AL MATERIAL 2 →
          </button>
          <button
            type="button"
            onClick={onIrDicc}
            className="w-full sm:w-auto rounded-xl border-2 border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 px-4 py-3 font-pixel text-[8.5px] uppercase font-bold transition-all text-center"
          >
            ABRIR GLOSARIO
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MATERIAL 2: LAS 4 PIEZAS CLAVE Y CONCEPTOS TÉCNICOS FUNDAMENTALES
   Rediseñado para adaptación perfecta en pantallas escolares de 11 pulgadas
   ───────────────────────────────────────────────────────────────────────── */
const MODULOS_MATERIAL2 = [
  {
    id: 'piezas',
    numero: '1',
    icono: '🧩',
    titulo: 'Las 4 Piezas Clave',
    subtitulo: 'Wallet, dApp, Smart Contract y Blockchain',
    Componente: Grafico4Piezas,
    explicacion: (
      <>
        <p>
          Para que una solución Web3 funcione, interactúan cuatro piezas fundamentales:
        </p>
        <ul className="list-disc list-inside space-y-1.5 mt-2">
          <li><b>Wallet:</b> Tu llavero criptográfico soberano donde reside tu clave privada.</li>
          <li><b>dApp (Decentralized App):</b> La interfaz web moderna con la que interactuás en el navegador.</li>
          <li><b>Smart Contract:</b> El programa autónomo con reglas inmutables desplegado en la red.</li>
          <li><b>Blockchain:</b> La red distribuida que valida, confirma y almacena el historial.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'blockchain',
    numero: '2',
    icono: '⛓️',
    titulo: 'Anatomía de Blockchain y Hash',
    subtitulo: 'Estructura de bloques y funciones hash SHA-256',
    Componente: GraficoBlockchain,
    explicacion: (
      <>
        <p>
          Una <Termino id="blockchain">blockchain</Termino> es un libro contable digital compuesto por bloques enlazados cronológicamente. Cada bloque contiene una lista de <Termino id="transaccion">transacciones</Termino>, una marca temporal y el <Termino id="hash">hash</Termino> matemático del bloque anterior.
        </p>
        <p className="mt-2">
          Gracias a esta relación en cadena, es matemáticamente imposible modificar una transacción del pasado sin romper todos los bloques siguientes, lo que alerta de inmediato a todos los participantes de la red.
        </p>
      </>
    ),
  },
  {
    id: 'wallet',
    numero: '3',
    icono: '👛',
    titulo: 'Wallets y Criptografía',
    subtitulo: 'Frase semilla, clave privada, clave pública y gas',
    Componente: GraficoWallet,
    explicacion: (
      <>
        <p>
          Una <Termino id="wallet">wallet</Termino> no guarda tokens ni dinero en su interior: almacena tus <Termino id="clave-privada">claves privadas</Termino>.
        </p>
        <p className="mt-2">
          Tu <Termino id="clave-publica">clave pública</Termino> y tu <Termino id="address">address</Termino> son visibles para todos. Cuando interactuás con una aplicación, autorizás las operaciones con una firma digital generada por tu clave privada, sin revelar nunca tu secreto.
        </p>
      </>
    ),
  },
  {
    id: 'contratos',
    numero: '4',
    icono: '📜',
    titulo: 'Smart Contracts (Leer vs Escribir)',
    subtitulo: 'Código inmutable, costo de gas y autorización',
    Componente: GraficoSmartContract,
    explicacion: (
      <>
        <p>
          Un <Termino id="smart-contract">smart contract</Termino> es un contrato inteligente escrito en código que vive en la blockchain y se ejecuta automáticamente cuando se cumplen ciertas condiciones predefinidas.
        </p>
        <p className="mt-2">
          La diferencia central que exploramos en el laboratorio es entre <b>Leer</b> (operación de consulta gratuita que no requiere firma) y <b>Escribir</b> (operación que altera el estado, requiere firma con tu wallet y consume gas para pagar el procesamiento de la red).
        </p>
      </>
    ),
  },
  {
    id: 'redes',
    numero: '5',
    icono: '🌐',
    titulo: 'Redes: Mainnet vs Testnet',
    subtitulo: 'Entorno de producción real vs laboratorio educativo',
    Componente: GraficoRedes,
    explicacion: (
      <>
        <p>
          La <Termino id="mainnet">mainnet</Termino> es la red de producción con valor económico real. La <Termino id="testnet">testnet</Termino> (como Sepolia) funciona exactamente igual pero utiliza tokens de prueba gratuitos obtenidos en grifos públicos.
        </p>
        <p className="mt-2">
          En las escuelas trabajamos sobre redes de prueba o simuladas para que puedas aprender, probar contratos y forzar errores sin costo alguno y con total seguridad.
        </p>
      </>
    ),
  },
];

function TeoriaConceptos() {
  const [moduloIdx, setModuloIdx] = useState(0);
  const navigate = useNavigate();
  const moduloActual = MODULOS_MATERIAL2[moduloIdx];
  const ComponenteGrafico = moduloActual.Componente;

  return (
    <section className="w-full space-y-6">
      {/* 1. HERO MATERIAL 2 */}
      <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 sm:p-7 shadow-[6px_6px_0_#0f172a]">
        <div className="inline-flex items-center gap-1.5 rounded border border-slate-900 bg-cyan-100 px-2.5 py-0.5 font-pixel text-[8.5px] font-black text-slate-950 uppercase mb-3 shadow-xs">
          ⚙️ MATERIAL 2 · CLASE 2
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
          Las 4 Piezas Clave y Conceptos Técnicos Fundamentales
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
          Seleccioná un módulo para explorar en detalle cada engranaje del sistema antes de interactuar con el simulador de transacciones.
        </p>
      </div>

      {/* 2. SELECTOR SUPERIOR ADAPTABLE A CUALQUIER PANTALLA (NETBOOKS 11") */}
      <div className="w-full overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {MODULOS_MATERIAL2.map((m, idx) => {
            const esActivo = idx === moduloIdx;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setModuloIdx(idx)}
                className={`rounded-xl border-2 border-slate-900 p-2.5 text-left transition-all flex items-center gap-2 ${
                  esActivo
                    ? 'bg-slate-950 text-white shadow-[3px_3px_0_#00f0ff] ring-2 ring-cyan-400'
                    : 'bg-white text-slate-800 hover:bg-slate-50 hover:translate-y-[-1px] shadow-[2px_2px_0_#cbd5e1]'
                }`}
              >
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-900 text-base ${
                  esActivo ? 'bg-cyan-400 text-slate-950' : 'bg-slate-100'
                }`}>
                  {m.icono}
                </span>
                <div className="min-w-0 flex-1">
                  <span className={`block font-pixel text-[7.5px] uppercase font-bold leading-none ${
                    esActivo ? 'text-cyan-300' : 'text-slate-500'
                  }`}>
                    MÓDULO {m.numero}
                  </span>
                  <span className="block font-black text-xs truncate mt-0.5 leading-tight">
                    {m.titulo}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CARD PRINCIPAL DEL MÓDULO ACTIVO */}
      <article className="rounded-2xl border-4 border-slate-900 bg-white p-5 sm:p-7 lg:p-9 shadow-[6px_6px_0_#0f172a] space-y-6">
        {/* Cabecera del módulo */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded border-2 border-slate-900 bg-cyan-100 px-2.5 py-1 font-pixel text-[8.5px] font-black uppercase text-slate-950 shadow-xs">
              MÓDULO {moduloActual.numero} DE {MODULOS_MATERIAL2.length}
            </span>
            <span className="font-pixel text-[8px] text-slate-500 font-bold">
              ESTUDIO TÉCNICO
            </span>
          </div>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-slate-950 flex items-center gap-2.5">
            <span>{moduloActual.icono}</span>
            <span>{moduloActual.titulo}</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-cyan-800 font-bold font-pixel uppercase">
            {moduloActual.subtitulo}
          </p>

          <div className="mt-4 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
            {moduloActual.explicacion}
          </div>
        </div>

        {/* Componente Gráfico Interactivo / Visual */}
        <div className="rounded-xl border-2 border-slate-900 bg-slate-50/70 p-4 sm:p-6 shadow-[3px_3px_0_#0f172a]">
          {ComponenteGrafico && <ComponenteGrafico />}
        </div>

        {/* Barra de navegación inferior entre módulos */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-slate-900">
          <button
            type="button"
            disabled={moduloIdx === 0}
            onClick={() => setModuloIdx((prev) => Math.max(0, prev - 1))}
            className="rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 font-pixel text-[8.5px] uppercase font-bold text-slate-800 shadow-[2px_2px_0_#0f172a] hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← ANTERIOR
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/demo')}
              className="rounded-xl border-2 border-slate-900 bg-cyan-300 hover:bg-cyan-200 px-4 py-2.5 font-pixel text-[8.5px] uppercase font-black text-slate-950 shadow-[2px_2px_0_#0f172a] transition-all"
            >
              🧪 PROBAR EN LABORATORIO (/DEMO) ↗
            </button>

            {moduloIdx < MODULOS_MATERIAL2.length - 1 ? (
              <button
                type="button"
                onClick={() => setModuloIdx((prev) => Math.min(MODULOS_MATERIAL2.length - 1, prev + 1))}
                className="rounded-xl border-2 border-slate-900 bg-slate-950 px-4 py-2.5 font-pixel text-[8.5px] uppercase font-black text-cyan-300 hover:bg-slate-800 shadow-[2px_2px_0_#0f172a] transition-all"
              >
                SIGUIENTE MÓDULO →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/recorrido')}
                className="rounded-xl border-2 border-slate-900 bg-emerald-400 hover:bg-emerald-300 px-4 py-2.5 font-pixel text-[8.5px] uppercase font-black text-slate-950 shadow-[2px_2px_0_#0f172a] transition-all"
              >
                CONTINUAR EL MAPA ✓
              </button>
            )}
          </div>
        </div>
      </article>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   GUÍA V1: CONEXIÓN REAL CON METAMASK Y SEPOLIA TESTNET
   ───────────────────────────────────────────────────────────────────────── */
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
    <section className="w-full">
      <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 sm:p-8 shadow-[6px_6px_0_#0f172a]">
        <header className="flex items-center gap-4 border-b-2 border-slate-900 pb-5">
          <div className="h-12 w-12 rounded-xl border-2 border-slate-900 bg-cyan-200 flex items-center justify-center text-2xl font-black shadow-[3px_3px_0_#0f172a]">
            🚀
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              Conexión Real con MetaMask y Sepolia Testnet
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5">
              Guía técnica para migrar de la simulación didáctica a una blockchain pública real.
            </p>
          </div>
        </header>

        <ol className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {PASOS.map((p, i) => (
            <li key={i} className="rounded-xl border-2 border-slate-900 bg-slate-50 p-3.5 flex gap-3 shadow-[3px_3px_0_#0f172a]">
              <span className="h-7 w-7 rounded-lg border-2 border-slate-900 bg-slate-950 text-cyan-300 font-pixel text-xs font-black flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <p className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-800 min-w-0">
                {p.pre}{' '}
                {p.link ? (
                  <a href={p.link} target="_blank" rel="noreferrer" className="text-cyan-700 underline font-black break-words hover:text-cyan-900">
                    {p.code} ↗
                  </a>
                ) : p.code ? (
                  <code className="bg-white border border-slate-300 text-slate-900 px-1.5 py-0.5 rounded font-mono text-xs break-words">
                    {p.code}
                  </code>
                ) : null}
                {p.post && <span> {p.post}</span>}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
