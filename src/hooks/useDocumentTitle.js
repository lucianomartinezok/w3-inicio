import { useEffect } from 'react';

const PRODUCTO = 'Desafío Blockchain';

export function useDocumentTitle(pagina) {
  useEffect(() => {
    document.title = `${pagina} — ${PRODUCTO}`;
  }, [pagina]);
}
