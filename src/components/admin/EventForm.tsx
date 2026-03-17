import React, { useState } from 'react';
import { Event, Artist } from '../../types';

interface EventFormProps {
  initialData: Partial<Event>;
  artists: Artist[];
  isSubmitting: boolean;
  onSubmit: (data: Event) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export const EventForm: React.FC<EventFormProps> = ({ 
  initialData, 
  artists, 
  isSubmitting, 
  onSubmit, 
  onCancel,
  isEditing 
}) => {
  const [form, setForm] = useState<Partial<Event>>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const artist = artists.find(a => a.id === form.artistId);
    onSubmit({
      ...form as Event,
      id: form.id || Date.now().toString(),
      artistName: artist?.name || 'Artista Desconocido'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" 
        placeholder="Título del Evento" 
        required
        value={form.title || ''}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
        onChange={e => setForm({...form, title: e.target.value})}
      />
      <select 
        required
        value={form.artistId || ''}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
        onChange={e => setForm({...form, artistId: e.target.value})}
      >
        <option value="">Seleccionar Artista</option>
        {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      <input 
        type="datetime-local" 
        required
        value={form.date || ''}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
        onChange={e => setForm({...form, date: e.target.value})}
      />
      <input 
        type="text" 
        placeholder="Ubicación" 
        value={form.location || ''}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
        onChange={e => setForm({...form, location: e.target.value})}
      />
      <input 
        type="url" 
        placeholder="URL de Imagen del Evento (Link)" 
        value={form.imageUrl || ''}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
        onChange={e => setForm({...form, imageUrl: e.target.value})}
      />
      <textarea 
        placeholder="Descripción" 
        value={form.description || ''}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm h-24 focus:border-emerald-500 outline-none transition-colors"
        onChange={e => setForm({...form, description: e.target.value})}
      />
      <div className="flex gap-4">
        {isEditing && (
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all border border-white/10"
          >
            Cancelar
          </button>
        )}
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-[2] bg-white text-black font-bold py-3 rounded-xl hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Evento' : 'Agregar Evento'}
        </button>
      </div>
    </form>
  );
};
