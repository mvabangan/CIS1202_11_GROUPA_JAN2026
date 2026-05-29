import { renderNavbar } from './navbar.js';

const profileContainer = document.getElementById('profile-content');

const ABOUT_QUERY = `*[_type == "aboutUs"][0]{
  mission,
  vision,
  goals
}`;

function renderGoals(goals) {
  if (!Array.isArray(goals) || goals.length === 0) {
    return '<p class="profile-empty">Goals will be published here once added in Sanity Studio.</p>';
  }

  return `
    <ul class="goals-list">
      ${goals.map((goal) => `<li>${goal}</li>`).join('')}
    </ul>
  `;
}

function renderSection(title, content, emptyMessage) {
  const body = content?.trim()
    ? `<p>${content}</p>`
    : `<p class="profile-empty">${emptyMessage}</p>`;

  return `
    <section class="card card-accent profile-card profile-mvg-card">
      <h2>${title}</h2>
      ${body}
    </section>
  `;
}

function renderProfile(data) {
  const mission = data?.mission ?? '';
  const vision = data?.vision ?? '';
  const goals = data?.goals ?? [];

  return `
    <div class="profile-mvg-grid">
      ${renderSection(
        'Mission',
        mission,
        'Mission statement will be published here once added in Sanity Studio.'
      )}
      ${renderSection(
        'Vision',
        vision,
        'Vision statement will be published here once added in Sanity Studio.'
      )}
      <section class="card card-accent profile-card profile-mvg-card">
        <h2>Goals</h2>
        ${renderGoals(goals)}
      </section>
    </div>
  `;
}

async function loadProfile() {
  if (!profileContainer) return;

  try {
    if (!window.coopSanityClient) {
      throw new Error('Sanity client not loaded. Include sanity-config.js after the Sanity UMD script.');
    }

    const data = await window.coopSanityClient.fetch(ABOUT_QUERY);

    if (!data) {
      profileContainer.innerHTML =
        '<p class="loading">No About Us document found. Add an <strong>aboutUs</strong> entry in Sanity Studio.</p>';
      return;
    }

    profileContainer.innerHTML = renderProfile(data);
  } catch (error) {
    console.error('Error fetching about us content:', error);
    profileContainer.innerHTML =
      '<p class="loading">Unable to load profile at this time. Please try again later.</p>';
  }
}

function initPage() {
  renderNavbar();
  loadProfile();
}

document.addEventListener('DOMContentLoaded', initPage);
