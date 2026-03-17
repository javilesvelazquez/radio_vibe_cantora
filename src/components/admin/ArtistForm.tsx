import React, { useState } from 'react';
import { Artist, SocialLink, Album } from '../../types';
import { Plus, Trash2, Image as ImageIcon, Save } from 'lucide-react';

interface ArtistFormProps {
  initialData: Partial<Artist>;
  isSubmitting: boolean;
  onSubmit: (data: Artist) => Promise<void>;
  onCancel: () => void;
  isEditing: boolean;
}

export const ArtistForm: React.FC<ArtistFormProps> = ({ 
  initialData, 
  isSubmitting, 
  onSubmit, 
  onCancel,
  isEditing 
}) => {
  const [form, setForm] = useState<Partial<Artist>>(initialData);
  const [newSocial, setNewSocial] = useState<SocialLink>({ platform: 'Instagram', url: '' });
  const [newAlbum, setNewAlbum] = useState<Album>({ title: '', year: '', coverUrl: '', listenUrl: '' });

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl' | 'headerUrl') => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleAlbumCoverUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewAlbum(prev => ({ ...prev, coverUrl: e.target.value }));
  };

  const addSocialLink = () => {
    if (newSocial.url) {
      setForm(prev => ({
        ...prev,
        socialLinks: [...(prev.socialLinks || []), newSocial]
      }));
      setNewSocial({ platform: 'Instagram', url: '' });
    }
  };

  const removeSocialLink = (index: number) => {
    setForm(prev => ({
      ...prev,
      socialLinks: prev.socialLinks?.filter((_, i) => i !== index)
    }));
  };

  const addAlbum = () => {
    if (newAlbum.title && newAlbum.year) {
      setForm(prev => ({
        ...prev,
        discography: [...(prev.discography || []), newAlbum]
      }));
      setNewAlbum({ title: '', year: '', coverUrl: '', listenUrl: '' });
    }
  };

  const removeAlbum = (index: number) => {
    setForm(prev => ({
      ...prev,
      discography: prev.discography?.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form as Artist,
      id: form.id || Date.now().toString(),
      socialLinks: form.socialLinks || [],
      discography: form.discography || []
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Información Básica</label>
          <input 
            type="text" 
            placeholder="Nombre del Artista" 
            required
            value={form.name || ''}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm mb-4 focus:border-emerald-500 outline-none transition-colors"
            onChange={e => setForm({...form, name: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="País" 
            value={form.country || ''}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm mb-4 focus:border-emerald-500 outline-none transition-colors"
            onChange={e => setForm({...form, country: e.target.value})}
          />
          <textarea 
            placeholder="Biografía corta" 
            value={form.bio || ''}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm h-24 mb-4 focus:border-emerald-500 outline-none transition-colors"
            onChange={e => setForm({...form, bio: e.target.value})}
          />
          <textarea 
            placeholder="Biografía extendida" 
            value={form.longBio || ''}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm h-32 focus:border-emerald-500 outline-none transition-colors"
            onChange={e => setForm({...form, longBio: e.target.value})}
          />
        </div>

        <div>
          <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Imágenes (Links de Google Drive/Web)</label>
          <div className="space-y-4 mb-4">
            <div className="flex gap-4 items-start">
              <div className="relative w-24 h-24 flex-shrink-0 bg-black border border-white/10 rounded-xl overflow-hidden">
                {form.imageUrl ? (
                  <img src={form.imageUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Profile" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon /></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-white/40 uppercase font-bold mb-1">URL Foto Perfil</p>
                <input 
                  type="url" 
                  placeholder="https://..." 
                  value={form.imageUrl || ''}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-emerald-500 outline-none transition-colors"
                  onChange={e => handleImageUrlChange(e, 'imageUrl')}
                />
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="relative w-24 h-14 flex-shrink-0 bg-black border border-white/10 rounded-xl overflow-hidden">
                {form.headerUrl ? (
                  <img src={form.headerUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="Banner" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20"><ImageIcon /></div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-white/40 uppercase font-bold mb-1">URL Banner</p>
                <input 
                  type="url" 
                  placeholder="https://..." 
                  value={form.headerUrl || ''}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs focus:border-emerald-500 outline-none transition-colors"
                  onChange={e => handleImageUrlChange(e, 'headerUrl')}
                />
              </div>
            </div>
          </div>
          <input 
            type="url" 
            placeholder="Link de Stripe (Donaciones)" 
            value={form.stripeLink || ''}
            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none transition-colors"
            onChange={e => setForm({...form, stripeLink: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Redes Sociales</label>
          <div className="flex gap-2 mb-4">
            <select 
              value={newSocial.platform}
              onChange={e => setNewSocial({...newSocial, platform: e.target.value})}
              className="bg-black border border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-emerald-500"
            >
              <option>Instagram</option>
              <option>Twitter</option>
              <option>Spotify</option>
              <option>Youtube</option>
              <option>Web</option>
            </select>
            <input 
              type="url" 
              placeholder="URL" 
              value={newSocial.url}
              onChange={e => setNewSocial({...newSocial, url: e.target.value})}
              className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-emerald-500"
            />
            <button type="button" onClick={addSocialLink} className="p-2 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 transition-colors">
              <Plus size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.socialLinks?.map((social, i) => (
              <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full text-xs border border-white/10">
                <span>{social.platform}</span>
                <button type="button" onClick={() => removeSocialLink(i)} className="text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Discografía</label>
          <div className="space-y-3 mb-4 p-4 bg-black/40 rounded-2xl border border-white/5">
            <input 
              type="text" 
              placeholder="Título del Disco" 
              value={newAlbum.title}
              onChange={e => setNewAlbum({...newAlbum, title: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-emerald-500"
            />
            <div className="grid grid-cols-1 gap-2">
              <input 
                type="text" 
                placeholder="Año" 
                value={newAlbum.year}
                onChange={e => setNewAlbum({...newAlbum, year: e.target.value})}
                className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-emerald-500"
              />
              <input 
                type="url" 
                placeholder="URL Portada del Disco" 
                value={newAlbum.coverUrl}
                onChange={handleAlbumCoverUrlChange}
                className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-emerald-500"
              />
            </div>
            <input 
              type="url" 
              placeholder="Link para escuchar (Spotify/YT)" 
              value={newAlbum.listenUrl}
              onChange={e => setNewAlbum({...newAlbum, listenUrl: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-xs outline-none focus:border-emerald-500"
            />
            <button type="button" onClick={addAlbum} className="w-full py-2 bg-white text-black font-bold rounded-xl text-xs hover:bg-emerald-500 hover:text-white transition-all">
              Agregar Disco
            </button>
          </div>
          <div className="space-y-2">
            {form.discography?.map((album, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-black overflow-hidden">
                    {album.coverUrl && <img src={album.coverUrl} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt={album.title} />}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{album.title}</p>
                    <p className="text-[10px] text-white/40">{album.year}</p>
                  </div>
                </div>
                <button type="button" onClick={() => removeAlbum(i)} className="text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          {isEditing && (
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white/5 text-white font-bold py-4 rounded-2xl hover:bg-white/10 transition-all border border-white/10"
            >
              Cancelar
            </button>
          )}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-[2] bg-emerald-500 text-black font-bold py-4 rounded-2xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Perfil' : 'Publicar Perfil de Artista'}
          </button>
        </div>
      </div>
    </form>
  );
};
