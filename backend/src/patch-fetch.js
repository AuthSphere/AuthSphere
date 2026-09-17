const isCloudflareWorker =
  typeof caches !== "undefined" || typeof WebSocketPair !== "undefined";

if (isCloudflareWorker) {
  // Cloudflare Workers fetch() throws if cache: "default" is passed.
  // Libraries like axios might pass this by default when using the fetch adapter.
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    if (init && init.cache === "default") {
      init = { ...init };
      delete init.cache;
    }
    return originalFetch(input, init);
  };
}
