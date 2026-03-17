import React, { useState, useEffect } from 'react';
import { Music, Save, Image as ImageIcon, User, Disc } from 'lucide-react';
import { NowPlaying } from '../../types';

interface NowPlayingSectionProps {
  currentData: NowPlaying;
  onUpdate: (data: Partial<NowPlaying>) => Promise<void>;
}

export const NowPlayingSection: React.FC<NowPlayingSectionProps> = ({ currentData, onUpdate }) => {
  const [formData, setFormData] = useState<NowPlaying>(currentData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(currentData);
  }, [currentData]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      alert('Metadatos actualizados');
    } catch (error) {
      alert('Error al actualizar metadatos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white/5 rounded-3xl p-8 border border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <Music className="text-emerald-500" />
        <h2 className="text-xl font-bold">Ahora Suena (Metadatos)</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Music size={12} /> Título de la Canción
            </label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
              <User size={12} /> Artista
            </label>
            <input 
              type="text" 
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Disc size={12} /> Álbum
            </label>
            <input 
              type="text" 
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
              <ImageIcon size={12} /> URL de Portada
            </label>
            <input 
              type="text" 
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-emerald-500 text-black font-bold px-8 py-3 rounded-xl hover:bg-emerald-400 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save size={18} /> {isSubmitting ? 'Guardando...' : 'Actualizar Metadatos'}
        </button>
      </div>
    </section>
  );
};
