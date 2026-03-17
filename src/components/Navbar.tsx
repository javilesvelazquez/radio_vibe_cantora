import React from 'react';
import { NavLink } from 'react-router-dom';
import { Radio, Calendar, Heart, Home } from 'lucide-react';
import { useData } from '../DataContext';

export const Navbar: React.FC = () => {
  const { siteSettings } = useData();
  
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/50 backdrop-blur-md border-b border-white/5 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center overflow-hidden">
              {siteSettings.logoUrl ? (
                <img src={siteSettings.logoUrl} alt="Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <Radio className="text-black" size={20} />
              )}
            </div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase">{siteSettings.title}</span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-6">
            <NavLink 
              to="/" 
              className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Inicio</span>
            </NavLink>
            <NavLink 
              to="/eventos" 
              className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Calendar size={18} />
              <span className="hidden sm:inline">Eventos</span>
            </NavLink>
            <NavLink 
              to="/donar" 
              className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              <Heart size={18} />
              <span className="hidden sm:inline">Apoyar</span>
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
