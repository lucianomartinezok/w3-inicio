import { useState } from 'react';
import {
  registrarAlumno,
  iniciarSesionAlumno,
  importarPasaporteAlumno,
} from '../services/authService';
import PanelDocente from './PanelDocente';

// Generador de Hash determinístico para el DNI del operador
export function generarHashOperador(dni) {
  if (!dni || !dni.trim()) return '0x000000000000';
  const limpio = dni.replace(/\D/g, '');
  let acc = 0;
  const str = `BLOCKCHAIN-ET12-${limpio}-IDENTITY-2026`;
  for (let i = 0; i < str.length; i++) {
    acc = ((acc << 5) - acc) + str.charCodeAt(i);
    acc |= 0;
  }
  const hex = Math.abs(acc).toString(16).padStart(8, '0');
  const tail = limpio.slice(-4).padStart(4, '0');
  return `0x${hex}${tail}`.toUpperCase();
}

export default function PortadaBienvenida({ datosIniciales, onComenzar }) {
  // Pestañas: 'login' | 'registro' | 'importar'
  const [pestana, setPestana] = useState('login');

  // Estados de Login
  const [loginDni, setLoginDni] = useState(datosIniciales?.dni || '');
  const [loginPassword, setLoginPassword] = useState('');

  // Estados de Registro
  const [nombre, setNombre] = useState(datosIniciales?.nombre || '');
  const [apellido, setApellido] = useState(datosIniciales?.apellido || '');
  const [dni, setDni] = useState(datosIniciales?.dni || '');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [escuela, setEscuela] = useState(datosIniciales?.escuela || '');
  const [grupo, setGrupo] = useState(datosIniciales?.grupo || '');

  // Estado para importar respaldo
  const [archivoTexto, setArchivoTexto] = useState('');

  // Modal Docente
  const [modalDocente, setModalDocente] = useState(false);

  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const hashDni = generarHashOperador(dni);

  // Manejar Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const res = await iniciarSesionAlumno({
        dni: loginDni,
        password: loginPassword,
      });

      if (!res.exito) {
        setError(res.error);
        setCargando(false);
        return;
      }

      onComenzar({
        ...res.usuario,
        ...res.progreso,
        sesionIniciada: true,
        esInvitado: false,
      });
    } catch (err) {
      setError('Error al iniciar sesión: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  // Manejar Registro
  const handleRegistroSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 4) {
      setError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setCargando(true);
    try {
      const res = await registrarAlumno({
        nombre,
        apellido,
        dni,
        password,
        escuela,
        grupo,
        hashDni,
      });

      if (!res.exito) {
        setError(res.error);
        setCargando(false);
        return;
      }

      onComenzar({
        ...res.usuario,
        ...res.progreso,
        sesionIniciada: true,
        esInvitado: false,
      });
    } catch (err) {
      setError('Error al registrar usuario: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  // Manejar Importar Respaldo
  const handleImportarSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      const parsed = JSON.parse(archivoTexto);
      const res = importarPasaporteAlumno(parsed);
      if (!res.exito) {
        setError(res.error);
        return;
      }
      onComenzar({
        ...res.usuario,
        ...res.progreso,
        sesionIniciada: true,
        esInvitado: false,
      });
    } catch {
      setError('El formato del código o archivo no es válido. Debe ser JSON.');
    }
  };

  // Acceso Invitado (Docente / Evaluación rápida)
  const handleAccesoInvitado = () => {
    onComenzar({
      nombre: 'Docente',
      apellido: 'Invitado',
      dni: '00000000',
      hashDni: '0xDOCENTE_INVITADO',
      escuela: 'Visita Docente',
      grupo: 'Revisión Pedagógica',
      paso: 0,
      completados: [],
      respuestas: {},
      passwords: { clase1: '', clase2: '', cierre: '' },
      sesionIniciada: true,
      esInvitado: true,
    });
  };

  return (
    <div className="relative min-h-screen min-h-[100dvh] w-full overflow-y-auto bg-[#060814] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      {/* Modal del panel docente */}
      {modalDocente && <PanelDocente onCerrar={() => setModalDocente(false)} />}

      {/* Fondo con retícula cibernética */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* HEADER SUPERIOR */}
      <header className="relative z-10 mx-auto w-full max-w-5xl border-b-2 border-cyan-500/30 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-cyan-400 bg-cyan-950 font-pixel text-base text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
            ⛓️
          </span>
          <div>
            <h1 className="font-pixel text-xs sm:text-sm font-black uppercase tracking-wider text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">
              INTRO A BLOCKCHAIN
            </h1>
            <p className="font-pixel text-[8px] sm:text-[9px] text-cyan-300 font-bold uppercase">
              SECUENCIA DE APRENDIZAJE INTERACTIVA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalDocente(true)}
            className="rounded border border-amber-400/50 bg-amber-950/60 hover:bg-amber-900/80 px-3 py-1 font-pixel text-[8.5px] text-amber-200 font-bold uppercase transition-colors flex items-center gap-1.5 shadow-[0_0_10px_rgba(251,191,36,0.2)]"
          >
            <span>👨‍🏫</span>
            <span>PANEL DOCENTE</span>
          </button>
          <div className="rounded border border-cyan-500/40 bg-[#091124] px-2.5 py-1 font-pixel text-[8px] text-cyan-300 font-bold">
            TERMINAL V2.5
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL: EXPLICACIÓN + FORMULARIO */}
      <main className="relative z-10 mx-auto w-full max-w-5xl my-6 grid grid-cols-1 lg:grid-cols-[1.05fr_1.15fr] gap-6 items-stretch">
        {/* PANEL IZQUIERDO: EXPLICACIÓN DEL TRAYECTO PEDAGÓGICO */}
        <div className="rounded-2xl border-2 border-cyan-500/40 bg-[#090e22] p-6 sm:p-7 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded border border-cyan-400 bg-cyan-950/80 px-2.5 py-1 font-pixel text-[8px] text-cyan-300 font-bold uppercase mb-4">
              🎯 ¿CÓMO FUNCIONA ESTE TRAYECTO?
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Bienvenido a la red distribuida de aprendizaje.
            </h2>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Vas a recorrer <strong className="text-cyan-300">10 nodos interactivos</strong> a lo largo de <b>3 clases presenciales</b> con tu docente y compañeros.
            </p>

            <div className="mt-5 space-y-3 font-medium text-xs">
              <div className="rounded-xl border border-cyan-500/20 bg-[#0c1630] p-3 flex gap-3 items-start">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-400 text-slate-950 font-pixel text-[9px] font-black">
                  1
                </span>
                <div>
                  <strong className="text-cyan-200 block font-pixel text-[9px] uppercase">
                    Clase 1 · El problema de la confianza (Hito 1)
                  </strong>
                  <span className="text-slate-300 leading-snug block mt-0.5">
                    Entendé por qué no necesitamos intermediarios, participá en la <b>Blockchain humana</b> y desbloqueá tu <b>Primera Clave Secreta</b>.
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-[#0c1630] p-3 flex gap-3 items-start">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-400 text-slate-950 font-pixel text-[9px] font-black">
                  2
                </span>
                <div>
                  <strong className="text-cyan-200 block font-pixel text-[9px] uppercase">
                    Clase 2 · Laboratorio de Wallets y Smart Contracts (Hito 2)
                  </strong>
                  <span className="text-slate-300 leading-snug block mt-0.5">
                    Experimentá en parejas en el simulador, firmá transacciones, testeá ataques a la red y obtené tu <b>Segunda Clave Secreta</b>.
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-500/20 bg-[#0c1630] p-3 flex gap-3 items-start">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-cyan-400 text-slate-950 font-pixel text-[9px] font-black">
                  3
                </span>
                <div>
                  <strong className="text-cyan-200 block font-pixel text-[9px] uppercase">
                    Clase 3 · Gobernanza, Debate y Cierre
                  </strong>
                  <span className="text-slate-300 leading-snug block mt-0.5">
                    Defendé tu caso de uso, conseguí la <b>Tercera Clave</b> y canjeá las 3 contraseñas por tu <b>Diploma Oficial Descargable</b>.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 p-3 text-[11px] text-cyan-200 leading-relaxed font-medium">
            💡 <b>Tu progreso queda guardado con tu contraseña:</b> Podés cerrar la pestaña o continuar en cualquier momento ingresando con tu DNI y tu clave.
          </div>
        </div>

        {/* PANEL DERECHO: FORMULARIO CON PESTAÑAS (LOGIN / REGISTRO / IMPORTAR) */}
        <div className="rounded-2xl border-2 border-cyan-400 bg-white p-5 sm:p-7 shadow-[8px_8px_0_#0f172a] text-slate-900 flex flex-col justify-between">
          <div>
            {/* PESTAÑAS DE NAVEGACIÓN */}
            <div className="flex border-b-2 border-slate-900 mb-4 gap-1">
              <button
                type="button"
                onClick={() => { setPestana('login'); setError(''); }}
                className={`flex-1 py-2 font-pixel text-[9px] uppercase font-black transition-colors ${
                  pestana === 'login'
                    ? 'border-b-4 border-cyan-500 text-cyan-900 bg-cyan-50/70 -mb-[2px]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🔑 INICIAR SESIÓN
              </button>
              <button
                type="button"
                onClick={() => { setPestana('registro'); setError(''); }}
                className={`flex-1 py-2 font-pixel text-[9px] uppercase font-black transition-colors ${
                  pestana === 'registro'
                    ? 'border-b-4 border-cyan-500 text-cyan-900 bg-cyan-50/70 -mb-[2px]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📝 CREAR CUENTA
              </button>
              <button
                type="button"
                onClick={() => { setPestana('importar'); setError(''); }}
                className={`px-3 py-2 font-pixel text-[8px] uppercase font-black transition-colors ${
                  pestana === 'importar'
                    ? 'border-b-4 border-cyan-500 text-cyan-900 bg-cyan-50/70 -mb-[2px]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Restaurar ficha o respaldo"
              >
                🔄 IMPORTAR
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border-2 border-red-500 bg-red-50 p-2.5 font-pixel text-[9px] font-bold text-red-700 leading-snug">
                ⚠️ {error}
              </div>
            )}

            {/* VISTA 1: INICIAR SESIÓN */}
            {pestana === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Continuá con tu progreso
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Ingresá tu DNI y tu contraseña para retomar tus respuestas.
                  </p>
                </div>

                <div>
                  <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-700 mb-1">
                    DNI del Estudiante *
                  </label>
                  <input
                    type="text"
                    required
                    value={loginDni}
                    onChange={(e) => setLoginDni(e.target.value)}
                    placeholder="Número de documento sin puntos"
                    className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-700 mb-1">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Tu contraseña secreta"
                    className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="mt-2 w-full rounded-xl border-2 border-slate-900 bg-cyan-400 hover:bg-cyan-300 py-3 px-4 font-pixel text-[10px] uppercase font-black text-slate-950 shadow-[4px_4px_0_#0f172a] transition-all hover:translate-x-0.5 active:translate-y-0.5"
                >
                  {cargando ? 'VALIDANDO...' : 'ENTRAR Y CONTINUAR MI RECORRIDO →'}
                </button>

                <p className="text-center text-xs text-slate-600 pt-1">
                  ¿Es tu primera vez?{' '}
                  <button
                    type="button"
                    onClick={() => { setPestana('registro'); setError(''); }}
                    className="font-bold text-cyan-800 underline hover:text-cyan-950"
                  >
                    Creá tu cuenta aquí
                  </button>
                </p>
              </form>
            )}

            {/* VISTA 2: REGISTRO DE CUENTA NUEVA */}
            {pestana === 'registro' && (
              <form onSubmit={handleRegistroSubmit} className="space-y-3">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Registro de nuevo estudiante
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Crea tu usuario para vincular tus bloques y tu diploma.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-700 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Sofía"
                      className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-700 mb-1">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      placeholder="Ej: Rossi"
                      className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                {/* DNI Y HASH */}
                <div>
                  <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-700 mb-1">
                    DNI (Identificador Único) *
                  </label>
                  <input
                    type="text"
                    required
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    placeholder="Número de documento sin puntos"
                    className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400 font-mono"
                  />
                  {dni && (
                    <div className="mt-1 rounded border border-slate-300 bg-slate-100 px-2 py-1 font-mono text-[9px] text-slate-700 flex justify-between">
                      <span className="font-pixel text-[7.5px] text-slate-500 uppercase">HASH OPERADOR:</span>
                      <span className="font-bold text-cyan-800">{hashDni}</span>
                    </div>
                  )}
                </div>

                {/* CONTRASEÑAS */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-700 mb-1">
                      Crear Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 4 caracteres"
                      className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-700 mb-1">
                      Confirmar Clave *
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="Repetila acá"
                      className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-700 mb-1">
                      Escuela / Colegio
                    </label>
                    <input
                      type="text"
                      value={escuela}
                      onChange={(e) => setEscuela(e.target.value)}
                      placeholder="Ej: Técnica N° 12"
                      className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-700 mb-1">
                      Curso / Grupo
                    </label>
                    <input
                      type="text"
                      value={grupo}
                      onChange={(e) => setGrupo(e.target.value)}
                      placeholder="Ej: 4° 2da - Grupo A"
                      className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-1.5 text-sm font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="mt-2 w-full rounded-xl border-2 border-slate-900 bg-emerald-400 hover:bg-emerald-300 py-3 px-4 font-pixel text-[10px] uppercase font-black text-slate-950 shadow-[4px_4px_0_#0f172a] transition-all hover:translate-x-0.5 active:translate-y-0.5"
                >
                  {cargando ? 'REGISTRANDO...' : 'REGISTRARME Y EMPEZAR →'}
                </button>
              </form>
            )}

            {/* VISTA 3: IMPORTAR RESPALDO */}
            {pestana === 'importar' && (
              <form onSubmit={handleImportarSubmit} className="space-y-3">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    Restaurar avance guardado
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Pegá tu código de respaldo generado en otra netbook para continuar donde quedaste.
                  </p>
                </div>

                <div>
                  <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-700 mb-1">
                    Código de respaldo JSON
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={archivoTexto}
                    onChange={(e) => setArchivoTexto(e.target.value)}
                    placeholder='Pegá aquí tu archivo de respaldo ({"version": "1.0", ...})'
                    className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 p-2 text-xs font-mono font-bold text-slate-950 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl border-2 border-slate-900 bg-cyan-400 hover:bg-cyan-300 py-2.5 px-4 font-pixel text-[10px] uppercase font-black text-slate-950 shadow-[3px_3px_0_#0f172a]"
                >
                  RESTAURAR Y CONTINUAR →
                </button>
              </form>
            )}
          </div>

          {/* ACCESO INVITADO / DOCENTE */}
          <div className="mt-4 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={handleAccesoInvitado}
              className="w-full rounded-xl border-2 border-slate-900 bg-amber-100 hover:bg-amber-200 py-2 px-3 font-pixel text-[8.5px] uppercase font-black text-slate-950 shadow-[2px_2px_0_#0f172a] transition-all flex items-center justify-center gap-2"
            >
              <span>👁️</span>
              <span>MODO INVITADO (REVISIÓN RÁPIDA SIN REGISTRO)</span>
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 mx-auto w-full max-w-5xl border-t border-cyan-500/20 pt-3 text-center font-pixel text-[8px] text-cyan-300/70 uppercase">
        MODO EDUCACIÓN · PLATAFORMA DE APRENDIZAJE ABIERTA EN BLOCKCHAIN
      </footer>
    </div>
  );
}
