import { createContext } from 'react';

export const NarradorContext = createContext(null);

export const TIPOS_EVENTO = {
  info:     { color: 'text-slate-300',  bg: 'bg-slate-800',   icono: 'ℹ️' },
  accion:   { color: 'text-indigo-300', bg: 'bg-indigo-950',  icono: '⚡' },
  espera:   { color: 'text-amber-300',  bg: 'bg-amber-950',   icono: '⏳' },
  exito:    { color: 'text-emerald-300',bg: 'bg-emerald-950', icono: '✅' },
  error:    { color: 'text-red-300',    bg: 'bg-red-950',     icono: '❌' },
  tecnico:  { color: 'text-purple-300', bg: 'bg-purple-950',  icono: '🔧' },
};
