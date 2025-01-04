import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchBar } from '@/components/search/search-bar';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: () => new URLSearchParams(),
}));

describe('SearchBar', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should update URL with search query', async () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test query' } });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('q=test+query'));
    });
  });

  it('should show suggestions when typing', async () => {
    render(<SearchBar />);
    
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });
});
