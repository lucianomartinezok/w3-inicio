import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const STORAGE_KEY = 'web3_recorrido_v1';

const ETAPAS = [
  { encuentro: 'Inicio', titulo: 'Prepará tu recorrido', icono: '👋' },
  { encuentro: 'Encuentro 1', titulo: 'El problema de la confianza', icono: '🧩' },
  { encuentro: 'Encuentro 1', titulo: 'Blockchain humana', icono: '⛓️' },
  { encuentro: 'Encuentro 1', titulo: 'Detectar una modificación', icono: '🔎' },
  { encuentro: 'Encuentro 1', titulo: 'Primera evidencia', icono: '📝' },
  { encuentro: 'Encuentro 2', titulo: 'Recuperar lo aprendido', icono: '🧠' },
  { encuentro: 'Encuentro 2', titulo: 'Laboratorio Web3', icono: '🧪' },
  { encuentro: 'Encuentro 2', titulo: 'Investigar un caso', icono: '🕵️' },
  { encuentro: 'Cierre', titulo: 'Producto y puesta en común', icono: '🎤' },
];

const ESTADO_INICIAL = {
  paso: 0,
  nombre: '',
  grupo: '',
  respuestas: {},
  completados: [],
};

export default function PaginaRecorrido() {
  useDocumentTitle('Plan de aprendizaje');
  const modoPrueba = new URLSearchParams(window.location.search).get('prueba') === '1';
  const [estado, setEstado] = useState(() => {
    try {
      return { ...ESTADO_INICIAL, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
    } catch {
      return ESTADO_INICIAL;
    }
  });
  const [pista, setPista] = useState(0);
  const [presentacionVisible, setPresentacionVisible] = useState(true);
  const etapa = ETAPAS[estado.paso];
  const ultimoCompleto = estado.completados.length ? Math.max(...estado.completados) : -1;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    } catch {
      // El recorrido sigue funcionando aunque el navegador bloquee el almacenamiento.
    }
    window.scrollTo(0, 0);
  }, [estado]);

  const guardarRespuesta = (clave, valor) => {
    setEstado((actual) => ({
      ...actual,
      respuestas: { ...actual.respuestas, [clave]: valor },
    }));
  };

  const completar = () => {
    setEstado((actual) => ({
      ...actual,
      completados: [...new Set([...actual.completados, actual.paso])],
      paso: Math.min(actual.paso + 1, ETAPAS.length - 1),
    }));
    setPista(0);
  };

  const irA = (paso) => {
    if (paso <= ultimoCompleto + 1) {
      setEstado((actual) => ({ ...actual, paso }));
      setPresentacionVisible(false);
      setPista(0);
    }
  };

  return (
    <div className="min-h-dvh bg-transparent text-slate-800">
      {modoPrueba && (
        <div className="border-b border-fuchsia-200 bg-fuchsia-50">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 lg:px-8">
            <strong className="mr-auto text-sm text-fuchsia-900">🧰 Modo de prueba activo</strong>
            <button onClick={() => autocompletarPaso(estado.paso, setEstado)} className="rounded-lg bg-fuchsia-600 px-3 py-2 text-xs font-black text-white">Autocompletar etapa</button>
            <button onClick={() => setEstado((e) => ({ ...e, completados: [...new Set([...e.completados, e.paso])], paso: Math.min(e.paso + 1, ETAPAS.length - 1) }))} className="rounded-lg border border-fuchsia-300 bg-white px-3 py-2 text-xs font-black text-fuchsia-800">Forzar avance →</button>
            <button onClick={() => { try { localStorage.removeItem(STORAGE_KEY); } catch { /* sin persistencia */ } setEstado(ESTADO_INICIAL); }} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600">Reiniciar</button>
          </div>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:px-6">
        <aside className="hidden lg:block">
          <nav className="sticky top-5 space-y-2 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="rounded-2xl bg-indigo-600 px-4 py-4 text-white shadow-sm">
              <div className="flex items-center justify-between gap-3 text-xs font-black uppercase tracking-wide">
                <span>Tu progreso</span>
                <span>{Math.round((estado.completados.length / ETAPAS.length) * 100)}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-indigo-900/35">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${(estado.completados.length / ETAPAS.length) * 100}%` }} />
              </div>
              <p className="mt-2 text-xs text-indigo-100">Etapa {estado.paso + 1} de {ETAPAS.length}</p>
            </div>
            {ETAPAS.map((item, indice) => {
              const completo = estado.completados.includes(indice);
              const habilitado = indice <= ultimoCompleto + 1;
              return (
                <button key={item.titulo} disabled={!habilitado} onClick={() => irA(indice)} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${indice === estado.paso ? 'bg-indigo-50 text-indigo-800' : habilitado ? 'hover:bg-slate-50' : 'cursor-not-allowed opacity-35'}`}>
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm ${completo ? 'bg-emerald-500 text-white' : indice === 0 && presentacionVisible ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>{completo ? '✓' : item.icono}</span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">{item.encuentro}</span>
                    <span className="block truncate text-sm font-bold">{item.titulo}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main>
          {presentacionVisible ? (
            <Presentacion />
          ) : (
            <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 sm:p-7">
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-indigo-700">{etapa.encuentro}</span>
                <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">{etapa.icono} {etapa.titulo}</h1>
              </div>
              <div className="p-6 sm:p-7">
                <ContenidoPaso paso={estado.paso} estado={estado} setEstado={setEstado} responder={guardarRespuesta} pista={pista} setPista={setPista} />
                <Navegacion paso={estado.paso} estado={estado} setEstado={setEstado} completar={completar} />
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function Presentacion() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-8 text-white sm:p-10">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-indigo-100">⛓️ Desafío Blockchain</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.98] sm:text-5xl xl:text-6xl">Espacios de incubación para proyectos de Blockchain</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-indigo-50">Clase, práctica y acompañamiento para comprender la tecnología, ensayar proyectos y construir una primera propuesta en equipo.</p>
      </div>
      <div className="grid gap-5 p-7 sm:grid-cols-3 sm:p-9">
        <BloquePresentacion icono="💭" titulo="Pensar">Partir de un problema cotidiano: cómo confiar en un registro compartido.</BloquePresentacion>
        <BloquePresentacion icono="🧩" titulo="Experimentar">Construir, modificar y verificar una cadena junto con el curso.</BloquePresentacion>
        <BloquePresentacion icono="🧪" titulo="Probar">Usar una wallet y un contrato simulados sin dinero ni riesgos.</BloquePresentacion>
        <p className="rounded-2xl bg-slate-100 p-5 text-sm leading-relaxed text-slate-700 sm:col-span-3"><b>Para comenzar:</b> elegí <b>👋 Inicio · Prepará tu recorrido</b> en el menú de la izquierda.</p>
      </div>
    </section>
  );
}

function BloquePresentacion({ icono, titulo, children }) {
  return <div className="rounded-2xl border border-slate-200 p-5"><span className="text-2xl">{icono}</span><h2 className="mt-3 font-black text-slate-950">{titulo}</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{children}</p></div>;
}

function autocompletarPaso(paso, setEstado) {
  const respuestasPrueba = {
    1: { problema: 'confianza', solucion: 'Mantener copias del registro y acordar reglas para validar los cambios.' },
    2: { nodo: 'nodo' },
    3: { hash: 'rompe', explicacion_hash: 'Al cambiar un dato cambia su huella y deja de coincidir con la referencia del bloque siguiente.' },
    4: {
      e1_problema: 'Permite mantener un registro compartido y verificable sin depender de una sola autoridad.',
      e1_cambio: 'Cambia su hash y se rompe la relación con los bloques posteriores.',
      e1_diferencia: 'El centralizado depende de una autoridad; el distribuido mantiene copias entre varios nodos.',
      e1_caso: 'No necesariamente: si la escuela controla el registro, una base centralizada puede ser más simple.',
    },
    5: { sintesis: 'registro', hipotesis: 'Conectar una identidad, leer el contrato, autorizar con una firma y esperar la confirmación.' },
    6: {
      lab_check: ['Conectamos la wallet simulada.', 'Identificamos la red.', 'Leímos el mensaje sin firmar.', 'Escribimos un mensaje y firmamos.', 'Observamos la confirmación, el hash y el bloque.', 'Abrimos el Narrador y seguimos los eventos.'],
      leer_escribir: 'Leer consulta el estado y no requiere firma; escribir lo modifica, requiere autorización y consume gas.',
    },
    7: { variante: 'firma', investigacion: 'La transacción se detuvo cuando la wallet solicitó la firma.', investigacion_por_que: 'Sin autorización del dueño de la wallet la escritura no puede enviarse.' },
    8: {
      caso_si: 'Trazabilidad entre organizaciones que no confían plenamente entre sí y necesitan verificar un historial común.',
      caso_no: 'Un registro interno controlado por una sola escuela, donde una base de datos común es suficiente.',
      metacognicion: 'Antes pensaba que blockchain era solamente Bitcoin; ahora entiendo el registro distribuido y todavía me pregunto cómo se alcanza el consenso.',
    },
  };

  setEstado((actual) => ({
    ...actual,
    nombre: paso === 0 ? 'Estudiante de prueba' : actual.nombre,
    grupo: paso === 0 ? '4.º año' : actual.grupo,
    respuestas: { ...actual.respuestas, ...(respuestasPrueba[paso] || {}) },
  }));
}

function ContenidoPaso({ paso, estado, setEstado, responder, pista, setPista }) {
  const r = estado.respuestas;

  if (paso === 0) return (
    <div className="space-y-6">
      <Bloque titulo="Tu misión">Al finalizar vas a poder explicar qué problema intenta resolver una blockchain, cómo se relacionan sus bloques y cuándo tendría sentido usarla.</Bloque>
      <div>
        <h2 className="mb-3 font-black text-slate-950">Todo el material, en un solo lugar</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Recurso to="/teoria/web3" icono="📚" titulo="Teoría" texto="Web3 y conceptos fundamentales." />
          <Recurso to="/diccionario" icono="📖" titulo="Glosario" texto="Definiciones, analogías y ejemplos." />
          <Recurso to="/demo" icono="🧪" titulo="Laboratorio" texto="Wallet y transacción simulada." />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Nombre y apellido" valor={estado.nombre} onChange={(valor) => setEstado((e) => ({ ...e, nombre: valor }))} />
        <Campo etiqueta="Curso o grupo" valor={estado.grupo} onChange={(valor) => setEstado((e) => ({ ...e, grupo: valor }))} />
      </div>
      <Aviso>Tu avance se guarda solamente en esta computadora y en este navegador.</Aviso>
    </div>
  );

  if (paso === 1) return (
    <div className="space-y-6">
      <Situacion>La escuela registra préstamos de notebooks en un único archivo. Un día aparecen dos versiones distintas y nadie sabe cuál es la correcta.</Situacion>
      <Pregunta texto="¿Cuál es el problema principal?">
        <Opciones valor={r.problema} onChange={(v) => responder('problema', v)} opciones={[
          ['rapidez', 'El archivo tarda en abrir.'],
          ['confianza', 'No se puede verificar quién cambió el registro ni cuál versión es válida.'],
          ['diseno', 'La tabla no tiene colores.'],
        ]} correcta="confianza" />
      </Pregunta>
      <Area etiqueta="Escribí una primera solución posible" valor={r.solucion || ''} onChange={(v) => responder('solucion', v)} />
      <Tutor pista={pista} setPista={setPista} pistas={['Pensá en las personas que necesitan confiar en ese archivo.', '¿Ayudaría que varias personas conservaran una copia?', 'Una solución puede combinar copias, comparación y reglas para aceptar cambios.']} />
    </div>
  );

  if (paso === 2) return (
    <div className="space-y-6">
      <Bloque titulo="Actividad con tu grupo">Cada grupo será un nodo y conservará una copia del mismo registro. Sigan las indicaciones del docente para construir tres bloques.</Bloque>
      <ol className="grid gap-3 sm:grid-cols-2">
        {['Numeren cada bloque.', 'Escriban las transacciones.', 'Copien la huella del bloque anterior.', 'Comparen el resultado entre todos los nodos.'].map((texto, i) => <li key={texto} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><b className="mr-2 text-indigo-600">{i + 1}.</b>{texto}</li>)}
      </ol>
      <Pregunta texto="¿Qué representa cada grupo en esta simulación?">
        <Opciones valor={r.nodo} onChange={(v) => responder('nodo', v)} opciones={[["bloque", 'Un bloque.'], ["nodo", 'Un nodo con una copia del registro.'], ["wallet", 'Una wallet.']]} correcta="nodo" />
      </Pregunta>
    </div>
  );

  if (paso === 3) return (
    <div className="space-y-6">
      <Situacion>Un grupo modifica una transacción del bloque 1, pero deja iguales las huellas escritas en los bloques 2 y 3.</Situacion>
      <Pregunta texto="¿Qué debería ocurrir al volver a calcular las huellas?">
        <Opciones valor={r.hash} onChange={(v) => responder('hash', v)} opciones={[["nada", 'Nada: los bloques posteriores no dependen del primero.'], ["rompe", 'Cambia la huella y el encadenamiento deja de ser válido.'], ["borra", 'Toda la información se borra automáticamente.']]} correcta="rompe" />
      </Pregunta>
      <Area etiqueta="Explicalo con tus palabras" valor={r.explicacion_hash || ''} onChange={(v) => responder('explicacion_hash', v)} />
      <Tutor pista={pista} setPista={setPista} pistas={['Una huella depende de los datos usados para crearla.', 'El bloque siguiente conserva la huella del anterior.', 'Si cambia un dato, cambia su hash y ya no coincide con la referencia guardada en el bloque siguiente.']} />
    </div>
  );

  if (paso === 4) return (
    <div className="space-y-5">
      <Bloque titulo="Evidencia del primer encuentro">Respondé de manera individual. El docente podrá pedirte que entregues o copies estas respuestas.</Bloque>
      <Area etiqueta="1. ¿Qué problema intenta resolver una blockchain?" valor={r.e1_problema || ''} onChange={(v) => responder('e1_problema', v)} />
      <Area etiqueta="2. ¿Qué sucede si se modifica un bloque anterior?" valor={r.e1_cambio || ''} onChange={(v) => responder('e1_cambio', v)} />
      <Area etiqueta="3. Diferencia entre registro centralizado y distribuido" valor={r.e1_diferencia || ''} onChange={(v) => responder('e1_diferencia', v)} />
      <Area etiqueta="4. ¿Usarías blockchain para los préstamos de una biblioteca escolar? Justificá." valor={r.e1_caso || ''} onChange={(v) => responder('e1_caso', v)} />
      <button onClick={() => window.print()} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold hover:bg-slate-50">Imprimir o guardar como PDF</button>
    </div>
  );

  if (paso === 5) return (
    <div className="space-y-6">
      <Pregunta texto="Elegí la síntesis más precisa">
        <Opciones valor={r.sintesis} onChange={(v) => responder('sintesis', v)} opciones={[["bitcoin", 'Blockchain es una moneda digital.'], ["registro", 'Blockchain es un registro compartido cuyos participantes pueden verificar cambios y acordar una versión válida.'], ["nube", 'Blockchain es cualquier archivo guardado en Internet.']]} correcta="registro" />
      </Pregunta>
      <Area etiqueta="Antes del laboratorio: ¿qué pasos imaginás que requiere guardar un mensaje en una blockchain?" valor={r.hipotesis || ''} onChange={(v) => responder('hipotesis', v)} />
      <div className="flex flex-wrap gap-3"><Link to="/teoria/conceptos" target="_blank" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">Repasar conceptos</Link><Link to="/diccionario" target="_blank" className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-bold">Abrir glosario</Link></div>
    </div>
  );

  if (paso === 6) return (
    <div className="space-y-6">
      <Bloque titulo="Trabajen en parejas">La demo es una simulación segura: no requiere MetaMask, criptomonedas ni dinero real.</Bloque>
      <Link to="/demo" target="_blank" className="inline-flex rounded-2xl bg-indigo-600 px-6 py-4 font-black text-white shadow-lg hover:bg-indigo-700">Abrir laboratorio simulado ↗</Link>
      <Checklist valores={r.lab_check || []} onChange={(v) => responder('lab_check', v)} items={['Conectamos la wallet simulada.', 'Identificamos la red.', 'Leímos el mensaje sin firmar.', 'Escribimos un mensaje y firmamos.', 'Observamos la confirmación, el hash y el bloque.', 'Abrimos el Narrador y seguimos los eventos.']} />
      <Area etiqueta="¿Cuál fue la diferencia entre leer y escribir en el contrato?" valor={r.leer_escribir || ''} onChange={(v) => responder('leer_escribir', v)} />
    </div>
  );

  if (paso === 7) return (
    <div className="space-y-6">
      <Bloque titulo="Elijan una investigación">Repitan la demo con una variante y registren qué sucede.</Bloque>
      <Opciones valor={r.variante} onChange={(v) => responder('variante', v)} opciones={[["firma", 'Rechazo de firma: abrir /demo?fallo=firma'], ["red", 'Red incorrecta: abrir /demo?fallo=red'], ["tecnico", 'Activar el modo técnico y analizar los eventos'], ["comparar", 'Comparar una operación de lectura con una escritura']]} />
      {r.variante === 'firma' && <a className="font-bold text-indigo-600 underline" target="_blank" rel="noreferrer" href="/demo?fallo=firma">Abrir variante de firma ↗</a>}
      {r.variante === 'red' && <a className="font-bold text-indigo-600 underline" target="_blank" rel="noreferrer" href="/demo?fallo=red">Abrir variante de red ↗</a>}
      <Area etiqueta="¿Qué ocurrió y en qué etapa del proceso?" valor={r.investigacion || ''} onChange={(v) => responder('investigacion', v)} />
      <Area etiqueta="¿Por qué el sistema se comportó de esa manera?" valor={r.investigacion_por_que || ''} onChange={(v) => responder('investigacion_por_que', v)} />
    </div>
  );

  return (
    <Cierre estado={estado} responder={responder} />
  );
}

function Cierre({ estado, responder }) {
  const r = estado.respuestas;
  const resumen = useMemo(() => `DESAFÍO BLOCKCHAIN\nEstudiante: ${estado.nombre}\nGrupo: ${estado.grupo}\n\nQué problema resuelve:\n${r.e1_problema || ''}\n\nQué ocurre al modificar un bloque:\n${r.e1_cambio || ''}\n\nLectura vs escritura:\n${r.leer_escribir || ''}\n\nInvestigación:\n${r.investigacion || ''}\n\nCaso donde usaríamos blockchain:\n${r.caso_si || ''}\n\nCaso donde no la usaríamos:\n${r.caso_no || ''}`, [estado, r]);
  return <div className="space-y-5">
    <Bloque titulo="Preparación de la exposición">La pareja dispone de dos minutos. Expliquen el proceso; no lean definiciones del glosario.</Bloque>
    <Area etiqueta="Un caso donde blockchain tendría sentido y por qué" valor={r.caso_si || ''} onChange={(v) => responder('caso_si', v)} />
    <Area etiqueta="Un caso donde blockchain no aportaría valor y por qué" valor={r.caso_no || ''} onChange={(v) => responder('caso_no', v)} />
    <Area etiqueta="Antes pensaba… ahora entiendo… todavía me pregunto…" valor={r.metacognicion || ''} onChange={(v) => responder('metacognicion', v)} />
    <button onClick={() => navigator.clipboard?.writeText(resumen)} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Copiar síntesis para entregar</button>
  </div>;
}

function Navegacion({ paso, estado, setEstado, completar }) {
  const r = estado.respuestas;
  const requisitos = [estado.nombre.trim() && estado.grupo.trim(), r.problema === 'confianza' && r.solucion?.trim(), r.nodo === 'nodo', r.hash === 'rompe' && r.explicacion_hash?.trim(), r.e1_problema?.trim() && r.e1_cambio?.trim() && r.e1_diferencia?.trim() && r.e1_caso?.trim(), r.sintesis === 'registro' && r.hipotesis?.trim(), r.lab_check?.length === 6 && r.leer_escribir?.trim(), r.variante && r.investigacion?.trim() && r.investigacion_por_que?.trim(), r.caso_si?.trim() && r.caso_no?.trim() && r.metacognicion?.trim()];
  const listo = Boolean(requisitos[paso]);
  return <div className="mt-9 flex items-center justify-between border-t border-slate-200 pt-6">
    <button disabled={paso === 0} onClick={() => setEstado((e) => ({ ...e, paso: Math.max(0, e.paso - 1) }))} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-600 disabled:opacity-30">← Anterior</button>
    {paso < ETAPAS.length - 1 ? <button disabled={!listo} onClick={completar} className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">Completar y continuar →</button> : <button disabled={!listo} onClick={() => setEstado((e) => ({ ...e, completados: [...new Set([...e.completados, paso])] }))} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white disabled:bg-slate-300">Finalizar recorrido ✓</button>}
  </div>;
}

function Bloque({ titulo, children }) { return <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5"><h2 className="font-black text-indigo-950">{titulo}</h2><div className="mt-2 leading-relaxed text-indigo-900">{children}</div></div>; }
function Situacion({ children }) { return <div className="rounded-2xl border-l-4 border-amber-400 bg-amber-50 p-5 font-semibold leading-relaxed text-amber-950">{children}</div>; }
function Aviso({ children }) { return <p className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">ℹ️ {children}</p>; }
function Pregunta({ texto, children }) { return <fieldset><legend className="mb-3 font-black text-slate-900">{texto}</legend>{children}</fieldset>; }
function Campo({ etiqueta, valor, onChange }) { return <label className="block text-sm font-bold text-slate-700">{etiqueta}<input value={valor} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>; }
function Area({ etiqueta, valor, onChange }) { return <label className="block text-sm font-bold text-slate-700">{etiqueta}<textarea rows="4" value={valor} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 font-normal leading-relaxed outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></label>; }
function Opciones({ opciones, valor, onChange, correcta }) { return <div className="space-y-2">{opciones.map(([id, texto]) => <label key={id} className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${valor === id ? id === correcta || !correcta ? 'border-indigo-400 bg-indigo-50' : 'border-red-300 bg-red-50' : 'border-slate-200 hover:bg-slate-50'}`}><input type="radio" checked={valor === id} onChange={() => onChange(id)} /><span>{texto}</span></label>)}</div>; }
function Checklist({ items, valores, onChange }) { const toggle = (item) => onChange(valores.includes(item) ? valores.filter((v) => v !== item) : [...valores, item]); return <div className="space-y-2">{items.map((item) => <label key={item} className="flex cursor-pointer gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50"><input type="checkbox" checked={valores.includes(item)} onChange={() => toggle(item)} /><span>{item}</span></label>)}</div>; }
function Tutor({ pistas, pista, setPista }) { return <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5"><div className="flex items-center justify-between gap-3"><b className="text-violet-900">💎 Tutor de pistas</b><button onClick={() => setPista(Math.min(pista + 1, pistas.length))} className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white">Necesito una pista</button></div>{pista > 0 && <p className="mt-3 text-sm text-violet-900">{pistas[pista - 1]}</p>}</div>; }
function Recurso({ to, icono, titulo, texto }) { return <Link to={to} className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"><span className="text-2xl">{icono}</span><h3 className="mt-2 font-black text-slate-900">{titulo}</h3><p className="mt-1 text-sm leading-relaxed text-slate-500">{texto}</p></Link>; }
