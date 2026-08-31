import { useContext } from 'react';
import { ModoContext } from '../context/modoContextBase';

export function useModo() {
  const contexto = useContext(ModoContext);
  if (!contexto) throw new Error('useModo debe usarse dentro de ModoProvider');
  return contexto;
}
