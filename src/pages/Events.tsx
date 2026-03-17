import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useData } from '../DataContext';
import { Calendar, MapPin, Clock, Info, User } from 'lucide-react';

export const Events: React.FC = () => {
  const { events } = useData();
  
  return (
    <div className="px-4 max-w-7xl mx-auto py-12 pb-40 space-y-12">
      <header className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">Próximos Eventos</h1>
        <p className="text-white/60 text-lg">No te pierdas las presentaciones en vivo de tus artistas favoritos. La música se vive mejor de cerca.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {events.length > 0 ? (
          events.map((event, index) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col lg:flex-row bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <div className="lg:w-1/3 aspect-video lg:aspect-auto">
                <img 
                  src={event.imageUrl} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-8 lg:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full border border-emerald-500/20">
                      CONCIERTO
                    </span>
                    <Link to={`/artista/${event.artistId}`} className="text-white/40 text-sm font-medium hover:text-emerald-500 transition-colors flex items-center gap-1" aria-label={`Ver perfil de ${event.artistName}`}>
                      <User size={14} /> {event.artistName}
                    </Link>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{event.title}</h2>
                  <p className="text-white/70 mb-8 max-w-2xl">{event.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 text-white/60">
                      <Calendar size={18} className="text-emerald-500" />
                      <span>{new Date(event.date).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/60">
                      <Clock size={18} className="text-emerald-500" />
                      <span>{new Date(event.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} hrs</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/60">
                      <MapPin size={18} className="text-emerald-500" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-emerald-500 hover:text-white transition-all" aria-label={`Comprar boletos para ${event.title}`}>
                    Comprar Boletos
                  </button>
                  <Link to={`/artista/${event.artistId}`} className="px-8 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-all flex items-center gap-2" aria-label={`Ver perfil de ${event.artistName}`}>
                    <User size={18} /> Ver Artista
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center bg-white/5 rounded-3xl border border-white/10">
            <Calendar size={48} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/40">No hay eventos programados próximamente.</p>
          </div>
        )}
      </div>
    </div>
  );
};
