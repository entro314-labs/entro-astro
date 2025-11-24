/**
 * Client-side tracking functions for Astro components
 *
 * @example
 * ```astro
 * ---
 * import { trackEvent } from '@entro314labs/entro-astro/client';
 * ---
 *
 * <button onclick={`(${trackEvent})('button_click', { id: 'hero-cta' })`}>
 *   Click me
 * </button>
 * ```
 */

declare global {
  interface Window {
    entrolytics?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
      identify: (userId: string, traits?: Record<string, unknown>) => void;
    };
  }
}

/**
 * Track a custom event
 *
 * Can be used inline in onclick handlers or called from client-side scripts
 */
export function trackEvent(eventName: string, eventData?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const tryTrack = () => {
    if (window.entrolytics) {
      window.entrolytics.track(eventName, eventData);
    } else {
      setTimeout(tryTrack, 100);
    }
  };

  tryTrack();
}

/**
 * Identify a user for logged-in tracking
 */
export function identify(userId: string, traits?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  const tryIdentify = () => {
    if (window.entrolytics) {
      window.entrolytics.identify(userId, traits);
    } else {
      setTimeout(tryIdentify, 100);
    }
  };

  tryIdentify();
}

/**
 * Track a page view manually
 * Useful when using View Transitions or client-side routing
 */
export function trackPageView(url?: string, referrer?: string): void {
  if (typeof window === 'undefined') return;

  const tryTrack = () => {
    if (window.entrolytics) {
      window.entrolytics.track('pageview', {
        url: url || window.location.pathname,
        referrer: referrer || document.referrer,
      });
    } else {
      setTimeout(tryTrack, 100);
    }
  };

  tryTrack();
}

// For inline script usage - attach to window
if (typeof window !== 'undefined') {
  (window as Window & { entrolyticsClient?: typeof import('./client') }).entrolyticsClient = {
    trackEvent,
    identify,
    trackPageView,
  };
}
