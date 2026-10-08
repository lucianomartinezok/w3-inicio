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
      setError('La clave debe tener al menos 4 caracteres.');
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
      setError('Error al registrar: ' + err.message);
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
      setError('Código o archivo JSON no válido.');
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
    <div className="relative h-screen h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#060814] text-slate-100 flex flex-col justify-between p-2 sm:p-3 lg:p-4 select-none">
      {/* Modal del panel docente */}
      {modalDocente && <PanelDocente onCerrar={() => setModalDocente(false)} />}

      {/* Fondo con retícula cibernética */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* HEADER SUPERIOR COMPACTO (Ajustado para 11") */}
      <header className="relative z-10 mx-auto w-full max-w-5xl border-b border-cyan-500/30 pb-2 flex shrink-0 items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-400 bg-cyan-950 font-pixel text-xs text-cyan-200 shadow-[0_0_8px_rgba(0,240,255,0.4)]">
            ⛓️
          </span>
          <div>
            <h1 className="font-pixel text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#00f0ff] drop-shadow-[0_0_6px_rgba(0,240,255,0.6)]">
              INTRO A BLOCKCHAIN
            </h1>
            <p className="font-pixel text-[7.5px] text-cyan-300 font-bold uppercase">
              SECUENCIA DE APRENDIZAJE INTERACTIVA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalDocente(true)}
            className="rounded border border-amber-400/50 bg-amber-950/60 hover:bg-amber-900/80 px-2.5 py-1 font-pixel text-[8px] text-amber-200 font-bold uppercase transition-colors flex items-center gap-1 shadow-[0_0_8px_rgba(251,191,36,0.2)]"
          >
            <span>👨‍🏫</span>
            <span>PANEL DOCENTE</span>
          </button>
          <div className="hidden sm:block rounded border border-cyan-500/40 bg-[#091124] px-2 py-0.5 font-pixel text-[7.5px] text-cyan-300 font-bold">
            V2.5 · 11" OK
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL: 100% VH SIN SCROLL OBLIGATORIO */}
      <main className="relative z-10 mx-auto w-full max-w-5xl my-auto py-1 sm:py-2 grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-3 sm:gap-4 items-stretch flex-1 min-h-0 overflow-hidden">
        {/* PANEL IZQUIERDO: EXPLICACIÓN DEL TRAYECTO PEDAGÓGICO */}
        <div className="rounded-xl border border-cyan-500/40 bg-[#090e22] p-3 sm:p-4 shadow-[0_0_20px_rgba(0,240,255,0.12)] flex flex-col justify-between overflow-y-auto min-h-0">
          <div>
            <div className="inline-flex items-center gap-1 rounded border border-cyan-400 bg-cyan-950/80 px-2 py-0.5 font-pixel text-[7.5px] text-cyan-300 font-bold uppercase mb-2">
              🎯 ¿CÓMO FUNCIONA ESTE TRAYECTO?
            </div>

            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              Red distribuida de aprendizaje.
            </h2>

            <p className="mt-1.5 text-xs text-slate-300 leading-snug font-medium">
              Vas a recorrer <strong className="text-cyan-300">10 nodos interactivos</strong> a lo largo de <b>3 clases presenciales</b> con tu docente y equipo.
            </p>

            <div className="mt-3 space-y-2 font-medium text-xs">
              <div className="rounded-lg border border-cyan-500/20 bg-[#0c1630] p-2 flex gap-2.5 items-start">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-400 text-slate-950 font-pixel text-[8px] font-black">
                  1
                </span>
                <div className="min-w-0">
                  <strong className="text-cyan-200 block font-pixel text-[8px] uppercase">
                    Clase 1 · Confianza y Blockchain humana
                  </strong>
                  <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">
                    Entendé cómo funciona un registro compartido y desbloqueá tu <b>Primera Clave Secreta</b>.
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-cyan-500/20 bg-[#0c1630] p-2 flex gap-2.5 items-start">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-400 text-slate-950 font-pixel text-[8px] font-black">
                  2
                </span>
                <div className="min-w-0">
                  <strong className="text-cyan-200 block font-pixel text-[8px] uppercase">
                    Clase 2 · Wallets y Smart Contracts
                  </strong>
                  <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">
                    Laboratorio simulado en parejas: firmá transacciones y obtené tu <b>Segunda Clave Secreta</b>.
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-cyan-500/20 bg-[#0c1630] p-2 flex gap-2.5 items-start">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-cyan-400 text-slate-950 font-pixel text-[8px] font-black">
                  3
                </span>
                <div className="min-w-0">
                  <strong className="text-cyan-200 block font-pixel text-[8px] uppercase">
                    Clase 3 · Debate y Diploma Oficial
                  </strong>
                  <span className="text-slate-300 text-[11px] leading-tight block mt-0.5">
                    Conseguí la <b>Tercera Clave</b> y canjeá tus 3 contraseñas por tu <b>Diploma Descargable</b>.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-2.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 p-2 text-[10px] text-cyan-200 leading-snug font-medium">
            💡 <b>Tu avance se guarda automáticamente:</b> Entrá siempre con tu DNI y tu contraseña para no perder tus respuestas.
          </div>
        </div>

        {/* PANEL DERECHO: FORMULARIO OPTIMIZADO PARA 11" (ALTURA CONTROLADA) */}
        <div className="rounded-xl border-2 border-cyan-400 bg-white p-3 sm:p-4 shadow-[4px_4px_0_#0f172a] text-slate-900 flex flex-col justify-between overflow-y-auto min-h-0">
          <div>
            {/* PESTAÑAS COMPACTAS */}
            <div className="flex border-b-2 border-slate-900 mb-2.5 gap-1 shrink-0">
              <button
                type="button"
                onClick={() => { setPestana('login'); setError(''); }}
                className={`flex-1 py-1 font-pixel text-[8.5px] uppercase font-black transition-colors ${
                  pestana === 'login'
                    ? 'border-b-2 border-cyan-500 text-cyan-900 bg-cyan-50 -mb-[2px]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🔑 INICIAR SESIÓN
              </button>
              <button
                type="button"
                onClick={() => { setPestana('registro'); setError(''); }}
                className={`flex-1 py-1 font-pixel text-[8.5px] uppercase font-black transition-colors ${
                  pestana === 'registro'
                    ? 'border-b-2 border-cyan-500 text-cyan-900 bg-cyan-50 -mb-[2px]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📝 CREAR CUENTA
              </button>
              <button
                type="button"
                onClick={() => { setPestana('importar'); setError(''); }}
                className={`px-2.5 py-1 font-pixel text-[7.5px] uppercase font-black transition-colors ${
                  pestana === 'importar'
                    ? 'border-b-2 border-cyan-500 text-cyan-900 bg-cyan-50 -mb-[2px]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Restaurar copia de otra netbook"
              >
                🔄 IMPORTAR
              </button>
            </div>

            {error && (
              <div className="mb-2 rounded border border-red-500 bg-red-50 p-1.5 font-pixel text-[8px] font-bold text-red-700 leading-tight">
                ⚠️ {error}
              </div>
            )}

            {/* VISTA 1: INICIAR SESIÓN */}
            {pestana === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-2.5">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-slate-950">
                    Continuá con tu recorrido
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Ingresá tu DNI y contraseña para recuperar tus respuestas.
                  </p>
                </div>

                <div>
                  <label className="block font-pixel text-[8px] uppercase font-bold text-slate-700 mb-0.5">
                    DNI del Estudiante *
                  </label>
                  <input
                    type="text"
                    required
                    value={loginDni}
                    onChange={(e) => setLoginDni(e.target.value)}
                    placeholder="Número de DNI sin puntos"
                    className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-pixel text-[8px] uppercase font-bold text-slate-700 mb-0.5">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Tu clave secreta"
                    className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-950 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full rounded-lg border-2 border-slate-900 bg-cyan-400 hover:bg-cyan-300 py-2 px-3 font-pixel text-[9px] uppercase font-black text-slate-950 shadow-[2px_2px_0_#0f172a] transition-all active:translate-y-0.5"
                >
                  {cargando ? 'VALIDANDO...' : 'ENTRAR AL RECORRIDO →'}
                </button>

                <p className="text-center text-[10px] text-slate-600 pt-0.5">
                  ¿No tenés cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => { setPestana('registro'); setError(''); }}
                    className="font-bold text-cyan-800 underline hover:text-cyan-950"
                  >
                    Creala acá
                  </button>
                </p>
              </form>
            )}

            {/* VISTA 2: REGISTRO DE CUENTA NUEVA (COMPACTA) */}
            {pestana === 'registro' && (
              <form onSubmit={handleRegistroSubmit} className="space-y-1.5">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-950">
                    Registro de nuevo estudiante
                  </h3>
                  <p className="text-[10px] text-slate-600 font-medium">
                    Vincula tus respuestas con tu DNI y tu clave.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-pixel text-[7.5px] uppercase font-bold text-slate-700 mb-0.5">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: Sofía"
                      className="w-full rounded border-2 border-slate-900 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-950 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-pixel text-[7.5px] uppercase font-bold text-slate-700 mb-0.5">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      required
                      value={apellido}
                      onChange={(e) => setApellido(e.target.value)}
                      placeholder="Ej: Rossi"
                      className="w-full rounded border-2 border-slate-900 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* DNI Y ESCUELA EN LA MISMA FILA */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-pixel text-[7.5px] uppercase font-bold text-slate-700 mb-0.5">
                      DNI *
                    </label>
                    <input
                      type="text"
                      required
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      placeholder="Sin puntos"
                      className="w-full rounded border-2 border-slate-900 bg-slate-50 px-2 py-1 text-xs font-bold font-mono text-slate-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-[7.5px] uppercase font-bold text-slate-700 mb-0.5">
                      Escuela
                    </label>
                    <input
                      type="text"
                      value={escuela}
                      onChange={(e) => setEscuela(e.target.value)}
                      placeholder="Ej: ET N° 12"
                      className="w-full rounded border-2 border-slate-900 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* CLAVES */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-pixel text-[7.5px] uppercase font-bold text-slate-700 mb-0.5">
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mín. 4 caracteres"
                      className="w-full rounded border-2 border-slate-900 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-[7.5px] uppercase font-bold text-slate-700 mb-0.5">
                      Confirmar Clave *
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      placeholder="Repetir"
                      className="w-full rounded border-2 border-slate-900 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-950 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* CURSO / GRUPO */}
                <div>
                  <label className="block font-pixel text-[7.5px] uppercase font-bold text-slate-700 mb-0.5">
                    Año / División / Grupo
                  </label>
                  <input
                    type="text"
                    value={grupo}
                    onChange={(e) => setGrupo(e.target.value)}
                    placeholder="Ej: 4° 2da - Grupo B"
                    className="w-full rounded border-2 border-slate-900 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-950 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full rounded-lg border-2 border-slate-900 bg-emerald-400 hover:bg-emerald-300 py-1.5 px-3 font-pixel text-[8.5px] uppercase font-black text-slate-950 shadow-[2px_2px_0_#0f172a] transition-all active:translate-y-0.5"
                >
                  {cargando ? 'REGISTRANDO...' : 'REGISTRARME Y EMPEZAR →'}
                </button>
              </form>
            )}

            {/* VISTA 3: IMPORTAR RESPALDO */}
            {pestana === 'importar' && (
              <form onSubmit={handleImportarSubmit} className="space-y-2">
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-950">
                    Restaurar avance
                  </h3>
                  <p className="text-[10px] text-slate-600 font-medium">
                    Pegá tu código de respaldo de otra netbook.
                  </p>
                </div>

                <textarea
                  required
                  rows={3}
                  value={archivoTexto}
                  onChange={(e) => setArchivoTexto(e.target.value)}
                  placeholder='Pegá aquí tu JSON de respaldo...'
                  className="w-full rounded border-2 border-slate-900 bg-slate-50 p-1.5 text-[11px] font-mono font-bold text-slate-950 focus:bg-white focus:outline-none"
                />

                <button
                  type="submit"
                  className="w-full rounded-lg border-2 border-slate-900 bg-cyan-400 hover:bg-cyan-300 py-1.5 px-3 font-pixel text-[8.5px] uppercase font-black text-slate-950 shadow-[2px_2px_0_#0f172a]"
                >
                  RESTAURAR Y CONTINUAR →
                </button>
              </form>
            )}
          </div>

          {/* ACCESO INVITADO / DOCENTE (COMPACTO AL PIE) */}
          <div className="mt-2 pt-2 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={handleAccesoInvitado}
              className="w-full rounded border-2 border-slate-900 bg-amber-100 hover:bg-amber-200 py-1 px-2 font-pixel text-[7.5px] uppercase font-black text-slate-950 shadow-[2px_2px_0_#0f172a] transition-all flex items-center justify-center gap-1.5"
            >
              <span>👁️</span>
              <span>MODO INVITADO (ENTRAR SIN REGISTRARSE)</span>
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER COMPACTO (1 LÍNEA) */}
      <footer className="relative z-10 mx-auto w-full max-w-5xl border-t border-cyan-500/20 pt-1 shrink-0 text-center font-pixel text-[7.5px] text-cyan-300/60 uppercase">
        MODO EDUCACIÓN · PLATAFORMA DE APRENDIZAJE ABIERTA EN BLOCKCHAIN
      </footer>
    </div>
  );
}
