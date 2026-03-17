import React from 'react';
import { Event } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onEdit, onDelete }) => {
  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Próximos Eventos</h3>
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
            <div>
              <p className="font-bold text-sm">{event.title}</p>
              <p className="text-[10px] text-white/40">{new Date(event.date).toLocaleString()}</p>
              <p className="text-[10px] text-emerald-500/60 uppercase tracking-tighter">{event.artistName}</p>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onEdit(event)} 
                className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                title="Editar"
              >
                <Plus size={16} />
              </button>
              <button 
                onClick={() => onDelete(event.id)} 
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
