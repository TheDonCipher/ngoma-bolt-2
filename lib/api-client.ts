import { isDevelopment } from "./env";

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const TIMEOUT = 10000; // 10 seconds

    if (!process.env.NEXT_PUBLIC_API_URL && !isDevelopment()) {
      console.error("NEXT_PUBLIC_API_URL environment variable is not set.");
    }

    export async function fetchWithErrorHandling<T>(
      url: string,
      options?: RequestInit
    ): Promise<T> {
      if (isDevelopment()) {
        // Mock API response for development
        console.log(`[MOCK API] Fetching: ${url}`);
        return new Promise((resolve) => {
          setTimeout(() => {
            if (url.includes("/albums/1")) {
              resolve({
                id: "1",
                title: "African Giant",
                description: "A masterful blend of Afrobeats, dancehall, and hip-hop that showcases the evolution of African music.",
                coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
                price: BigInt("500000000000000000"), // 0.5 ETH
                royaltyFee: 10,
                trackCount: 19,
                releaseDate: new Date("2023-12-01"),
                artist: {
                  id: "1",
                  name: "Burna Boy",
                  image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
                  genre: "Afro-fusion",
                  totalTracks: 24,
                  floorPrice: 0.5,
                  previewTrack: "https://example.com/preview1.mp3"
                },
                tracks: [
                  {
                    id: "1",
                    title: "African Giant",
                    artist: {
                      id: "1",
                      name: "Burna Boy",
                      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
                      genre: "Afro-fusion",
                      totalTracks: 24,
                      floorPrice: 0.5,
                      previewTrack: "https://example.com/preview1.mp3"
                    },
                    duration: 234,
                    previewUrl: "https://example.com/preview1.mp3",
                    price: BigInt("50000000000000000"), // 0.05 ETH
                  },
                  {
                    id: "2",
                    title: "Anybody",
                    artist: {
                      id: "1",
                      name: "Burna Boy",
                      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
                      genre: "Afro-fusion",
                      totalTracks: 24,
                      floorPrice: 0.5,
                      previewTrack: "https://example.com/preview1.mp3"
                    },
                    duration: 189,
                    previewUrl: "https://example.com/preview2.mp3",
                    price: BigInt("50000000000000000"), // 0.05 ETH
                  },
                  {
                    id: "3",
                    title: "Killin Dem",
                    artist: {
                      id: "1",
                      name: "Burna Boy",
                      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000",
                      genre: "Afro-fusion",
                      totalTracks: 24,
                      floorPrice: 0.5,
                      previewTrack: "https://example.com/preview1.mp3"
                    },
                    duration: 216,
                    previewUrl: "https://example.com/preview3.mp3",
                    price: BigInt("50000000000000000"), // 0.05 ETH
                  }
                ]
              }
              );
            } else if (url.includes("/artists/featured")) {
              resolve([
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
              ]);
            }
          }, 500);
        }) as T;
      }

      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), TIMEOUT);

        const response = await fetch(`${API_URL}${url}`, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(id);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'API Error');
        }
        return await response.json() as T;
      } catch (error: any) {
        console.error('API Error:', error);
        throw new Error(error.message || 'API Error');
      }
    }
