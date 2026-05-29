 /* ── MOCK DATA ── */
  const FEATURED = {
    icon: '🥇',
    tag: 'Most Recent · 2024',
    name: 'Outstanding Cooperative of the Year — VISAYAS',
    body: 'Awarded by the Cooperative Development Authority (CDA) in recognition of exceptional governance, financial stability, and sustained community development programs serving over 4,200 active members.',
    pills: ['CDA National Awards 2024', 'Governance Category', 'VISAYAS Regional Winner'],
  };

  const STATS = [
    { num: '18', lbl: 'Total Awards' },
    { num: '2006', lbl: 'First Recognition' },
    { num: '9', lbl: 'National Awards' },
    { num: '2024', lbl: 'Most Recent' },
  ];

  const AWARDS = [
    { year: '2023', icon: '🏅', name: 'Best in Financial Management', body: 'Recognized for maintaining a clean audit record and exemplary financial reporting practices.', org: 'Cooperative Development Authority', gold: false },
    { year: '2023', icon: '🌟', name: 'Gawad Parangal — Livelihood Programs', body: 'Acknowledged for income-generating projects that lifted 120 member families above the poverty line.', org: 'DOLE Regional Office IV-A', gold: true },
    { year: '2022', icon: '🏆', name: 'Top 10 Most Productive Cooperatives', body: 'Placed 7th among all cooperatives in CALABARZON for net surplus and member patronage.', org: 'Confederation of Cooperatives (NATCCO)', gold: false },
    { year: '2022', icon: '🌱', name: 'Green Cooperative Award', body: 'Honored for sustainable farming partnerships and zero-waste CoopMart operations.', org: 'DENR & DA Joint Program', gold: false },
    { year: '2021', icon: '🤝', name: 'Excellence in Member Services', body: 'Commended for launching the 24/7 digital loan application system and member hotline.', org: 'Philippine Federation of Credit Cooperatives', gold: true },
    { year: '2020', icon: '🛡️', name: 'Resilience Award — COVID Response', body: 'Recognized for providing emergency assistance, livelihood kits, and loan moratoriums during the pandemic.', org: 'LGU — Municipal Government', gold: false },
    { year: '2019', icon: '📊', name: 'Cooperative Governance Award', body: 'Cited for transparent annual general assemblies and participatory policy-making practices.', org: 'Cooperative Development Authority', gold: true },
    { year: '2018', icon: '🎓', name: 'Best Cooperative Education Program', body: 'Awarded for the PMES curriculum enhancement and scholarship fund for members\' dependents.', org: 'TESDA & CDA Joint Citation', gold: false },
    { year: '2016', icon: '🌾', name: 'Agri-Cooperative of the Year', body: 'Honored for integrating smallholder farmers into the supply chain and tripling their income.', org: 'Department of Agriculture', gold: false },
  ];

  /* ── RENDER STATS BAR ── */
  document.getElementById('stats-bar').innerHTML = STATS.map(s => `
    <div class="stat-item">
      <div class="stat-num">${s.num}</div>
      <div class="stat-lbl">${s.lbl}</div>
    </div>`).join('');

  /* ── RENDER FEATURED AWARD ── */
  document.getElementById('featured-wrap').innerHTML = `
    <div class="featured-award" style="margin-bottom:56px">
      <div class="feat-icon">${FEATURED.icon}</div>
      <div class="feat-body">
        <div class="feat-tag">${FEATURED.tag}</div>
        <div class="feat-name">${FEATURED.name}</div>
        <div class="feat-body-text">${FEATURED.body}</div>
        <div class="feat-meta">${FEATURED.pills.map(p => `<span class="feat-pill">${p}</span>`).join('')}</div>
      </div>
    </div>`;

  /* ── RENDER AWARDS GRID ── */
  document.getElementById('awards-grid').innerHTML = AWARDS.map((a, i) => `
    <div class="award-card ${a.gold ? 'gold-card' : ''}" style="animation-delay:${i * .06}s">
      <div class="award-icon">${a.icon}</div>
      <div class="award-year">${a.year}</div>
      <div class="award-name">${a.name}</div>
      <div class="award-body">${a.body}</div>
      <div class="award-org">${a.org}</div>
    </div>`).join('');