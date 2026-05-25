import client from './sanity-config.js';

const container = document.getElementById('investments-container');

const GROQ_QUERY = `*[_type == "service"]{
  name,
  description
}`;

function displayServices(services) {
  return services
    .map(
      (service) => `
        <div class="card card-accent service-card">
          <div class="card-header">
            <h3>${service.name ?? 'Investment Service'}</h3>
          </div>
          <div class="card-body">
            <p>${service.description ?? ''}</p>
          </div>
        </div>
      `
    )
    .join('');
}

async function fetchInvestments() {
  if (!container) return;

  try {
    const services = await client.fetch(GROQ_QUERY);

    if (!services || services.length === 0) {
      container.innerHTML =
        '<p class="loading">No investment services are available at this time. Please check back later.</p>';
      return;
    }

    container.innerHTML = displayServices(services);
  } catch (error) {
    console.error('Error fetching investment services:', error);
    container.innerHTML =
      '<p class="loading">Unable to load investment services at this time. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', fetchInvestments);
