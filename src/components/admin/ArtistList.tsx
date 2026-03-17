import React from 'react';
import { Artist } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface ArtistListProps {
  artists: Artist[];
  onEdit: (artist: Artist) => void;
  onDelete: (id: string) => void;
}

export const ArtistList: React.FC<ArtistListProps> = ({ artists, onEdit, onDelete }) => {
  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Artistas Registrados</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map(artist => (
          <div key={artist.id} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
                {artist.imageUrl && (
                  <img 
                    src={artist.imageUrl} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                    alt={artist.name}
                  />
                )}
              </div>
              <span className="font-bold text-sm">{artist.name}</span>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(artist)} 
                className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                title="Editar"
              >
                <Plus size={16} />
              </button>
              <button 
                onClick={() => onDelete(artist.id)} 
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
