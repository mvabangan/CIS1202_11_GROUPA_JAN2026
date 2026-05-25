const projectId = globalThis.SANITY_PROJECT_ID || '';

if (!projectId) {
  console.warn('SANITY_PROJECT_ID is not set. Add the real Sanity project ID before fetching live CMS data.');
}

export const sanityConfig = {
  projectId,
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: true,
};

let clientPromise;

async function getClient() {
  if (!clientPromise) {
    clientPromise = import('https://cdn.skypack.dev/@sanity/client').then(({ createClient }) => {
      return createClient(sanityConfig);
    });
  }

  return clientPromise;
}

export const client = {
  async fetch(query, params = {}) {
    if (!projectId) {
      throw new Error('Missing Sanity project ID. Set globalThis.SANITY_PROJECT_ID before loading the page.');
    }

    const sanityClient = await getClient();
    return sanityClient.fetch(query, params);
  },
};

export async function fetchSanity(query, params = {}) {
  return client.fetch(query, params);
}
