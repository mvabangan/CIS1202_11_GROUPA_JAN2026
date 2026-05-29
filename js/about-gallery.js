/* ── SANITY CLIENT PIPELINE CONFIGURATION ── */
const SANITY_CONFIG = {
  projectId: "ltk0qh4a",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
};

// GROQ Query targeted directly at your official "timeline" schema definitions
const GALLERY_QUERY = `*[_type == "timeline" && defined(mainImage)] | order(eventDate desc) {
  _id,
  title,
  category,
  eventDate,
  description,
  keyMetric,
  mainImage
}`;

// Dictionary helper mapping your schema's stored string values to pretty display text
const CATEGORY_MAP = {
  'operational': 'Operational',
  'financial': 'Financial',
  'social': 'Social Impact',
  'digital': 'Digital Transformation'
};

/* ── APPLICATION STATE MANAGEMENT ── */
let MASTER_PHOTOS_REPOS = [];
let CATEGORIES = ['All'];
let activeCategory = 'All';
let currentIndex = 0;
let filteredPhotos = [];
let urlFor = null;

/* ── SYSTEM INITIALIZATION FRAMEWORK ── */
document.addEventListener("DOMContentLoaded", () => {
  const { createClient } = globalThis.SanityClient;
  const client = createClient(SANITY_CONFIG);
  
  const builder = globalThis.SanityImageUrlBuilder(client);
  urlFor = (source) => builder.image(source);

  loadGalleryFromTimeline(client);
  setupKeyboardNavigationEngine();
});

/* ── ASYNC NETWORK PIPELINE DATA RECOVERY ── */
async function loadGalleryFromTimeline(client) {
  const statusEl = document.getElementById("fetch-status");
  const totalCountEl = document.getElementById('total-count');
  
  try {
    const rawData = await client.fetch(GALLERY_QUERY);
    MASTER_PHOTOS_REPOS = Array.isArray(rawData) ? rawData.filter(Boolean) : [];

    if (!MASTER_PHOTOS_REPOS.length) {
      statusEl.textContent = "A look into the historical milestones and moments that bring the Green Valley Cooperative community together.";
      if (totalCountEl) totalCountEl.textContent = "0";
      renderGallery();
      return;
    }

    statusEl.textContent = "A window into the events, milestones, and moments that bring the Green Valley Cooperative community together.";
    if (totalCountEl) totalCountEl.textContent = MASTER_PHOTOS_REPOS.length;

    // Extract dynamic categories based on what items exist in the timeline feed
    const rawCategories = [...new Set(MASTER_PHOTOS_REPOS.map(p => p.category).filter(Boolean))];
    const mappedCategories = rawCategories.map(cat => CATEGORY_MAP[cat] || cat);
    CATEGORIES = ['All', ...mappedCategories];

    setupFilterControlTabs();
    renderGallery();

  } catch (err) {
    statusEl.textContent = "Error loading images from database archive timeline layers.";
    console.error("Sanity data pull failed:", err);
  }
}

/* ── ARCHITECTURAL UI GENERATION FUNCTIONS ── */
function setupFilterControlTabs() {
  const filterBtnsEl = document.getElementById('filter-btns');
  if (!filterBtnsEl) return;

  filterBtnsEl.innerHTML = '';
  CATEGORIES.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === activeCategory ? ' active' : '');
    btn.textContent = cat;
    btn.onclick = () => {
      activeCategory = cat;
      document.querySelectorAll('.filter-btn').forEach(b =>
        b.classList.toggle('active', b.textContent === cat)
      );
      renderGallery();
    };
    filterBtnsEl.appendChild(btn);
  });
}

function renderGallery() {
  // Filter items matching against standard categorical string conversions
  filteredPhotos = activeCategory === 'All'
    ? MASTER_PHOTOS_REPOS
    : MASTER_PHOTOS_REPOS.filter(p => (CATEGORY_MAP[p.category] || p.category) === activeCategory);

  const filterCountEl = document.getElementById('filter-count');
  if (filterCountEl) {
    filterCountEl.textContent = `${filteredPhotos.length} photo${filteredPhotos.length !== 1 ? 's' : ''}`;
  }

  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  if (filteredPhotos.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 40px;">
        <p style="color: var(--text-muted);">No images found in this category layer.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filteredPhotos.map((p, i) => {
    const gridImgUrl = p.mainImage ? urlFor(p.mainImage).width(600).height(450).fit("crop").url() : '';
    const cleanDate = p.eventDate ? new Date(p.eventDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent';
    const displayTag = CATEGORY_MAP[p.category] || p.category || 'General';

    return `
      <div class="gallery-item" style="animation-delay:${i * .05}s" onclick="openLightbox(${i})">
        <div class="gallery-photo" style="height:210px; background-color:#f4f6f4; position:relative;">
          ${gridImgUrl ? `<img src="${gridImgUrl}" alt="${p.title || 'Timeline Event'}" style="width:100%; height:100%; object-fit:cover;">` : ''}
          <div class="gallery-overlay">
            <div class="gallery-overlay-text">
              <div class="overlay-event">${p.title || 'Untitled Event'}</div>
              <div class="overlay-date">${cleanDate}</div>
            </div>
            <div class="overlay-zoom">🔍</div>
          </div>
        </div>
        <div class="gallery-caption">
          <div class="caption-event">${p.title || 'Untitled Event'}</div>
          <div class="caption-meta">
            <span>${cleanDate}</span>
            <span class="caption-tag">${displayTag}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ── LIGHTBOX ENGAGEMENT CONTROLS ── */
function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  const lightboxEl = document.getElementById('lightbox');
  if (lightboxEl) lightboxEl.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightboxEl = document.getElementById('lightbox');
  if (lightboxEl) lightboxEl.classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightboxOnBg(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

function navigateLightbox(dir) {
  currentIndex = Math.max(0, Math.min(filteredPhotos.length - 1, currentIndex + dir));
  renderLightbox();
  
  const inner = document.getElementById('lightbox-inner');
  if (inner) {
    inner.style.animation = 'none';
    inner.offsetHeight; // Reset CSS layout animation cycle 
    inner.style.animation = 'lbIn .2s ease';
  }
}

function renderLightbox() {
  const p = filteredPhotos[currentIndex];
  if (!p) return;

  const lbPhoto = document.getElementById('lb-photo');
  const lbTag = document.getElementById('lb-tag');
  const lbTitle = document.getElementById('lb-title');
  const lbDesc = document.getElementById('lb-desc');
  const lbMeta = document.getElementById('lb-meta');
  const btnPrev = document.getElementById('lb-prev');
  const btnNext = document.getElementById('lb-next');

  if (lbPhoto && p.mainImage) {
    const fullSizeImgUrl = urlFor(p.mainImage).width(1200).height(800).fit("max").url();
    lbPhoto.innerHTML = `<img src="${fullSizeImgUrl}" alt="${p.title}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:4px;">`;
  }
  
  const cleanDate = p.eventDate ? new Date(p.eventDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent';

  if (lbTag) lbTag.textContent = CATEGORY_MAP[p.category] || p.category || 'General';
  if (lbTitle) lbTitle.textContent = p.title || 'Untitled Event';
  
  // Combine description text with optional key highlights
  let finalDescription = p.description || 'No detailed log entry provided.';
  if (p.keyMetric) {
    finalDescription += ` (Highlight: ${p.keyMetric})`;
  }
  if (lbDesc) lbDesc.textContent = finalDescription;
  
  if (lbMeta) {
    lbMeta.innerHTML = `
      <span>📅 ${cleanDate}</span>
      <span>📍 Cooperative Archive</span>
    `;
  }
  
  if (btnPrev) btnPrev.disabled = currentIndex === 0;
  if (btnNext) btnNext.disabled = currentIndex === filteredPhotos.length - 1;
}

function setupKeyboardNavigationEngine() {
  document.addEventListener('keydown', e => {
    const lightboxEl = document.getElementById('lightbox');
    if (!lightboxEl || !lightboxEl.classList.contains('open')) return;
    
    if (e.key === 'ArrowLeft')  navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'Escape')     closeLightbox();
  });
}