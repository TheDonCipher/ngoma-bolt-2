import { render, screen, fireEvent } from '@testing-library/react';
import { AudioPlayer } from '@/components/player/audio-player';
import { usePlayerStore } from '@/lib/store/use-player-store';

jest.mock('@/lib/store/use-player-store');

describe('AudioPlayer', () => {
  const mockTrack = {
    id: '1',
    title: 'Test Track',
    artist: {
      name: 'Test Artist',
      image: 'https://example.com/image.jpg',
    },
    duration: 180,
    previewUrl: 'https://example.com/track.mp3',
  };

  beforeEach(() => {
    (usePlayerStore as jest.Mock).mockReturnValue({
      currentTrack: mockTrack,
      isPlaying: false,
      volume: 1,
      playbackProgress: 0,
      setIsPlaying: jest.fn(),
      setVolume: jest.fn(),
    });
  });

  it('renders track information', () => {
    render(<AudioPlayer />);
    expect(screen.getByText('Test Track')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('toggles play/pause', () => {
    const setIsPlaying = jest.fn();
    (usePlayerStore as jest.Mock).mockReturnValue({
      currentTrack: mockTrack,
      isPlaying: false,
      volume: 1,
      playbackProgress: 0,
      setIsPlaying,
    });

    render(<AudioPlayer />);
    fireEvent.click(screen.getByRole('button', { name: /play/i }));
    expect(setIsPlaying).toHaveBeenCalledWith(true);
  });
});
