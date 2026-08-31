import { useEffect, useRef, useState } from 'react';
import { useContrato } from '../hooks/useContrato';
import { useNarrador } from '../hooks/useNarrador';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const ETAPAS = [
  ['💻', 'Conectar', 'La app conoce tu identidad'],
  ['📖', 'Leer', 'Consultar sin modificar'],
  ['✍️', 'Escribir', 'Firmar una transacción'],
  ['✅', 'Confirmar', 'Ver el resultado'],
  ['🗂️', 'Registro', 'Revisar lo guardado'],
  ['🛡️', 'Pruebas', 'Errores y ataques'],
];

const HISTORIAL_KEY = 'web3demo_historial';

export default function PaginaDemo() {
  useDocumentTitle('Laboratorio Web3');
  const [etapa, setEtapa] = useState(0);
  const [maxEtapa, setMaxEtapa] = useState(0);
  const [respuestaConexion, setRespuestaConexion] = useState('');
  const [respuestaLectura, setRespuestaLectura] = useState('');
  const [texto, setTexto] = useState('');
  const [historial, setHistorial] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HISTORIAL_KEY)) || [];
    } catch {
      return [];
    }
  });
  const { cuenta, chainId, balance, conectar, leerMensaje, enviarMensaje, mensajeActual, ultimaTx, cargando, error } = useContrato();

  const conectarYAvanzar = async () => {
    const resultado = await conectar();
    if (!resultado) return;
    setMaxEtapa((actual) => Math.max(actual, 1));
    setEtapa(1);
  };

  const leerYAvanzar = async () => {
    const resultado = await leerMensaje();
    if (resultado === undefined) return;
    setMaxEtapa((actual) => Math.max(actual, 2));
    setEtapa(2);
  };

  const enviarYAvanzar = async (mensaje) => {
    const resultado = await enviarMensaje(mensaje);
    if (!resultado) return;
    const nuevoRegistro = { mensaje, ...resultado };
    setHistorial((actual) => {
      const siguiente = [...actual, nuevoRegistro];
      try {
        localStorage.setItem(HISTORIAL_KEY, JSON.stringify(siguiente));
      } catch {
        // El laboratorio continúa aunque el navegador no permita persistencia.
      }
      return siguiente;
    });
    setMaxEtapa((actual) => Math.max(actual, 3));
    setEtapa(3);
  };

  const abrirRegistro = () => {
    setMaxEtapa(4);
    setEtapa(4);
  };

  const abrirPruebas = () => {
    setMaxEtapa(5);
    setEtapa(5);
  };

  const guardarOtro = () => {
    setTexto('');
    setEtapa(2);
  };

  return (
    <div className="h-[calc(100dvh-1.75rem)] overflow-hidden bg-transparent p-4 text-slate-800 lg:p-5">
      <div className="mx-auto grid h-full max-w-7xl gap-4 lg:grid-cols-[13.5rem_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="border-b border-slate-200 px-3 py-3">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-indigo-600">Laboratorio Web3</p>
            <h1 className="mt-1 text-xl font-black text-slate-950">Una transacción, paso a paso</h1>
          </div>
          <nav className="mt-3 flex flex-1 flex-col gap-2" aria-label="Etapas del laboratorio">
            {ETAPAS.map(([icono, titulo, detalle], indice) => {
              const habilitada = indice <= maxEtapa;
              const completa = indice < maxEtapa || indice === 3 && ultimaTx;
              return <button key={titulo} type="button" disabled={!habilitada} onClick={() => setEtapa(indice)} className={`flex min-h-16 items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${etapa === indice ? 'border-indigo-300 bg-indigo-50 text-indigo-950' : habilitada ? 'border-transparent hover:bg-slate-50' : 'cursor-not-allowed border-transparent opacity-35'}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${completa ? 'bg-emerald-500 text-white' : etapa === indice ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{completa ? '✓' : icono}</span>
                <span className="min-w-0"><span className="block text-sm font-black">{indice + 1}. {titulo}</span><span className="block text-xs leading-snug text-slate-500">{detalle}</span></span>
              </button>;
            })}
          </nav>
        </aside>

        <main className="min-h-0 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-slate-50 px-6 py-3">
              <div><p className="text-xs font-black uppercase tracking-wider text-indigo-600">Etapa {etapa + 1} de {ETAPAS.length}</p><p className="mt-0.5 text-sm text-slate-500">Todo ocurre en esta pantalla. Podés volver desde la barra lateral.</p></div>
              <div className="hidden items-center gap-1 sm:flex" aria-label={`Progreso: ${maxEtapa + 1} de ${ETAPAS.length}`}>{ETAPAS.map((item, indice) => <span key={item[1]} className={`h-2 w-10 rounded-full ${indice <= maxEtapa ? 'bg-indigo-600' : 'bg-slate-200'}`} />)}</div>
            </div>
            <div className="min-h-0 flex-1 p-5 lg:p-6">
              {etapa === 0 && <EtapaConexion respuesta={respuestaConexion} setRespuesta={setRespuestaConexion} conectar={conectarYAvanzar} cargando={cargando} error={error} />}
              {etapa === 1 && <EtapaLectura cuenta={cuenta} chainId={chainId} balance={balance} mensaje={mensajeActual} respuesta={respuestaLectura} setRespuesta={setRespuestaLectura} avanzar={leerYAvanzar} cargando={cargando} />}
              {etapa === 2 && <EtapaEscritura texto={texto} setTexto={setTexto} enviar={enviarYAvanzar} cargando={cargando} error={error} volver={() => setEtapa(1)} />}
              {etapa === 3 && <EtapaConfirmacion mensaje={mensajeActual} tx={ultimaTx} guardarOtro={guardarOtro} abrirRegistro={abrirRegistro} abrirPruebas={abrirPruebas} puedeProbar={historial.length >= 2} />}
              {etapa === 4 && <EtapaRegistro historial={historial} volver={() => setEtapa(3)} guardarOtro={guardarOtro} abrirPruebas={abrirPruebas} />}
              {etapa === 5 && <EtapaPruebas volver={() => setEtapa(4)} />}
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}

function MonitorProceso({ etapa }) {
  const { eventos } = useNarrador();
  const ultimo = eventos[eventos.length - 1];
  const apoyos = [
    'Mirá qué permiso solicita la app y qué dato queda protegido.',
    'Observá que una consulta no abre una solicitud de firma.',
    'Seguí el recorrido: firma, envío, validación y bloque.',
    'Relacioná el mensaje con su hash, bloque y costo de gas.',
    'Compará los mensajes y comprobá que cada transacción tiene su propio hash y bloque.',
    'Buscá qué cambia, qué rechaza la mayoría y qué información permanece disponible.',
  ];

  return <section className="mt-3 rounded-2xl bg-slate-950 p-3 text-slate-200" aria-label="Monitor del proceso" aria-live="polite">
    <div className="flex items-center gap-2 border-b border-white/10 pb-2">
      <span className={`h-2.5 w-2.5 rounded-full ${ultimo?.tipo === 'error' ? 'bg-red-400' : ultimo ? 'bg-emerald-400' : 'bg-slate-500'}`} />
      <h2 className="text-xs font-black uppercase tracking-wider">Monitor del proceso</h2>
    </div>
    <p className="mt-2 text-xs leading-snug text-indigo-200">{apoyos[etapa]}</p>
    <div className="mt-2 rounded-xl bg-white/5 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Último evento</p>
      <p className="mt-1 line-clamp-2 text-xs leading-snug text-slate-300">{ultimo?.humano || 'Esperando la primera acción…'}</p>
    </div>
  </section>;
}

function EtapaConexion({ respuesta, setRespuesta, conectar, cargando, error }) {
  return <PantallaEtapa etapa={0} icono="💻" titulo="La notebook pide conectarse" bajada="Primero entendamos qué permiso estamos dando." grafico={<GraficoNotebook estado="permiso" />}>
    <PreguntaSimple pregunta="¿Qué dato nunca debe conocer una página?" valor={respuesta} onChange={setRespuesta} opciones={[["direccion", 'Mi dirección pública'], ["privada", 'Mi clave privada'], ["red", 'La red que estoy usando']]} correcta="privada" />
    <p className={`rounded-xl px-4 py-3 text-sm ${respuesta === 'privada' ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>{respuesta === 'privada' ? '✓ Exacto. La wallet firma sin revelar tu clave privada.' : 'Elegí una respuesta para habilitar la conexión.'}</p>
    {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">⚠️ {error}</p>}
    <button type="button" disabled={respuesta !== 'privada' || cargando} onClick={conectar} className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">{cargando ? '⏳ Buscando wallet…' : '🦊 Conectar wallet simulada →'}</button>
  </PantallaEtapa>;
}

function EtapaLectura({ cuenta, chainId, balance, mensaje, respuesta, setRespuesta, avanzar, cargando }) {
  return <PantallaEtapa etapa={1} icono="📖" titulo="Leer no cambia la blockchain" bajada="La app consulta un dato público del contrato." grafico={<GraficoNotebook estado="lectura" />}>
    <div className="grid grid-cols-2 gap-3 text-sm"><Dato etiqueta="Wallet" valor={`${cuenta?.slice(0, 8)}…${cuenta?.slice(-4)}`} /><Dato etiqueta="Red" valor={`${chainId} · Sepolia`} /><Dato etiqueta="Balance de prueba" valor={`${balance} ETH`} /><Dato etiqueta="Mensaje actual" valor={mensaje ? `“${mensaje}”` : '(vacío)'} /></div>
    <PreguntaSimple pregunta="¿Leer un contrato necesita firma?" valor={respuesta} onChange={setRespuesta} opciones={[["si", 'Sí, siempre'], ["no", 'No, porque no modifica datos']]} correcta="no" />
    <button type="button" disabled={respuesta !== 'no' || cargando} onClick={avanzar} className="w-full rounded-xl bg-emerald-600 px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">{cargando ? '⏳ Consultando…' : '📖 Leer y continuar →'}</button>
  </PantallaEtapa>;
}

function EtapaEscritura({ texto, setTexto, enviar, cargando, error, volver }) {
  return <PantallaEtapa etapa={2} icono="✍️" titulo="Escribir requiere autorización" bajada="Ahora sí cambiaremos el estado del contrato." grafico={<GraficoNotebook estado="firma" />}>
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><b>Antes de firmar:</b> revisá el mensaje, la red y el costo simulado. Firmar significa autorizar esta acción.</div>
    <label className="block text-sm font-bold text-slate-700">Mensaje para guardar<textarea rows="3" maxLength="120" value={texto} onChange={(e) => setTexto(e.target.value)} className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-indigo-500" placeholder="Escribí un mensaje breve…" /></label>
    <div className="flex justify-between text-xs text-slate-500"><span>Red: Sepolia · Gas simulado</span><span>{texto.length}/120</span></div>
    {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">⚠️ {error}</p>}
    <div className="flex gap-3"><button type="button" onClick={volver} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold">← Volver</button><button type="button" disabled={!texto.trim() || cargando} onClick={() => enviar(texto)} className="flex-1 rounded-xl bg-amber-500 px-5 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">{cargando ? '⏳ Esperando confirmación…' : '✍️ Revisar, firmar y enviar →'}</button></div>
  </PantallaEtapa>;
}

function EtapaConfirmacion({ mensaje, tx, guardarOtro, abrirRegistro, abrirPruebas, puedeProbar }) {
  return <PantallaEtapa etapa={3} icono="✅" titulo="La red confirmó la transacción" bajada="El nuevo estado ya forma parte de un bloque." grafico={<GraficoNotebook estado="confirmada" />}>
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-emerald-700">Mensaje guardado</p><p className="mt-2 text-xl font-black text-emerald-950">“{mensaje}”</p></div>
    <div className="grid grid-cols-2 gap-3"><Dato etiqueta="Bloque" valor={`#${tx?.numeroBloque ?? '—'}`} /><Dato etiqueta="Gas usado" valor={`${tx?.gasUsado ?? '—'} unidades`} /></div>
    <div className="rounded-xl bg-slate-950 p-4 text-xs text-slate-300"><span className="text-slate-500">HASH DE TRANSACCIÓN</span><p className="mt-1 break-all font-mono text-indigo-300">{tx?.hash}</p></div>
    <div className="grid grid-cols-2 gap-3"><button type="button" onClick={guardarOtro} className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-sm font-black text-indigo-800">✍️ Guardar otro mensaje</button><button type="button" onClick={abrirRegistro} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white">🗂️ Ver lo guardado →</button></div>
    {puedeProbar && <button type="button" onClick={abrirPruebas} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white">🛡️ Probar errores y ataques →</button>}
  </PantallaEtapa>;
}

function EtapaRegistro({ historial, volver, guardarOtro, abrirPruebas }) {
  const recientes = [...historial].reverse().slice(0, 4);
  return <PantallaEtapa etapa={4} icono="🗂️" titulo="Registro de la notebook" bajada="Estas son las transacciones realizadas en este navegador." grafico={<GraficoFlujoRegistro cantidad={historial.length} />}>
    <div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase tracking-wide text-indigo-600">Historial local</p><h3 className="mt-1 text-lg font-black text-slate-950">{historial.length} {historial.length === 1 ? 'mensaje guardado' : 'mensajes guardados'}</h3></div><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">✓ Verificados</span></div>
    <div className="grid gap-2">
      {recientes.map((item, indice) => <div key={`${item.hash}-${indice}`} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-sm">🧱</span><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-900">“{item.mensaje}”</p><p className="truncate font-mono text-[10px] text-slate-500">{item.hash}</p></div><span className="text-xs font-bold text-slate-500">#{item.numeroBloque}</span></div>)}
      {recientes.length === 0 && <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-500">Todavía no hay transacciones guardadas.</p>}
    </div>
    {historial.length > recientes.length && <p className="text-xs text-slate-500">Se muestran las últimas {recientes.length} transacciones de esta notebook.</p>}
    <div className="grid grid-cols-2 gap-3"><button type="button" onClick={volver} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold">← Última confirmación</button><button type="button" onClick={guardarOtro} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white">✍️ Guardar otro mensaje</button></div>
    {historial.length >= 2 && <button type="button" onClick={abrirPruebas} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white">🛡️ Abrir test de errores →</button>}
  </PantallaEtapa>;
}

const INCIDENTES = {
  caida: { titulo: 'Cae un nodo', resumen: 'Nodo 2 desconectado', resultado: 'Los otros cinco nodos conservan sus copias, reorganizan las conexiones y la red sigue funcionando.', color: 'emerald' },
  hackeo: { titulo: 'Nodo hackeado', resumen: 'Nodo 4 envía datos alterados', resultado: 'La mayoría detecta la diferencia, rechaza esos datos y aísla al nodo manipulado.', color: 'violet' },
  firma: { titulo: 'Firma falsa', resumen: 'La firma no coincide', resultado: 'Los nodos rechazan la operación antes de incorporarla a un bloque. El registro no cambia.', color: 'amber' },
  bloque: { titulo: 'Bloque modificado', resumen: 'El hash deja de coincidir', resultado: 'Las copias válidas detectan la ruptura y restauran la versión acordada por la red.', color: 'cyan' },
};

function EtapaPruebas({ volver }) {
  const [incidente, setIncidente] = useState(null);
  const [fase, setFase] = useState('sana');
  const temporizadores = useRef([]);
  const activo = incidente ? INCIDENTES[incidente] : null;

  useEffect(() => () => temporizadores.current.forEach(clearTimeout), []);

  const simular = (id) => {
    temporizadores.current.forEach(clearTimeout);
    setIncidente(id);
    setFase('alarma');
    reproducirAlerta(id);
    temporizadores.current = [
      setTimeout(() => setFase('pendiente'), 1050),
      setTimeout(() => setFase('reparando'), 2200),
      setTimeout(() => setFase('sana'), 3500),
    ];
  };

  const estadoTexto = fase === 'alarma' ? '¡INCIDENTE DETECTADO!' : fase === 'pendiente' ? 'VALIDACIÓN PENDIENTE…' : fase === 'reparando' ? 'RECONFIGURANDO LA RED…' : activo ? 'RED RECUPERADA' : 'RED SANA · DATOS CIRCULANDO';

  return <PantallaEtapa etapa={5} icono="🛡️" titulo="¿Qué pasa si algo falla?" bajada="La red está funcionando. Elegí un incidente y mirá toda la secuencia." grafico={<GraficoRedAtaques incidente={incidente} fase={fase} estadoTexto={estadoTexto} />}>
    <div><p className="text-xs font-black uppercase tracking-wide text-indigo-600">Provocá un incidente</p><div className="mt-2 grid grid-cols-2 gap-2">{Object.entries(INCIDENTES).map(([id, item]) => <button key={id} type="button" disabled={fase !== 'sana'} onClick={() => simular(id)} className={`incident-option rounded-xl border px-3 py-3 text-left text-sm font-bold disabled:cursor-wait disabled:opacity-50 ${incidente === id ? 'border-indigo-400 bg-indigo-50 text-indigo-900' : 'border-slate-200 hover:bg-slate-50'}`}>{id === 'caida' ? '🔌' : id === 'hackeo' ? '👾' : id === 'firma' ? '🔑' : '⛓️'} {item.titulo}</button>)}</div></div>
    <div className={`rounded-2xl border p-4 transition-colors ${fase === 'alarma' ? 'border-red-300 bg-red-50 text-red-950' : fase === 'pendiente' ? 'border-amber-300 bg-amber-50 text-amber-950' : fase === 'reparando' ? 'border-cyan-300 bg-cyan-50 text-cyan-950' : activo ? 'border-emerald-300 bg-emerald-50 text-emerald-950' : 'border-slate-200 bg-slate-50 text-slate-700'}`} aria-live="polite"><p className="text-xs font-black uppercase tracking-wide">{estadoTexto}</p>{activo ? <><p className="mt-1 font-black">{activo.resumen}</p><p className="mt-2 text-sm leading-relaxed">{fase === 'sana' ? activo.resultado : fase === 'alarma' ? 'La red marca el problema y detiene temporalmente esa operación.' : fase === 'pendiente' ? 'Los nodos comparan firmas, hashes y copias antes de decidir.' : 'Los nodos válidos reconstruyen las conexiones y sincronizan el registro.'}</p></> : <p className="mt-2 text-sm">Los seis nodos comparten la misma versión y validan nuevas transacciones.</p>}</div>
    <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700"><b>Idea clave:</b> la red detecta, valida y se recupera; no acepta automáticamente todo lo que recibe.</p>
    <button type="button" onClick={volver} className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold">← Volver al registro</button>
  </PantallaEtapa>;
}

function reproducirAlerta(tipo) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const contexto = new AudioCtx();
  const patrones = { caida: [180, 120, 240], hackeo: [520, 260, 650], firma: [360, 360, 180], bloque: [220, 440, 660] };
  patrones[tipo].forEach((frecuencia, indice) => {
    const oscilador = contexto.createOscillator();
    const volumen = contexto.createGain();
    oscilador.type = tipo === 'hackeo' ? 'sawtooth' : tipo === 'firma' ? 'square' : 'sine';
    oscilador.frequency.value = frecuencia;
    volumen.gain.setValueAtTime(0.0001, contexto.currentTime + indice * 0.22);
    volumen.gain.exponentialRampToValueAtTime(0.12, contexto.currentTime + indice * 0.22 + 0.02);
    volumen.gain.exponentialRampToValueAtTime(0.0001, contexto.currentTime + indice * 0.22 + 0.17);
    oscilador.connect(volumen).connect(contexto.destination);
    oscilador.start(contexto.currentTime + indice * 0.22);
    oscilador.stop(contexto.currentTime + indice * 0.22 + 0.18);
  });
  setTimeout(() => contexto.close(), 1200);
}

function PantallaEtapa({ etapa, icono, titulo, bajada, grafico, children }) {
  return <section className="grid h-full min-h-0 gap-6 lg:grid-cols-[minmax(17rem,0.8fr)_minmax(25rem,1.2fr)] lg:items-center"><div className="min-w-0"><p className="text-xs font-black uppercase tracking-wider text-indigo-600">{icono} Laboratorio guiado</p><h2 className="mt-2 text-3xl font-black text-slate-950">{titulo}</h2><p className="mt-2 text-slate-600">{bajada}</p><div className="mt-5">{grafico}</div><MonitorProceso etapa={etapa} /></div><div className="min-w-0 space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">{children}</div></section>;
}

function GraficoNotebook({ estado }) {
  const pasos = { permiso: ['APP', '¿Conectar?', 'WALLET'], lectura: ['CONTRATO', 'Consultar dato', 'RESPUESTA'], firma: ['MENSAJE', 'Firmar permiso', 'RED'], confirmada: ['TRANSACCIÓN', 'Bloque validado', '✓ LISTO'] }[estado];
  return <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-xl"><div className="mx-auto rounded-2xl border-4 border-slate-700 bg-slate-900 p-4"><div className="mb-4 flex gap-1.5"><i className="h-2 w-2 rounded-full bg-red-400" /><i className="h-2 w-2 rounded-full bg-amber-400" /><i className="h-2 w-2 rounded-full bg-emerald-400" /></div><div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center"><span className="rounded-xl bg-indigo-500/20 px-3 py-4 text-xs font-black text-indigo-200">{pasos[0]}</span><span className="text-xl text-indigo-300">→</span><span className="rounded-xl bg-emerald-500/20 px-3 py-4 text-xs font-black text-emerald-200">{pasos[2]}</span></div><p className="mt-4 text-center text-sm font-bold text-slate-300">{pasos[1]}</p></div><div className="mx-auto h-2 w-28 rounded-b-xl bg-slate-600" /></div>;
}

function GraficoFlujoRegistro({ cantidad }) {
  return <div className="rounded-3xl bg-slate-950 p-4 text-white shadow-xl">
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 text-center text-[10px] font-black">
      <div><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-xl">✍️</span><p className="mt-1 text-indigo-200">CREAR</p></div>
      <div className="flex items-center"><i className="h-0.5 flex-1 bg-indigo-500" /><span className="px-1 text-indigo-300">TX</span><i className="h-0.5 flex-1 bg-indigo-500" /></div>
      <div><span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-xl">📡</span><p className="mt-1 text-amber-200">DISTRIBUIR</p></div>
    </div>
    <div className="mx-auto my-2 h-5 w-0.5 bg-slate-600" />
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-3">
      <div className="flex items-center justify-center gap-3 text-xl"><span>💻</span><span>🖥️</span><span>💻</span><span>🖥️</span></div>
      <p className="mt-1 text-center text-[10px] font-black text-emerald-300">LOS NODOS VALIDAN Y COPIAN</p>
    </div>
    <div className="mx-auto my-2 h-5 w-0.5 bg-slate-600" />
    <div className="flex items-center justify-center gap-1.5">{[1, 2, 3].map((bloque) => <span key={bloque} className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-black">B{bloque}</span>)}<span className="text-indigo-300">→</span><span className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-black">+ {cantidad}</span></div>
    <p className="mt-2 text-center text-xs text-slate-400">Cada escritura validada se suma al registro compartido.</p>
  </div>;
}

function GraficoRedAtaques({ incidente, fase, estadoTexto }) {
  const nodos = [1, 2, 3, 4, 5, 6];
  const afectado = incidente === 'caida' ? 2 : incidente === 'hackeo' ? 4 : null;
  const enAlarma = fase === 'alarma';
  const pendiente = fase === 'pendiente';
  const reparando = fase === 'reparando';
  const tono = enAlarma ? 'border-red-500 bg-red-950' : pendiente ? 'border-amber-400 bg-amber-950' : reparando ? 'border-cyan-400 bg-cyan-950' : 'border-emerald-500/40 bg-slate-950';
  const claseFase = enAlarma ? 'network-alarm' : pendiente ? 'network-pending' : reparando ? 'network-repair' : 'network-healthy';
  return <div className={`${claseFase} rounded-3xl border-2 p-4 text-white shadow-xl transition-colors ${tono}`}>
    <div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-wider text-slate-300">Red distribuida</p><span className={`flex items-center gap-1.5 text-[10px] font-black ${enAlarma ? 'text-red-200' : pendiente ? 'text-amber-200' : reparando ? 'text-cyan-200' : 'text-emerald-300'}`}><i className="network-status-dot h-2.5 w-2.5 rounded-full bg-current" /> {estadoTexto}</span></div>
    <div className="relative mx-auto mt-3 h-52 max-w-xs">
      <div className="network-ring absolute inset-[18%] rounded-full border border-dashed border-current opacity-60" />
      <i className="data-packet packet-one absolute left-1/2 top-[15%] z-30 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_white]" />
      <i className="data-packet packet-two absolute bottom-[20%] left-[18%] z-30 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_white]" />
      <div className={`absolute left-1/2 top-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl text-center text-[10px] font-black shadow-lg ${enAlarma ? 'bg-red-600' : pendiente ? 'bg-amber-500 text-slate-950' : reparando ? 'bg-cyan-500 text-slate-950' : 'bg-emerald-600'}`}>{enAlarma ? 'ALERTA' : pendiente ? 'REVISANDO' : reparando ? 'REPARANDO' : 'CONSENSO'}<br />{enAlarma ? '!' : '6/6'}</div>
      {nodos.map((nodo, indice) => {
        const posiciones = ['left-1/2 top-0 -translate-x-1/2', 'right-3 top-1/4', 'right-3 bottom-2', 'left-1/2 bottom-0 -translate-x-1/2', 'left-3 bottom-2', 'left-3 top-1/4'];
        const estaAfectado = nodo === afectado && fase !== 'sana';
        const colorNodo = enAlarma ? 'border-red-200 bg-red-600' : pendiente ? estaAfectado ? 'border-red-200 bg-red-600' : 'border-amber-200 bg-amber-500 text-slate-950' : reparando ? 'border-cyan-200 bg-cyan-500 text-slate-950' : 'border-emerald-300 bg-emerald-600';
        return <div key={nodo} className={`network-node absolute ${posiciones[indice]} z-20 flex h-11 w-11 items-center justify-center rounded-xl border-2 text-xs font-black shadow ${colorNodo}`}>{estaAfectado ? incidente === 'caida' ? 'OFF' : '✕' : `N${nodo}`}</div>;
      })}
    </div>
    <div className="rounded-xl bg-black/20 px-3 py-2 text-center text-xs font-bold text-slate-100">{!incidente ? 'Los nodos intercambian datos y mantienen copias sincronizadas.' : fase === 'sana' ? 'La red volvió a operar con normalidad.' : fase === 'alarma' ? 'Se detiene la operación sospechosa.' : fase === 'pendiente' ? 'Los nodos comparan sus copias.' : 'Se reconstruyen conexiones y estado.'}</div>
  </div>;
}

function PreguntaSimple({ pregunta, opciones, valor, onChange, correcta }) {
  return <fieldset><legend className="mb-2 text-sm font-black text-slate-900">Comprobación rápida · {pregunta}</legend><div className="grid gap-2 sm:grid-cols-2">{opciones.map(([id, texto]) => <label key={id} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm ${valor === id ? id === correcta ? 'border-emerald-400 bg-emerald-50' : 'border-red-300 bg-red-50' : 'border-slate-200 hover:bg-slate-50'}`}><input type="radio" checked={valor === id} onChange={() => onChange(id)} /><span>{texto}</span></label>)}</div></fieldset>;
}

function Dato({ etiqueta, valor }) {
  return <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-[10px] font-black uppercase tracking-wide text-slate-400">{etiqueta}</p><p className="mt-1 truncate text-sm font-bold text-slate-800" title={valor}>{valor}</p></div>;
}
