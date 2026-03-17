import React, { useState } from 'react';
import { useData } from '../DataContext';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, UserPlus, CalendarPlus, CheckCircle2, XCircle, RefreshCw, Bell } from 'lucide-react';
import { Artist, Event } from '../types';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ArtistList } from '../components/admin/ArtistList';
import { EventList } from '../components/admin/EventList';
import { StreamUrlSection } from '../components/admin/StreamUrlSection';
import { ArtistForm } from '../components/admin/ArtistForm';
import { EventForm } from '../components/admin/EventForm';
import { ConfirmDialog } from '../components/admin/ConfirmDialog';
import { SiteSettingsSection } from '../components/admin/SiteSettingsSection';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error';
}

const AdminContent: React.FC = () => {
  const { 
    artists, 
    events, 
    streamUrl, 
    loading, 
    firebaseConnected, 
    user,
    login,
    logout,
    addArtist, 
    updateArtist,
    deleteArtist,
    addEvent, 
    updateEvent,
    deleteEvent,
    updateStreamUrl,
    siteSettings,
    updateSiteSettings,
    bootstrapData
  } = useData();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const handleBootstrap = async () => {
    setIsBootstrapping(true);
    try {
      await bootstrapData();
      addNotification('Datos iniciales cargados exitosamente');
    } catch (error) {
      console.error('Error bootstrapping:', error);
      addNotification('Error al cargar datos iniciales', 'error');
    } finally {
      setIsBootstrapping(false);
    }
  };

  const addNotification = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleArtistSubmit = async (artist: Artist) => {
    setIsSubmitting(true);
    try {
      if (editingArtist) {
        await updateArtist(artist);
        addNotification('Artista actualizado exitosamente');
      } else {
        await addArtist(artist);
        addNotification('Artista agregado exitosamente');
      }
      setEditingArtist(null);
    } catch (error) {
      console.error('Error saving artist:', error);
      addNotification('Error al guardar artista.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEventSubmit = async (event: Event) => {
    setIsSubmitting(true);
    try {
      if (editingEvent) {
        await updateEvent(event);
        addNotification('Evento actualizado exitosamente');
      } else {
        await addEvent(event);
        addNotification('Evento agregado exitosamente');
      }
      setEditingEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
      addNotification('Error al guardar evento.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 p-12 rounded-3xl border border-white/10 max-w-md w-full"
        >
          <Radio size={48} className="text-emerald-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Acceso Restringido</h1>
          <p className="text-white/60 mb-8">Debes iniciar sesión con tu cuenta de administrador para gestionar la radio.</p>
          <button 
            onClick={login}
            className="w-full bg-emerald-500 text-black font-bold py-4 rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2"
          >
            Iniciar Sesión con Google
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="px-4 max-w-5xl mx-auto py-12 pb-32 space-y-12">
      {/* Notifications */}
      <div className="fixed top-20 right-4 z-[110] space-y-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${
                n.type === 'success' ? 'bg-zinc-900 border-emerald-500/20 text-emerald-500' : 'bg-zinc-900 border-red-500/20 text-red-500'
              }`}
            >
              <Bell size={18} />
              <span className="text-sm font-medium">{n.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ConfirmDialog 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tighter mb-2">Panel de Control</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-white/40">Hola, {user.displayName || user.email}</p>
              <button 
                onClick={() => {
                  setConfirmConfig({
                    isOpen: true,
                    title: '¿Cerrar Sesión?',
                    message: '¿Estás seguro de que deseas salir del panel de administración?',
                    onConfirm: logout
                  });
                }} 
                className="text-xs text-emerald-500 hover:underline"
              >
                Cerrar Sesión
              </button>
            </div>
            <button 
              onClick={handleBootstrap}
              disabled={isBootstrapping}
              className="text-xs bg-white/5 hover:bg-white/10 text-white/60 hover:text-white px-3 py-1 rounded-full border border-white/10 transition-all disabled:opacity-50"
            >
              {isBootstrapping ? 'Cargando...' : 'Cargar Datos Iniciales'}
            </button>
          </div>
        </div>
        
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
          firebaseConnected === true ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
          firebaseConnected === false ? 'bg-red-500/10 border-red-500/20 text-red-500' :
          'bg-white/5 border-white/10 text-white/40'
        }`}>
          {firebaseConnected === true ? <CheckCircle2 size={18} /> :
           firebaseConnected === false ? <XCircle size={18} /> :
           <RefreshCw size={18} className="animate-spin" />}
          <span className="text-sm font-medium">
            {firebaseConnected === true ? 'Firebase Conectado' :
             firebaseConnected === false ? 'Error de Conexión' :
             'Verificando Conexión...'}
          </span>
        </div>
      </header>

      <StreamUrlSection currentUrl={streamUrl} onUpdate={updateStreamUrl} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SiteSettingsSection 
          currentSettings={siteSettings} 
          onUpdate={async (settings) => {
            try {
              await updateSiteSettings(settings);
              addNotification('Configuración del sitio actualizada');
            } catch (error) {
              addNotification('Error al actualizar configuración', 'error');
            }
          }} 
        />
        
        {/* Artist Section */}
        <section className="bg-white/5 rounded-3xl p-8 border border-white/5 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="text-emerald-500" />
            <h2 className="text-xl font-bold">{editingArtist ? 'Editar Artista' : 'Agregar Artista'}</h2>
          </div>
          
          <ArtistForm 
            key={editingArtist?.id || 'new'}
            initialData={editingArtist || {}}
            isSubmitting={isSubmitting}
            onSubmit={handleArtistSubmit}
            onCancel={() => setEditingArtist(null)}
            isEditing={!!editingArtist}
          />

          <ArtistList 
            artists={artists}
            onEdit={setEditingArtist}
            onDelete={(id) => {
              setConfirmConfig({
                isOpen: true,
                title: '¿Eliminar Artista?',
                message: 'Esta acción no se puede deshacer y podría afectar a los eventos asociados.',
                onConfirm: () => {
                  deleteArtist(id).catch(() => addNotification('Error al eliminar artista', 'error'));
                }
              });
            }}
          />
        </section>

        {/* Event Section */}
        <section className="bg-white/5 rounded-3xl p-8 border border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <CalendarPlus className="text-emerald-500" />
            <h2 className="text-xl font-bold">{editingEvent ? 'Editar Evento' : 'Agregar Evento'}</h2>
          </div>
          
          <EventForm 
            key={editingEvent?.id || 'new'}
            initialData={editingEvent || {}}
            artists={artists}
            isSubmitting={isSubmitting}
            onSubmit={handleEventSubmit}
            onCancel={() => setEditingEvent(null)}
            isEditing={!!editingEvent}
          />

          <EventList 
            events={events}
            onEdit={setEditingEvent}
            onDelete={(id) => {
              setConfirmConfig({
                isOpen: true,
                title: '¿Eliminar Evento?',
                message: '¿Estás seguro de que deseas eliminar este evento permanentemente?',
                onConfirm: () => {
                  deleteEvent(id).catch(() => addNotification('Error al eliminar evento', 'error'));
                }
              });
            }}
          />
        </section>
      </div>
    </div>
  );
};

export const Admin: React.FC = () => (
  <ErrorBoundary>
    <AdminContent />
  </ErrorBoundary>
);
