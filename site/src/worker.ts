// Worker entry point. Requests for files that exist are served from the
// static assets and never reach this code. Everything that does reach it is
// a path with no page, so it is answered with the 404 page, and each one is
// recorded in Workers Logs.
//
// The path is rewritten to /404/ before Astro sees it, so Astro answers with
// the 404 page straight away instead of first redirecting to add a trailing
// slash. A route that later needs live code must be routed here explicitly.
import { handle } from '@astrojs/cloudflare/handler';

export default {
  fetch(request, env, ctx) {
    const url = new URL(request.url);
    url.pathname = '/404/';
    url.search = '';
    return handle(new Request(url, request), env, ctx);
  },
} satisfies ExportedHandler<Env>;
