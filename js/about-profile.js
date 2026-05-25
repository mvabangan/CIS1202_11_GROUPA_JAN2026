import client from './sanity-config.js';

const profileContainer = document.getElementById('profile-content');

const PROFILE_QUERY = `*[_type == "companyProfile"][0]{
  cooperativeName,
  tagline,
  mission,
  vision,
  goals
}`;

function renderProfile(data) {
  const name = data.cooperativeName ?? 'Our Cooperative';
  const tagline = data.tagline ?? '';
  const mission = data.mission ?? '';
  const vision = data.vision ?? '';
  const goals = data.goals ?? '';

  const cards = [];

  if (tagline || name) {
    cards.push(`
      <section class="card profile-summary profile-card">
        <h2>${name}</h2>
        ${tagline ? `<p>${tagline}</p>` : ''}
      </section>
    `);
  }

  if (mission) {
    cards.push(`
      <section class="card card-accent profile-card">
        <h2>Mission</h2>
        <p>${mission}</p>
      </section>
    `);
  }

  if (vision) {
    cards.push(`
      <section class="card card-accent profile-card">
        <h2>Vision</h2>
        <p>${vision}</p>
      </section>
    `);
  }

  if (goals) {
    cards.push(`
      <section class="card card-accent profile-card">
        <h2>Goals</h2>
        <p>${goals}</p>
      </section>
    `);
  }

  return cards.join('');
}

async function loadProfile() {
  if (!profileContainer) return;

  try {
    const data = await client.fetch(PROFILE_QUERY);

    if (!data || (!data.mission && !data.vision && !data.goals && !data.tagline)) {
      profileContainer.innerHTML =
        '<p class="loading">Profile information is not available yet. Please check back later.</p>';
      return;
    }

    profileContainer.innerHTML = renderProfile(data);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    profileContainer.innerHTML =
      '<p class="loading">Unable to load profile at this time. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadProfile);
