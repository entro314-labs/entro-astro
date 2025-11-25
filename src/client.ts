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

export interface EventData {
  [key: string]: string | number | boolean | EventData | string[] | number[] | EventData[];
}

declare global {
  interface Window {
    entrolytics?: {
      track: (eventName?: string | object, eventData?: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
    };
  }
}

function waitForTracker(callback: () => void): void {
  if (typeof window === 'undefined') return;

  const tryExecute = () => {
    if (window.entrolytics) {
      callback();
    } else {
      setTimeout(tryExecute, 100);
    }
  };

  tryExecute();
}

/**
 * Track a custom event
 *
 * Can be used inline in onclick handlers or called from client-side scripts
 */
export function trackEvent(eventName: string, eventData?: EventData): void {
  waitForTracker(() => {
    window.entrolytics?.track(eventName, eventData);
  });
}

/**
 * Track revenue event
 *
 * @example
 * ```ts
 * trackRevenue('purchase', 99.99, 'USD', { productId: 'abc123' });
 * ```
 */
export function trackRevenue(
  eventName: string,
  revenue: number,
  currency = 'USD',
  data?: EventData,
): void {
  waitForTracker(() => {
    const eventData: EventData = {
      ...data,
      revenue,
      currency,
    };
    window.entrolytics?.track(eventName, eventData);
  });
}

/**
 * Track outbound link click
 */
export function trackOutboundLink(url: string, data?: EventData): void {
  waitForTracker(() => {
    window.entrolytics?.track('outbound-link-click', {
      ...data,
      url,
    });
  });
}

/**
 * Identify with custom data
 */
export function identify(data: EventData): void {
  waitForTracker(() => {
    window.entrolytics?.identify(data);
  });
}

/**
 * Identify a user by ID for logged-in tracking
 */
export function identifyUser(userId: string, traits?: EventData): void {
  waitForTracker(() => {
    window.entrolytics?.identify({ id: userId, ...traits });
  });
}

/**
 * Track a page view manually
 * Useful when using View Transitions or client-side routing
 */
export function trackPageView(url?: string, referrer?: string): void {
  waitForTracker(() => {
    const payload: Record<string, unknown> = {};
    if (url) payload.url = url;
    if (referrer) payload.referrer = referrer;
    window.entrolytics?.track(payload);
  });
}

// For inline script usage - attach to window
if (typeof window !== 'undefined') {
  (window as Window & { entrolyticsClient?: typeof import('./client') }).entrolyticsClient = {
    trackEvent,
    trackRevenue,
    trackOutboundLink,
    identify,
    identifyUser,
    trackPageView,
  };
}
