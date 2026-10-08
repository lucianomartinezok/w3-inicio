import { useState, useMemo } from 'react';
import {
  obtenerConsolidadoDocente,
  resetearPasswordAlumno,
  CLAVE_DOCENTE_DEFAULT,
} from '../services/authService';

export default function PanelDocente({ onCerrar }) {
  const [autenticado, setAutenticado] = useState(false);
  const [claveIngresada, setClaveIngresada] = useState('');
  const [errorClave, setErrorClave] = useState('');
  const [filtroGrupo, setFiltroGrupo] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [mensajeReset, setMensajeReset] = useState('');

  // Clave maestra que puede venir por variable de entorno o usar la default
  const CLAVE_CORRECTA = import.meta.env.VITE_CLAVE_DOCENTE || CLAVE_DOCENTE_DEFAULT;

  const handleLoginDocente = (e) => {
    e.preventDefault();
    if (claveIngresada.trim() === CLAVE_CORRECTA) {
      setAutenticado(true);
      setErrorClave('');
    } else {
      setErrorClave('Clave de docente incorrecta.');
    }
  };

  const listaAlumnos = useMemo(() => {
    if (!autenticado) return [];
    return obtenerConsolidadoDocente();
  }, [autenticado, mensajeReset]);

  const gruposDisponibles = useMemo(() => {
    const setG = new Set(listaAlumnos.map((a) => a.grupo || 'Sin grupo'));
    return ['TODOS', ...Array.from(setG)];
  }, [listaAlumnos]);

  const alumnosFiltrados = useMemo(() => {
    return listaAlumnos.filter((a) => {
      const coincideGrupo = filtroGrupo === 'TODOS' || (a.grupo || 'Sin grupo') === filtroGrupo;
      const coincideBusqueda =
        !busqueda ||
        a.nombreCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
        a.dni.includes(busqueda);
      return coincideGrupo && coincideBusqueda;
    });
  }, [listaAlumnos, filtroGrupo, busqueda]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!alumnoSeleccionado || !nuevaPassword) return;
    const res = await resetearPasswordAlumno(alumnoSeleccionado.dni, nuevaPassword);
    if (res.exito) {
      setMensajeReset(`✓ Contraseña cambiada para DNI ${alumnoSeleccionado.dni}`);
      setNuevaPassword('');
      setTimeout(() => setMensajeReset(''), 4000);
    } else {
      setMensajeReset(`❌ Error: ${res.error}`);
    }
  };

  const descargarCSV = () => {
    if (listaAlumnos.length === 0) return;
    const headers = ['DNI', 'Nombre', 'Escuela', 'Grupo', 'Nodo Actual', 'Completados', 'Clave1', 'Clave2', 'Cierre', 'Ultima Actualizacion'];
    const rows = listaAlumnos.map((a) => [
      `"${a.dni}"`,
      `"${a.nombreCompleto}"`,
      `"${a.escuela}"`,
      `"${a.grupo}"`,
      a.nodoActual,
      a.totalCompletados,
      `"${a.passwords?.clase1 || '-'}"`,
      `"${a.passwords?.clase2 || '-'}"`,
      `"${a.passwords?.cierre || '-'}"`,
      `"${a.fechaActualizacion ? new Date(a.fechaActualizacion).toLocaleString() : '-'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_alumnos_blockchain_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border-4 border-slate-900 bg-white p-5 sm:p-7 shadow-[10px_10px_0_#0f172a] text-slate-900 max-h-[92vh] flex flex-col">
        {/* Cabecera del Panel */}
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-300 font-pixel text-lg shadow-[2px_2px_0_#0f172a]">
              👨‍🏫
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
                PANEL DE CONTROL DOCENTE
              </h2>
              <p className="font-pixel text-[9px] text-cyan-800 uppercase font-bold">
                Monitoreo en vivo de alumnos y avances
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCerrar}
            className="rounded-lg border-2 border-slate-900 bg-slate-100 px-3 py-1 font-pixel text-xs font-bold text-slate-900 shadow-[2px_2px_0_#0f172a] hover:bg-slate-200 transition-colors"
          >
            ✕ CERRAR
          </button>
        </div>

        {!autenticado ? (
          /* FORMULARIO DE ACCESO CON CLAVE DOCENTE */
          <div className="my-auto py-12 max-w-md mx-auto w-full text-center">
            <span className="text-4xl block mb-2">🔐</span>
            <h3 className="text-lg font-black text-slate-900">Acceso Restringido a Profesores</h3>
            <p className="text-xs text-slate-600 mt-1 mb-5">
              Ingresá la clave de docente para ver el avance en tiempo real de todos los alumnos registrados en esta terminal.
            </p>

            <form onSubmit={handleLoginDocente} className="space-y-3">
              <input
                type="password"
                required
                autoFocus
                placeholder="Clave docente (Ej: PROFE-ET12)"
                value={claveIngresada}
                onChange={(e) => setClaveIngresada(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-4 py-2.5 text-center text-sm font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono tracking-wider"
              />
              {errorClave && (
                <p className="text-xs font-bold text-red-600 font-pixel">{errorClave}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl border-2 border-slate-900 bg-cyan-400 py-2.5 font-pixel text-xs font-black uppercase text-slate-950 shadow-[3px_3px_0_#0f172a] hover:bg-cyan-300 transition-all"
                >
                  INGRESAR AL PANEL
                </button>
              </div>
            </form>
            <p className="text-[10px] text-slate-400 mt-4">
              (Clave por defecto preconfigurada: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">PROFE-ET12</code>)
            </p>
          </div>
        ) : (
          /* CONTENIDO DEL PANEL DOCENTE */
          <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
            {/* BARRA DE HERRAMIENTAS Y ACCIONES */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-100 p-3 rounded-xl border-2 border-slate-900">
              <div className="flex flex-wrap items-center gap-2 flex-1">
                <input
                  type="text"
                  placeholder="Buscar por nombre o DNI..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="rounded-lg border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 min-w-[200px]"
                />
                <select
                  value={filtroGrupo}
                  onChange={(e) => setFiltroGrupo(e.target.value)}
                  className="rounded-lg border-2 border-slate-900 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none"
                >
                  {gruposDisponibles.map((g) => (
                    <option key={g} value={g}>
                      Grupo: {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-pixel text-[10px] text-slate-600 font-bold">
                  {alumnosFiltrados.length} alumnos registrados
                </span>
                <button
                  type="button"
                  onClick={descargarCSV}
                  className="rounded-lg border-2 border-slate-900 bg-emerald-400 px-3 py-1.5 font-pixel text-[9px] font-black uppercase text-slate-950 shadow-[2px_2px_0_#0f172a] hover:bg-emerald-300 transition-colors"
                >
                  📥 DESCARGAR EXCEL / CSV
                </button>
              </div>
            </div>

            {mensajeReset && (
              <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 p-2 font-pixel text-[10px] font-bold text-emerald-800">
                {mensajeReset}
              </div>
            )}

            {/* TABLA DE ALUMNOS */}
            {alumnosFiltrados.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-xl">
                <span className="text-3xl block mb-1">📭</span>
                <p className="text-sm font-bold text-slate-600">No hay alumnos registrados con ese filtro.</p>
                <p className="text-xs text-slate-400">Los alumnos aparecerán aquí automáticamente apenas se registren en la web.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border-2 border-slate-900 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-cyan-300 font-pixel text-[8.5px] uppercase">
                      <th className="p-2.5 border-b border-slate-800">Estudiante</th>
                      <th className="p-2.5 border-b border-slate-800">DNI / Hash</th>
                      <th className="p-2.5 border-b border-slate-800">Grupo / Escuela</th>
                      <th className="p-2.5 border-b border-slate-800 text-center">Nodo Actual</th>
                      <th className="p-2.5 border-b border-slate-800 text-center">Progreso</th>
                      <th className="p-2.5 border-b border-slate-800 text-center">Claves</th>
                      <th className="p-2.5 border-b border-slate-800 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {alumnosFiltrados.map((a) => (
                      <tr key={a.dni} className="hover:bg-slate-50 transition-colors">
                        <td className="p-2.5 font-bold text-slate-950">
                          {a.nombreCompleto}
                        </td>
                        <td className="p-2.5 font-mono text-[11px] text-slate-600">
                          <div>{a.dni}</div>
                          <span className="text-[9px] text-cyan-800 font-bold">{a.hashDni}</span>
                        </td>
                        <td className="p-2.5 text-slate-700">
                          <span className="font-bold text-slate-900 block">{a.grupo}</span>
                          <span className="text-[10px] text-slate-500">{a.escuela}</span>
                        </td>
                        <td className="p-2.5 text-center font-pixel text-[10px] font-black text-slate-900">
                          Nodo {String(a.nodoActual).padStart(2, '0')}
                        </td>
                        <td className="p-2.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-cyan-500 h-full rounded-full"
                                style={{ width: `${Math.min(100, (a.totalCompletados / 10) * 100)}%` }}
                              />
                            </div>
                            <span className="font-pixel text-[9px] font-bold text-slate-700">
                              {a.totalCompletados}/10
                            </span>
                          </div>
                        </td>
                        <td className="p-2.5 text-center font-pixel text-[9px]">
                          <span className={a.passwords?.clase1 ? 'text-emerald-600' : 'text-slate-300'}>🔑1 </span>
                          <span className={a.passwords?.clase2 ? 'text-emerald-600' : 'text-slate-300'}>🔑2 </span>
                          <span className={a.passwords?.cierre ? 'text-emerald-600' : 'text-slate-300'}>🎓</span>
                        </td>
                        <td className="p-2.5 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => setAlumnoSeleccionado(a)}
                            className="rounded border border-slate-900 bg-amber-100 px-2 py-1 font-pixel text-[8px] font-bold text-slate-900 hover:bg-amber-200 shadow-[1px_1px_0_#0f172a]"
                          >
                            🔑 RESET PASS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* MODAL RESET DE CONTRASEÑA */}
            {alumnoSeleccionado && (
              <div className="mt-4 p-4 rounded-xl border-2 border-amber-500 bg-amber-50/80">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-black text-sm text-amber-950">
                    Cambiar contraseña de: {alumnoSeleccionado.nombreCompleto} (DNI {alumnoSeleccionado.dni})
                  </h4>
                  <button
                    type="button"
                    onClick={() => setAlumnoSeleccionado(null)}
                    className="text-xs font-bold text-amber-900"
                  >
                    Cancelar
                  </button>
                </div>
                <form onSubmit={handleResetPassword} className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Nueva contraseña provisional..."
                    value={nuevaPassword}
                    onChange={(e) => setNuevaPassword(e.target.value)}
                    className="flex-1 rounded-lg border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-bold text-slate-900"
                  />
                  <button
                    type="submit"
                    className="rounded-lg border-2 border-slate-900 bg-amber-400 px-3 py-1.5 font-pixel text-[9px] font-black uppercase text-slate-950 shadow-[2px_2px_0_#0f172a]"
                  >
                    GUARDAR NUEVA CLAVE
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
