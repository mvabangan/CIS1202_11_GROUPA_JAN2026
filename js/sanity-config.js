// ===========================
// SANITY CMS CLIENT CONFIGURATION
// ===========================

// Sanity client using ES modules
export const sanityConfig = {
  projectId: 'YOUR_PROJECT_ID', // Replace with your actual Sanity project ID
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
};

// Initialize and export Sanity client
export const client = {
  fetch: async (query, params = {}) => {
    const url = new URL(
      `https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/query/${sanityConfig.dataset}`
    );

    // Add query parameters
    url.searchParams.set('query', query);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Sanity fetch error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result;
  },
};

export default client;
