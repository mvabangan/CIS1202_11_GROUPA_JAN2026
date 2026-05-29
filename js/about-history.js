import { renderNavbar } from './navbar.js';

const timelineEl = document.getElementById('history-timeline');

const TIMELINE_QUERY = `*[_type == "timeline"] | order(eventDate desc) {
  eventDate,
  title,
  category,
  description,
  keyMetric
}`;

const CATEGORY_LABELS = {
  operational: 'Operational',
  financial: 'Financial',
  social: 'Social / Member Impact',
  digital: 'Digital Transformation',
};

function formatEventDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderTimeline(events) {
  return events
    .map((event) => {
      const categoryLabel = event.category
        ? CATEGORY_LABELS[event.category] ?? event.category
        : '';

      return `
        <article class="timeline-item card">
          <span class="timeline-year">${formatEventDate(event.eventDate)}</span>
          ${categoryLabel ? `<span class="timeline-category">${categoryLabel}</span>` : ''}
          <h3>${event.title ?? 'Milestone'}</h3>
          ${event.keyMetric ? `<p class="timeline-metric"><strong>${event.keyMetric}</strong></p>` : ''}
          ${event.description ? `<p>${event.description}</p>` : ''}
        </article>
      `;
    })
    .join('');
}

async function loadHistory() {
  if (!timelineEl) return;

  try {
    if (!window.coopSanityClient) {
      throw new Error('Sanity client not loaded. Include sanity-config.js after the Sanity UMD script.');
    }

    const events = await window.coopSanityClient.fetch(TIMELINE_QUERY);

    if (!events || events.length === 0) {
      timelineEl.innerHTML =
        '<p class="loading">No history events are available yet. Please check back later.</p>';
      return;
    }

    timelineEl.innerHTML = renderTimeline(events);
  } catch (error) {
    console.error('Error fetching history timeline:', error);
    timelineEl.innerHTML =
      '<p class="loading">Unable to load history at this time. Please try again later.</p>';
  }
}

function initPage() {
  renderNavbar();
  loadHistory();
}

document.addEventListener('DOMContentLoaded', initPage);
