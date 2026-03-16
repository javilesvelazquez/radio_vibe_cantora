import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './DataContext';
import { Navbar } from './components/Navbar';
import { Player } from './components/Player';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Events = lazy(() => import('./pages/Events').then(m => ({ default: m.Events })));
const Donate = lazy(() => import('./pages/Donate').then(m => ({ default: m.Donate })));
const ArtistProfile = lazy(() => import('./pages/ArtistProfile').then(m => ({ default: m.ArtistProfile })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

export default function App() {
  return (
    <DataProvider>
      <Router>
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-500">
          <Navbar />
          
          <main className="pt-16 min-h-[calc(100vh-80px)]">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/eventos" element={<Events />} />
                <Route path="/donar" element={<Donate />} />
                <Route path="/artista/:id" element={<ArtistProfile />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </main>

          <Player />
        </div>
      </Router>
    </DataProvider>
  );
}
