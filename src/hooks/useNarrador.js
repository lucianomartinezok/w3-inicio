import { useContext } from 'react';
import { NarradorContext } from '../context/narradorContextBase';

export function useNarrador() {
  const contexto = useContext(NarradorContext);
  if (!contexto) throw new Error('useNarrador debe usarse dentro de NarradorProvider');
  return contexto;
}
