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

  /* ── GROQ: services whose name matches the co-op store ──────────────
   *  The schema notes name example is "Coop Mart".
   *  Using GROQ's match operator so "Coop Mart", "CoopMart", "Coop"
   *  variants all resolve correctly regardless of exact casing.
   * ─────────────────────────────────────────────────────────────────── */
  const SERVICE_QUERY = `
    *[_type == "service" && lower(name) match "coop*"] | order(name asc) {
      _id,
      name,
      description,
      icon
    }
  `;

  /* ── DOM references ── */
  const gridEl   = document.getElementById("coopmart-grid");
  const statusEl = document.getElementById("coopmart-status");
  const searchEl = document.getElementById("coopmart-search");
  const countEl  = document.getElementById("service-count");

  /* ── Skeleton placeholders while loading ── */
  function showSkeletons(n = 6) {
    if (!gridEl) return;
    gridEl.innerHTML = Array.from({ length: n }, () => `
      <div class="card skeleton" aria-hidden="true">
        <div class="skeleton-img"></div>
        <div class="skeleton-line" style="width:70%"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line" style="width:40%; margin-bottom:18px"></div>
      </div>
    `).join("");
  }

  /* ── Emoji placeholder when no icon image ── */
  function createPlaceholder(name) {
    const div = document.createElement("div");
    div.className = "card-img-placeholder";
    const label = name.toLowerCase();
    div.textContent =
      label.includes("food")  ? "🍱" :
      label.includes("agri")  ? "🌾" :
      label.includes("loan")  ? "💰" :
      label.includes("insur") ? "🛡️" :
      label.includes("health")? "🏥" :
      "🛒";
    return div;
  }

  /* ── Render a single service card ── */
  function renderCard(item) {
    // Schema: name (string, required), description (text), icon (image)
    const name        = (item.name        || "Unnamed Service").trim();
    const description = (item.description || "").trim();

    const card = document.createElement("article");
    card.className    = "card";
    card.dataset.name = name.toLowerCase();  // used for client-side search

    // Icon image or emoji fallback
    if (item.icon) {
      const img     = document.createElement("img");
      img.className = "card-img";
      img.alt       = name;
      img.loading   = "lazy";
      img.src       = urlFor(item.icon).width(560).height(360).fit("crop").url();
      img.onerror   = () => { img.replaceWith(createPlaceholder(name)); };
      card.appendChild(img);
    } else {
      card.appendChild(createPlaceholder(name));
    }

    // Body
    const body    = document.createElement("div");
    body.className = "card-body";

    const badge       = document.createElement("span");
    badge.className   = "card-badge";
    badge.textContent = "CoopMart";

    const h3       = document.createElement("h3");
    h3.textContent = name;

    body.appendChild(badge);
    body.appendChild(h3);

    if (description) {
      const p       = document.createElement("p");
      p.textContent = description.length > 120
        ? description.slice(0, 120).trimEnd() + "…"
        : description;
      body.appendChild(p);
    }

    card.appendChild(body);
    return card;
  }

  /* ── Client-side search filter ── */
  let allItems = [];

  function filterCards(query) {
    const q      = query.trim().toLowerCase();
    const cards  = gridEl?.querySelectorAll(".card[data-name]");
    let visible  = 0;

    cards?.forEach((card) => {
      const match = !q || card.dataset.name.includes(q);
      card.style.display = match ? "" : "none";
      if (match) visible++;
    });

    const emptyEl = document.getElementById("coopmart-empty");
    if (emptyEl) emptyEl.hidden = visible > 0;

    if (countEl) countEl.textContent = q
      ? `${visible} result${visible !== 1 ? "s" : ""}`
      : `${allItems.length} item${allItems.length !== 1 ? "s" : ""}`;
  }

  /* ── Main fetch ── */
  async function loadServices() {
    showSkeletons(6);
    if (statusEl) statusEl.textContent = "Loading…";

    try {
      const data = await client.fetch(SERVICE_QUERY);
      allItems   = Array.isArray(data) ? data.filter(Boolean) : [];

      if (!gridEl) return;
      gridEl.innerHTML = "";

      if (!allItems.length) {
        if (statusEl) statusEl.textContent = "";
        gridEl.innerHTML = `
          <div class="state-msg" id="coopmart-empty">
            <p>No CoopMart services found.</p>
          </div>`;
        return;
      }

      if (statusEl) statusEl.textContent = "";
      if (countEl)  countEl.textContent  =
        `${allItems.length} item${allItems.length !== 1 ? "s" : ""}`;

      allItems.forEach((item) => gridEl.appendChild(renderCard(item)));

      // Hidden empty-state node for search
      const emptyDiv     = document.createElement("div");
      emptyDiv.className = "state-msg";
      emptyDiv.id        = "coopmart-empty";
      emptyDiv.hidden    = true;
      emptyDiv.innerHTML = "<p>No items match your search.</p>";
      gridEl.after(emptyDiv);

    } catch (err) {
      console.error("[coopmart.js] Failed to load services:", err);
      if (statusEl) statusEl.textContent = "Could not load items. Check console.";
      if (gridEl)   gridEl.innerHTML = "";
    }
  }

  /* ── Wire search input ── */
  if (searchEl) {
    let timer;
    searchEl.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => filterCards(searchEl.value), 220);
    });
  }

  /* ── Bootstrap ── */
  loadServices();
