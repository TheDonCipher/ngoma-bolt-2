import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectWalletButton } from '@/components/web3/connect-wallet-button';
import { useAddress } from '@thirdweb-dev/react';

jest.mock('@thirdweb-dev/react', () => ({
  useAddress: jest.fn(),
  ConnectWallet: ({ children }: { children: React.ReactNode }) => (
    <button>{children}</button>
  ),
}));

describe('ConnectWalletButton', () => {
  it('renders connect button when not connected', () => {
    (useAddress as jest.Mock).mockReturnValue(null);
    render(<ConnectWalletButton />);
    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument();
  });

  it('handles connection', () => {
    const mockAddress = '0x123';
    (useAddress as jest.Mock).mockReturnValue(mockAddress);
    render(<ConnectWalletButton />);
    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument();
  });
});
