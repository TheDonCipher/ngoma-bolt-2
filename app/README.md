# Frontend Application Structure

## Directory Organization

### `/app`
The main application directory using Next.js 13+ App Router.

```
/app
├── (dashboard)     # Dashboard routes with shared layout
├── albums         # Album details and management
├── dashboard      # Role-specific dashboards (artist, fan, admin)
├── explore        # Music discovery and browsing
├── news          # Platform news and updates
└── globals.css    # Global styles
```

## Implementation Guide

### Component Architecture

1. Smart vs Presentational Components
```tsx
// Smart component example (pages/albums/[id].tsx)
export default function AlbumPage({ params }: { params: { id: string } }) {
  const [album, setAlbum] = useState<Album | null>(null);
  // Data fetching, state management, etc.
  return <AlbumDetails album={album} />;
}

// Presentational component (components/albums/album-details.tsx)
export function AlbumDetails({ album }: { album: Album }) {
  // Pure rendering logic
  return <div>{/* Album UI */}</div>;
}
```

2. Custom Hooks Pattern
```tsx
// hooks/use-album-details.ts
export function useAlbumDetails(id: string) {
  const [album, setAlbum] = useState<Album | null>(null);
  useEffect(() => {
    // Fetch album data
  }, [id]);
  return { album, isLoading, error };
}
```

### State Management

1. Global Player State
```tsx
// store/use-player-store.ts
export const usePlayerStore = create<PlayerStore>((set) => ({
  currentTrack: null,
  setTrack: (track) => set({ currentTrack: track }),
  // Other player actions
}));
```

2. Web3 Integration
```tsx
// hooks/use-web3-auth.ts
export function useWeb3Auth() {
  const address = useAddress();
  // Authentication logic
  return { isConnected, connect, disconnect };
}
```

### Error Handling

1. Error Boundary Implementation
```tsx
// components/error-boundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  // Error UI rendering
}
```

2. API Error Handling
```tsx
// lib/api-client.ts
export async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('API Error');
    return response.json();
  } catch (error) {
    // Error handling logic
  }
}
```

### Performance Optimization

1. Image Optimization
```tsx
// components/optimized-image.tsx
export function OptimizedImage({ src, alt }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
      placeholder="blur"
    />
  );
}
```

2. Dynamic Imports
```tsx
// pages/album/[id].tsx
const AudioPlayer = dynamic(() => import('@/components/audio-player'), {
  loading: () => <PlayerSkeleton />,
  ssr: false,
});
```

### Accessibility Implementation

1. Keyboard Navigation
```tsx
// components/player-controls.tsx
export function PlayerControls() {
  return (
    <button
      onClick={handlePlay}
      onKeyDown={handleKeyPress}
      aria-label="Play"
      tabIndex={0}
    >
      {/* Control UI */}
    </button>
  );
}
```

2. ARIA Labels
```tsx
// components/track-list.tsx
export function TrackList() {
  return (
    <div role="list" aria-label="Track listing">
      {tracks.map(track => (
        <div role="listitem" key={track.id}>
          {/* Track UI */}
        </div>
      ))}
    </div>
  );
}
```

### Testing Strategy

1. Component Testing
```tsx
// __tests__/components/album-card.test.tsx
describe('AlbumCard', () => {
  it('renders album details correctly', () => {
    render(<AlbumCard album={mockAlbum} />);
    expect(screen.getByText(mockAlbum.title)).toBeInTheDocument();
  });
});
```

2. Integration Testing
```tsx
// __tests__/integration/player.test.tsx
describe('Audio Player Integration', () => {
  it('plays selected track', async () => {
    render(<AudioPlayer />);
    // Test player functionality
  });
});
```

### Build & Deployment

1. Environment Configuration
```
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_WEB3_NETWORK=base-sepolia
```

2. Build Optimization
```json
// next.config.js
module.exports = {
  images: {
    domains: ['ipfs.io'],
  },
  webpack: (config) => {
    // Custom webpack configuration
    return config;
  },
};
```
