export interface Artist {
  id: string;
  name: string;
  image: string;
  genre: string;
  totalTracks: number;
  floorPrice: number;
  previewTrack: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  price: bigint;
  royaltyFee: number;
  trackCount: number;
  releaseDate: Date;
  artist: Artist;
}

export interface Track {
  id: string;
  title: string;
  artist: Artist;
  duration: number;
  previewUrl: string;
  price: bigint;
  albumId?: string;
}
