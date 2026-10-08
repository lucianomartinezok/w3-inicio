import { useEffect, useRef, useState } from 'react';

/**
 * ModalDiploma.jsx
 * Validador de las 3 contraseñas de hito, generador de Diploma en Canvas HTML5
 * con descarga en PNG y acceso al Formulario de Google (Ticket final).
 */

export const CLAVES_OFICIALES = {
  clase1: 'GENESIS-2026',
  clase2: 'SMART-77',
  clase3: 'CONSENSO-OK',
};

// URL de Google Forms predeterminada para el ticket de acreditación
export const FORMULARIO_GOOGLE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSc_TALLER_BLOCKCHAIN_TICKET/viewform';

export default function ModalDiploma({
  nombreCompleto = 'Estudiante',
  dni = '00000000',
  hashDni = '0x000000',
  escuela = 'Escuela Técnica',
  grupo = '',
  passwordsGanadas = {},
  onClose,
}) {
  const [clave1, setClave1] = useState(passwordsGanadas.clase1 || '');
  const [clave2, setClave2] = useState(passwordsGanadas.clase2 || '');
  const [clave3, setClave3] = useState(passwordsGanadas.cierre || '');
  const [error, setError] = useState('');
  const [validado, setValidado] = useState(false);
  const [descargado, setDescargado] = useState(false);
  const canvasRef = useRef(null);

  // Auto-validar si ya tiene las 3 contraseñas completas
  useEffect(() => {
    if (
      passwordsGanadas.clase1 === CLAVES_OFICIALES.clase1 &&
      passwordsGanadas.clase2 === CLAVES_OFICIALES.clase2 &&
      passwordsGanadas.cierre === CLAVES_OFICIALES.clase3
    ) {
      setValidado(true);
    }
  }, [passwordsGanadas]);

  // Dibujar el diploma en el canvas cuando está validado
  useEffect(() => {
    if (!validado) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1200;
    const H = 750;

    // 1. Fondo blanco puro con marco neo-brutalista
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // 2. Patrón de cuadrícula digital sutil
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let x = 40; x < W - 40; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, H - 40);
      ctx.stroke();
    }
    for (let y = 40; y < H - 40; y += 30) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(W - 40, y);
      ctx.stroke();
    }

    // 3. Borde doble grueso negro (#0f172a)
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 10;
    ctx.strokeRect(25, 25, W - 50, H - 50);

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(38, 38, W - 76, H - 76);

    // 4. Esquinas tecnológicas (Target brackets)
    ctx.fillStyle = '#0f172a';
    const esquinas = [
      [25, 25],
      [W - 55, 25],
      [25, H - 55],
      [W - 55, H - 55],
    ];
    esquinas.forEach(([x, y]) => {
      ctx.fillRect(x, y, 30, 30);
    });

    // 5. Encabezado institucional
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0891b2';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('⚡ RED EDUCATIVA DE APRENDIZAJE ABIERTO · TECNOLOGÍA BLOCKCHAIN ⚡', W / 2, 85);

    ctx.fillStyle = '#0f172a';
    ctx.font = '900 36px sans-serif';
    ctx.fillText('CERTIFICADO DE ACREDITACIÓN', W / 2, 130);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('TRAYECTO FORMATIVO EN TECNOLOGÍA BLOCKCHAIN, CRIPTOGRAFÍA Y SMART CONTRACTS', W / 2, 160);

    // Línea divisoria
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(180, 185);
    ctx.lineTo(W - 180, 185);
    ctx.stroke();

    // 6. Cuerpo del diploma
    ctx.fillStyle = '#334155';
    ctx.font = '18px sans-serif';
    ctx.fillText('Por cuanto se certifica que el/la operador/a:', W / 2, 230);

    // Nombre del estudiante destacado
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 44px sans-serif';
    ctx.fillText(nombreCompleto.toUpperCase(), W / 2, 285);

    // Datos del operador (DNI y Hash)
    ctx.fillStyle = '#0369a1';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`DNI: ${dni}   |   IDENTIFICADOR HASH: ${hashDni}`, W / 2, 325);

    ctx.fillStyle = '#475569';
    ctx.font = '16px sans-serif';
    ctx.fillText(`${escuela} ${grupo ? `· División: ${grupo}` : ''}`, W / 2, 355);

    // 7. Contenido de las 3 clases aprobadas
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 17px sans-serif';
    ctx.fillText('Ha cumplimentado satisfactoriamente los 10 nodos y las 3 clases pedagógicas del trayecto:', W / 2, 405);

    // Caja de logros de las 3 clases
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.fillRect(150, 430, W - 300, 140);
    ctx.strokeRect(150, 430, W - 300, 140);

    ctx.textAlign = 'left';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('✓ CLASE 1: El Problema de la Confianza, Registro Distribuido y Blockchain Humana.', 180, 470);
    ctx.fillText('✓ CLASE 2: Criptografía Asimétrica, Wallets, Smart Contracts y Pruebas de Resiliencia.', 180, 505);
    ctx.fillText('✓ CLASE 3: Consenso, Tolerancia a Fallos, Gobernanza y Debate de Casos Reales.', 180, 540);

    // 8. Footer: Sello de validación, fecha y firma
    const fecha = new Date().toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`FECHA DE EMISIÓN: ${fecha}`, 150, 630);
    ctx.font = '12px monospace';
    ctx.fillText(`VERIFICACIÓN HASH: ${hashDni}-VERIFIED`, 150, 655);

    // Sello circular digital
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(W - 250, 630, 45, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = 'bold 10px monospace';
    ctx.fillText('VALIDADO', W - 250, 622);
    ctx.fillText('POR RED', W - 250, 637);
    ctx.fillText('★ 2026 ★', W - 250, 650);
  }, [validado, nombreCompleto, dni, hashDni, escuela, grupo]);

  const validarPass = (e) => {
    e.preventDefault();
    const p1 = clave1.trim().toUpperCase();
    const p2 = clave2.trim().toUpperCase();
    const p3 = clave3.trim().toUpperCase();

    if (
      p1 === CLAVES_OFICIALES.clase1 &&
      p2 === CLAVES_OFICIALES.clase2 &&
      p3 === CLAVES_OFICIALES.clase3
    ) {
      setValidado(true);
      setError('');
    } else {
      setError('Una o más contraseñas son incorrectas. Revisá tus notas de cada clase.');
    }
  };

  const autocompletar = () => {
    setClave1(CLAVES_OFICIALES.clase1);
    setClave2(CLAVES_OFICIALES.clase2);
    setClave3(CLAVES_OFICIALES.clase3);
    setValidado(true);
    setError('');
  };

  const descargarDiplomaPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const enlace = document.createElement('a');
    const limpio = nombreCompleto.toLowerCase().replace(/\s+/g, '_');
    enlace.download = `diploma_blockchain_${limpio}.png`;
    enlace.href = url;
    enlace.click();
    setDescargado(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Certificación y Diploma Oficial"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-5 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-2xl border-4 border-slate-900 bg-white p-5 sm:p-7 shadow-[10px_10px_0_#00f0ff] text-slate-900 animate-in fade-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOTÓN CERRAR */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg border-2 border-slate-900 bg-slate-950 text-cyan-300 font-pixel text-xs font-bold hover:bg-slate-800 transition-colors"
          aria-label="Cerrar ventana"
        >
          ✕
        </button>

        {/* CABECERA */}
        <div className="flex items-center gap-3 border-b-2 border-slate-900 pb-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-900 bg-cyan-300 text-2xl shadow-[2px_2px_0_#0f172a]">
            🎓
          </span>
          <div>
            <h2 className="font-pixel text-xs sm:text-sm font-black uppercase text-slate-950">
              ACREDITACIÓN Y DIPLOMA OFICIAL
            </h2>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">
              Ingresá las 3 contraseñas secretas para emitir tu certificado digital.
            </p>
          </div>
        </div>

        {/* CONTENIDO SEGÚN ESTADO */}
        {!validado ? (
          <div className="mt-5 space-y-4">
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              Cada etapa completada te otorgó una clave. Ingresá las 3 contraseñas para desbloquear tu diploma:
            </p>

            {error && (
              <div className="rounded-lg border-2 border-red-500 bg-red-50 p-2.5 font-pixel text-[9px] font-bold text-red-700">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={validarPass} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-800 mb-1">
                    Clave 1 (Clase 1 / Hito 1)
                  </label>
                  <input
                    type="text"
                    required
                    value={clave1}
                    onChange={(e) => setClave1(e.target.value)}
                    placeholder="Ej: GENESIS-2026"
                    className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-2 font-mono text-xs font-bold text-slate-950 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-800 mb-1">
                    Clave 2 (Clase 2 / Hito 2)
                  </label>
                  <input
                    type="text"
                    required
                    value={clave2}
                    onChange={(e) => setClave2(e.target.value)}
                    placeholder="Ej: SMART-77"
                    className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-2 font-mono text-xs font-bold text-slate-950 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-pixel text-[8.5px] uppercase font-bold text-slate-800 mb-1">
                    Clave 3 (Cierre Final)
                  </label>
                  <input
                    type="text"
                    required
                    value={clave3}
                    onChange={(e) => setClave3(e.target.value)}
                    placeholder="Ej: CONSENSO-OK"
                    className="w-full rounded-lg border-2 border-slate-900 bg-slate-50 px-3 py-2 font-mono text-xs font-bold text-slate-950 uppercase focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl border-2 border-slate-900 bg-cyan-400 hover:bg-cyan-300 py-3 px-4 font-pixel text-[9.5px] uppercase font-black text-slate-950 shadow-[4px_4px_0_#0f172a] transition-all active:translate-y-0.5"
                >
                  VALIDAR CLAVES Y EMITIR DIPLOMA
                </button>

                <button
                  type="button"
                  onClick={autocompletar}
                  className="rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 py-3 px-3 font-pixel text-[8.5px] uppercase font-bold text-slate-800 transition-colors"
                  title="Autocompletar si completaste los 3 hitos"
                >
                  AUTOCOMPLETAR CON CLAVES GANADAS
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            {/* VISTA PREVIA DEL DIPLOMA */}
            <div className="overflow-hidden rounded-xl border-2 border-slate-900 shadow-[4px_4px_0_#0f172a] bg-slate-100 p-2 flex justify-center">
              <canvas
                ref={canvasRef}
                width={1200}
                height={750}
                className="w-full h-auto max-h-[380px] object-contain rounded bg-white shadow"
              />
            </div>

            {/* BOTONES DE DESCARGA Y TICKET DE GOOGLE FORMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={descargarDiplomaPNG}
                className={`rounded-xl border-2 border-slate-900 py-3 px-4 font-pixel text-[10px] uppercase font-black transition-all shadow-[4px_4px_0_#0f172a] active:translate-y-0.5 flex items-center justify-center gap-2 ${
                  descargado
                    ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                    : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                }`}
              >
                <span>📥</span>
                <span>{descargado ? '✓ DIPLOMA DESCARGADO (.PNG)' : 'DESCARGAR DIPLOMA (.PNG)'}</span>
              </button>

              <a
                href={FORMULARIO_GOOGLE_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border-2 border-slate-900 bg-slate-950 hover:bg-slate-800 text-cyan-300 py-3 px-4 font-pixel text-[10px] uppercase font-black transition-all shadow-[4px_4px_0_#0f172a] active:translate-y-0.5 flex items-center justify-center gap-2 text-center"
              >
                <span>📋</span>
                <span>TICKET FINAL EN GOOGLE FORMS ↗</span>
              </a>
            </div>

            {/* EXPLICACIÓN DEL TICKET */}
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-3.5 text-xs text-slate-700 leading-relaxed font-medium">
              💡 <b>Paso para completar el taller:</b> Una vez descargado el diploma en tu máquina, abrí el enlace de <b>Google Forms</b> para responder qué te pareció el taller y adjuntar la imagen de tu certificado como evidencia final.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
