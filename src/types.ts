export interface SocialLink {
  platform: string;
  url: string;
}

export interface Album {
  title: string;
  year: string;
  coverUrl: string;
  listenUrl: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  longBio: string;
  country: string;
  imageUrl: string;
  headerUrl: string;
  stripeLink: string;
  socialLinks: SocialLink[];
  discography: Album[];
}

export interface Event {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  date: string;
  location: string;
  description: string;
  imageUrl: string;
}

export interface NowPlaying {
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  streamUrl: string;
}
