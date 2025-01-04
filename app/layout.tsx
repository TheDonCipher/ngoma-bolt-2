import './globals.css';
    import type { Metadata } from 'next';
    import { Inter } from 'next/font/google';
    import { ThemeProvider } from '@/components/providers/theme-provider';
    import { Web3Provider } from '@/components/providers/web3-provider';
    import { AudioProvider } from '@/components/providers/audio-provider';
    import { BadgeProvider } from '@/components/providers/badge-provider';
    import { Toaster } from '@/components/ui/toaster';
    import { MainNav } from '@/components/layout/main-nav';
    import { ErrorBoundary } from '@/components/shared/error-boundary';
    import { ServiceWorker } from '@/components/shared/service-worker';
    import dynamic from 'next/dynamic';

    const inter = Inter({ subsets: ['latin'] });

    const AudioPlayer = dynamic(() => import('@/components/player/audio-player'), {
      ssr: false,
      loading: () => <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t animate-pulse" />,
    });

    export const metadata: Metadata = {
      title: 'Afrobeats NFT - Web3 Music Platform',
      description: 'Discover and collect unique music NFTs from African artists',
      manifest: '/manifest.json',
      themeColor: '#6366f1',
    };

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en" suppressHydrationWarning>
          <head>
            <meta name="application-name" content="Afrobeats NFT" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Afrobeats NFT" />
            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />
            <link rel="apple-touch-icon" href="/icons/icon-192.png" />
          </head>
          <body className={inter.className}>
            <ThemeProvider attribute="class" defaultTheme="dark">
              <Web3Provider>
                <AudioProvider>
                  <BadgeProvider>
                    <ErrorBoundary>
                      <div className="min-h-screen flex flex-col">
                        <MainNav />
                        <main className="flex-1">
                          {children}
                        </main>
                        <AudioPlayer />
                      </div>
                      <Toaster />
                    </ErrorBoundary>
                  </BadgeProvider>
                </AudioProvider>
              </Web3Provider>
            </ThemeProvider>
            <ServiceWorker />
          </body>
        </html>
      );
    }
