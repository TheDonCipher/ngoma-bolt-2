export const mockFeaturedArtists = [
  {
    id: "1",
    name: "Burna Boy",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
    genre: "Afro-fusion",
    totalTracks: 24,
    floorPrice: 0.5,
    previewTrack: "https://example.com/preview1.mp3"
  },
  {
    id: "2",
    name: "Wizkid",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
    genre: "Afrobeats",
    totalTracks: 18,
    floorPrice: 0.8,
    previewTrack: "https://example.com/preview2.mp3"
  },
  {
    id: "3",
    name: "Tems",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
    genre: "Alternative R&B",
    totalTracks: 12,
    floorPrice: 0.3,
    previewTrack: "https://example.com/preview3.mp3"
  }
];

export const mockAlbumData = {
  id: "1",
  title: "African Giant",
  description: "A masterful blend of Afrobeats, dancehall, and hip-hop that showcases the evolution of African music.",
  coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
  price: BigInt("500000000000000000"), // 0.5 ETH
  royaltyFee: 10,
  trackCount: 19,
  releaseDate: new Date("2023-12-01"),
  artist: mockFeaturedArtists[0],
  tracks: [
    {
      id: "1",
      title: "African Giant",
      artist: mockFeaturedArtists[0],
      duration: 234,
      previewUrl: "https://example.com/preview1.mp3",
      price: BigInt("50000000000000000"), // 0.05 ETH
    },
    {
      id: "2",
      title: "Anybody",
      artist: mockFeaturedArtists[0],
      duration: 189,
      previewUrl: "https://example.com/preview2.mp3",
      price: BigInt("50000000000000000"), // 0.05 ETH
    },
    {
      id: "3",
      title: "Killin Dem",
      artist: mockFeaturedArtists[0],
      duration: 216,
      previewUrl: "https://example.com/preview3.mp3",
      price: BigInt("50000000000000000"), // 0.05 ETH
    }
  ]
};
