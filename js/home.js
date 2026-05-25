import { renderNavbar } from './navbar.js';
import { fetchSanity } from './sanity-config.js';

const serviceFallback = [
  {
    _id: 'service-1',
    title: 'Member Support',
    description: 'Practical support services designed to help members grow with confidence.',
    category: 'Core Service',
  },
  {
    _id: 'service-2',
    title: 'Community Programs',
    description: 'Events and initiatives that strengthen collaboration and shared progress.',
    category: 'Community',
  },
  {
    _id: 'service-3',
    title: 'Financial Guidance',
    description: 'Clear, member-friendly guidance that keeps cooperative decisions transparent.',
    category: 'Support',
  },
];

const newsFallback = [
  {
    _id: 'post-1',
    title: 'Growing Together as a Cooperative',
    excerpt: 'A look at how shared ownership creates long-term value for members.',
    publishedAt: new Date().toISOString(),
  },
  {
    _id: 'post-2',
    title: 'New Services for Members',
    excerpt: 'We are expanding support and introducing more resources for the community.',
    publishedAt: new Date().toISOString(),
  },
  {
    _id: 'post-3',
    title: 'Upcoming Community Forum',
    excerpt: 'Join the next forum to share ideas and help guide the cooperative forward.',
    publishedAt: new Date().toISOString(),
  },
];

function formatDate(value) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function buildPageShell() {
  const app = document.querySelector('#app');

  if (!app) {
    return;
  }

  app.innerHTML = `
    <main id="home">
      <section class="hero">
        <div class="container hero__panel">
          <span class="hero__eyebrow">Community-led cooperative</span>
          <h1>Community. Trust. Growth.</h1>
          <p>
            A professional cooperative website foundation built with vanilla HTML, CSS, and JavaScript.
            This experience is designed to feel dependable, warm, and easy to extend.
          </p>
          <div class="hero__actions">
            <a class="btn btn--primary" href="#services">Explore Services</a>
            <a class="btn btn--secondary" href="#news">Latest News</a>
          </div>
        </div>
      </section>

      <section id="about" class="section">
        <div class="container section-heading">
          <h2>Built for Members, Designed for Trust</h2>
          <p>
            Our cooperative focuses on shared progress, open communication, and practical support for every member.
          </p>
        </div>
      </section>

      <section id="services" class="section">
        <div class="container">
          <div class="section-heading">
            <h2>Services Preview</h2>
            <p>Current services pulled from Sanity and presented as clear, reusable cards.</p>
          </div>
          <div id="services-grid" class="grid grid--cards"></div>
        </div>
      </section>

      <section id="news" class="section">
        <div class="container">
          <div class="section-heading">
            <h2>News Preview</h2>
            <p>Latest updates from the cooperative newsroom.</p>
          </div>
          <div id="news-list" class="news-list"></div>
        </div>
      </section>

      <section id="contact" class="section">
        <div class="container">
          <div class="card">
            <span class="card__tag">Contact</span>
            <h3>Ready to connect?</h3>
            <p>Use this foundation for a future contact section, member inquiry form, or support channel.</p>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container">
        <p><strong>Cooperative</strong> - Community. Trust. Growth.</p>
        <p>Built with vanilla HTML, CSS, and JavaScript for a clean, reusable foundation.</p>
      </div>
    </footer>
  `;
}

function renderServices(services) {
  const container = document.querySelector('#services-grid');
  if (!container) return;

  container.innerHTML = services.map((service) => `
    <article class="card">
      <span class="card__tag">${service.category || 'Service'}</span>
      <h3>${service.title || 'Untitled Service'}</h3>
      <p>${service.description || 'No description available.'}</p>
    </article>
  `).join('');
}

function renderNews(posts) {
  const container = document.querySelector('#news-list');
  if (!container) return;

  container.innerHTML = posts.map((post) => `
    <article class="news-item">
      <h3>${post.title || 'Untitled Post'}</h3>
      <p>${post.excerpt || post.summary || 'No excerpt available.'}</p>
      <div class="meta">${post.publishedAt ? formatDate(post.publishedAt) : 'Latest update'}</div>
    </article>
  `).join('');
}

async function loadContent() {
  const serviceQuery = `*[_type == "service"] | order(_createdAt desc)[0...3]{_id, title, description, category}`;
  const postQuery = `*[_type == "post"] | order(publishedAt desc, _createdAt desc)[0...3]{_id, title, "excerpt": coalesce(excerpt, summary), publishedAt}`;

  const [servicesResult, postsResult] = await Promise.allSettled([
    fetchSanity(serviceQuery),
    fetchSanity(postQuery),
  ]);

  renderServices(servicesResult.status === 'fulfilled' ? servicesResult.value : serviceFallback);
  renderNews(postsResult.status === 'fulfilled' ? postsResult.value : newsFallback.slice(0, 3));
}

function initHome() {
  renderNavbar();
  buildPageShell();
  void loadContent();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome, { once: true });
} else {
  initHome();
}
