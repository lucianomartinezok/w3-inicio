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

export default function App() {
  return (
    <BrowserRouter>
      <ModoProvider>
        <NarradorProvider>
          <div className="flex min-h-screen bg-slate-50">
            <Routes>
              <Route path="/" element={<Navigate to="/teoria/web3" replace />} />
              <Route path="/teoria" element={<Navigate to="/teoria/web3" replace />} />
              <Route path="/teoria/:tema" element={<PaginaTeoria />} />
              <Route path="/demo" element={<PaginaDemo />} />
              <Route path="/diccionario" element={<PaginaDiccionario />} />
            </Routes>
          </div>
        </NarradorProvider>
      </ModoProvider>
    </BrowserRouter>
  );
}
