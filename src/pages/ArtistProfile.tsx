import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useData } from '../DataContext';
import { Heart, Instagram, Twitter, Music, Youtube, ExternalLink, ArrowLeft, Globe } from 'lucide-react';

export const ArtistProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { artists } = useData();
  const artist = useMemo(() => artists.find(a => a.id === id), [artists, id]);

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Artista no encontrado</h2>
        <Link to="/" className="text-emerald-500 hover:underline flex items-center gap-2">
          <ArrowLeft size={18} /> Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* Header Image */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={artist.headerUrl} 
          alt={artist.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 max-w-7xl mx-auto flex flex-col md:flex-row items-end gap-6">
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={artist.imageUrl} 
            alt={artist.name}
            className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover border-4 border-[#050505] shadow-2xl z-10"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 pb-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="text-emerald-500 font-bold tracking-widest text-xs uppercase mb-2 block">{artist.country}</span>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">{artist.name}</h1>
              <div className="flex flex-wrap gap-4">
                <a 
                  href={artist.stripeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-colors flex items-center gap-2"
                >
                  <Heart size={18} fill="currentColor" /> APOYAR ARTISTA
                </a>
                <div className="flex items-center gap-3 px-4">
                  {artist.socialLinks?.map((social, i) => (
                    <a 
                      key={i} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-white/60 hover:text-white transition-colors"
                      title={social.platform}
                    >
                      {social.platform.toLowerCase() === 'instagram' && <Instagram size={20} />}
                      {social.platform.toLowerCase() === 'twitter' && <Twitter size={20} />}
                      {social.platform.toLowerCase() === 'spotify' && <Music size={20} />}
                      {social.platform.toLowerCase() === 'youtube' && <Youtube size={20} />}
                      {['instagram', 'twitter', 'spotify', 'youtube'].indexOf(social.platform.toLowerCase()) === -1 && <Globe size={20} />}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Bio Section */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 border-b border-white/10 pb-2">Biografía</h2>
            <p className="text-white/70 leading-relaxed text-lg whitespace-pre-line">
              {artist.longBio}
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 border-b border-white/10 pb-2">Discografía Destacada</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {artist.discography?.map((album, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <a href={album.listenUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="aspect-square rounded-xl overflow-hidden mb-3 relative">
                      <img 
                        src={album.coverUrl} 
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="text-white" size={32} />
                      </div>
                    </div>
                    <h3 className="font-bold text-sm line-clamp-1">{album.title}</h3>
                    <p className="text-xs text-white/40">{album.year}</p>
                  </a>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
            <h3 className="text-xl font-bold mb-4">¿Por qué apoyar?</h3>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              Tu contribución directa ayuda a {artist.name} a financiar nuevas grabaciones, giras y proyectos creativos. Cantora no toma ninguna comisión de estas donaciones.
            </p>
            <a 
              href={artist.stripeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              Donar vía Stripe <ExternalLink size={16} />
            </a>
          </div>

          <div className="bg-emerald-500/10 rounded-3xl p-8 border border-emerald-500/20">
            <h3 className="text-xl font-bold mb-2 text-emerald-500">En Cantora</h3>
            <p className="text-sm text-white/70">
              {artist.name} es uno de nuestros artistas más solicitados. Sintoniza nuestra señal diaria para escuchar sus mejores éxitos y entrevistas exclusivas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
