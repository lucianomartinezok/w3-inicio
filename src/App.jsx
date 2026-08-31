/**
 * App.jsx
 * Layout raíz — envuelve contextos y rutas.
 * El Sidebar lo renderizan las páginas individuales para poder pasar contexto.
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NarradorProvider } from './context/NarradorContext';
import { ModoProvider } from './context/ModoContext';
import PaginaTeoria from './pages/PaginaTeoria';
import PaginaDemo from './pages/PaginaDemo';
import PaginaDiccionario from './pages/PaginaDiccionario';
import PaginaRecorrido from './pages/PaginaRecorrido';
import NavegacionPrincipal from './components/NavegacionPrincipal';
import PieGlobal from './components/PieGlobal';

export default function App() {
  return (
    <BrowserRouter>
      <ModoProvider>
        <NarradorProvider>
          <div className="app-shell min-h-dvh pl-12">
            <NavegacionPrincipal />
            <main id="contenido-principal" className="min-h-dvh pb-7">
              <Routes>
                <Route path="/" element={<Navigate to="/recorrido" replace />} />
                <Route path="/recorrido" element={<PaginaRecorrido />} />
                <Route path="/teoria" element={<Navigate to="/teoria/web3" replace />} />
                <Route path="/teoria/:tema" element={<PaginaTeoria />} />
                <Route path="/demo" element={<PaginaDemo />} />
                <Route path="/diccionario" element={<PaginaDiccionario />} />
              </Routes>
            </main>
            <PieGlobal />
          </div>
        </NarradorProvider>
      </ModoProvider>
    </BrowserRouter>
  );
}
