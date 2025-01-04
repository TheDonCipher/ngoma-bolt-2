import { renderHook } from '@testing-library/react';
    import { useWeb3Auth } from '@/lib/hooks/use-web3-auth';
    import { useAddress, useConnectionStatus, useChainId } from '@thirdweb-dev/react';

    jest.mock('@thirdweb-dev/react', () => ({
      useAddress: jest.fn(),
      useConnectionStatus: jest.fn(),
      useChainId: jest.fn(),
      useNetwork: () => ({ chain: { unsupported: false } }),
    }));

    describe('useWeb3Auth', () => {
      it('handles successful connection', () => {
        const mockAddress = '0x123';
        (useAddress as jest.Mock).mockReturnValue(mockAddress);
        (useConnectionStatus as jest.Mock).mockReturnValue('connected');

        const { result } = renderHook(() => useWeb3Auth());

        expect(result.current.isConnected).toBe(true);
        expect(result.current.isConnecting).toBe(false);
      });

      it('handles disconnected state', () => {
        (useAddress as jest.Mock).mockReturnValue(null);
        (useConnectionStatus as jest.Mock).mockReturnValue('disconnected');

        const { result } = renderHook(() => useWeb3Auth());

        expect(result.current.isConnected).toBe(false);
        expect(result.current.isDisconnected).toBe(true);
      });

      it('handles unsupported network', () => {
        const mockAddress = '0x123';
        (useAddress as jest.Mock).mockReturnValue(mockAddress);
        (useConnectionStatus as jest.Mock).mockReturnValue('connected');
        jest.mock('@thirdweb-dev/react', () => ({
          useAddress: jest.fn(),
          useConnectionStatus: jest.fn(),
          useChainId: jest.fn(),
          useNetwork: () => ({ chain: { unsupported: true } }),
        }));

        const { result } = renderHook(() => useWeb3Auth());

        expect(result.current.isConnected).toBe(true);
      });
    });
