import client from './sanity-config.js';

const timeline = document.getElementById('history-timeline');

const HISTORY_QUERY = `*[_type == "historyEvent"] | order(year asc) {
  year,
  title,
  description
}`;

function renderTimeline(events) {
  return events
    .map(
      (event) => `
        <article class="timeline-item card">
          <span class="timeline-year">${event.year ?? '—'}</span>
          <h3>${event.title ?? 'Milestone'}</h3>
          <p>${event.description ?? ''}</p>
        </article>
      `
    )
    .join('');
}

async function loadHistory() {
  if (!timeline) return;

  try {
    const events = await client.fetch(HISTORY_QUERY);

    if (!events || events.length === 0) {
      timeline.innerHTML =
        '<p class="loading">No history events are available yet. Please check back later.</p>';
      return;
    }

    timeline.innerHTML = renderTimeline(events);
  } catch (error) {
    console.error('Error fetching history timeline:', error);
    timeline.innerHTML =
      '<p class="loading">Unable to load history at this time. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadHistory);
