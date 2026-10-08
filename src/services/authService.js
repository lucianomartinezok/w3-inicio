/**
 * authService.js
 * Sistema de autenticación de alumnos y persistencia de progreso 100% web,
 * gratuito, seguro y autónomo.
 *
 * Características:
 * - Registro con DNI, Nombre, Apellido, Escuela, Grupo y Contraseña.
 * - Hash criptográfico SHA-256 para contraseñas (Web Crypto API).
 * - Guardado de progreso aislado por alumno (múltiples alumnos pueden usar la misma máquina).
 * - Recuperación inmediata de avance al iniciar sesión.
 * - Soporte para respaldo/pasaporte digital para mover avance entre netbooks.
 * - Panel de administración para el docente con reset de contraseñas y reporte en vivo.
 */

const STORAGE_KEY_USUARIOS = 'web3_registro_usuarios_v2';
const STORAGE_KEY_PROGRESOS = 'web3_registro_progresos_v2';
const STORAGE_KEY_SESION = 'web3_sesion_activa_v2';

// Clave maestra por defecto para acceso docente al panel de monitoreo
export const CLAVE_DOCENTE_DEFAULT = 'PROFE-ET12';

/**
 * Genera un hash SHA-256 a partir de una contraseña.
 */
export async function hashearPassword(password) {
  if (!password) return '';
  try {
    if (window.crypto && window.crypto.subtle) {
      const buffer = new TextEncoder().encode(`W3_SALT_${password}_ET12`);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (err) {
    console.warn('Crypto.subtle no disponible, usando hash alternativo', err);
  }
  // Fallback determinístico simple si crypto.subtle no está disponible
  let h = 0;
  const str = `FALLBACK_SALT_${password}_2026`;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return 'fb_' + Math.abs(h).toString(16);
}

/**
 * Obtiene la lista/mapa de todos los usuarios registrados.
 */
export function obtenerUsuariosRegistrados() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USUARIOS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Guarda el mapa de usuarios en el almacenamiento persistente.
 */
function guardarUsuariosRegistrados(usuarios) {
  try {
    localStorage.setItem(STORAGE_KEY_USUARIOS, JSON.stringify(usuarios));
  } catch (e) {
    console.error('Error guardando usuarios', e);
  }
}

/**
 * Obtiene el mapa de todos los progresos de alumnos por DNI.
 */
export function obtenerTodosProgresos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESOS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Guarda el mapa de progresos.
 */
function guardarTodosProgresos(progresos) {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESOS, JSON.stringify(progresos));
  } catch (e) {
    console.error('Error guardando progresos', e);
  }
}

/**
 * Obtiene la sesión del usuario actualmente activo.
 */
export function obtenerSesionActiva() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Establece la sesión activa en el navegador.
 */
export function fijarSesionActiva(usuario) {
  try {
    if (usuario) {
      localStorage.setItem(STORAGE_KEY_SESION, JSON.stringify(usuario));
    } else {
      localStorage.removeItem(STORAGE_KEY_SESION);
    }
  } catch (e) {
    console.error('Error fijando sesión', e);
  }
}

/**
 * Registra un nuevo alumno con contraseña.
 */
export async function registrarAlumno({
  nombre,
  apellido,
  dni,
  password,
  escuela,
  grupo,
  hashDni,
}) {
  const dniLimpio = String(dni || '').replace(/\D/g, '').trim();

  if (!dniLimpio) {
    return { exito: false, error: 'El DNI es obligatorio y debe tener números.' };
  }
  if (!nombre?.trim() || !apellido?.trim()) {
    return { exito: false, error: 'Completá tu nombre y apellido.' };
  }
  if (!password || password.length < 4) {
    return { exito: false, error: 'La contraseña debe tener al menos 4 caracteres.' };
  }

  const usuarios = obtenerUsuariosRegistrados();

  if (usuarios[dniLimpio]) {
    return {
      exito: false,
      error: 'Ya existe una cuenta con este DNI. Podés ir a "Iniciar Sesión".',
    };
  }

  const passwordHash = await hashearPassword(password);

  const nuevoUsuario = {
    dni: dniLimpio,
    nombre: nombre.trim(),
    apellido: apellido.trim(),
    escuela: escuela?.trim() || 'Escuela Técnica',
    grupo: grupo?.trim() || 'Sin grupo',
    hashDni: hashDni || `0x${dniLimpio.padStart(8, '0')}`,
    passwordHash,
    fechaRegistro: new Date().toISOString(),
    rol: 'alumno',
  };

  usuarios[dniLimpio] = nuevoUsuario;
  guardarUsuariosRegistrados(usuarios);

  // Inicializar progreso del alumno
  const progresos = obtenerTodosProgresos();
  const progresoInicial = {
    dni: dniLimpio,
    paso: 0,
    completados: [],
    respuestas: {},
    passwords: {
      clase1: '',
      clase2: '',
      cierre: '',
    },
    fechaActualizacion: new Date().toISOString(),
  };

  progresos[dniLimpio] = progresoInicial;
  guardarTodosProgresos(progresos);

  // Establecer sesión activa
  fijarSesionActiva(nuevoUsuario);

  return {
    exito: true,
    usuario: nuevoUsuario,
    progreso: progresoInicial,
  };
}

/**
 * Inicia sesión para un alumno con DNI y contraseña.
 */
export async function iniciarSesionAlumno({ dni, password }) {
  const dniLimpio = String(dni || '').replace(/\D/g, '').trim();

  if (!dniLimpio) {
    return { exito: false, error: 'Ingresá tu número de DNI.' };
  }
  if (!password) {
    return { exito: false, error: 'Ingresá tu contraseña.' };
  }

  const usuarios = obtenerUsuariosRegistrados();
  const usuario = usuarios[dniLimpio];

  if (!usuario) {
    return {
      exito: false,
      error: 'No encontramos ninguna cuenta con este DNI. Podés crear una en "Crear Cuenta".',
    };
  }

  const hashIngresado = await hashearPassword(password);

  if (usuario.passwordHash !== hashIngresado) {
    return {
      exito: false,
      error: 'Contraseña incorrecta. Verificá los caracteres e intentá de nuevo.',
    };
  }

  // Cargar progreso del alumno
  const progresos = obtenerTodosProgresos();
  const progreso = progresos[dniLimpio] || {
    dni: dniLimpio,
    paso: 0,
    completados: [],
    respuestas: {},
    passwords: { clase1: '', clase2: '', cierre: '' },
    fechaActualizacion: new Date().toISOString(),
  };

  fijarSesionActiva(usuario);

  return {
    exito: true,
    usuario,
    progreso,
  };
}

/**
 * Cierra la sesión activa actual.
 */
export function cerrarSesion() {
  fijarSesionActiva(null);
}

/**
 * Guarda el progreso actualizado de un alumno.
 */
export function guardarProgresoAlumno(dni, datosProgreso) {
  const dniLimpio = String(dni || '').replace(/\D/g, '').trim();
  if (!dniLimpio) return false;

  const progresos = obtenerTodosProgresos();
  const actual = progresos[dniLimpio] || {};

  progresos[dniLimpio] = {
    ...actual,
    ...datosProgreso,
    dni: dniLimpio,
    fechaActualizacion: new Date().toISOString(),
  };

  guardarTodosProgresos(progresos);
  return true;
}

/**
 * Carga el progreso de un alumno por DNI.
 */
export function cargarProgresoAlumno(dni) {
  const dniLimpio = String(dni || '').replace(/\D/g, '').trim();
  if (!dniLimpio) return null;
  const progresos = obtenerTodosProgresos();
  return progresos[dniLimpio] || null;
}

/**
 * Cambia o resetea la contraseña de un alumno (utilizado por el docente o el alumno).
 */
export async function resetearPasswordAlumno(dni, nuevaPassword) {
  const dniLimpio = String(dni || '').replace(/\D/g, '').trim();
  if (!dniLimpio) return { exito: false, error: 'DNI inválido' };
  if (!nuevaPassword || nuevaPassword.length < 4) {
    return { exito: false, error: 'La nueva contraseña debe tener al menos 4 caracteres' };
  }

  const usuarios = obtenerUsuariosRegistrados();
  if (!usuarios[dniLimpio]) {
    return { exito: false, error: 'Usuario no encontrado' };
  }

  usuarios[dniLimpio].passwordHash = await hashearPassword(nuevaPassword);
  guardarUsuariosRegistrados(usuarios);

  return { exito: true };
}

/**
 * Exporta un consolidado de todos los alumnos y sus avances para el docente.
 */
export function obtenerConsolidadoDocente() {
  const usuarios = obtenerUsuariosRegistrados();
  const progresos = obtenerTodosProgresos();

  return Object.values(usuarios).map((usr) => {
    const prog = progresos[usr.dni] || {
      paso: 0,
      completados: [],
      respuestas: {},
      passwords: {},
      fechaActualizacion: null,
    };

    return {
      dni: usr.dni,
      nombreCompleto: `${usr.nombre} ${usr.apellido}`,
      escuela: usr.escuela,
      grupo: usr.grupo,
      hashDni: usr.hashDni,
      fechaRegistro: usr.fechaRegistro,
      nodoActual: prog.paso,
      totalCompletados: prog.completados?.length || 0,
      completados: prog.completados || [],
      respuestas: prog.respuestas || {},
      passwords: prog.passwords || {},
      fechaActualizacion: prog.fechaActualizacion,
    };
  });
}

/**
 * Genera un archivo o token de respaldo portable para que el alumno pueda
 * llevarse su avance a otra netbook si cambia de máquina en el aula.
 */
export function generarPasaporteAlumno(dni) {
  const dniLimpio = String(dni || '').replace(/\D/g, '').trim();
  const usuarios = obtenerUsuariosRegistrados();
  const progresos = obtenerTodosProgresos();

  const usuario = usuarios[dniLimpio];
  const progreso = progresos[dniLimpio];

  if (!usuario) return null;

  return {
    version: '1.0',
    exportadoEn: new Date().toISOString(),
    usuario: {
      dni: usuario.dni,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      escuela: usuario.escuela,
      grupo: usuario.grupo,
      hashDni: usuario.hashDni,
      passwordHash: usuario.passwordHash,
    },
    progreso: progreso || {},
  };
}

/**
 * Importa un pasaporte digital en una nueva netbook.
 */
export function importarPasaporteAlumno(datosPasaporte) {
  try {
    if (!datosPasaporte?.usuario?.dni) {
      return { exito: false, error: 'El archivo de respaldo no es válido.' };
    }

    const { usuario, progreso } = datosPasaporte;
    const usuarios = obtenerUsuariosRegistrados();
    const progresos = obtenerTodosProgresos();

    usuarios[usuario.dni] = usuario;
    progresos[usuario.dni] = {
      ...(progreso || {}),
      dni: usuario.dni,
      fechaActualizacion: new Date().toISOString(),
    };

    guardarUsuariosRegistrados(usuarios);
    guardarTodosProgresos(progresos);
    fijarSesionActiva(usuario);

    return { exito: true, usuario, progreso: progresos[usuario.dni] };
  } catch (err) {
    return { exito: false, error: 'Error al importar datos: ' + err.message };
  }
}
