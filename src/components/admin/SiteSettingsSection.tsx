import React, { useState } from 'react';
import { Layout, Save } from 'lucide-react';

interface SiteSettings {
  title: string;
  subtitle: string;
  logoUrl: string;
  heroImageUrl: string;
}

interface SiteSettingsSectionProps {
  currentSettings: SiteSettings;
  onUpdate: (settings: SiteSettings) => Promise<void>;
}

export const SiteSettingsSection: React.FC<SiteSettingsSectionProps> = ({ currentSettings, onUpdate }) => {
  const [settings, setSettings] = useState<SiteSettings>(currentSettings);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await onUpdate(settings);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="bg-white/5 rounded-3xl p-8 border border-white/5">
      <div className="flex items-center gap-3 mb-6">
        <Layout className="text-emerald-500" />
        <h2 className="text-xl font-bold">Personalización del Sitio</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Título del Sitio</label>
            <input 
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({ ...settings, title: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none transition-all"
              placeholder="Ej: CANTORA RADIO"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">URL del Logo (Opcional)</label>
            <input 
              type="url"
              value={settings.logoUrl}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none transition-all"
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Subtítulo / Descripción Hero</label>
          <textarea 
            value={settings.subtitle}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none transition-all h-24 resize-none"
            placeholder="Describe tu radio..."
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-white/40 uppercase tracking-widest">URL Imagen de Portada (Hero)</label>
          <input 
            type="url"
            value={settings.heroImageUrl}
            onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500/50 outline-none transition-all"
            placeholder="https://..."
            required
          />
        </div>

        <button 
          type="submit"
          disabled={isUpdating}
          className="w-full bg-emerald-500 text-black font-bold py-3 rounded-xl hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save size={18} />
          {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </section>
  );
};
