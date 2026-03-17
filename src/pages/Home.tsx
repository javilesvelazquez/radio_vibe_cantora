import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useData } from '../DataContext';
import { ExternalLink, Music2, User } from 'lucide-react';

export const Home: React.FC = () => {
  const { artists, siteSettings } = useData();
  
  return (
    <div className="space-y-12 pb-40">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden rounded-3xl mx-4 mt-4">
        <div className="absolute inset-0 z-0">
          <img 
            src={siteSettings.heroImageUrl} 
            className="w-full h-full object-cover opacity-50"
            alt="Hero background"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
          >
            {siteSettings.title.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {i === siteSettings.title.split(' ').length - 1 ? (
                  <span className="text-emerald-500 italic">{word}</span>
                ) : (
                  word + ' '
                )}
              </React.Fragment>
            ))}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/80 leading-relaxed"
          >
            {siteSettings.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Featured Artists */}
      <section className="px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Artistas Destacados</h2>
          <div className="h-px flex-1 mx-8 bg-white/10 hidden md:block" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {artists.length > 0 ? (
            artists.map((artist, index) => (
              <motion.div 
                key={artist.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all"
              >
                <Link to={`/artista/${artist.id}`} className="block aspect-square overflow-hidden" aria-label={`Ver perfil de ${artist.name}`}>
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
                      aria-label={`Ver perfil completo de ${artist.name}`}
                    >
                      VER PERFIL <User size={12} />
                    </Link>
                    <a 
                      href={artist.stripeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors"
                      aria-label={`Apoyar a ${artist.name} vía Stripe`}
                    >
                      APOYAR <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-white/10">
              <Music2 size={48} className="mx-auto text-white/20 mb-4" />
              <p className="text-white/40">No se encontraron artistas en este momento.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
