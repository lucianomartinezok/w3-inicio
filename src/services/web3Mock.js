/**
 * web3Mock.js — v0: Simulación completa del flujo Web3
 *
 * Implementa la misma interfaz que web3Real.js pero sin blockchain.
 * Usa setTimeout para simular los tiempos reales, localStorage para persistir
 * el mensaje, y genera datos falsos con formato correcto (hash, bloque, gas).
 *
 * Para testear errores: agrega ?fallo=firma o ?fallo=red a la URL.
 */

const DELAY = {
  detectar: 400,
  permiso: 600,
  red: 300,
  leer: 350,
  preparar: 500,
  firmar: null, // requiere acción del usuario
  minar: () => 1500 + Math.random() * 1500,
};

const MOCK_CUENTA = '0xDEM0A8B9c2f3D4e5F6A7B8C9d0E1F2a3B4C5D4FE';
const MOCK_CHAIN_ID = '0xaa36a7';
const MOCK_BALANCE = '0.1337';
let _bloqueActual = 6_001_234;

function esperar(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function generarHash() {
  const chars = '0123456789abcdef';
  let h = '0x';
  for (let i = 0; i < 64; i++) h += chars[Math.floor(Math.random() * 16)];
  return h;
}

function obtenerFallo() {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('fallo');
}

// ─── MODAL FAKE DE METAMASK ────────────────────────────────────

function mostrarModalWallet(tipo, onAceptar, onRechazar) {
  // Crea un overlay que simula el popup de MetaMask
  const overlay = document.createElement('div');
  overlay.id = 'mock-modal';
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;
    display:flex;align-items:center;justify-content:center;
  `;

  const mensajes = {
    conexion: {
      titulo: '🦊 MetaMask (Simulado)',
      subtitulo: 'Una app quiere conectarse a tu wallet',
      detalle: 'Va a poder ver tu dirección pública. No puede ver tu clave privada ni mover tus fondos sin tu permiso.',
      botonOk: 'Conectar',
      cuenta: MOCK_CUENTA,
      red: 'Sepolia Testnet',
    },
    firma: {
      titulo: '🦊 MetaMask (Simulado)',
      subtitulo: 'Solicitud de firma de transacción',
      detalle: 'Función: actualizarMensaje(string)\nCosto estimado de gas: ~43,000 unidades\nEsta transacción modificará el contrato.',
      botonOk: 'Firmar y enviar',
      cuenta: MOCK_CUENTA,
      red: 'Sepolia Testnet',
    },
  };

  const m = mensajes[tipo];

  overlay.innerHTML = `
    <div style="
      background:#1e2130;border:1px solid #6366f1;border-radius:16px;
      padding:24px;max-width:380px;width:90%;color:#e2e8f0;font-family:system-ui;
    ">
      <div style="font-size:18px;font-weight:700;margin-bottom:4px;">${m.titulo}</div>
      <div style="font-size:14px;color:#94a3b8;margin-bottom:16px;">${m.subtitulo}</div>
      <div style="background:#0f1117;border-radius:8px;padding:12px;margin-bottom:12px;font-size:12px;">
        <div style="color:#64748b;margin-bottom:4px;">CUENTA</div>
        <div style="font-family:monospace;color:#a5b4fc;word-break:break-all;">${m.cuenta}</div>
        <div style="color:#64748b;margin-top:8px;margin-bottom:4px;">RED</div>
        <div style="color:#34d399;">${m.red}</div>
      </div>
      <div style="background:#0f1117;border-radius:8px;padding:12px;margin-bottom:20px;font-size:12px;color:#94a3b8;white-space:pre-line;">
        ${m.detalle}
      </div>
      <div style="display:flex;gap:12px;">
        <button id="mock-rechazar" style="
          flex:1;padding:10px;border-radius:8px;border:1px solid #475569;
          background:transparent;color:#94a3b8;cursor:pointer;font-size:14px;
        ">Rechazar</button>
        <button id="mock-aceptar" style="
          flex:1;padding:10px;border-radius:8px;border:none;
          background:#6366f1;color:white;cursor:pointer;font-size:14px;font-weight:600;
        ">${m.botonOk}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById('mock-aceptar').onclick = () => {
    overlay.remove();
    onAceptar();
  };
  document.getElementById('mock-rechazar').onclick = () => {
    overlay.remove();
    onRechazar(new Error('Usuario rechazó la operación'));
  };
}

// ─── API PÚBLICA ───────────────────────────────────────────────

/**
 * conectarWallet
 * Simula el flujo completo de conexión a MetaMask.
 * Retorna: { cuenta, chainId, balance }
 */
export async function conectarWallet(onProgreso) {
  const fallo = obtenerFallo();

  onProgreso?.({ paso: 'detectar', msg: 'Buscando MetaMask en el navegador...' });
  await esperar(DELAY.detectar);

  if (fallo === 'red') {
    throw new Error('Red incorrecta. Por favor conectate a Sepolia Testnet.');
  }

  onProgreso?.({ paso: 'permiso', msg: 'MetaMask encontrado. Pidiendo permiso...' });

  return new Promise((resolve, reject) => {
    mostrarModalWallet(
      'conexion',
      async () => {
        await esperar(DELAY.red);
        onProgreso?.({ paso: 'verificar_red', msg: 'Verificando que estés en Sepolia (chainId 0xaa36a7)...' });
        await esperar(DELAY.red);
        onProgreso?.({ paso: 'listo', msg: `Conectado. Address: ${MOCK_CUENTA.slice(0, 10)}...` });
        resolve({
          cuenta: MOCK_CUENTA,
          chainId: MOCK_CHAIN_ID,
          balance: MOCK_BALANCE,
        });
      },
      reject
    );
  });
}

/**
 * leerMensaje
 * Lee el mensaje actual del contrato (simulado con localStorage).
 * No requiere firma, es una operación de lectura gratuita.
 */
export async function leerMensaje(onProgreso) {
  onProgreso?.({ paso: 'leer', msg: 'Consultando el contrato... (operación gratuita, sin firma)' });
  await esperar(DELAY.leer);
  const msg = localStorage.getItem('web3demo_mensaje') || '';
  onProgreso?.({ paso: 'leer_ok', msg: `Mensaje leído desde el contrato: "${msg || '(vacío)'}"` });
  return msg;
}

/**
 * enviarMensaje
 * Simula el envío de una transacción para actualizar el mensaje.
 * Retorna: { hash, numeroBloque, gasUsado, autor, timestamp }
 */
export async function enviarMensaje(texto, onProgreso) {
  const fallo = obtenerFallo();

  onProgreso?.({ paso: 'preparar', msg: 'Preparando la transacción...', tecnico: `actualizarMensaje("${texto}")` });
  await esperar(DELAY.preparar);

  if (fallo === 'firma') {
    // Simula que el usuario rechaza en MetaMask
    return new Promise((_, reject) => {
      mostrarModalWallet('firma', () => {}, () => {
        reject(new Error('Transacción rechazada por el usuario en MetaMask.'));
      });
    });
  }

  onProgreso?.({ paso: 'firmar', msg: 'Esperando tu firma en MetaMask...' });

  return new Promise((resolve, reject) => {
    mostrarModalWallet(
      'firma',
      async () => {
        const hash = generarHash();
        onProgreso?.({
          paso: 'broadcast',
          msg: 'Transacción firmada y enviada a la red Sepolia.',
          tecnico: `txHash: ${hash}`,
        });
        await esperar(200);

        onProgreso?.({ paso: 'mempool', msg: 'Transacción en la lista de espera (mempool). Los validadores la están viendo...' });
        const tiempoMinado = DELAY.minar();
        await esperar(tiempoMinado * 0.4);

        onProgreso?.({ paso: 'validador', msg: 'Un validador la tomó y la está incluyendo en un bloque...' });
        await esperar(tiempoMinado * 0.6);

        _bloqueActual += 1;
        const gasUsado = (42000 + Math.floor(Math.random() * 3000)).toString();
        localStorage.setItem('web3demo_mensaje', texto);

        onProgreso?.({
          paso: 'confirmada',
          msg: `¡Confirmada! Bloque #${_bloqueActual}. Gas usado: ${gasUsado} unidades.`,
          tecnico: `bloque: ${_bloqueActual}, gasUsed: ${gasUsado}, hash: ${hash}`,
        });

        resolve({
          hash,
          numeroBloque: _bloqueActual,
          gasUsado,
          autor: MOCK_CUENTA,
          timestamp: Date.now(),
        });
      },
      reject
    );
  });
}

/**
 * obtenerInfoContrato
 * Devuelve la address y ABI del contrato (usadas por el hook).
 */
export function obtenerInfoContrato() {
  return {
    direccion: '0xMOCK_CONTRACT_ADDRESS_AQUI',
    esMock: true,
  };
}
