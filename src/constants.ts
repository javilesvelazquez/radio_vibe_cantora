import { Artist, Event } from './types';

export const ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Natalia Lafourcade',
    bio: 'Cantautora mexicana, una de las voces más importantes de la música latinoamericana contemporánea.',
    longBio: 'Natalia Lafourcade es una cantante, compositora, productora musical, arreglista, diseñadora y activista mexicana. En su trayectoria ha ganado 28 premios Grammy Latinos y 3 premios Grammy, lo que la convierte en la mujer con más Grammys Latinos en la historia. Su música fusiona el pop con el folklore mexicano y latinoamericano, creando un sonido único que ha resonado en todo el mundo.',
    country: 'México',
    imageUrl: 'https://picsum.photos/seed/natalia/400/400',
    headerUrl: 'https://picsum.photos/seed/natalia-header/1200/400',
    stripeLink: 'https://buy.stripe.com/mock_natalia',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/natalialafourcade' },
      { platform: 'Spotify', url: 'https://open.spotify.com/artist/1u7zHbqS7v937vYpC9696V' },
      { platform: 'Youtube', url: 'https://youtube.com/natalialafourcade' }
    ],
    discography: [
      { title: 'De Todas las Flores', year: '2022', coverUrl: 'https://picsum.photos/seed/album-dtlf/300/300', listenUrl: '#' },
      { title: 'Un Canto por México', year: '2020', coverUrl: 'https://picsum.photos/seed/album-ucpm/300/300', listenUrl: '#' },
      { title: 'Musas', year: '2017', coverUrl: 'https://picsum.photos/seed/album-musas/300/300', listenUrl: '#' },
      { title: 'Hasta la Raíz', year: '2015', coverUrl: 'https://picsum.photos/seed/album-hlr/300/300', listenUrl: '#' }
    ]
  },
  {
    id: '2',
    name: 'Jorge Drexler',
    bio: 'Cantautor uruguayo radicado en España, ganador del Oscar y múltiples Latin Grammys.',
    longBio: 'Jorge Drexler es un músico, médico y actor uruguayo, ganador del premio Óscar a la mejor canción original en 2004 por "Al otro lado del río". Su obra se caracteriza por letras poéticas y una experimentación sonora que mezcla ritmos rioplatenses con electrónica y pop. Es reconocido por su capacidad de narrar historias complejas a través de canciones aparentemente sencillas.',
    country: 'Uruguay/España',
    imageUrl: 'https://picsum.photos/seed/drexler/400/400',
    headerUrl: 'https://picsum.photos/seed/drexler-header/1200/400',
    stripeLink: 'https://buy.stripe.com/mock_drexler',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/jorgedrexler' },
      { platform: 'Spotify', url: 'https://open.spotify.com/artist/41v39696V' },
      { platform: 'Twitter', url: 'https://twitter.com/drexlerjorge' }
    ],
    discography: [
      { title: 'Tinta y Tiempo', year: '2022', coverUrl: 'https://picsum.photos/seed/album-tyt/300/300', listenUrl: '#' },
      { title: 'Salvavidas de Hielo', year: '2017', coverUrl: 'https://picsum.photos/seed/album-sdh/300/300', listenUrl: '#' },
      { title: 'Bailar en la Cueva', year: '2014', coverUrl: 'https://picsum.photos/seed/album-belc/300/300', listenUrl: '#' }
    ]
  },
  {
    id: '3',
    name: 'Silvana Estrada',
    bio: 'Nueva voz del folk mexicano con una sensibilidad única.',
    longBio: 'Silvana Estrada es una cantante y compositora mexicana. Su música se caracteriza por el uso del cuatro venezolano y una voz poderosa que evoca la tradición del folklore latinoamericano con una frescura contemporánea. Ha colaborado con artistas como Natalia Lafourcade y Jorge Drexler, consolidándose como una de las artistas más prometedoras de su generación.',
    country: 'México',
    imageUrl: 'https://picsum.photos/seed/silvana/400/400',
    headerUrl: 'https://picsum.photos/seed/silvana-header/1200/400',
    stripeLink: 'https://buy.stripe.com/mock_silvana',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/silvanaestradab' },
      { platform: 'Spotify', url: 'https://open.spotify.com/artist/silvana' }
    ],
    discography: [
      { title: 'Marchita', year: '2022', coverUrl: 'https://picsum.photos/seed/album-marchita/300/300', listenUrl: '#' },
      { title: 'Lo Sagrado', year: '2017', coverUrl: 'https://picsum.photos/seed/album-ls/300/300', listenUrl: '#' }
    ]
  },
  {
    id: '4',
    name: 'Rozalén',
    bio: 'Cantautora española comprometida con causas sociales y el folklore.',
    longBio: 'María de los Ángeles Rozalén Ortuño, conocida artísticamente como Rozalén, es una cantautora y compositora española. Es una de las principales voces de la nueva canción de autor en España y una importante activista social. Sus conciertos son inclusivos, contando siempre con una intérprete de lengua de signos en el escenario.',
    country: 'España',
    imageUrl: 'https://picsum.photos/seed/rozalen/400/400',
    headerUrl: 'https://picsum.photos/seed/rozalen-header/1200/400',
    stripeLink: 'https://buy.stripe.com/mock_rozalen',
    socialLinks: [
      { platform: 'Instagram', url: 'https://instagram.com/rozalenmusic' },
      { platform: 'Spotify', url: 'https://open.spotify.com/artist/rozalen' }
    ],
    discography: [
      { title: 'El Árbol y el Bosque', year: '2020', coverUrl: 'https://picsum.photos/seed/album-eayb/300/300', listenUrl: '#' },
      { title: 'Cuando el Río Suena...', year: '2017', coverUrl: 'https://picsum.photos/seed/album-cers/300/300', listenUrl: '#' }
    ]
  }
];

export const EVENTS: Event[] = [
  {
    id: '1',
    title: 'De Todas las Flores Tour',
    artistId: '1',
    artistName: 'Natalia Lafourcade',
    date: '2026-05-15T20:00:00Z',
    location: 'Auditorio Nacional, CDMX',
    description: 'Presentación oficial de su último álbum en un concierto íntimo y poderoso.',
    imageUrl: 'https://picsum.photos/seed/concert1/800/400'
  },
  {
    id: '2',
    title: 'Tinta y Tiempo en Vivo',
    artistId: '2',
    artistName: 'Jorge Drexler',
    date: '2026-06-10T21:00:00Z',
    location: 'Teatro Real, Madrid',
    description: 'Un recorrido por su discografía y las nuevas canciones de Tinta y Tiempo.',
    imageUrl: 'https://picsum.photos/seed/concert2/800/400'
  }
];
