const GLOBAL_SANITY_CONFIG = {
  projectId: 'ltk0qh4a',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
};

const sanityClientGlobal = globalThis.SanityClient;

if (!sanityClientGlobal || typeof sanityClientGlobal.createClient !== 'function') {
  throw new Error('SanityClient global is missing. Load the Sanity UMD script before js/home.js.');
}

// Initialize the client using the globally loaded SanityClient library
const { createClient } = sanityClientGlobal;

// Attach the client to the global window object so all team scripts can access it
window.coopSanityClient = createClient(GLOBAL_SANITY_CONFIG);
window.fetchSanity = function fetchSanity(query, params = {}) {
  return window.coopSanityClient.fetch(query, params);
};
