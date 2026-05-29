/* ── SANITY CONNECTION CONFIGURATION ── */
const SANITY_CONFIG = {
  projectId: "ltk0qh4a", // Using project ID provided in your base sanity reference
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
};

// GROQ query customized for your specific professor 'director' schema schema rules
const BOD_QUERY = `*[_type == "director"] | order(_createdAt asc) {
  name,
  role,
  image,
  message,
  education
}`;

/* ── DOM INITIALIZATION LAYER ── */
document.addEventListener('DOMContentLoaded', () => {
  const { createClient } = globalThis.SanityClient;
  const client = createClient(SANITY_CONFIG);
  
  // Initialize Image URL Builders for dynamic image handling
  const builder = globalThis.SanityImageUrlBuilder(client);
  const urlFor = (source) => builder.image(source);

  fetchBoardData(client, urlFor);
});

/* ── DATA PROCESSING ENGINE ── */
async function fetchBoardData(client, urlFor) {
  const statusEl = document.getElementById("fetch-status");
  const chairmanSection = document.getElementById("chairman-section");
  const chairmanCard = document.getElementById("chairman-card");
  const bodGrid = document.getElementById("bod-grid");

  try {
    statusEl.textContent = "Loading Board of Directors records...";
    const rawData = await client.fetch(BOD_QUERY);
    const directors = Array.isArray(rawData) ? rawData.filter(Boolean) : [];

    if (!directors.length) {
      statusEl.textContent = "Meet the elected leaders who govern Green Valley Cooperative with integrity.";
      bodGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No leadership records found.</p>`;
      return;
    }

    // Reset components for render injection
    statusEl.textContent = "Meet the elected leaders who govern Green Valley Cooperative with integrity, accountability, and deep commitment to our members.";
    bodGrid.innerHTML = "";
    
    let boardMembersList = [];

    directors.forEach((director) => {
      // Clean education payload (handles either a string raw input or complex schema mapping)
      let eduText = "";
      if (Array.isArray(director.education)) {
        eduText = director.education.map(e => e.degree || e.school || "").filter(Boolean).join(", ");
      } else if (typeof director.education === 'string') {
        eduText = director.education;
      }

      // Check if this director is the Chairman/Chairperson
      const isChair = director.role.toLowerCase().includes("chair");

      if (isChair && chairmanCard) {
        // Render Dynamic Spotlight Section
        chairmanSection.style.display = "block";
        chairmanCard.innerHTML = `
          <div class="chairman-avatar">
            ${director.image ? `<img src="${urlFor(director.image).width(200).height(200).fit("crop").url()}" alt="${director.name}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : '👨‍💼'}
          </div>
          <div class="chairman-info">
            <div class="chairman-role">${director.role}</div>
            <div class="chairman-name">${director.name}</div>
            ${eduText ? `<div class="chairman-edu">🎓 ${eduText}</div>` : ''}
            ${director.message ? `<div class="chairman-quote">"${director.message}"</div>` : ''}
          </div>
        `;
      } else {
        // Collect regular directors for the loop grid layout matrix block
        boardMembersList.push({ ...director, calculatedEdu: eduText });
      }
    });

    // Render remaining Board Members into Cards Grid Layout
    if (bodGrid) {
      bodGrid.innerHTML = boardMembersList.map((m, i) => `
        <div class="bod-card" style="animation: fadeUp .45s ease both; animation-delay:${.05 + i * .07}s">
          <div class="bod-card-top"></div>
          <div class="bod-avatar-wrap">
            ${m.image ? `<img src="${urlFor(m.image).width(150).height(150).fit("crop").url()}" alt="${m.name}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">` : '👤'}
          </div>
          <div class="bod-card-body">
            <div class="bod-role-tag">${m.role}</div>
            <div class="bod-name">${m.name}</div>
            ${m.calculatedEdu ? `
              <div class="bod-edu">
                <span>🎓</span>
                <div>${m.calculatedEdu}</div>
              </div>` : ''}
          </div>
        </div>
      `).join('');
    }

  } catch (err) {
    statusEl.textContent = "Error sync-loading server profiles. Check dev console.";
    console.error("Sanity pull exception error caught:", err);
  }
}