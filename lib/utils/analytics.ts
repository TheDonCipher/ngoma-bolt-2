type EventName = 
  | "page_view"
  | "nft_purchase"
  | "track_play"
  | "album_view"
  | "artist_follow"
  | "search";

interface EventProperties {
  [key: string]: string | number | boolean;
}

export function trackEvent(name: EventName, properties?: EventProperties) {
  if (typeof window === "undefined") return;

  try {
    // Google Analytics
    if (window.gtag && process.env.NEXT_PUBLIC_GA_TRACKING_ID) {
      window.gtag("event", name, properties);
    }

    // Add other analytics providers here
  } catch (error) {
    console.error("Analytics Error:", error);
  }
}

export function trackPageView(url: string) {
  trackEvent("page_view", { url });
}

export function trackNFTPurchase(tokenId: string, price: number) {
  trackEvent("nft_purchase", { tokenId, price });
}

export function trackTrackPlay(trackId: string, artistId: string) {
  trackEvent("track_play", { trackId, artistId });
}
