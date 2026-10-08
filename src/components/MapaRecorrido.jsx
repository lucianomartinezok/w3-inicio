import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ==========================================================================
   BLOCKCHAIN NETWORK OVERWORLD — CYBERPUNK PIXEL ART
   Inspirado en estética de distrito tecnológico nocturno (Palo Alto / Cyberpunk),
   paleta neón oscuro e iconografía técnica de Blockchain.
   ========================================================================== */

// Sintetizador Web Audio API para efectos de sonido de interfaz digital / sci-fi
function playCyberSound(type, enabled = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'step') {
      // Pulso sutil de desplazamiento en la red
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (type === 'enter') {
      // Confirmación / Acceso a nodo (acorde digital ascendente)
      const freqs = [587.33, 880, 1174.66]; // D5, A5, D6
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.08, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.22);
      });
    } else if (type === 'locked') {
      // Advertencia de nodo no disponible
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(85, now + 0.1);
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch {
    // Silencio si el navegador no permite audio antes de interacción
  }
}

// Configuración de los 10 nodos del mapa (0: Inicio + 9 etapas)
const NODOS_MAPA = [
  {
    id: 0,
    tipo: 'spawn',
    numero: '00',
    label: 'Inicio de la red',
    codigo: 'SP0',
    tag: 'SPAWN',
    x: 100,
    y: 120,
    vecinos: { right: 1 },
    descripcion: 'Punto de partida del operador en la red. Terminal de bienvenida y mapa general.',
  },
  {
    id: 1,
    tipo: 'terminal',
    numero: '01',
    label: 'Prepará tu recorrido',
    codigo: 'N1',
    tag: 'REGISTRO',
    x: 290,
    y: 120,
    vecinos: { left: 0, right: 2 },
    descripcion: 'Prepará tu recorrido: registrá tus datos y conocé las herramientas Web3 de la secuencia.',
  },
  {
    id: 2,
    tipo: 'bloque',
    numero: '02',
    label: 'El problema de la confianza',
    codigo: 'N2',
    tag: 'CONFIANZA',
    x: 490,
    y: 120,
    vecinos: { left: 1, right: 3, down: 7 },
    descripcion: 'El problema de la confianza: cómo coordinar registros compartidos sin una autoridad central.',
  },
  {
    id: 3,
    tipo: 'nodos',
    numero: '03',
    label: 'Blockchain humana',
    codigo: 'N3',
    tag: 'RED HUMANA',
    x: 690,
    y: 120,
    vecinos: { left: 2, right: 4, down: 6 },
    descripcion: 'Blockchain humana: dinámica de aula donde cada grupo es un nodo con copias del registro.',
  },
  {
    id: 4,
    tipo: 'auditoria',
    numero: '04',
    label: 'Detectar una modificación',
    codigo: 'N4',
    tag: 'AUDITORÍA',
    x: 880,
    y: 120,
    vecinos: { left: 3, down: 5 },
    descripcion: 'Detectar una modificación: verificar cómo cambiar un dato rompe los hashes posteriores.',
  },
  {
    id: 5,
    tipo: 'ledger',
    numero: '05',
    label: 'Cierre de la primera etapa',
    codigo: 'N5',
    tag: 'LEDGER',
    x: 880,
    y: 280,
    vecinos: { up: 4, left: 6 },
    descripcion: 'Cierre de la primera etapa: ledger inmutable, copias distribuidas y evidencia individual.',
  },
  {
    id: 6,
    tipo: 'llave',
    numero: '06',
    label: 'Recuperar lo aprendido',
    codigo: 'N6',
    tag: 'REPASO',
    x: 680,
    y: 280,
    vecinos: { right: 5, left: 7, up: 3 },
    descripcion: 'Recuperar lo aprendido: conceptos clave previos a interactuar con wallets y contratos.',
  },
  {
    id: 7,
    tipo: 'contrato',
    numero: '07',
    label: 'Wallet y transacción',
    codigo: 'N7',
    tag: 'LAB SMART',
    x: 480,
    y: 280,
    vecinos: { right: 6, up: 2, down: 8 },
    descripcion: 'Wallet y transacción: simulación práctica, firma criptográfica, contratos y gas.',
  },
  {
    id: 8,
    tipo: 'escudo',
    numero: '08',
    label: 'Pruebas y resiliencia',
    codigo: 'N8',
    tag: 'DEFENSA',
    x: 480,
    y: 430,
    vecinos: { up: 7, right: 9 },
    descripcion: 'Pruebas y resiliencia: rechazo de transacciones, tolerancia a fallos y ataques a la red.',
  },
  {
    id: 9,
    tipo: 'consenso',
    numero: '09',
    label: 'Puesta en común',
    codigo: 'N9',
    tag: 'CIERRE FINAL',
    x: 780,
    y: 430,
    vecinos: { left: 8, up: 5 },
    descripcion: 'Puesta en común: debate final sobre gobernanza, consenso y casos reales de aplicación.',
  },
];

/* --------------------------------------------------------------------------
   ICONOS PIXEL-ART VECTORIALES NATIVOS DE BLOCKCHAIN
   -------------------------------------------------------------------------- */

// 0. Portal / Spawn de Inicio
function IconoSpawn({ activo, superado }) {
  const cPrimario = superado ? '#00ff9d' : activo ? '#00f0ff' : '#38bdf8';
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="3" fill="#0b0f19" stroke={cPrimario} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke={cPrimario} strokeWidth="1.5" strokeDasharray="3 2" />
      <circle cx="12" cy="12" r="2.2" fill={cPrimario} />
      <line x1="12" y1="4" x2="12" y2="7" stroke={cPrimario} strokeWidth="1.5" />
      <line x1="12" y1="17" x2="12" y2="20" stroke={cPrimario} strokeWidth="1.5" />
      <line x1="4" y1="12" x2="7" y2="12" stroke={cPrimario} strokeWidth="1.5" />
      <line x1="17" y1="12" x2="20" y2="12" stroke={cPrimario} strokeWidth="1.5" />
    </svg>
  );
}

// 1. Terminal / Portal de conexión
function IconoTerminal({ activo, superado }) {
  const colorBorde = superado ? '#00ff9d' : activo ? '#00f0ff' : '#64748b';
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="3" width="20" height="15" fill="#0b0f19" stroke={colorBorde} strokeWidth="2" />
      <rect x="4" y="5" width="16" height="11" fill="#131b2e" />
      <path d="M 6 8 L 9 10.5 L 6 13" stroke={superado ? '#00ff9d' : '#00f0ff'} strokeWidth="2" strokeLinecap="square" />
      <line x1="11" y1="13" x2="15" y2="13" stroke={superado ? '#00ff9d' : '#00f0ff'} strokeWidth="2" />
      <path d="M 8 18 L 6 21 H 18 L 16 18" stroke={colorBorde} strokeWidth="1.5" />
    </svg>
  );
}

// 2. Bloque de Datos (Cubo isométrico de datos)
function IconoBloque({ activo, superado }) {
  const cPrimario = superado ? '#00ff9d' : activo ? '#00f0ff' : '#60a5fa';
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      {/* Cara superior */}
      <polygon points="12,2 21,7 12,12 3,7" fill="#1e293b" stroke={cPrimario} strokeWidth="1.5" />
      {/* Cara izquierda */}
      <polygon points="3,7 12,12 12,21 3,16" fill="#0f172a" stroke={cPrimario} strokeWidth="1.5" />
      {/* Cara derecha */}
      <polygon points="12,12 21,7 21,16 12,21" fill="#162033" stroke={cPrimario} strokeWidth="1.5" />
      {/* Hash grabado central */}
      <circle cx="12" cy="7" r="1.5" fill={cPrimario} />
      <line x1="6" y1="11.5" x2="9" y2="13" stroke={cPrimario} strokeWidth="1.5" />
      <line x1="15" y1="13" x2="18" y2="11.5" stroke={cPrimario} strokeWidth="1.5" />
    </svg>
  );
}

// 3. Clúster de Nodos Distribuidos
function IconoNodos({ activo, superado }) {
  const cPrimario = superado ? '#00ff9d' : activo ? '#00f0ff' : '#a855f7';
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      {/* Líneas de conexión */}
      <line x1="12" y1="12" x2="12" y2="4" stroke={cPrimario} strokeWidth="1.5" />
      <line x1="12" y1="12" x2="4" y2="16" stroke={cPrimario} strokeWidth="1.5" />
      <line x1="12" y1="12" x2="20" y2="16" stroke={cPrimario} strokeWidth="1.5" />
      <line x1="12" y1="4" x2="4" y2="16" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
      <line x1="12" y1="4" x2="20" y2="16" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
      {/* Nodo central */}
      <circle cx="12" cy="12" r="3" fill="#0f172a" stroke={cPrimario} strokeWidth="2" />
      {/* Nodos periféricos */}
      <circle cx="12" cy="4" r="2.2" fill={cPrimario} />
      <circle cx="4" cy="16" r="2.2" fill={cPrimario} />
      <circle cx="20" cy="16" r="2.2" fill={cPrimario} />
    </svg>
  );
}

// 4. Auditoría / Scanner de Integridad (Lupa de Hash)
function IconoAuditoria({ activo, superado }) {
  const cPrimario = superado ? '#00ff9d' : activo ? '#ff2a85' : '#f59e0b';
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <circle cx="10" cy="10" r="6" fill="#0f172a" stroke={cPrimario} strokeWidth="2" />
      <line x1="15" y1="15" x2="21" y2="21" stroke={cPrimario} strokeWidth="2.5" strokeLinecap="square" />
      {/* Signo de chequeo o alerta en lente */}
      {superado ? (
        <path d="M 7 10 L 9 12 L 13 8" stroke="#00ff9d" strokeWidth="2" strokeLinecap="square" />
      ) : (
        <>
          <line x1="10" y1="7" x2="10" y2="11" stroke={cPrimario} strokeWidth="2" />
          <circle cx="10" cy="13" r="0.8" fill={cPrimario} />
        </>
      )}
    </svg>
  );
}

// 5. Ledger Inmutable / Libro Mayor Sellado
function IconoLedger({ activo, superado }) {
  const cPrimario = superado ? '#00ff9d' : activo ? '#00f0ff' : '#e2e8f0';
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="16" height="18" rx="1" fill="#0f172a" stroke={cPrimario} strokeWidth="2" />
      {/* Espiral o lomo */}
      <line x1="8" y1="3" x2="8" y2="21" stroke={cPrimario} strokeWidth="1.5" />
      {/* Filas de registro */}
      <line x1="11" y1="7" x2="17" y2="7" stroke={superado ? '#00ff9d' : '#64748b'} strokeWidth="1.5" />
      <line x1="11" y1="11" x2="17" y2="11" stroke={superado ? '#00ff9d' : '#64748b'} strokeWidth="1.5" />
      <line x1="11" y1="15" x2="15" y2="15" stroke={superado ? '#00ff9d' : '#64748b'} strokeWidth="1.5" />
    </svg>
  );
}

// 6. Llave Digital / Firma Criptográfica
function IconoLlave({ activo, superado }) {
  const cPrimario = superado ? '#00ff9d' : activo ? '#00f0ff' : '#facc15';
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="12" r="4.5" fill="#0f172a" stroke={cPrimario} strokeWidth="2" />
      <circle cx="8" cy="12" r="1.5" fill={cPrimario} />
      <line x1="12.5" y1="12" x2="20" y2="12" stroke={cPrimario} strokeWidth="2" />
      <line x1="17" y1="12" x2="17" y2="16" stroke={cPrimario} strokeWidth="2" />
      <line x1="20" y1="12" x2="20" y2="15" stroke={cPrimario} strokeWidth="2" />
    </svg>
  );
}

// 7. Smart Contract & Wallet
function IconoContrato({ activo, superado }) {
  const cPrimario = superado ? '#00ff9d' : activo ? '#00f0ff' : '#38bdf8';
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M 5 3 H 15 L 19 7 V 21 H 5 Z" fill="#0f172a" stroke={cPrimario} strokeWidth="2" />
      <polygon points="15,3 15,7 19,7" fill="#1e293b" stroke={cPrimario} strokeWidth="1.5" />
      <line x1="8" y1="11" x2="16" y2="11" stroke={superado ? '#00ff9d' : '#38bdf8'} strokeWidth="1.5" />
      <line x1="8" y1="15" x2="13" y2="15" stroke={superado ? '#00ff9d' : '#38bdf8'} strokeWidth="1.5" />
      {/* Chip / candado en esquina */}
      <rect x="7" y="6" width="3" height="2" fill={cPrimario} />
    </svg>
  );
}

// 8. Escudo de Resiliencia / Tolerancia a Fallos
function IconoEscudo({ activo, superado }) {
  const cPrimario = superado ? '#00ff9d' : activo ? '#00f0ff' : '#ef4444';
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path d="M 12 3 L 4 6 V 13 C 4 17.5 7.5 21 12 22 C 16.5 21 20 17.5 20 13 V 6 Z" fill="#0f172a" stroke={cPrimario} strokeWidth="2" />
      {/* Ondas o check de integridad */}
      <path d="M 8 12 L 11 15 L 16 9" stroke={superado ? '#00ff9d' : cPrimario} strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

// 9. Monolito / Núcleo de Consenso Central
function IconoConsenso({ activo, superado }) {
  const cPrimario = superado ? '#00ff9d' : activo ? '#ff2a85' : '#00f0ff';
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      {/* Anillo orbital */}
      <circle cx="12" cy="12" r="9" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
      {/* Cubo principal de consenso */}
      <polygon points="12,4 19,8 12,12 5,8" fill="#1e1b4b" stroke={cPrimario} strokeWidth="1.5" />
      <polygon points="5,8 12,12 12,19 5,15" fill="#0f172a" stroke={cPrimario} strokeWidth="1.5" />
      <polygon points="12,12 19,8 19,15 12,19" fill="#172554" stroke={cPrimario} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill="#00ff9d" />
    </svg>
  );
}

// Selector dinámico de icono por tipo de posta
function IconoPosta({ tipo, activo, superado }) {
  switch (tipo) {
    case 'spawn':
      return <IconoSpawn activo={activo} superado={superado} />;
    case 'terminal':
      return <IconoTerminal activo={activo} superado={superado} />;
    case 'bloque':
      return <IconoBloque activo={activo} superado={superado} />;
    case 'nodos':
      return <IconoNodos activo={activo} superado={superado} />;
    case 'auditoria':
      return <IconoAuditoria activo={activo} superado={superado} />;
    case 'ledger':
      return <IconoLedger activo={activo} superado={superado} />;
    case 'llave':
      return <IconoLlave activo={activo} superado={superado} />;
    case 'contrato':
      return <IconoContrato activo={activo} superado={superado} />;
    case 'escudo':
      return <IconoEscudo activo={activo} superado={superado} />;
    case 'consenso':
      return <IconoConsenso activo={activo} superado={superado} />;
    default:
      return <IconoBloque activo={activo} superado={superado} />;
  }
}

/* --------------------------------------------------------------------------
   INDICADOR FLOTANTE DEL NODO ACTIVO (RETRO PIXEL ART INDICATOR)
   Flota ARRIBA del nodo con rebote y alto contraste sin tapar ni pisar el nodo.
   -------------------------------------------------------------------------- */
function IndicadorNodoActivo({ nombre = '' }) {
  return (
    <div className="flex flex-col items-center animate-bounce select-none pointer-events-none drop-shadow-[0_0_12px_rgba(255,230,0,0.85)]">
      {/* Placa luminosa superior de alta visibilidad */}
      <div className="flex items-center gap-1.5 rounded border-2 border-yellow-300 bg-[#070b16] px-2 py-0.5 shadow-[0_0_14px_rgba(255,230,0,0.6)]">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
        <span className="font-pixel text-[8px] uppercase tracking-wider text-yellow-300 font-black">
          {nombre && nombre.trim() ? nombre.slice(0, 10).toUpperCase() : '1P'}
        </span>
      </div>

      {/* Flecha pixel-art apuntando hacia abajo al nodo */}
      <svg className="h-5 w-6 -mt-0.5 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]" viewBox="0 0 24 20" fill="none">
        <polygon points="12,19 3,7 8,7 8,1 16,1 16,7 21,7" fill="#ffe600" stroke="#000000" strokeWidth="2" strokeLinejoin="miter" />
        <polygon points="12,14 6,8 9,8 9,3 15,3 15,8 18,8" fill="#ffffff" />
      </svg>
    </div>
  );
}

/* --------------------------------------------------------------------------
   COMPONENTE PRINCIPAL: MAPA OVERWORLD CYBERPUNK
   -------------------------------------------------------------------------- */
export default function MapaRecorrido({
  etapas,
  pasoActual,
  completados = [],
  ultimoCompleto = -1,
  nombre = '',
  dni = '',
  hashDni = '',
  esInvitado = false,
  onCambiarNombre,
  onEntrar,
  onResetear,
  onAbrirDiploma,
  onCerrarSesion,
  onDescargarRespaldo,
  onAbrirDocente,
}) {
  const [prevPaso, setPrevPaso] = useState(pasoActual);
  const [seleccionado, setSeleccionado] = useState(0);
  const [hoverNodo, setHoverNodo] = useState(null);
  const [audioActivo, setAudioActivo] = useState(true);
  const [pantallaCompleta, setPantallaCompleta] = useState(Boolean(document.fullscreenElement));
  const [modalCreditos, setModalCreditos] = useState(false);
  const [modalRegistro, setModalRegistro] = useState(false);
  const [modalReset, setModalReset] = useState(false);
  const [nombreInput, setNombreInput] = useState('');

  // Sincronizar si cambia el paso exterior y no es la primera carga
  if (pasoActual !== undefined && pasoActual !== prevPaso && pasoActual > 0) {
    setPrevPaso(pasoActual);
    setSeleccionado(pasoActual);
  }

  const nodoActual = NODOS_MAPA[seleccionado] || NODOS_MAPA[0];
  const etapaActual = etapas[seleccionado] || etapas[0];
  const habilitado = esInvitado || seleccionado <= ultimoCompleto + 1;
  const esCompletado = completados.includes(seleccionado);

  // Mover a nodo
  const moverANodo = useCallback(
    (nuevoId) => {
      if (nuevoId === seleccionado) return;
      playCyberSound('step', audioActivo);
      setSeleccionado(nuevoId);
    },
    [seleccionado, audioActivo]
  );

  // Escuchar cambios de pantalla completa
  useEffect(() => {
    const actualizar = () => setPantallaCompleta(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', actualizar);
    return () => document.removeEventListener('fullscreenchange', actualizar);
  }, []);

  const alternarPantallaCompleta = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Navegador sin permisos o modo restringido
    }
  };

  // Navegación por teclado (Flechas, WASD, Enter, Espacio, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.key === 'Escape') {
        if (modalReset) {
          setModalReset(false);
          return;
        }
        if (modalRegistro) {
          setModalRegistro(false);
          return;
        }
        if (modalCreditos) {
          setModalCreditos(false);
          return;
        }
      }

      // Navegación lineal: Izquierda / Arriba retrocede, Derecha / Abajo avanza
      let proximo = null;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        if (seleccionado > 0) proximo = seleccionado - 1;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        if (seleccionado < NODOS_MAPA.length - 1) proximo = seleccionado + 1;
      }

      if (proximo !== null) {
        e.preventDefault();
        moverANodo(proximo);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (habilitado) {
          playCyberSound('enter', audioActivo);
          onEntrar(seleccionado);
        } else {
          playCyberSound('locked', audioActivo);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodoActual, habilitado, seleccionado, audioActivo, modalCreditos, modalRegistro, onEntrar, moverANodo]);

  const accionEntrar = () => {
    if (habilitado) {
      playCyberSound('enter', audioActivo);
      onEntrar(seleccionado);
    } else {
      playCyberSound('locked', audioActivo);
    }
  };

  return (
    <section className="relative flex h-screen h-[100dvh] w-full overflow-hidden bg-[#060814] text-slate-100 select-none">
      {/* ====================================================================
          SIDEBAR: ANCHO 25% | ALTO 100% | NUNCA TIENE SCROLL
          Operador en una línea, registro próx, título recorrido, 10 slots
          ==================================================================== */}
      <aside className="flex h-full w-1/4 min-w-[260px] max-w-[360px] flex-col justify-between border-r border-cyan-500/30 bg-[#080d1e] p-3 text-slate-100 shadow-[0_0_25px_rgba(0,0,0,0.5)] z-20 shrink-0 overflow-hidden">
        {/* PARTE SUPERIOR DEL SIDEBAR */}
        <div className="shrink-0">
          {/* LÍNEA 1: OPERADOR Y NOMBRE EN LA MISMA LÍNEA */}
          <div className="flex items-center justify-between font-pixel text-[9px] sm:text-[10px] font-bold border-b border-cyan-500/20 pb-2">
            <span className="text-cyan-300">OPERADOR:</span>
            <span className="text-[#00f0ff] truncate drop-shadow-[0_0_6px_rgba(0,240,255,0.7)]">
              {nombre && nombre.trim() ? nombre.toUpperCase() : 'INVITADO'}
            </span>
          </div>

          {/* LÍNEA 2: DIPLOMA / CERTIFICADO DE ACREDITACIÓN */}
          <button
            type="button"
            onClick={onAbrirDiploma}
            className="mt-1 w-full flex items-center justify-between text-[7.5px] sm:text-[8px] font-pixel text-cyan-200 hover:text-white bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 rounded px-1.5 py-1 transition-all active:translate-y-0.5 shadow-[0_0_8px_rgba(0,240,255,0.2)]"
            title="Ver o canjear claves por el Diploma Oficial"
          >
            <span className="flex items-center gap-1">
              <span>🎓</span>
              <span>DIPLOMA DE TALLER</span>
            </span>
            <span className="text-[7px] text-amber-300 font-bold border border-amber-500/50 rounded px-1 bg-amber-950/40">
              CANJEAR
            </span>
          </button>

          {/* LÍNEA 3: TÍTULO RECORRIDO */}
          <div className="mt-2 flex items-center justify-between border-y border-cyan-500/30 py-1">
            <h2 className="font-pixel text-[10px] sm:text-[11px] uppercase tracking-widest text-[#00f0ff] font-black">
              RECORRIDO
            </h2>
            <span className="font-pixel text-[8px] text-cyan-300 font-bold">
              {completados.length}/10 NODOS
            </span>
          </div>
        </div>

        {/* 10 SLOTS NUMERADOS CON SU NOMBRE (CERO SCROLL) */}
        <div className="my-1 flex-1 flex flex-col justify-between py-0.5 space-y-0.5 overflow-hidden">
          {NODOS_MAPA.map((nodo) => {
            const esActivo = seleccionado === nodo.id;
            const superado = completados.includes(nodo.id);
            const esHabilitado = esInvitado || nodo.id <= ultimoCompleto + 1;
            const nombreEtapa = etapas[nodo.id]?.titulo || nodo.label;

            return (
              <button
                key={nodo.id}
                type="button"
                onClick={() => moverANodo(nodo.id)}
                onMouseEnter={() => setHoverNodo(nodo.id)}
                onMouseLeave={() => setHoverNodo(null)}
                className={`w-full flex items-center justify-between gap-1.5 rounded px-2 py-1 text-left transition-all ${
                  esActivo
                    ? 'border border-cyan-300 bg-cyan-950/90 text-cyan-100 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                    : superado
                    ? 'border border-emerald-500/40 bg-[#071714] text-emerald-200 hover:border-emerald-400'
                    : esHabilitado
                    ? 'border border-slate-700/80 bg-[#0c1224] text-slate-200 hover:border-cyan-500/50'
                    : 'border border-slate-800/60 bg-[#080b16] text-slate-500 opacity-60'
                }`}
                title={`Nodo ${nodo.numero}: ${nombreEtapa}`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded font-pixel text-[7.5px] font-bold ${
                      superado
                        ? 'bg-emerald-400 text-slate-950'
                        : esActivo
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {superado ? '✓' : nodo.numero}
                  </span>
                  <span className="truncate font-pixel text-[8px] sm:text-[8.5px] font-bold">
                    {nodo.numero}. {nombreEtapa}
                  </span>
                </div>
                <span className="shrink-0 text-[8px] font-pixel text-slate-400">
                  {superado ? '✓' : !esHabilitado ? '🔒' : esActivo ? '▶' : ''}
                </span>
              </button>
            );
          })}
        </div>

        {/* PARTE INFERIOR: ACCIÓN DEL NODO ACTIVO Y CRÉDITOS */}
        <div className="shrink-0 pt-1 border-t border-cyan-500/20 space-y-1.5">
          {/* Tarjeta de acción del nodo seleccionado */}
          <div className="rounded-lg border border-cyan-400/50 bg-[#091124] p-2">
            <div className="flex items-center justify-between font-pixel text-[7.5px] text-cyan-300 font-bold">
              <span>NODO {nodoActual.numero} / 09</span>
              <span>⏱ {etapaActual?.tiempo || '15 min'}</span>
            </div>
            <div className="mt-0.5 font-pixel text-[8.5px] text-[#00f0ff] font-bold truncate">
              {etapaActual?.titulo || nodoActual.label}
            </div>
            <div className="mt-1.5">
              {habilitado ? (
                <button
                  type="button"
                  onClick={accionEntrar}
                  className="w-full rounded border-2 border-cyan-300 bg-cyan-400 py-1.5 px-2 font-pixel text-[8px] sm:text-[8.5px] uppercase text-slate-950 font-black shadow-[0_0_10px_rgba(0,240,255,0.4)] transition-all hover:bg-cyan-200 active:translate-y-0.5"
                >
                  {esCompletado ? 'REVISAR NODO →' : 'CONECTAR NODO (ENTER) →'}
                </button>
              ) : (
                <div className="rounded border border-slate-700 bg-slate-900 py-1 px-2 text-center font-pixel text-[7.5px] uppercase text-slate-400 font-bold">
                  🔒 BLOQUEADO
                </div>
              )}
            </div>
          </div>

          {/* Acciones de usuario y docente */}
          <div className="flex gap-1.5 mt-1.5">
            <button
              type="button"
              onClick={onDescargarRespaldo}
              className="flex-1 flex items-center justify-center gap-1 rounded border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 py-1 px-1 font-pixel text-[7px] uppercase text-emerald-300 transition-colors"
              title="Descargar respaldo de avance"
            >
              💾 RESPALDO
            </button>
            <button
              type="button"
              onClick={onCerrarSesion}
              className="flex-1 flex items-center justify-center gap-1 rounded border border-red-500/40 bg-red-950/40 hover:bg-red-900/60 py-1 px-1 font-pixel text-[7px] uppercase text-red-300 transition-colors"
              title="Cerrar sesión de este estudiante"
            >
              🚪 SALIR
            </button>
          </div>
          <div className="flex gap-1.5 mt-1">
            <button
              type="button"
              onClick={onAbrirDocente}
              className="flex-1 flex items-center justify-center gap-1 rounded border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/60 py-1 px-1 font-pixel text-[7px] uppercase text-amber-300 transition-colors"
            >
              👨‍🏫 DOCENTE
            </button>
            <button
              type="button"
              onClick={() => setModalCreditos(true)}
              className="flex-1 flex items-center justify-center gap-1 rounded border border-cyan-400/40 bg-[#0a1329] hover:bg-cyan-900/60 py-1 px-1 font-pixel text-[7px] uppercase text-cyan-300 transition-colors"
            >
              ℹ️ CRÉDITOS
            </button>
          </div>
        </div>
      </aside>

      {/* ====================================================================
          MAPA CONTAINER: ANCHO 75% | ALTO 100%
          Dividido en: Header (10%), Mapa (80%), Footer (10%)
          ==================================================================== */}
      <div className="flex h-full w-3/4 flex-1 flex-col overflow-hidden bg-[#060814]">
        {/* HEADER: 10% ALTO */}
        <header className="flex h-[10%] shrink-0 items-center justify-between border-b border-cyan-500/30 bg-[#0a0f24] px-4 sm:px-6 z-10 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          <div>
            <h1 className="font-pixel text-xs sm:text-sm md:text-base tracking-tight text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.85)] font-black">
              INTRO A BLOCKCHAIN
            </h1>
            <p className="mt-0.5 text-[10px] sm:text-[11px] text-cyan-200/90 font-bold tracking-wider uppercase">
              SECUENCIA DE APRENDIZAJE INTERACTIVA
            </p>
          </div>

          {/* BOTÓN PANTALLA COMPLETA */}
          <button
            type="button"
            onClick={alternarPantallaCompleta}
            className="flex items-center gap-2 rounded-lg border-2 border-cyan-400 bg-[#0c162b] px-3 py-1.5 sm:px-4 sm:py-2 font-pixel text-[9px] sm:text-[10px] uppercase text-[#00f0ff] font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all hover:bg-cyan-400 hover:text-slate-950 active:translate-y-0.5"
            title={pantallaCompleta ? 'Salir de pantalla completa' : 'Ver en pantalla completa'}
          >
            <span className="text-sm font-bold">{pantallaCompleta ? '⤢' : '⛶'}</span>
            <span>{pantallaCompleta ? 'SALIR DE PANTALLA COMPLETA' : 'VER EN PANTALLA COMPLETA'}</span>
          </button>
        </header>

        {/* MAPA: 80% ALTO — SOLO CUADRÍCULA Y CIRCUITO DE DATOS */}
        <div className="relative flex h-[80%] flex-1 overflow-hidden bg-[#080b18]">
          {/* Rejilla pura ortogonal de fondo (sin rectángulos vacíos ni Palo Alto) */}
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* CIRCUITO DE FIBRA ÓPTICA Y LÍNEAS DE CONEXIÓN */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 560" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cyberDataLine" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#ff2a85" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#00ff9d" stopOpacity="0.8" />
              </linearGradient>

              <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* PISTAS DE CIRCUITO DE LA RED (10 NODOS) */}
            {/* Fila 1 superior: N0 -> N1 -> N2 -> N3 -> N4 */}
            <path d="M 100 120 H 880" fill="none" stroke="#11182c" strokeWidth="12" strokeLinecap="square" />
            <path d="M 100 120 H 880" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeDasharray="6 4" className="animate-data-pulse" />

            {/* Bajada de N4 a N5 */}
            <path d="M 880 120 V 280" fill="none" stroke="#11182c" strokeWidth="12" strokeLinecap="square" />
            <path d="M 880 120 V 280" fill="none" stroke="#ff2a85" strokeWidth="2.5" />

            {/* Fila 2 media: N5 -> N6 -> N7 */}
            <path d="M 880 280 H 480" fill="none" stroke="#11182c" strokeWidth="12" strokeLinecap="square" />
            <path d="M 880 280 H 480" fill="none" stroke="#ff2a85" strokeWidth="2.5" strokeDasharray="6 4" className="animate-data-pulse" />

            {/* Conexiones secundarias entre niveles */}
            <path d="M 690 120 V 280" fill="none" stroke="#1e293b" strokeWidth="3" strokeDasharray="3 3" opacity="0.6" />
            <path d="M 490 120 V 280" fill="none" stroke="#1e293b" strokeWidth="3" strokeDasharray="3 3" opacity="0.6" />

            {/* Bajada de N7 a N8 */}
            <path d="M 480 280 V 430" fill="none" stroke="#11182c" strokeWidth="12" strokeLinecap="square" />
            <path d="M 480 280 V 430" fill="none" stroke="#00ff9d" strokeWidth="2.5" />

            {/* Fila 3 inferior: N8 -> N9 (hacia el consenso) */}
            <path d="M 480 430 H 780" fill="none" stroke="#11182c" strokeWidth="12" strokeLinecap="square" />
            <path d="M 480 430 H 780" fill="none" stroke="url(#cyberDataLine)" strokeWidth="3.5" filter="url(#neonGlow)" />

            {/* CHIPS DE INTERCONEXIÓN */}
            {[
              { x: 290, y: 120 },
              { x: 490, y: 120 },
              { x: 690, y: 120 },
              { x: 880, y: 120 },
              { x: 880, y: 280 },
              { x: 680, y: 280 },
              { x: 480, y: 280 },
              { x: 480, y: 430 },
            ].map((pt, i) => (
              <g key={i} transform={`translate(${pt.x}, ${pt.y})`} className="pointer-events-none">
                <rect x="-5" y="-5" width="10" height="10" fill="#0d1424" stroke="#00f0ff" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="2" fill="#00f0ff" className="animate-pulse" />
              </g>
            ))}

            {/* BALIZA / NÚCLEO DE CONSENSO (ADYACENTE A NODO 9) */}
            <g transform="translate(850, 400)" className="pointer-events-none select-none">
              <polygon points="25,5 5,20 25,35 45,20" fill="#1e1b4b" stroke="#00f0ff" strokeWidth="1.5" />
              <polygon points="5,20 25,35 25,55 5,42" fill="#0d1222" stroke="#ff2a85" strokeWidth="1.5" />
              <polygon points="25,35 45,20 45,42 25,55" fill="#131d33" stroke="#00ff9d" strokeWidth="1.5" />
              <circle cx="25" cy="20" r="2.5" fill="#00f0ff" className="animate-ping" />
            </g>
          </svg>

          {/* CAPA INTERACTIVA: 10 NODOS DEL MAPA */}
          {NODOS_MAPA.map((nodo) => {
            const esActivo = seleccionado === nodo.id;
            const esHover = hoverNodo === nodo.id;
            const esHabilitado = esInvitado || nodo.id <= ultimoCompleto + 1;
            const superado = completados.includes(nodo.id);
            const porcentajeX = (nodo.x / 1000) * 100;
            const porcentajeY = (nodo.y / 560) * 100;
            const tituloCompleto = etapas[nodo.id]?.titulo || nodo.label;

            return (
              <div
                key={nodo.id}
                style={{ left: `${porcentajeX}%`, top: `${porcentajeY}%` }}
                className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  type="button"
                  onClick={() => moverANodo(nodo.id)}
                  onMouseEnter={() => setHoverNodo(nodo.id)}
                  onMouseLeave={() => setHoverNodo(null)}
                  onFocus={() => setHoverNodo(nodo.id)}
                  onBlur={() => setHoverNodo(null)}
                  className={`group relative flex flex-col items-center cursor-pointer transition-all duration-150 focus:outline-none ${
                    esActivo ? 'scale-110' : esHover ? 'scale-105' : 'hover:scale-105'
                  }`}
                  aria-label={`Seleccionar nodo ${nodo.numero}: ${tituloCompleto}`}
                >
                  {/* Caja del Nodo */}
                  <div
                    className={`relative flex h-11 w-11 items-center justify-center rounded-lg border-2 transition-all sm:h-12 sm:w-12 ${
                      esActivo
                        ? 'border-cyan-400 bg-[#0d1629] shadow-[0_0_18px_rgba(0,240,255,0.7)] ring-2 ring-cyan-400/50'
                        : esHover
                        ? 'border-amber-300 bg-[#121c33] shadow-[0_0_16px_rgba(251,191,36,0.6)] ring-2 ring-amber-300/60'
                        : superado
                        ? 'border-emerald-400/90 bg-[#071a15] shadow-[0_0_10px_rgba(0,255,157,0.3)]'
                        : esHabilitado
                        ? 'border-cyan-700/80 bg-[#0c101e] hover:border-cyan-400'
                        : 'border-slate-800 bg-[#080a14] opacity-50'
                    }`}
                  >
                    {/* Icono de la posta */}
                    <IconoPosta tipo={nodo.tipo} activo={esActivo} superado={superado} />

                    {/* Número de posta en esquina */}
                    <span
                      className={`absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded border font-pixel text-[7.5px] font-bold ${
                        superado
                          ? 'border-emerald-400 bg-emerald-950 text-emerald-200'
                          : esActivo
                          ? 'border-cyan-300 bg-cyan-950 text-cyan-200'
                          : 'border-cyan-800/80 bg-[#0a0f1d] text-cyan-300'
                      }`}
                    >
                      {superado ? '✓' : nodo.numero}
                    </span>

                    {/* Candado si está bloqueado */}
                    {!esHabilitado && (
                      <span className="absolute -top-1.5 -left-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-slate-600 bg-slate-900 text-[8px] text-slate-200">
                        🔒
                      </span>
                    )}
                  </div>

                  {/* ETIQUETA COMPLETA DEL NODO — VISIBLE A SIMPLE VISTA */}
                  <div
                    className={`mt-1.5 w-32 sm:w-36 rounded-md border px-1.5 py-1 text-center font-bold text-[9px] sm:text-[10px] leading-tight tracking-tight transition-all shadow-md ${
                      esActivo
                        ? 'border-cyan-300 bg-[#0c1833] text-cyan-100 shadow-[0_0_12px_rgba(0,240,255,0.6)] ring-1 ring-cyan-400'
                        : esHover
                        ? 'border-amber-300 bg-[#121c33] text-amber-100 shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                        : superado
                        ? 'border-emerald-400/90 bg-[#071f18] text-emerald-100 shadow-[0_0_8px_rgba(0,255,157,0.35)]'
                        : esHabilitado
                        ? 'border-cyan-700/80 bg-[#0a1224] text-cyan-200 hover:border-cyan-400 hover:text-white'
                        : 'border-slate-800 bg-[#080b15] text-slate-400'
                    }`}
                  >
                    <span className="block font-pixel text-[7.5px] text-cyan-400/90 tracking-wider uppercase mb-0.5 font-black">
                      {nodo.numero}
                    </span>
                    <span className="block leading-snug">
                      {tituloCompleto}
                    </span>
                  </div>
                </button>
              </div>
            );
          })}

          {/* INDICADOR FLOTANTE ARRIBA DEL NODO ACTIVO (NO LO PISA NI LO TAPA) */}
          <div
            style={{
              left: `${(nodoActual.x / 1000) * 100}%`,
              top: `${(nodoActual.y / 560) * 100}%`,
            }}
            className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-[135%] transition-all duration-300 ease-out"
          >
            <IndicadorNodoActivo nombre={nombre} />
          </div>

          {/* CONSOLA INFERIOR IZQUIERDA: PREVIEW DEL NODO (ARRIBA) + NAVEGACIÓN LINEAL IZQ / DER (ABAJO) */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-40 flex flex-col gap-2 w-72 sm:w-80 select-none">
            {/* CARD DE PREVIEW / HOVER DEL NODO */}
            {(() => {
              const nodoPreview = hoverNodo !== null
                ? (NODOS_MAPA.find((n) => n.id === hoverNodo) || nodoActual)
                : nodoActual;
              const esPreviewHover = hoverNodo !== null;
              const superadoPreview = completados.includes(nodoPreview.id);
              const habilitadoPreview = esInvitado || nodoPreview.id <= ultimoCompleto + 1;
              const etapaPreview = etapas[nodoPreview.id];
              const tituloPreview = etapaPreview?.titulo || nodoPreview.label;

              return (
                <div
                  className={`rounded-xl border-2 p-3 backdrop-blur-md transition-all duration-150 shadow-2xl ${
                    esPreviewHover
                      ? 'border-cyan-300 bg-[#06122c]/95 shadow-[0_0_25px_rgba(0,240,255,0.4)] ring-1 ring-cyan-400'
                      : 'border-cyan-500/40 bg-[#080d1e]/90 shadow-[0_0_20px_rgba(0,0,0,0.7)]'
                  }`}
                >
                  {/* Encabezado con estado e indicación de preview o nodo activo */}
                  <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5 font-pixel text-[8px] sm:text-[8.5px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-black tracking-wide ${esPreviewHover ? 'text-amber-300 animate-pulse' : 'text-[#00f0ff]'}`}>
                        {esPreviewHover ? '👁️ PREVIEW (HOVER PARA VER)' : '📍 NODO ACTUAL'}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="text-cyan-300 font-bold">N° {nodoPreview.numero}</span>
                    </div>
                    <span
                      className={`font-bold ${
                        superadoPreview
                          ? 'text-emerald-400'
                          : habilitadoPreview
                          ? 'text-cyan-300'
                          : 'text-slate-400'
                      }`}
                    >
                      {superadoPreview ? '✓ SUPERADO' : habilitadoPreview ? '● ACTIVO' : '🔒 BLOQUEADO'}
                    </span>
                  </div>

                  {/* Título completo del nodo en la preview */}
                  <div className="mt-2 text-xs sm:text-[13px] font-extrabold text-white leading-snug">
                    {nodoPreview.numero}. {tituloPreview}
                  </div>

                  {/* Descripción pedagógica */}
                  <p className="mt-1 text-[10px] sm:text-[11px] text-slate-300 leading-relaxed font-normal">
                    {nodoPreview.descripcion}
                  </p>

                  {/* Metadatos: tiempo y modalidad */}
                  <div className="mt-2 flex items-center justify-between border-t border-cyan-500/20 pt-1.5 text-[8px] sm:text-[8.5px] font-pixel text-cyan-300/90">
                    <span className="flex items-center gap-1">⏱ {etapaPreview?.tiempo || '15 min'}</span>
                    <span className="flex items-center gap-1">👥 {etapaPreview?.modalidad || 'Individual'}</span>
                  </div>
                </div>
              );
            })()}

            {/* CONTROLES LINEALES: SOLO IZQUIERDA Y DERECHA (+ CONECTAR) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => moverANodo(seleccionado - 1)}
                disabled={seleccionado <= 0}
                className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-lg border-2 border-cyan-400/60 bg-[#091124] font-pixel text-[10px] font-black text-cyan-200 transition-all hover:bg-cyan-400 hover:text-slate-950 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                title="Nodo Anterior (← o A)"
                aria-label="Nodo anterior"
              >
                <span>◀</span>
                <span>IZQ</span>
              </button>

              <button
                type="button"
                onClick={accionEntrar}
                disabled={!habilitado}
                className="flex-[1.2] flex h-9 items-center justify-center gap-1.5 rounded-lg border-2 border-cyan-300 bg-cyan-400 font-pixel text-[9px] sm:text-[9.5px] font-black text-slate-950 transition-all hover:bg-cyan-200 active:scale-95 disabled:opacity-30 disabled:bg-slate-800 disabled:text-slate-400 disabled:border-slate-700 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                title="Conectar / Entrar al nodo (Enter)"
                aria-label="Conectar al nodo"
              >
                <span>{esCompletado ? 'REVISAR' : 'CONECTAR'}</span>
                <span>⏎</span>
              </button>

              <button
                type="button"
                onClick={() => moverANodo(seleccionado + 1)}
                disabled={seleccionado >= NODOS_MAPA.length - 1}
                className="flex-1 flex h-9 items-center justify-center gap-1.5 rounded-lg border-2 border-cyan-400/60 bg-[#091124] font-pixel text-[10px] font-black text-cyan-200 transition-all hover:bg-cyan-400 hover:text-slate-950 active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                title="Nodo Siguiente (→ o D)"
                aria-label="Nodo siguiente"
              >
                <span>DER</span>
                <span>▶</span>
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER: 10% ALTO (MÍNIMO) — TEORÍA PARTE 1, TEORÍA PARTE 2, GLOSARIO / SFX, RESETEAR */}
        <footer className="flex h-[10%] shrink-0 items-center justify-between border-t border-cyan-500/30 bg-[#090d20] px-3 sm:px-6 z-10 text-slate-200 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
          {/* Izquierda: Teoría parte 1, Teoría parte 2, Glosario */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/teoria/web3"
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-[#0c1429] hover:bg-cyan-950 px-2 sm:px-3 py-1.5 font-pixel text-[8px] sm:text-[9px] text-cyan-200 font-bold transition-colors active:translate-y-0.5"
            >
              Teoría parte 1
            </Link>

            <Link
              to="/teoria/conceptos"
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-[#0c1429] hover:bg-cyan-950 px-2 sm:px-3 py-1.5 font-pixel text-[8px] sm:text-[9px] text-cyan-200 font-bold transition-colors active:translate-y-0.5"
            >
              Teoría parte 2
            </Link>

            <Link
              to="/diccionario"
              className="flex items-center gap-1.5 rounded-lg border border-fuchsia-500/50 bg-[#170e28] hover:bg-fuchsia-950 px-2 sm:px-3 py-1.5 font-pixel text-[8px] sm:text-[9px] text-fuchsia-200 font-bold transition-colors active:translate-y-0.5"
            >
              Glosario
            </Link>
          </div>

          {/* Derecha: SFX y Botón Rojo Resetear el camino */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setAudioActivo(!audioActivo)}
              title={audioActivo ? 'Silenciar audio' : 'Activar audio'}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-400/50 bg-[#0c1429] hover:bg-cyan-950 px-2.5 sm:px-3 py-1.5 font-pixel text-[8px] sm:text-[9px] text-cyan-200 font-bold transition-colors active:translate-y-0.5"
            >
              {audioActivo ? '🔊 SFX' : '🔇 MUDO'}
            </button>

            <button
              type="button"
              onClick={() => setModalReset(true)}
              title="Resetear todo el camino y volver al inicio"
              className="flex items-center gap-1.5 rounded-lg border-2 border-red-500 bg-red-950/80 hover:bg-red-600 hover:text-white px-2.5 sm:px-3 py-1.5 font-pixel text-[8px] sm:text-[9px] text-red-200 font-bold transition-colors active:translate-y-0.5 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
            >
              ⚠️ Resetear el camino
            </button>
          </div>
        </footer>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE RESETEO DEL CAMINO */}
      {modalReset && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar reinicio del camino"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setModalReset(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border-2 border-red-500 bg-[#160a0f] p-5 text-slate-100 shadow-[0_0_35px_rgba(239,68,68,0.4)] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-red-500/30 pb-3">
              <span className="text-xl">⚠️</span>
              <h3 className="font-pixel text-xs uppercase text-red-400 font-bold">
                RESETEAR EL CAMINO
              </h3>
            </div>
            <p className="mt-3 text-xs text-slate-200 leading-relaxed font-medium">
              ¿Estás seguro de que querés reiniciar todo el progreso? Se borrarán las respuestas guardadas y volverás al nodo inicial (00).
            </p>
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  setModalReset(false);
                  setSeleccionado(0);
                  onResetear?.();
                }}
                className="flex-1 rounded-lg border-2 border-red-500 bg-red-600 hover:bg-red-500 py-2 px-3 font-pixel text-[10px] uppercase text-white font-black shadow-[0_0_12px_rgba(239,68,68,0.4)] transition-all"
              >
                SÍ, REINICIAR
              </button>
              <button
                type="button"
                onClick={() => setModalReset(false)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE REGISTRO RÁPIDO DE OPERADOR */}
      {modalRegistro && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Registrar nombre de operador"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setModalRegistro(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border-2 border-cyan-400 bg-[#090e21] p-5 text-slate-100 shadow-[0_0_35px_rgba(0,240,255,0.3)] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalRegistro(false)}
              className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-500/40 bg-[#0c1429] text-cyan-200 hover:bg-cyan-900 hover:text-white font-bold transition-colors text-sm"
              aria-label="Cerrar registro"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 border-b border-cyan-500/30 pb-3">
              <span className="text-xl">👤</span>
              <h3 className="font-pixel text-xs uppercase text-[#00f0ff] font-bold">
                REGISTRO DE OPERADOR
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (nombreInput.trim()) {
                  onCambiarNombre?.(nombreInput.trim());
                  setModalRegistro(false);
                }
              }}
              className="mt-4 space-y-3"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase">
                  Ingresá tu nombre o alias:
                </label>
                <input
                  type="text"
                  autoFocus
                  value={nombreInput}
                  onChange={(e) => setNombreInput(e.target.value)}
                  placeholder="Ej: Ada Lovelace"
                  className="mt-1.5 w-full rounded-lg border border-cyan-400/60 bg-[#060b17] px-3 py-2 text-sm text-cyan-100 placeholder-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-1 focus:ring-cyan-300"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg border-2 border-cyan-300 bg-cyan-400 py-2 px-3 font-pixel text-[10px] uppercase text-slate-950 font-black shadow-[0_0_12px_rgba(0,240,255,0.4)] hover:bg-cyan-300"
                >
                  GUARDAR
                </button>
                <button
                  type="button"
                  onClick={() => setModalRegistro(false)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP / MODAL DE CRÉDITOS (SIN REFERENCIAS A ESCUELA ESPECÍFICA) */}
      {modalCreditos && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Créditos del proyecto"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setModalCreditos(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border-2 border-cyan-400 bg-[#090e21] p-6 text-slate-100 shadow-[0_0_35px_rgba(0,240,255,0.3)] animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón cerrar */}
            <button
              type="button"
              onClick={() => setModalCreditos(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-500/40 bg-[#0c1429] text-cyan-200 hover:bg-cyan-900 hover:text-white font-bold transition-colors"
              aria-label="Cerrar ventana de créditos"
            >
              ✕
            </button>

            {/* Cabecera modal */}
            <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400 bg-cyan-950 text-2xl">
                ⛓️
              </span>
              <div>
                <h3 className="font-pixel text-xs uppercase tracking-tight text-[#00f0ff] font-black">
                  CRÉDITOS DEL PROYECTO
                </h3>
                <p className="text-[11px] text-slate-300 font-semibold">
                  Secuencia de Aprendizaje Blockchain
                </p>
              </div>
            </div>

            {/* Cuerpo modal */}
            <div className="my-5 space-y-3">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-cyan-300 font-bold block">
                  Facilitador Pedagógico Digital
                </span>
                <strong className="text-xl font-black text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)] block mt-0.5">
                  Luciano Martínez
                </strong>
              </div>

              <div className="rounded-xl border border-cyan-500/30 bg-[#0c1428] p-3 text-xs text-slate-200 leading-relaxed font-medium">
                Plataforma interactiva, mapa de incubación y laboratorio de simulación para la enseñanza abierta de tecnología Blockchain, contratos inteligentes y criptografía aplicada.
              </div>
            </div>

            {/* Enlace y acción */}
            <div className="space-y-2 border-t border-cyan-500/30 pt-4">
              <a
                href="https://github.com/lucianomartinezok/w3-inicio"
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-cyan-300 bg-cyan-400 hover:bg-cyan-300 px-4 py-2.5 font-pixel text-[10px] uppercase text-slate-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all active:translate-y-0.5"
              >
                <span>💻 ACCEDER AL REPOSITORIO EN GITHUB ↗</span>
              </a>

              <button
                type="button"
                onClick={() => setModalCreditos(false)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* --------------------------------------------------------------------------
   MAPA COMPACTO LATERAL (DURANTE LA ACTIVIDAD) ESTILO TERMINAL
   -------------------------------------------------------------------------- */
export function MapaCompacto({
  etapas,
  pasoActual,
  completados,
  ultimoCompleto = 0,
  nombre,
  dni = '',
  hashDni = '',
  esInvitado = false,
  onVerCompleto,
  onIrA,
  onAbrirDiploma,
  onCerrarSesion,
  onDescargarRespaldo,
  onAbrirDocente,
}) {
  const [pantallaCompleta, setPantallaCompleta] = useState(Boolean(document.fullscreenElement));

  useEffect(() => {
    const actualizar = () => setPantallaCompleta(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', actualizar);
    return () => document.removeEventListener('fullscreenchange', actualizar);
  }, []);

  const alternarPantallaCompleta = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  };

  const nodoActual = NODOS_MAPA[pasoActual] || NODOS_MAPA[0];
  const etapaActual = etapas[pasoActual] || etapas[0];

  return (
    <aside className="flex h-full w-1/4 min-w-[260px] max-w-[340px] flex-col justify-between border-r border-cyan-500/30 bg-[#080d1e] p-3 text-slate-100 shadow-[0_0_25px_rgba(0,0,0,0.5)] z-20 shrink-0 overflow-hidden select-none">
      {/* PARTE SUPERIOR */}
      <div className="shrink-0 space-y-2">
        {/* Botón para volver al mapa completo */}
        <button
          type="button"
          onClick={onVerCompleto}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg border-2 border-cyan-400 bg-cyan-950 px-3 py-1.5 font-pixel text-[8.5px] uppercase text-cyan-200 font-bold transition-all hover:bg-cyan-900 hover:text-white shadow-[0_0_12px_rgba(0,240,255,0.3)] active:translate-y-0.5"
        >
          <span>←</span>
          <span>VOLVER AL MAPA COMPLETO</span>
        </button>

        {/* LÍNEA 1: OPERADOR Y NOMBRE */}
        <div className="flex items-center justify-between font-pixel text-[9px] font-bold border-b border-cyan-500/20 pb-1.5">
          <span className="text-cyan-300">OPERADOR:</span>
          <span className="text-[#00f0ff] truncate drop-shadow-[0_0_6px_rgba(0,240,255,0.7)]">
            {nombre && nombre.trim() ? nombre.toUpperCase() : 'INVITADO'}
          </span>
        </div>

        {/* LÍNEA 2: DIPLOMA / CERTIFICADO DE ACREDITACIÓN */}
        <button
          type="button"
          onClick={onAbrirDiploma}
          className="w-full flex items-center justify-between text-[7.5px] font-pixel text-cyan-200 hover:text-white bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/40 rounded px-1.5 py-1 transition-all active:translate-y-0.5 shadow-[0_0_8px_rgba(0,240,255,0.2)]"
          title="Ver o canjear claves por el Diploma Oficial"
        >
          <span className="flex items-center gap-1">
            <span>🎓</span>
            <span>DIPLOMA DE TALLER</span>
          </span>
          <span className="text-[7px] text-amber-300 font-bold border border-amber-500/50 rounded px-1 bg-amber-950/40">
            CANJEAR
          </span>
        </button>

        {/* LÍNEA 3: TÍTULO RECORRIDO */}
        <div className="flex items-center justify-between border-y border-cyan-500/30 py-1">
          <h2 className="font-pixel text-[10px] uppercase tracking-widest text-[#00f0ff] font-black">
            RECORRIDO
          </h2>
          <span className="font-pixel text-[8px] text-cyan-300 font-bold">
            {completados.length}/10 NODOS
          </span>
        </div>
      </div>

      {/* 10 SLOTS NUMERADOS (CERO SCROLL EN SIDEBAR) */}
      <div className="my-1 flex-1 flex flex-col justify-between py-0.5 space-y-0.5 overflow-hidden">
        {NODOS_MAPA.map((nodo, indice) => {
          const completa = completados.includes(indice);
          const activa = pasoActual === indice;
          const esHabilitado = esInvitado || indice <= (ultimoCompleto ?? 0) + 1;
          const nombreEtapa = etapas[indice]?.titulo || nodo.label;

          return (
            <button
              key={nodo.id}
              type="button"
              disabled={!esHabilitado}
              onClick={() => onIrA?.(indice)}
              className={`w-full flex items-center justify-between gap-1.5 rounded px-2 py-1 text-left transition-all ${
                activa
                  ? 'border border-cyan-300 bg-cyan-950/90 text-cyan-100 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : completa
                  ? 'border border-emerald-500/40 bg-[#071714] text-emerald-200 hover:border-emerald-400'
                  : esHabilitado
                  ? 'border border-slate-700/80 bg-[#0c1224] text-slate-200 hover:border-cyan-500/50'
                  : 'border border-slate-800/60 bg-[#080b16] text-slate-500 opacity-50 cursor-not-allowed'
              }`}
              title={`Nodo ${nodo.numero}: ${nombreEtapa}`}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded font-pixel text-[7.5px] font-bold ${
                    completa
                      ? 'bg-emerald-400 text-slate-950'
                      : activa
                      ? 'bg-cyan-400 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {completa ? '✓' : nodo.numero}
                </span>
                <span className="truncate font-pixel text-[8px] font-bold">
                  {nodo.numero}. {nombreEtapa}
                </span>
              </div>
              <span className="shrink-0 text-[8px] font-pixel text-slate-400">
                {completa ? '✓' : !esHabilitado ? '🔒' : activa ? '▶' : ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* PARTE INFERIOR: ESTADO ACTUAL Y PANTALLA COMPLETA */}
      <div className="shrink-0 pt-1 border-t border-cyan-500/20 space-y-1.5">
        <div className="rounded border border-cyan-500/30 bg-[#091124] p-1.5 text-center">
          <span className="font-pixel text-[7.5px] text-cyan-300/80 uppercase block">NODO EN CURSO</span>
          <span className="font-pixel text-[8.5px] text-[#00f0ff] font-bold truncate block">
            {nodoActual.numero}. {etapaActual?.titulo || nodoActual.label}
          </span>
        </div>

        <button
          type="button"
          onClick={alternarPantallaCompleta}
          className="w-full flex items-center justify-center gap-1 rounded border border-cyan-700 bg-[#0d1629] py-1 px-2 font-pixel text-[7.5px] uppercase text-cyan-200 hover:border-cyan-400 hover:text-cyan-100 transition-colors"
        >
          {pantallaCompleta ? '⤢ SALIR PANTALLA COMPLETA' : '⛶ PANTALLA COMPLETA'}
        </button>

        <div className="flex gap-1.5 pt-0.5">
          <button
            type="button"
            onClick={onDescargarRespaldo}
            className="flex-1 rounded border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 py-1 px-1 font-pixel text-[7px] uppercase text-emerald-300 transition-colors"
            title="Descargar copia de tu avance"
          >
            💾 RESPALDO
          </button>
          <button
            type="button"
            onClick={onCerrarSesion}
            className="flex-1 rounded border border-red-500/40 bg-red-950/40 hover:bg-red-900/60 py-1 px-1 font-pixel text-[7px] uppercase text-red-300 transition-colors"
            title="Cerrar sesión"
          >
            🚪 SALIR
          </button>
        </div>
      </div>
    </aside>
  );
}
