# @entro314labs/entro-astro

Astro integration for [Entrolytics](https://entrolytics.click) - First-party growth analytics for the edge.

## Installation

```bash
npm install @entro314labs/entro-astro
# or
pnpm add @entro314labs/entro-astro
```

## Quick Start

```ts
// astro.config.mjs
import { defineConfig } from 'astro/config';
import entrolytics from '@entro314labs/entro-astro';

export default defineConfig({
  integrations: [
    entrolytics({
      websiteId: 'your-website-id',
    }),
  ],
});
```

That's it! The integration automatically injects the tracking script and handles View Transitions.

## Configuration Options

```ts
entrolytics({
  // Required: Your Entrolytics website ID
  websiteId: 'your-website-id',

  // Optional: Custom host (for self-hosted instances)
  host: 'https://entrolytics.click',

  // Optional: Auto-track page views (default: true)
  autoTrack: true,

  // Optional: Track outbound link clicks (default: true)
  trackOutboundLinks: true,

  // Optional: Track file downloads (default: false)
  trackFileDownloads: false,

  // Optional: Respect Do Not Track (default: false)
  respectDnt: false,

  // Optional: Cross-domain tracking
  domains: ['example.com', 'blog.example.com'],
});
```

## Manual Event Tracking

For tracking custom events in your Astro components:

```astro
---
// In your Astro component
---

<script>
  // Track a button click
  document.getElementById('my-button').addEventListener('click', () => {
    if (window.entrolytics) {
      window.entrolytics.track('button_click', {
        button_id: 'hero-cta',
        page: window.location.pathname
      });
    }
  });
</script>

<button id="my-button">Click me</button>
```

### Using the Client Module

```astro
---
import { trackEvent } from '@entro314labs/entro-astro/client';
---

<script>
  import { trackEvent, identify } from '@entro314labs/entro-astro/client';

  // Track events
  trackEvent('signup_click', { plan: 'pro' });

  // Identify users
  identify('user-123', { email: 'user@example.com' });
</script>
```

## View Transitions Support

The integration automatically works with Astro's View Transitions. Page views are re-tracked on each navigation.

## TypeScript

Full TypeScript support included:

```ts
import type { EntrolyticsOptions } from '@entro314labs/entro-astro';

const options: EntrolyticsOptions = {
  websiteId: 'your-id',
  trackOutboundLinks: true,
};
```

## License

MIT License - see [LICENSE](LICENSE) file for details.
