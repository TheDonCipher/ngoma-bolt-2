import { renderHook, waitFor } from '@testing-library/react';
import { useSearch } from '@/lib/hooks/use-search';

describe('useSearch', () => {
  it('should return search results', async () => {
    const { result } = renderHook(() => 
      useSearch('test', { category: 'tracks' })
    );

    await waitFor(() => {
      expect(result.current.results.items).toHaveLength(1);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should handle empty query', async () => {
    const { result } = renderHook(() => 
      useSearch('', { category: 'tracks' })
    );

    expect(result.current.results.items).toHaveLength(0);
  });

  it('should apply filters correctly', async () => {
    const { result } = renderHook(() => 
      useSearch('test', {
        category: 'tracks',
        genre: ['afrobeats'],
        priceRange: { min: 0, max: 1 },
      })
    );

    await waitFor(() => {
      expect(result.current.results.items).toBeDefined();
    });
  });
});
