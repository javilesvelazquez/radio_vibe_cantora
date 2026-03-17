import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useData } from '../DataContext';
import { Heart, ShieldCheck, Zap, ExternalLink, Music2, User } from 'lucide-react';

export const Donate: React.FC = () => {
  const { artists } = useData();
  
  return (
    <div className="px-4 max-w-7xl mx-auto py-12 pb-40 space-y-16">
      <header className="max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">Apoya el Arte Independiente</h1>
        <p className="text-white/60 text-xl leading-relaxed">
          En Cantora creemos en el valor de la creación. Tu apoyo directo permite que los cantautores sigan contando historias y creando mundos a través de su música.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-bold">Apoyo Directo</h3>
          <p className="text-white/40 text-sm">El 100% de tu donación va directamente al artista seleccionado a través de su link personal de Stripe.</p>
        </div>
        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold">Seguro y Transparente</h3>
          <p className="text-white/40 text-sm">Utilizamos la infraestructura de Stripe para garantizar que tu transacción sea segura y privada.</p>
        </div>
        <div className="p-8 bg-white/5 rounded-3xl border border-white/5 space-y-4">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-500">
            <Heart size={24} />
          </div>
          <h3 className="text-xl font-bold">Comunidad Cantora</h3>
          <p className="text-white/40 text-sm">Al donar, te conviertes en parte activa del ecosistema musical que mantiene viva la canción de autor.</p>
        </div>
      </div>

      <section className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight">Elige a quién apoyar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.map((artist, index) => (
            <motion.div 
              key={artist.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all"
            >
              <Link to={`/artista/${artist.id}`} className="block aspect-square overflow-hidden">
                <img 
                  src={artist.imageUrl} 
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">{artist.country}</span>
                  <Music2 size={14} className="text-white/20" />
                </div>
                <Link to={`/artista/${artist.id}`} className="block hover:text-emerald-500 transition-colors">
                  <h3 className="text-xl font-bold mb-2">{artist.name}</h3>
                </Link>
                <p className="text-sm text-white/60 line-clamp-2 mb-4">{artist.bio}</p>
                <div className="flex items-center justify-between">
                  <Link 
                    to={`/artista/${artist.id}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-white transition-colors"
                  >
                    VER PERFIL <User size={12} />
                  </Link>
                  <a 
                    href={artist.stripeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                  >
                    APOYAR <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
