/**
 * GraficoWallet.jsx
 * Muestra el árbol de derivación de claves en estilo neo-brutalista adaptado a netbooks de 11 pulgadas.
 */
export default function GraficoWallet({ mini = false }) {
  const pasos = [
    {
      id: 'seed',
      icono: '🌱',
      label: 'Frase Semilla (Seed Phrase)',
      sub: '12 o 24 palabras en inglés',
      detalle: 'La raíz matemática única generada al crear tu wallet. Si la perdés, perdés el acceso para siempre.',
      badge: 'SECRETA · NUNCA COMPARTIR',
      color: 'bg-amber-100 border-amber-900 text-amber-950',
    },
    {
      id: 'priv',
      icono: '🔐',
      label: 'Clave Privada (Private Key)',
      sub: 'Número secreto de 256 bits',
      detalle: 'Tu sello criptográfico. Con ella tu wallet firma cada mensaje o transacción sin revelarla jamás.',
      badge: 'PODER DE FIRMA EXCLUSIVO',
      color: 'bg-red-50 border-slate-900 text-slate-950',
    },
    {
      id: 'pub',
      icono: '📢',
      label: 'Clave Pública (Public Key)',
      sub: 'Derivada de la clave privada',
      detalle: 'Cualquier nodo de la red puede usarla para verificar matemáticamente que tu firma es auténtica.',
      badge: 'VERIFICACIÓN PÚBLICA',
      color: 'bg-cyan-50 border-slate-900 text-slate-950',
    },
    {
      id: 'addr',
      icono: '🪪',
      label: 'Dirección Pública (Address)',
      sub: '0x71C...B29 (42 caracteres hex)',
      detalle: 'Tu alias visible en la red. Es el destino que compartís con tus compañeros para recibir transferencias.',
      badge: 'COMPARTIBLE Y VISIBLE',
      color: 'bg-emerald-50 border-slate-900 text-slate-950',
    },
  ];

  if (mini) {
    return (
      <div className="w-full flex flex-col items-center gap-1.5 py-1">
        {pasos.map((p, i) => (
          <div key={p.id} className="flex flex-col items-center w-full max-w-[220px]">
            <div className={`w-full rounded border-2 p-1.5 text-center ${p.color} shadow-xs`}>
              <div className="font-pixel text-[8px] font-bold">{p.icono} {p.label}</div>
            </div>
            {i < pasos.length - 1 && <span className="text-[10px] text-slate-800 font-bold leading-none">↓</span>}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between border-b-2 border-slate-900 pb-2">
        <span className="font-pixel text-[9px] font-black uppercase tracking-wider text-slate-700">
          👛 DERIVACIÓN CRIPTOGRÁFICA EN UNA WALLET (DE LA SEMILLA A LA DIRECCIÓN)
        </span>
        <span className="font-pixel text-[8px] text-cyan-800 font-bold hidden sm:inline">
          FLUJO UNIDIRECCIONAL MATEMÁTICO ↓
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
        {pasos.map((p, i) => (
          <div
            key={p.id}
            className={`rounded-xl border-2 border-slate-900 p-4 shadow-[3px_3px_0_#0f172a] flex flex-col justify-between ${p.color}`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-900/20 pb-2">
                <span className="text-2xl">{p.icono}</span>
                <span className="font-pixel text-[7.5px] uppercase font-black px-1.5 py-0.5 rounded border border-slate-900 bg-white shadow-xs">
                  PASO {i + 1}
                </span>
              </div>
              <h4 className="mt-2.5 font-black text-slate-950 text-sm leading-snug">
                {p.label}
              </h4>
              <p className="font-pixel text-[8px] text-slate-600 font-bold mt-0.5">
                {p.sub}
              </p>
              <p className="mt-2 text-xs text-slate-800 leading-relaxed font-medium">
                {p.detalle}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-900/10">
              <span className="font-pixel text-[7.5px] font-black uppercase text-slate-800 block">
                {p.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border-2 border-slate-900 bg-white p-3.5 text-xs text-slate-800 font-medium leading-relaxed shadow-[2px_2px_0_#0f172a]">
        💡 <b>Regla de oro:</b> La wallet <u>no almacena dinero ni activos</u> dentro de la computadora. Tu saldo vive en el registro público de la blockchain. La wallet es exclusivamente tu <b>llavero de claves privadas</b>, que te permite firmar y ordenar a la red que ejecute una operación.
      </div>
    </div>
  );
}
