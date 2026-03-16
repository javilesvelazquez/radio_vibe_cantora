import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Artist, Event } from './types';
import { ARTISTS as INITIAL_ARTISTS, EVENTS as INITIAL_EVENTS } from './constants';
import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  setDoc, 
  doc, 
  onSnapshot,
  getDocFromServer,
  deleteDoc
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

interface SiteSettings {
  title: string;
  subtitle: string;
  logoUrl: string;
  heroImageUrl: string;
}

interface DataContextType {
  artists: Artist[];
  events: Event[];
  streamUrl: string;
  siteSettings: SiteSettings;
  loading: boolean;
  firebaseConnected: boolean | null;
  user: User | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  addArtist: (artist: Artist) => Promise<void>;
  updateArtist: (artist: Artist) => Promise<void>;
  deleteArtist: (id: string) => Promise<void>;
  addEvent: (event: Event) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  updateStreamUrl: (url: string) => Promise<void>;
  updateSiteSettings: (settings: SiteSettings) => Promise<void>;
  bootstrapData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [streamUrl, setStreamUrl] = useState<string>("https://stream.zeno.fm/f3d687707q0uv");
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: "CANTORA",
    subtitle: "Sintoniza la esencia de México, Latinoamérica y España. Una estación dedicada a la palabra hecha canción.",
    logoUrl: "",
    heroImageUrl: "https://picsum.photos/seed/cantora-hero/1920/1080?blur=4"
  });
  const [loading, setLoading] = useState(true);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleFirestoreError = useCallback((error: unknown, operationType: OperationType, path: string | null) => {
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
        emailVerified: auth.currentUser?.emailVerified,
        isAnonymous: auth.currentUser?.isAnonymous,
        tenantId: auth.currentUser?.tenantId,
        providerInfo: auth.currentUser?.providerData.map(provider => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }, []);

  const testConnection = useCallback(async () => {
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
      setFirebaseConnected(true);
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration.");
        setFirebaseConnected(false);
      } else {
        setFirebaseConnected(true);
      }
    }
  }, []);

  useEffect(() => {
    testConnection();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribeAuth();
  }, [testConnection]);

  useEffect(() => {
    const unsubArtists = onSnapshot(collection(db, 'artists'), (snapshot) => {
      if (!snapshot.empty) {
        const artistsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Artist));
        setArtists(artistsData);
      } else {
        // Only fallback to initial data if we're sure it's empty and not just loading
        setArtists(INITIAL_ARTISTS);
      }
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'artists'));

    return () => unsubArtists();
  }, [handleFirestoreError]);

  useEffect(() => {
    const unsubEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      if (!snapshot.empty) {
        const eventsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        setEvents(eventsData);
      } else {
        setEvents(INITIAL_EVENTS);
      }
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'events'));

    return () => unsubEvents();
  }, [handleFirestoreError]);

  useEffect(() => {
    const unsubSettings = onSnapshot(doc(db, 'settings', 'stream_url'), (snapshot) => {
      if (snapshot.exists()) {
        setStreamUrl(snapshot.data().value);
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/stream_url'));

    const unsubGeneral = onSnapshot(doc(db, 'settings', 'general'), (snapshot) => {
      if (snapshot.exists()) {
        setSiteSettings(prev => ({ ...prev, ...snapshot.data() }));
      }
    }, (error) => handleFirestoreError(error, OperationType.GET, 'settings/general'));

    return () => {
      unsubSettings();
      unsubGeneral();
    };
  }, [handleFirestoreError]);

  const login = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const addArtist = useCallback(async (artist: Artist) => {
    try {
      const { id, ...data } = artist;
      await addDoc(collection(db, 'artists'), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'artists');
    }
  }, [handleFirestoreError]);

  const updateArtist = useCallback(async (artist: Artist) => {
    try {
      const { id, ...data } = artist;
      await setDoc(doc(db, 'artists', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `artists/${artist.id}`);
    }
  }, [handleFirestoreError]);

  const deleteArtist = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'artists', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `artists/${id}`);
    }
  }, [handleFirestoreError]);

  const addEvent = useCallback(async (event: Event) => {
    try {
      const { id, ...data } = event;
      await addDoc(collection(db, 'events'), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'events');
    }
  }, [handleFirestoreError]);

  const updateEvent = useCallback(async (event: Event) => {
    try {
      const { id, ...data } = event;
      await setDoc(doc(db, 'events', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `events/${event.id}`);
    }
  }, [handleFirestoreError]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `events/${id}`);
    }
  }, [handleFirestoreError]);

  const updateStreamUrl = useCallback(async (url: string) => {
    try {
      await setDoc(doc(db, 'settings', 'stream_url'), { key: 'stream_url', value: url });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/stream_url');
    }
  }, [handleFirestoreError]);

  const updateSiteSettings = useCallback(async (settings: SiteSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/general');
    }
  }, [handleFirestoreError]);

  const bootstrapData = useCallback(async () => {
    try {
      // Bootstrap Artists
      for (const artist of INITIAL_ARTISTS) {
        const { id, ...data } = artist;
        await setDoc(doc(db, 'artists', id), data);
      }
      // Bootstrap Events
      for (const event of INITIAL_EVENTS) {
        const { id, ...data } = event;
        await setDoc(doc(db, 'events', id), data);
      }
      // Bootstrap Stream URL
      await setDoc(doc(db, 'settings', 'stream_url'), { key: 'stream_url', value: "https://stream.zeno.fm/f3d687707q0uv" });
      // Bootstrap General Settings
      await setDoc(doc(db, 'settings', 'general'), {
        title: "CANTORA",
        subtitle: "Sintoniza la esencia de México, Latinoamérica y España. Una estación dedicada a la palabra hecha canción.",
        logoUrl: "",
        heroImageUrl: "https://picsum.photos/seed/cantora-hero/1920/1080?blur=4"
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'bootstrap');
    }
  }, [handleFirestoreError]);

  const value = useMemo(() => ({
    artists, 
    events, 
    streamUrl, 
    siteSettings,
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
    updateSiteSettings,
    bootstrapData
  }), [
    artists, 
    events, 
    streamUrl, 
    siteSettings,
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
    updateSiteSettings,
    bootstrapData
  ]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};
