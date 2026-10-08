import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import MapaRecorrido, { MapaCompacto } from '../components/MapaRecorrido';
import PortadaBienvenida from '../components/PortadaBienvenida';
import ModalDiploma from '../components/ModalDiploma';
import PanelDocente from '../components/PanelDocente';
import {
  obtenerSesionActiva,
  cerrarSesion,
  guardarProgresoAlumno,
  cargarProgresoAlumno,
  generarPasaporteAlumno,
} from '../services/authService';

const STORAGE_KEY = 'web3_recorrido_v1';

const ETAPAS = [
  { encuentro: 'Punto de partida', titulo: 'Inicio de la red', icono: '🚀', tiempo: '5 min', modalidad: 'Spawn / Conexión' },
  { encuentro: 'Encuentro 1 · Introducción', titulo: 'Prepará tu recorrido', icono: '👋', tiempo: '15 min', modalidad: 'Con el docente' },
  { encuentro: 'Encuentro 1 · Autoasistido', titulo: 'El problema de la confianza', icono: '🧩', tiempo: '40 min', modalidad: 'Autónomo o en pareja' },
  { encuentro: 'Encuentro 1 · Guiado', titulo: 'Blockchain humana', icono: '⛓️', tiempo: '40 min', modalidad: 'Con el docente' },
  { encuentro: 'Encuentro 1 · Guiado', titulo: 'Detectar una modificación', icono: '🔎', tiempo: 'Dentro de los 40 min', modalidad: 'Actividad grupal' },
  { encuentro: 'Encuentro 1 · Cierre', titulo: 'Cierre de la primera etapa', icono: '📝', tiempo: 'Dentro de los 40 min', modalidad: 'Evidencia individual' },
  { encuentro: 'Encuentro 2 · Introducción', titulo: 'Recuperar lo aprendido', icono: '🧠', tiempo: '10 min', modalidad: 'Docente o autoasistido' },
  { encuentro: 'Encuentro 2 · Laboratorio', titulo: 'Wallet y transacción', icono: '🧪', tiempo: '90 min', modalidad: 'Trabajo en parejas' },
  { encuentro: 'Encuentro 2 · Laboratorio', titulo: 'Pruebas y resiliencia', icono: '🛡️', tiempo: 'Dentro de los 90 min', modalidad: 'Investigación guiada' },
  { encuentro: 'Encuentro 2 · Cierre', titulo: 'Puesta en común', icono: '🎤', tiempo: '20 min', modalidad: 'Cierre colectivo' },
];

const ESTADO_INICIAL = {
  sesionIniciada: false,
  esInvitado: false,
  nombre: '',
  apellido: '',
  dni: '',
  hashDni: '',
  escuela: '',
  grupo: '',
  paso: 0,
  respuestas: {},
  completados: [],
  passwords: {
    clase1: '',
    clase2: '',
    cierre: '',
  },
};

export default function PaginaRecorrido() {
  useDocumentTitle('Plan de aprendizaje');
  const modoPrueba = new URLSearchParams(window.location.search).get('prueba') === '1';
  const [estado, setEstado] = useState(() => {
    try {
      const sesion = obtenerSesionActiva();
      if (sesion && sesion.dni) {
        const guardadoProg = cargarProgresoAlumno(sesion.dni);
        return {
          ...ESTADO_INICIAL,
          ...sesion,
          ...(guardadoProg || {}),
          sesionIniciada: true,
        };
      }
      const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return { ...ESTADO_INICIAL, ...guardado };
    } catch {
      return ESTADO_INICIAL;
    }
  });
  const [pista, setPista] = useState(0);
  const [presentacionVisible, setPresentacionVisible] = useState(true);
  const [modalDiplomaVisible, setModalDiplomaVisible] = useState(false);
  const [modalDocenteVisible, setModalDocenteVisible] = useState(false);
  const etapa = ETAPAS[estado.paso];
  const ultimoCompleto = estado.completados.length ? Math.max(...estado.completados) : -1;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
      if (estado.sesionIniciada && !estado.esInvitado && estado.dni) {
        guardarProgresoAlumno(estado.dni, {
          paso: estado.paso,
          completados: estado.completados,
          respuestas: estado.respuestas,
          passwords: estado.passwords,
        });
      }
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
    setEstado((actual) => {
      const nuevoCompletados = [...new Set([...actual.completados, actual.paso])];
      const nuevasPasswords = { ...(actual.passwords || {}) };
      if (actual.paso === 5) nuevasPasswords.clase1 = 'GENESIS-2026';
      if (actual.paso === 8) nuevasPasswords.clase2 = 'SMART-77';
      if (actual.paso === 9) nuevasPasswords.cierre = 'CONSENSO-OK';

      return {
        ...actual,
        completados: nuevoCompletados,
        passwords: nuevasPasswords,
        paso: Math.min(actual.paso + 1, ETAPAS.length - 1),
      };
    });
    setPista(0);
  };

  const irA = (paso) => {
    if (estado.esInvitado || paso <= ultimoCompleto + 1) {
      setEstado((actual) => ({ ...actual, paso }));
      setPresentacionVisible(false);
      setPista(0);
    }
  };

  const reiniciarRecorrido = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // sin persistencia
    }
    setEstado(ESTADO_INICIAL);
    setPresentacionVisible(true);
    setPista(0);
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // sin persistencia
    }
    setEstado(ESTADO_INICIAL);
    setPresentacionVisible(true);
    setPista(0);
  };

  const handleDescargarRespaldo = () => {
    const datos = generarPasaporteAlumno(estado.dni);
    if (!datos) return;
    const jsonStr = JSON.stringify(datos, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avance_blockchain_${estado.dni}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Si no inició sesión y no está en modo prueba, se muestra la portada con formulario
  if (!estado.sesionIniciada && !modoPrueba) {
    return (
      <PortadaBienvenida
        datosIniciales={estado}
        onComenzar={(datos) => {
          setEstado((actual) => ({
            ...actual,
            ...datos,
            sesionIniciada: true,
          }));
        }}
      />
    );
  }

  return (
    <div className="w-full h-screen h-[100dvh] overflow-hidden bg-[#060814] text-slate-100">
      {modalDocenteVisible && <PanelDocente onCerrar={() => setModalDocenteVisible(false)} />}

      {modoPrueba && (
        <div className="border-b border-fuchsia-200 bg-fuchsia-50 z-50 relative shrink-0">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2 lg:px-8">
            <strong className="mr-auto text-xs text-fuchsia-900 font-pixel">🧰 MODO DE PRUEBA ACTIVO</strong>
            <button onClick={() => autocompletarPaso(estado.paso, setEstado)} className="rounded-lg bg-fuchsia-600 px-3 py-1.5 text-xs font-black text-white">Autocompletar etapa</button>
            <button onClick={() => setEstado((e) => ({ ...e, completados: [...new Set([...e.completados, e.paso])], paso: Math.min(e.paso + 1, ETAPAS.length - 1) }))} className="rounded-lg border border-fuchsia-300 bg-white px-3 py-1.5 text-xs font-black text-fuchsia-800">Forzar avance →</button>
            <button onClick={reiniciarRecorrido} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600">Reiniciar</button>
          </div>
        </div>
      )}

      {presentacionVisible ? (
        <MapaRecorrido
          etapas={ETAPAS}
          pasoActual={estado.paso}
          completados={estado.completados}
          ultimoCompleto={ultimoCompleto}
          nombre={estado.nombre}
          dni={estado.dni}
          hashDni={estado.hashDni}
          esInvitado={estado.esInvitado}
          onCambiarNombre={(nuevo) => setEstado((e) => ({ ...e, nombre: nuevo }))}
          onEntrar={irA}
          onResetear={reiniciarRecorrido}
          onAbrirDiploma={() => setModalDiplomaVisible(true)}
          onCerrarSesion={handleCerrarSesion}
          onDescargarRespaldo={handleDescargarRespaldo}
          onAbrirDocente={() => setModalDocenteVisible(true)}
        />
      ) : (
        <div className="flex h-full w-full overflow-hidden bg-[#060814]">
          {/* SIDEBAR COMPACTO: 25% ANCHO, 100% ALTO, CERO SCROLL */}
          <MapaCompacto
            etapas={ETAPAS}
            pasoActual={estado.paso}
            completados={estado.completados}
            ultimoCompleto={ultimoCompleto}
            nombre={estado.nombre}
            dni={estado.dni}
            hashDni={estado.hashDni}
            esInvitado={estado.esInvitado}
            onVerCompleto={() => setPresentacionVisible(true)}
            onIrA={irA}
            onAbrirDiploma={() => setModalDiplomaVisible(true)}
            onCerrarSesion={handleCerrarSesion}
            onDescargarRespaldo={handleDescargarRespaldo}
            onAbrirDocente={() => setModalDocenteVisible(true)}
          />

          {/* CONTENIDO DEL NODO: 75% ANCHO, 100% ALTO, SCROLL INTERNO OBLIGATORIO, FONDO BLANCO */}
          <main className="flex-1 h-full overflow-y-auto bg-slate-100 p-3 sm:p-5 lg:p-7 select-text">
            <div className="mx-auto max-w-4xl rounded-2xl border-4 border-slate-900 bg-white shadow-[8px_8px_0_#0f172a] overflow-hidden">
              {/* HEADER TÉCNICO CON ESTÉTICA CYBERPUNK Y FONDO BLANCO */}
              <header className="border-b-2 border-slate-900 bg-white p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded border-2 border-slate-900 bg-cyan-100 px-2.5 py-1 font-pixel text-[9px] font-black uppercase text-slate-950 shadow-[2px_2px_0_#0f172a]">
                      NODO {String(estado.paso).padStart(2, '0')} // {etapa.encuentro}
                    </span>
                    <span className="font-pixel text-[9px] text-cyan-800 font-bold">
                      {estado.completados.includes(estado.paso) ? '● ESTADO: SUPERADO ✓' : '● ESTADO: EN CURSO ▶'}
                    </span>
                    <span className="font-pixel text-[8px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                      ● GUARDADO ✓
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDescargarRespaldo}
                      className="flex items-center gap-1 rounded-lg border-2 border-slate-900 bg-emerald-100 hover:bg-emerald-200 px-2 py-1 font-pixel text-[8px] uppercase text-emerald-950 font-bold shadow-[2px_2px_0_#0f172a] transition-colors"
                      title="Descargar copia de seguridad de tu progreso"
                    >
                      <span>💾</span>
                      <span>RESPALDO</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPresentacionVisible(true)}
                      className="flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-slate-950 px-3 py-1 font-pixel text-[8.5px] uppercase text-cyan-300 font-bold shadow-[2px_2px_0_#0f172a] hover:bg-slate-800 hover:text-cyan-200 transition-colors"
                    >
                      <span>←</span>
                      <span>VER EN EL MAPA</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCerrarSesion}
                      className="flex items-center gap-1 rounded-lg border-2 border-slate-900 bg-red-100 hover:bg-red-200 px-2 py-1 font-pixel text-[8px] uppercase text-red-950 font-bold shadow-[2px_2px_0_#0f172a] transition-colors"
                      title="Cerrar sesión de este usuario"
                    >
                      <span>🚪</span>
                      <span>SALIR</span>
                    </button>
                  </div>
                </div>

                <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl shrink-0">{etapa.icono}</span>
                  <span>{etapa.titulo}</span>
                </h1>

                <div className="mt-4 flex flex-wrap items-center gap-2 font-pixel text-[8.5px] font-bold">
                  <span className="rounded border border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-800">
                    ⏱ TIEMPO: {etapa.tiempo}
                  </span>
                  <span className="rounded border border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-800">
                    👥 MODALIDAD: {etapa.modalidad}
                  </span>
                  <span className="rounded border border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-800">
                    📍 AVANCE GLOBAL: {estado.completados.length}/{ETAPAS.length}
                  </span>
                </div>
              </header>

              {/* BANNER MODO INVITADO / DOCENTE */}
              {estado.esInvitado && (
                <div className="border-b-2 border-slate-900 bg-amber-100 px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-amber-950 font-pixel text-[8.5px] font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-base">👁️</span>
                    <span>MODO INVITADO (DOCENTE / REVISIÓN): PODÉS PASAR Y NAVEGAR SIN RESPONDER OBLIGATORIAMENTE</span>
                  </div>
                  <button
                    type="button"
                    onClick={reiniciarRecorrido}
                    className="rounded border border-amber-800 bg-white px-2 py-0.5 text-[8px] uppercase text-amber-900 hover:bg-amber-50 font-pixel"
                  >
                    SALIR / CERRAR SESIÓN
                  </button>
                </div>
              )}

              {/* CUERPO DEL NODO */}
              <div className="p-5 sm:p-7 space-y-6 bg-white">
                <ContenidoPaso
                  paso={estado.paso}
                  estado={estado}
                  setEstado={setEstado}
                  responder={guardarRespuesta}
                  pista={pista}
                  setPista={setPista}
                  onAbrirDiploma={() => setModalDiplomaVisible(true)}
                />
                <Navegacion
                  paso={estado.paso}
                  estado={estado}
                  setEstado={setEstado}
                  completar={completar}
                  onVolverAlMapa={() => setPresentacionVisible(true)}
                />
              </div>
            </div>
          </main>
        </div>
      )}

      {/* MODAL DE DIPLOMA Y CERTIFICACIÓN OFICIAL */}
      {modalDiplomaVisible && (
        <ModalDiploma
          nombreCompleto={`${estado.nombre} ${estado.apellido}`.trim() || 'Estudiante'}
          dni={estado.dni || '00000000'}
          hashDni={estado.hashDni || '0x000000'}
          escuela={estado.escuela || 'Escuela Técnica'}
          grupo={estado.grupo || ''}
          passwordsGanadas={estado.passwords || {}}
          onClose={() => setModalDiplomaVisible(false)}
        />
      )}
    </div>
  );
}

function autocompletarPaso(paso, setEstado) {
  const respuestasPrueba = {
    2: { problema: 'confianza', solucion: 'Mantener copias del registro y acordar reglas para validar los cambios.' },
    3: { nodo: 'nodo' },
    4: { hash: 'rompe', explicacion_hash: 'Al cambiar un dato cambia su huella y deja de coincidir con la referencia del bloque siguiente.' },
    5: {
      e1_problema: 'Permite mantener un registro compartido y verificable sin depender de una sola autoridad.',
      e1_cambio: 'Cambia su hash y se rompe la relación con los bloques posteriores.',
      e1_diferencia: 'El centralizado depende de una autoridad; el distribuido mantiene copias entre varios nodos.',
      e1_caso: 'No necesariamente: si la escuela controla el registro, una base centralizada puede ser más simple.',
    },
    6: { sintesis: 'registro', hipotesis: 'Conectar una identidad, leer el contrato, autorizar con una firma y esperar la confirmación.' },
    7: {
      lab_check: ['Conectamos la wallet simulada.', 'Identificamos la red.', 'Leímos el mensaje sin firmar.', 'Escribimos un mensaje y firmamos.', 'Observamos la confirmación, el hash y el bloque.', 'Abrimos el Narrador y seguimos los eventos.'],
      leer_escribir: 'Leer consulta el estado y no requiere firma; escribir lo modifica, requiere autorización y consume gas.',
    },
    8: { variante: 'firma', investigacion: 'La transacción se detuvo cuando la wallet solicitó la firma.', investigacion_por_que: 'Sin autorización del dueño de la wallet la escritura no puede enviarse.' },
    9: {
      caso_si: 'Trazabilidad entre organizaciones que no confían plenamente entre sí y necesitan verificar un historial común.',
      caso_no: 'Un registro interno controlado por una sola escuela, donde una base de datos común es suficiente.',
      metacognicion: 'Antes pensaba que blockchain era solamente Bitcoin; ahora entiendo el registro distribuido y todavía me pregunto cómo se alcanza el consenso.',
    },
  };

  setEstado((actual) => ({
    ...actual,
    nombre: actual.nombre || 'Estudiante de prueba',
    apellido: actual.apellido || 'Técnico',
    dni: actual.dni || '44123456',
    hashDni: actual.hashDni || '0x44123456',
    grupo: actual.grupo || '4.º año',
    passwords: {
      clase1: paso >= 5 ? 'GENESIS-2026' : (actual.passwords?.clase1 || ''),
      clase2: paso >= 8 ? 'SMART-77' : (actual.passwords?.clase2 || ''),
      cierre: paso >= 9 ? 'CONSENSO-OK' : (actual.passwords?.cierre || ''),
    },
    respuestas: { ...actual.respuestas, ...(respuestasPrueba[paso] || {}) },
  }));
}

function ContenidoPaso({ paso, estado, setEstado, responder, pista, setPista, onAbrirDiploma }) {
  const r = estado.respuestas;

  if (paso === 0) return (
    <div className="space-y-6">
      <Bloque titulo="🚀 Portal de Inicio · Conexión a la red">
        ¡Te damos la bienvenida a la plataforma interactiva de Blockchain!
        Esta secuencia está diseñada para que explores cómo funciona un registro compartido, la criptografía de bloques, las transacciones con wallets y el consenso sin una entidad central.
      </Bloque>

      <div>
        <h2 className="mb-3 font-black text-slate-950">Módulos principales de la plataforma</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Recurso to="/teoria/web3" icono="📚" titulo="Teoría" texto="Conceptos fundamentales de Web3 y descentralización." />
          <Recurso to="/diccionario" icono="📖" titulo="Glosario" texto="Definiciones técnicas explicadas de forma simple." />
          <Recurso to="/demo" icono="🧪" titulo="Laboratorio" texto="Simulador de wallet, smart contract y gas." />
        </div>
      </div>

      <div className="rounded-xl border-2 border-slate-900 bg-cyan-50/70 p-5 shadow-[4px_4px_0_#0f172a] text-slate-800">
        <h3 className="font-black text-slate-950 font-pixel text-xs uppercase">🎮 NAVEGACIÓN DEL MAPA DE RED</h3>
        <p className="mt-2 text-sm text-slate-800 leading-relaxed font-medium">
          Podés desplazarte linealmente entre los 10 nodos usando los botones <b>◀ IZQ / DER ▶</b>, las <b>flechas del teclado (o A/D)</b>, o haciendo clic directamente en cada nodo. Presioná <b>ENTER</b> o el botón <b>CONECTAR</b> para ingresar al nodo seleccionado.
        </p>
      </div>

      <Aviso>Tu avance se guarda automáticamente en esta computadora y navegador.</Aviso>
    </div>
  );

  if (paso === 1) return (
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

  if (paso === 2) return (
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

  if (paso === 3) return (
    <div className="space-y-6">
      <Bloque titulo="Actividad con tu grupo">Cada grupo será un nodo y conservará una copia del mismo registro. Sigan las indicaciones del docente para construir tres bloques.</Bloque>
      <ol className="grid gap-3 sm:grid-cols-2">
        {['Numeren cada bloque.', 'Escriban las transacciones.', 'Copien la huella del bloque anterior.', 'Comparen el resultado entre todos los nodos.'].map((texto, i) => (
          <li key={texto} className="rounded-xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a] flex items-center gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-slate-900 bg-cyan-200 font-pixel text-xs font-black text-slate-950">
              {i + 1}
            </span>
            <span className="font-bold text-slate-900 text-sm">{texto}</span>
          </li>
        ))}
      </ol>
      <Pregunta texto="¿Qué representa cada grupo en esta simulación?">
        <Opciones valor={r.nodo} onChange={(v) => responder('nodo', v)} opciones={[["bloque", 'Un bloque.'], ["nodo", 'Un nodo con una copia del registro.'], ["wallet", 'Una wallet.']]} correcta="nodo" />
      </Pregunta>
    </div>
  );

  if (paso === 4) return (
    <div className="space-y-6">
      <Situacion>Un grupo modifica una transacción del bloque 1, pero deja iguales las huellas escritas en los bloques 2 y 3.</Situacion>
      <Pregunta texto="¿Qué debería ocurrir al volver a calcular las huellas?">
        <Opciones valor={r.hash} onChange={(v) => responder('hash', v)} opciones={[["nada", 'Nada: los bloques posteriores no dependen del primero.'], ["rompe", 'Cambia la huella y el encadenamiento deja de ser válido.'], ["borra", 'Toda la información se borra automáticamente.']]} correcta="rompe" />
      </Pregunta>
      <Area etiqueta="Explicalo con tus palabras" valor={r.explicacion_hash || ''} onChange={(v) => responder('explicacion_hash', v)} />
      <Tutor pista={pista} setPista={setPista} pistas={['Una huella depende de los datos usados para crearla.', 'El bloque siguiente conserva la huella del anterior.', 'Si cambia un dato, cambia su hash y ya no coincide con la referencia guardada en el bloque siguiente.']} />
    </div>
  );

  if (paso === 5) {
    const textoHito1 = `EVIDENCIA HITO 1 · INTRODUCCIÓN A BLOCKCHAIN\nEstudiante: ${estado.nombre || 'Sin nombre'}\nCurso/Grupo: ${estado.grupo || 'Sin curso'}\n\n1. ¿Qué problema intenta resolver una blockchain?\n${r.e1_problema || ''}\n\n2. ¿Qué sucede si se modifica un bloque anterior?\n${r.e1_cambio || ''}\n\n3. Diferencia entre registro centralizado y distribuido:\n${r.e1_diferencia || ''}\n\n4. Caso biblioteca escolar:\n${r.e1_caso || ''}`;

    return (
      <div className="space-y-5">
        <Bloque titulo="🏁 Hito 1 · Evidencia individual de la primera etapa">
          Respondé de manera individual. Al finalizar podés guardar un archivo PDF o copiar tus respuestas para pegarlas directamente en Google Classroom.
        </Bloque>
        <Area etiqueta="1. ¿Qué problema intenta resolver una blockchain?" valor={r.e1_problema || ''} onChange={(v) => responder('e1_problema', v)} />
        <Area etiqueta="2. ¿Qué sucede si se modifica un bloque anterior?" valor={r.e1_cambio || ''} onChange={(v) => responder('e1_cambio', v)} />
        <Area etiqueta="3. Diferencia entre registro centralizado y distribuido" valor={r.e1_diferencia || ''} onChange={(v) => responder('e1_diferencia', v)} />
        <Area etiqueta="4. ¿Usarías blockchain para los préstamos de una biblioteca escolar? Justificá." valor={r.e1_caso || ''} onChange={(v) => responder('e1_caso', v)} />
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <BotonCopiar texto={textoHito1} label="📋 COPIAR RESPUESTAS PARA CLASSROOM" />
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl border-2 border-slate-900 bg-white px-5 py-3 font-pixel text-xs uppercase font-bold text-slate-950 shadow-[3px_3px_0_#0f172a] hover:bg-slate-100 transition-all active:translate-y-0.5"
          >
            🖨️ GUARDAR COMO PDF
          </button>
        </div>

        {/* LLAVE CRIPTOGRÁFICA HITO 1 */}
        <div className="rounded-xl border-2 border-slate-900 bg-amber-50 p-4 shadow-[4px_4px_0_#0f172a]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <h3 className="font-pixel text-[9.5px] font-black uppercase text-amber-950">
                  CLAVE HITO 1 (CLASE 1): <span className="font-mono text-xs bg-amber-200 px-2 py-0.5 rounded border border-amber-400">GENESIS-2026</span>
                </h3>
              </div>
              <p className="mt-1 text-xs text-amber-900 font-medium">
                Anotá esta clave en tu cuaderno. Es la primera de las 3 contraseñas requeridas para emitir tu diploma oficial al final del trayecto.
              </p>
            </div>
            <BotonCopiar texto="GENESIS-2026" label="COPIAR CLAVE 1" />
          </div>
        </div>
      </div>
    );
  }

  if (paso === 6) return (
    <div className="space-y-6">
      <Pregunta texto="Elegí la síntesis más precisa">
        <Opciones valor={r.sintesis} onChange={(v) => responder('sintesis', v)} opciones={[["bitcoin", 'Blockchain es una moneda digital.'], ["registro", 'Blockchain es un registro compartido cuyos participantes pueden verificar cambios y acordar una versión válida.'], ["nube", 'Blockchain es cualquier archivo guardado en Internet.']]} correcta="registro" />
      </Pregunta>
      <Area etiqueta="Antes del laboratorio: ¿qué pasos imaginás que requiere guardar un mensaje en una blockchain?" valor={r.hipotesis || ''} onChange={(v) => responder('hipotesis', v)} />
      <div className="flex flex-wrap gap-3">
        <Link to="/teoria/conceptos" target="_blank" className="rounded-xl border-2 border-slate-900 bg-slate-950 px-5 py-3 font-pixel text-xs uppercase font-bold text-cyan-300 shadow-[3px_3px_0_#0f172a] hover:bg-slate-800 transition-all">
          📚 REPASAR CONCEPTOS
        </Link>
        <Link to="/diccionario" target="_blank" className="rounded-xl border-2 border-slate-900 bg-white px-5 py-3 font-pixel text-xs uppercase font-bold text-slate-950 shadow-[3px_3px_0_#0f172a] hover:bg-slate-100 transition-all">
          📖 ABRIR GLOSARIO
        </Link>
      </div>
    </div>
  );

  if (paso === 7) return (
    <div className="space-y-6">
      <Bloque titulo="Trabajen en parejas">La demo es una simulación segura: no requiere MetaMask, criptomonedas ni dinero real.</Bloque>
      <Link to="/demo" target="_blank" className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-cyan-400 px-6 py-3.5 font-pixel text-xs uppercase font-black text-slate-950 shadow-[4px_4px_0_#0f172a] hover:bg-cyan-300 hover:translate-x-0.5 transition-all">
        🧪 ABRIR LABORATORIO SIMULADO ↗
      </Link>
      <Checklist valores={r.lab_check || []} onChange={(v) => responder('lab_check', v)} items={['Conectamos la wallet simulada.', 'Identificamos la red.', 'Leímos el mensaje sin firmar.', 'Escribimos un mensaje y firmamos.', 'Observamos la confirmación, el hash y el bloque.', 'Abrimos el Narrador y seguimos los eventos.']} />
      <Area etiqueta="¿Cuál fue la diferencia entre leer y escribir en el contrato?" valor={r.leer_escribir || ''} onChange={(v) => responder('leer_escribir', v)} />
    </div>
  );

  if (paso === 8) {
    const textoHito2 = `EVIDENCIA HITO 2 · LABORATORIO Y RESILIENCIA\nEstudiante: ${estado.nombre || 'Sin nombre'}\nCurso/Grupo: ${estado.grupo || 'Sin curso'}\nVariante analizada: ${r.variante || 'No especificada'}\n\n¿Qué ocurrió y en qué etapa del proceso?\n${r.investigacion || ''}\n\n¿Por qué el sistema se comportó de esa manera?\n${r.investigacion_por_que || ''}`;

    return (
      <div className="space-y-6">
        <Bloque titulo="🏁 Hito 2 · Pruebas de resiliencia y fallos">
          Repitan la demo en parejas forzando una variante de error y registren la respuesta técnica de la red.
        </Bloque>
        <Opciones valor={r.variante} onChange={(v) => responder('variante', v)} opciones={[
          ["firma", 'Rechazo de firma: abrir /demo?fallo=firma'],
          ["red", 'Red incorrecta: abrir /demo?fallo=red'],
          ["tecnico", 'Activar el modo técnico y analizar los eventos'],
          ["comparar", 'Comparar una operación de lectura con una escritura']
        ]} />
        {r.variante === 'firma' && <a className="inline-block font-pixel text-xs font-black text-cyan-700 hover:text-cyan-900 underline mt-2" target="_blank" rel="noreferrer" href="/demo?fallo=firma">ABRIR VARIANTE DE RECHAZO DE FIRMA ↗</a>}
        {r.variante === 'red' && <a className="inline-block font-pixel text-xs font-black text-cyan-700 hover:text-cyan-900 underline mt-2" target="_blank" rel="noreferrer" href="/demo?fallo=red">ABRIR VARIANTE DE RED INCORRECTA ↗</a>}
        <Area etiqueta="¿Qué ocurrió y en qué etapa del proceso?" valor={r.investigacion || ''} onChange={(v) => responder('investigacion', v)} />
        <Area etiqueta="¿Por qué el sistema se comportó de esa manera?" valor={r.investigacion_por_que || ''} onChange={(v) => responder('investigacion_por_que', v)} />
        <div className="pt-2">
          <BotonCopiar texto={textoHito2} label="📋 COPIAR INFORME DE PRUEBA" />
        </div>

        {/* LLAVE CRIPTOGRÁFICA HITO 2 */}
        <div className="rounded-xl border-2 border-slate-900 bg-amber-50 p-4 shadow-[4px_4px_0_#0f172a]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔑</span>
                <h3 className="font-pixel text-[9.5px] font-black uppercase text-amber-950">
                  CLAVE HITO 2 (CLASE 2): <span className="font-mono text-xs bg-amber-200 px-2 py-0.5 rounded border border-amber-400">SMART-77</span>
                </h3>
              </div>
              <p className="mt-1 text-xs text-amber-900 font-medium">
                Anotá tu segunda clave criptográfica. Con ella y la clave de la Clase 3 podrás desbloquear el diploma final.
              </p>
            </div>
            <BotonCopiar texto="SMART-77" label="COPIAR CLAVE 2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Cierre estado={estado} responder={responder} onAbrirDiploma={onAbrirDiploma} />
  );
}

function Cierre({ estado, responder, onAbrirDiploma }) {
  const r = estado.respuestas;
  const resumen = useMemo(() => `DESAFÍO BLOCKCHAIN · SÍNTESIS FINAL\nEstudiante: ${estado.nombre || 'Sin nombre'}\nCurso/Grupo: ${estado.grupo || 'Sin curso'}\n\n=== HITO 1: REGISTRO Y CONFIANZA ===\nProblema que resuelve: ${r.e1_problema || ''}\nAl modificar un bloque: ${r.e1_cambio || ''}\nCentralizado vs Distribuido: ${r.e1_diferencia || ''}\nCaso biblioteca: ${r.e1_caso || ''}\n\n=== HITO 2: LABORATORIO Y CONTRATOS ===\nLectura vs escritura: ${r.leer_escribir || ''}\nVariante de prueba: ${r.variante || ''}\nResultado de investigación: ${r.investigacion || ''}\nExplicación técnica: ${r.investigacion_por_que || ''}\n\n=== CIERRE: GOBERNANZA Y METACOGNICIÓN ===\nCaso donde SÍ conviene blockchain: ${r.caso_si || ''}\nCaso donde NO conviene: ${r.caso_no || ''}\nReflexión (Antes/Ahora/Pregunta): ${r.metacognicion || ''}`, [estado, r]);

  return (
    <div className="space-y-6">
      <Bloque titulo="🏆 Cierre Integrador · Preparación de la exposición">
        La pareja dispone de dos minutos para exponer su caso. Expliquen el proceso de consenso y confianza; no lean definiciones del glosario de memoria.
      </Bloque>
      <Area etiqueta="Un caso donde blockchain tendría sentido y por qué" valor={r.caso_si || ''} onChange={(v) => responder('caso_si', v)} />
      <Area etiqueta="Un caso donde blockchain no aportaría valor y por qué" valor={r.caso_no || ''} onChange={(v) => responder('caso_no', v)} />
      <Area etiqueta="Antes pensaba… ahora entiendo… todavía me pregunto…" valor={r.metacognicion || ''} onChange={(v) => responder('metacognicion', v)} />
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <BotonCopiar texto={resumen} label="📋 COPIAR SÍNTESIS COMPLETA PARA CLASSROOM" />
        <button
          type="button"
          onClick={() => window.print()}
          className="rounded-xl border-2 border-slate-900 bg-white px-5 py-3 font-pixel text-xs uppercase font-bold text-slate-950 shadow-[3px_3px_0_#0f172a] hover:bg-slate-100 transition-all active:translate-y-0.5"
        >
          🖨️ GUARDAR SÍNTESIS EN PDF
        </button>
      </div>

      {/* CLAVE DE CIERRE / CLASE 3 Y ACCESO AL DIPLOMA */}
      <div className="mt-8 rounded-2xl border-4 border-slate-900 bg-cyan-50/80 p-5 shadow-[6px_6px_0_#0f172a] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔑</span>
              <h3 className="font-pixel text-xs sm:text-sm font-black uppercase text-slate-950">
                CLAVE CIERRE (CLASE 3): <span className="font-mono text-sm bg-cyan-200 px-2.5 py-0.5 rounded border border-cyan-400">CONSENSO-OK</span>
              </h3>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-700 font-medium">
              ¡Felicitaciones! Has completado el trayecto completo de Blockchain. Ya tenés las 3 contraseñas secretas para emitir tu Diploma Oficial.
            </p>
          </div>
          <BotonCopiar texto="CONSENSO-OK" label="COPIAR CLAVE FINAL" />
        </div>

        <div className="border-t-2 border-slate-900/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-700 font-medium">
            <b>Claves del trayecto:</b> <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300">GENESIS-2026</code> · <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300">SMART-77</code> · <code className="bg-white px-1.5 py-0.5 rounded border border-slate-300">CONSENSO-OK</code>
          </div>
          <button
            type="button"
            onClick={onAbrirDiploma}
            className="w-full sm:w-auto rounded-xl border-2 border-slate-900 bg-cyan-400 hover:bg-cyan-300 px-6 py-3.5 font-pixel text-xs uppercase font-black text-slate-950 shadow-[4px_4px_0_#0f172a] active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            <span>🎓</span>
            <span>DESBLOQUEAR Y DESCARGAR DIPLOMA OFICIAL ↗</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function getMensajePendiente(paso, estado) {
  const r = estado.respuestas;
  switch (paso) {
    case 1:
      if (!estado.nombre?.trim() || !estado.grupo?.trim()) return 'Completá tu nombre y curso/grupo para continuar.';
      break;
    case 2:
      if (r.problema !== 'confianza') return 'Seleccioná la opción correcta sobre el problema de confianza.';
      if (!r.solucion?.trim()) return 'Escribí una propuesta de solución para habilitar el avance.';
      break;
    case 3:
      if (r.nodo !== 'nodo') return 'Seleccioná qué representa cada grupo en la simulación.';
      break;
    case 4:
      if (r.hash !== 'rompe') return 'Seleccioná qué ocurre al recalcular las huellas criptográficas.';
      if (!r.explicacion_hash?.trim()) return 'Explicá brevemente con tus palabras cómo se rompe la cadena.';
      break;
    case 5:
      if (!r.e1_problema?.trim() || !r.e1_cambio?.trim() || !r.e1_diferencia?.trim() || !r.e1_caso?.trim()) {
        return 'Respondé las 4 preguntas de la evidencia individual.';
      }
      break;
    case 6:
      if (r.sintesis !== 'registro') return 'Elegí la síntesis más precisa sobre Blockchain.';
      if (!r.hipotesis?.trim()) return 'Escribí tu hipótesis sobre los pasos para guardar un mensaje.';
      break;
    case 7:
      if (!r.lab_check || r.lab_check.length < 6) return 'Realizá y tildá los 6 pasos del laboratorio simulado.';
      if (!r.leer_escribir?.trim()) return 'Explicá la diferencia entre leer y escribir en el contrato.';
      break;
    case 8:
      if (!r.variante) return 'Seleccioná una variante de prueba o fallo.';
      if (!r.investigacion?.trim() || !r.investigacion_por_que?.trim()) return 'Completá qué ocurrió en la prueba y el por qué.';
      break;
    case 9:
      if (!r.caso_si?.trim() || !r.caso_no?.trim() || !r.metacognicion?.trim()) {
        return 'Completá las 3 reflexiones finales para cerrar la secuencia.';
      }
      break;
    default:
      return '';
  }
  return '';
}

function Navegacion({ paso, estado, setEstado, completar, onVolverAlMapa }) {
  const r = estado.respuestas;
  const esInvitado = Boolean(estado.esInvitado);
  const requisitos = [
    true,
    Boolean(estado.nombre.trim() && estado.grupo.trim()),
    Boolean(r.problema === 'confianza' && r.solucion?.trim()),
    Boolean(r.nodo === 'nodo'),
    Boolean(r.hash === 'rompe' && r.explicacion_hash?.trim()),
    Boolean(r.e1_problema?.trim() && r.e1_cambio?.trim() && r.e1_diferencia?.trim() && r.e1_caso?.trim()),
    Boolean(r.sintesis === 'registro' && r.hipotesis?.trim()),
    Boolean(r.lab_check?.length === 6 && r.leer_escribir?.trim()),
    Boolean(r.variante && r.investigacion?.trim() && r.investigacion_por_que?.trim()),
    Boolean(r.caso_si?.trim() && r.caso_no?.trim() && r.metacognicion?.trim()),
  ];
  const listo = esInvitado || Boolean(requisitos[paso]);
  const mensajePendiente = getMensajePendiente(paso, estado);

  return (
    <div className="mt-8 border-t-2 border-slate-900 pt-6">
      {/* Banner de estado de completitud */}
      <div className={`mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border-2 border-slate-900 p-3 font-pixel text-[9px] ${
        esInvitado
          ? 'bg-amber-100 text-amber-950 border-amber-900'
          : listo
          ? 'bg-emerald-50 text-emerald-950'
          : 'bg-amber-50 text-amber-950'
      }`}>
        <div className="flex items-center gap-2">
          <span className="text-sm">{esInvitado ? '👁️' : listo ? '✓' : '⚠️'}</span>
          <span className="font-bold">
            {esInvitado
              ? 'MODO DOCENTE / INVITADO · NAVEGACIÓN LIBRE (PASO SIN RESPUESTAS OBLIGATORIAS)'
              : listo
              ? 'REQUISITOS COMPLETADOS · LISTO PARA AVANZAR'
              : `PENDIENTE: ${mensajePendiente}`}
          </span>
        </div>
        <span className="font-bold uppercase text-slate-700">
          NODO {paso + 1} DE 10
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={paso === 0}
          onClick={() => setEstado((e) => ({ ...e, paso: Math.max(0, e.paso - 1) }))}
          className="flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 font-pixel text-[9px] uppercase font-bold text-slate-800 shadow-[3px_3px_0_#0f172a] hover:bg-slate-100 disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed transition-all"
        >
          ← NODO ANTERIOR
        </button>

        {paso < ETAPAS.length - 1 ? (
          <button
            type="button"
            disabled={!listo}
            onClick={completar}
            className={`flex items-center gap-2 rounded-xl border-2 border-slate-900 px-5 py-3 font-pixel text-[10px] uppercase font-black transition-all ${
              listo
                ? 'bg-cyan-400 text-slate-950 shadow-[4px_4px_0_#0f172a] hover:bg-cyan-300 hover:translate-x-0.5 active:translate-y-0.5'
                : 'bg-slate-200 text-slate-500 border-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{esInvitado ? 'CONTINUAR (MODO DOCENTE) →' : 'COMPLETAR Y CONTINUAR →'}</span>
          </button>
        ) : (
          <button
            type="button"
            disabled={!listo}
            onClick={() => {
              setEstado((e) => ({ ...e, completados: [...new Set([...e.completados, paso])] }));
              onVolverAlMapa?.();
            }}
            className={`flex items-center gap-2 rounded-xl border-2 border-slate-900 px-5 py-3 font-pixel text-[10px] uppercase font-black transition-all ${
              listo
                ? 'bg-emerald-400 text-slate-950 shadow-[4px_4px_0_#0f172a] hover:bg-emerald-300 hover:translate-x-0.5 active:translate-y-0.5'
                : 'bg-slate-200 text-slate-500 border-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <span>{esInvitado ? 'VOLVER AL MAPA (REVISIÓN FINALIZADA) ✓' : 'COMPLETAR TRAYECTO ✓'}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function BotonCopiar({ texto, label = '📋 COPIAR PARA GOOGLE CLASSROOM' }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(texto);
      }
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

  return (
    <button
      type="button"
      onClick={copiar}
      className={`rounded-xl border-2 border-slate-900 px-5 py-3 font-pixel text-xs uppercase font-bold shadow-[3px_3px_0_#0f172a] transition-all active:translate-y-0.5 ${
        copiado
          ? 'bg-emerald-400 text-slate-950 shadow-[2px_2px_0_#0f172a]'
          : 'bg-slate-950 text-cyan-300 hover:bg-slate-800'
      }`}
    >
      {copiado ? '✓ ¡COPIADO AL PORTAPAPELES!' : label}
    </button>
  );
}

function Bloque({ titulo, children }) {
  return (
    <div className="rounded-xl border-2 border-slate-900 bg-cyan-50/50 p-5 shadow-[4px_4px_0_#0f172a]">
      <div className="flex items-center gap-2 border-b border-cyan-800/20 pb-2">
        <span className="font-pixel text-[8.5px] uppercase tracking-wider text-cyan-900 font-black">
          ⚡ PROTOCOLO PEDAGÓGICO
        </span>
      </div>
      <h2 className="mt-2 text-base sm:text-lg font-black text-slate-950">{titulo}</h2>
      <div className="mt-2 leading-relaxed text-slate-800 font-medium text-sm">{children}</div>
    </div>
  );
}

function Situacion({ children }) {
  return (
    <div className="rounded-xl border-2 border-slate-900 bg-amber-50 p-5 shadow-[4px_4px_0_#0f172a]">
      <div className="flex items-center gap-2 border-b border-amber-500/40 pb-2">
        <span className="font-pixel text-[8.5px] uppercase tracking-wider text-amber-900 font-black">
          ⚠️ CASO DE ESTUDIO // SIMULACIÓN
        </span>
      </div>
      <div className="mt-2 text-sm sm:text-base font-bold leading-relaxed text-amber-950">
        {children}
      </div>
    </div>
  );
}

function Aviso({ children }) {
  return (
    <div className="rounded-xl border-2 border-slate-900 bg-slate-50 p-3.5 shadow-[3px_3px_0_#0f172a] text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
      <span className="text-base shrink-0">ℹ️</span>
      <span>{children}</span>
    </div>
  );
}

function Pregunta({ texto, children }) {
  return (
    <fieldset className="rounded-xl border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_#0f172a]">
      <legend className="px-2 font-pixel text-[8.5px] uppercase tracking-wider text-slate-900 font-black bg-white border border-slate-900 rounded">
        DESAFÍO // PREGUNTA
      </legend>
      <div className="mb-4 text-base font-black text-slate-950">
        {texto}
      </div>
      {children}
    </fieldset>
  );
}

function Campo({ etiqueta, valor, onChange }) {
  return (
    <label className="block text-xs sm:text-sm font-black text-slate-900">
      <span className="font-pixel text-[8.5px] uppercase tracking-wider text-cyan-800 block mb-1">
        DATO REQUERIDO
      </span>
      {etiqueta}
      <input
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Completá aquí..."
        className="mt-1.5 w-full rounded-xl border-2 border-slate-900 bg-white px-4 py-3 font-bold text-slate-950 placeholder-slate-400 outline-none shadow-[3px_3px_0_#0f172a] focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200 transition-all"
      />
    </label>
  );
}

function Area({ etiqueta, valor, onChange }) {
  return (
    <label className="block text-xs sm:text-sm font-black text-slate-900">
      <span className="font-pixel text-[8.5px] uppercase tracking-wider text-cyan-800 block mb-1">
        REGISTRO DE RESPUESTA
      </span>
      {etiqueta}
      <textarea
        rows="4"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribí tu respuesta de forma fundamentada..."
        className="mt-1.5 w-full resize-none rounded-xl border-2 border-slate-900 bg-white px-4 py-3 font-medium text-slate-950 placeholder-slate-400 leading-relaxed outline-none shadow-[3px_3px_0_#0f172a] focus:border-cyan-600 focus:ring-2 focus:ring-cyan-200 transition-all text-sm"
      />
    </label>
  );
}

function Opciones({ opciones, valor, onChange, correcta }) {
  return (
    <div className="space-y-2.5">
      {opciones.map(([id, texto]) => {
        const seleccionado = valor === id;
        const esCorrecta = id === correcta;
        return (
          <label
            key={id}
            className={`flex cursor-pointer items-center gap-3.5 rounded-xl border-2 p-3.5 transition-all ${
              seleccionado
                ? esCorrecta || !correcta
                  ? 'border-slate-900 bg-cyan-100/70 text-slate-950 shadow-[4px_4px_0_#0f172a] ring-1 ring-cyan-500'
                  : 'border-slate-900 bg-red-100 text-slate-950 shadow-[4px_4px_0_#0f172a]'
                : 'border-slate-300 bg-white hover:border-slate-900 hover:bg-slate-50 text-slate-800 shadow-[2px_2px_0_#cbd5e1]'
            }`}
          >
            <input
              type="radio"
              name="opcion"
              checked={seleccionado}
              onChange={() => onChange(id)}
              className="h-4 w-4 accent-cyan-600 shrink-0"
            />
            <span className="font-bold text-sm leading-snug">{texto}</span>
          </label>
        );
      })}
    </div>
  );
}

function Checklist({ items, valores, onChange }) {
  const toggle = (item) => onChange(valores.includes(item) ? valores.filter((v) => v !== item) : [...valores, item]);
  return (
    <div className="space-y-2">
      {items.map((item) => {
        const checked = valores.includes(item);
        return (
          <label
            key={item}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all ${
              checked
                ? 'border-slate-900 bg-emerald-100/70 text-slate-950 shadow-[3px_3px_0_#0f172a]'
                : 'border-slate-300 bg-white hover:border-slate-900 hover:bg-slate-50 text-slate-800'
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(item)}
              className="h-4 w-4 accent-emerald-600 rounded shrink-0"
            />
            <span className="font-bold text-sm">{item}</span>
          </label>
        );
      })}
    </div>
  );
}

function Tutor({ pistas, pista, setPista }) {
  return (
    <div className="rounded-xl border-2 border-slate-900 bg-violet-50 p-4 shadow-[4px_4px_0_#0f172a]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-300 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xl">💎</span>
          <div>
            <b className="font-pixel text-[9px] uppercase tracking-wider text-violet-950 font-black block">
              TUTOR DE PISTAS IA
            </b>
            <span className="text-[11px] text-violet-800 font-bold">
              {pista}/{pistas.length} pistas reveladas
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPista(Math.min(pista + 1, pistas.length))}
          disabled={pista >= pistas.length}
          className="rounded-lg border-2 border-slate-900 bg-violet-600 px-3 py-1.5 font-pixel text-[8.5px] uppercase text-white font-bold shadow-[2px_2px_0_#0f172a] hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {pista >= pistas.length ? 'TODAS REVELADAS' : 'REVELAR PISTA 💡'}
        </button>
      </div>
      {pista > 0 && (
        <div className="mt-3 space-y-2">
          {pistas.slice(0, pista).map((p, idx) => (
            <div key={idx} className="rounded-lg border border-violet-200 bg-white p-2.5 text-xs sm:text-sm font-semibold text-violet-950 shadow-sm">
              <span className="font-pixel text-[8px] text-violet-700 font-bold mr-2">[{idx + 1}]</span>
              {p}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Recurso({ to, icono, titulo, texto }) {
  return (
    <Link
      to={to}
      className="rounded-xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0_#0f172a] transition-all hover:bg-cyan-50 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#0f172a]"
    >
      <span className="text-2xl">{icono}</span>
      <h3 className="mt-2 font-black text-slate-950 text-sm sm:text-base">{titulo}</h3>
      <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-slate-700">{texto}</p>
    </Link>
  );
}
