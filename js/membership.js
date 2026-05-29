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

  /* ── Animate a counter from 0 → target ── */
  function animateCount(el, target, duration = 1600) {
    const start    = performance.now();
    const from     = 0;
    const update   = (now) => {
      const elapsed = now - start;
      const progress= Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased   = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(from + (target - from) * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ── Update the stat widget on the page ── */
  async function loadMemberCount() {
    const countEl = document.getElementById("member-count");
    if (!countEl) return;

    try {
      const count = await window.coopSanityClient.fetch(MEMBER_COUNT_QUERY);
      animateCount(countEl, typeof count === "number" ? count : 0);
    } catch (err) {
      console.error("[membership.js] Failed to load member count:", err);
      if (countEl) countEl.textContent = "—";
    }
  }

  /* ── Tab switching for membership types ── */
  function initTabs() {
    const tabBtns   = document.querySelectorAll(".tab-btn[data-tab]");
    const tabPanels = document.querySelectorAll(".tab-panel[data-tab]");
    if (!tabBtns.length) return;

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;

        tabBtns.forEach((b)   => b.classList.toggle("active", b === btn));
        tabPanels.forEach((p) => {
          p.hidden = p.dataset.tab !== target;
          p.style.display = p.dataset.tab === target ? "" : "none";
        });
      });
    });

    // Activate first tab by default
    tabBtns[0]?.click();
  }

  /* ── Accordion for FAQ-style rows (optional, if page uses them) ── */
  function initAccordions() {
    const headers = document.querySelectorAll(".accordion-header");
    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const body    = header.nextElementSibling;
        const isOpen  = header.classList.contains("open");

        // Close all
        document.querySelectorAll(".accordion-header.open").forEach((h) => {
          h.classList.remove("open");
          h.nextElementSibling.style.maxHeight = "0";
        });

        // Toggle clicked
        if (!isOpen) {
          header.classList.add("open");
          body.style.maxHeight = body.scrollHeight + "px";
        }
      });
    });
  }

  /* ── Bootstrap ── */
  loadMemberCount();
  initTabs();
  initAccordions();
