// ==========================================
// GLOBAL SANITY CMS CLIENT CONFIGURATION
// ==========================================

const GLOBAL_SANITY_CONFIG = {
    projectId: "ltk0qh4a",
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: true,
};

// Initialize the client using the globally loaded SanityClient library
const { createClient } = globalThis.SanityClient;

// Attach the client to the global window object so all team scripts can access it
window.coopSanityClient = createClient(GLOBAL_SANITY_CONFIG);