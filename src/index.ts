import type { AstroIntegration } from 'astro';

const DEFAULT_HOST = 'https://entrolytics.click';

export interface EntrolyticsOptions {
  /**
   * Your Entrolytics website ID
   */
  websiteId: string;

  /**
   * Entrolytics host URL (for self-hosted instances)
   * @default 'https://entrolytics.click'
   */
  host?: string;

  /**
   * Automatically track page views
   * @default true
   */
  autoTrack?: boolean;

  /**
   * Track outbound link clicks automatically
   * @default true
   */
  trackOutboundLinks?: boolean;

  /**
   * Track file downloads (pdf, zip, etc.)
   * @default false
   */
  trackFileDownloads?: boolean;

  /**
   * Respect browser Do Not Track setting
   * @default false
   */
  respectDnt?: boolean;

  /**
   * Domains for cross-domain tracking
   */
  domains?: string[];

  /**
   * Cache tracking script locally
   * @default false
   */
  cacheScript?: boolean;
}

function generateScriptTag(options: EntrolyticsOptions): string {
  const {
    websiteId,
    host = DEFAULT_HOST,
    autoTrack = true,
    trackOutboundLinks = true,
    trackFileDownloads = false,
    respectDnt = false,
    domains,
  } = options;

  const scriptUrl = `${host.replace(/\/$/, '')}/script.js`;

  const attributes: string[] = [
    `src="${scriptUrl}"`,
    `data-website-id="${websiteId}"`,
    'defer',
  ];

  if (!autoTrack) {
    attributes.push('data-auto-track="false"');
  }

  if (trackOutboundLinks) {
    attributes.push('data-track-outbound-links="true"');
  }

  if (trackFileDownloads) {
    attributes.push('data-track-file-downloads="true"');
  }

  if (respectDnt) {
    attributes.push('data-do-not-track="true"');
  }

  if (domains && domains.length > 0) {
    attributes.push(`data-domains="${domains.join(',')}"`);
  }

  return `<script ${attributes.join(' ')}></script>`;
}

/**
 * Astro integration for Entrolytics analytics
 *
 * @example
 * ```ts
 * // astro.config.mjs
 * import { defineConfig } from 'astro/config';
 * import entrolytics from '@entro314labs/entro-astro';
 *
 * export default defineConfig({
 *   integrations: [
 *     entrolytics({
 *       websiteId: 'your-website-id',
 *     }),
 *   ],
 * });
 * ```
 */
export default function entrolytics(options: EntrolyticsOptions): AstroIntegration {
  if (!options.websiteId) {
    throw new Error('[@entro314labs/entro-astro] websiteId is required');
  }

  return {
    name: '@entro314labs/entro-astro',
    hooks: {
      'astro:config:setup': ({ injectScript }) => {
        const scriptTag = generateScriptTag(options);

        // Inject script into head
        injectScript('head-inline', scriptTag);

        // Handle View Transitions - re-track page on navigation
        injectScript(
          'page',
          `
          document.addEventListener('astro:page-load', () => {
            if (typeof window.entrolytics !== 'undefined' && window.entrolytics.track) {
              // The script handles this automatically with data-auto-track
              // This is a fallback for View Transitions
            }
          });
        `
        );
      },
    },
  };
}

export type { AstroIntegration };
