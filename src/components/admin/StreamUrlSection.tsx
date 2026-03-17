import React, { useState } from 'react';
import { Radio, Save } from 'lucide-react';

interface StreamUrlSectionProps {
  currentUrl: string;
  onUpdate: (url: string) => Promise<void>;
}

export const StreamUrlSection: React.FC<StreamUrlSectionProps> = ({ currentUrl, onUpdate }) => {
  const [newUrl, setNewUrl] = useState(currentUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onUpdate(newUrl);
      alert('Señal actualizada');
    } catch (error) {
      alert('Error al actualizar señal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-white/5 rounded-3xl p-8 border border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <Radio className="text-emerald-500" />
        <h2 className="text-xl font-bold">Señal de Radio</h2>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input 
          type="text" 
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="URL del streaming (mp3/aac)"
          className={`flex-1 bg-black border rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors ${
            newUrl.startsWith('http:') ? 'border-yellow-500/50' : 'border-white/10'
          }`}
        />
        <button 
          onClick={handleSave}
          disabled={isSubmitting || newUrl === currentUrl}
          className="bg-emerald-500 text-black font-bold px-6 py-3 rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} /> {isSubmitting ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
      {newUrl.startsWith('http:') && (
        <p className="mt-2 text-xs text-yellow-500">
          ⚠️ Advertencia: Las URLs HTTP pueden ser bloqueadas por el navegador por seguridad. Se recomienda usar HTTPS.
        </p>
      )}
    </section>
  );
};
