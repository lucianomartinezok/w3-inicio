/**
 * ToggleModo.jsx — switch Principiante / Técnico
 */
import { useModo } from '../context/ModoContext';

export default function ToggleModo() {
  const { modo, toggleModo } = useModo();
  const esTecnico = modo === 'tecnico';

  return (
    <button
      onClick={toggleModo}
      title={esTecnico ? 'Cambiar a modo Principiante' : 'Cambiar a modo Técnico'}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
        esTecnico
          ? 'border-purple-500 bg-purple-950 text-purple-300 hover:bg-purple-900'
          : 'border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700'
      }`}
    >
      <span>{esTecnico ? '🔧' : '🎓'}</span>
      <span>{esTecnico ? 'Modo Técnico' : 'Modo Principiante'}</span>
    </button>
  );
}
