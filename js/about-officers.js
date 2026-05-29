const DEPARTMENTS = [
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Top management responsible for overall cooperative strategy and direction.',
    officers: [
      { name: 'Mary Veronica Abangan', role: 'General Manager', edu: 'MBA, Ateneo de Manila University', since: 'Since 2018', badge: 'Executive', emoji: '👩‍💼' },
      { name: 'June Jayson Culanag', role: 'Deputy General Manager', edu: 'BS Management, DLSU', since: 'Since 2020', badge: 'Executive', emoji: '👨‍💼' },
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    desc: 'Manages financial records, member accounts, and audit compliance.',
    officers: [
      { name: 'John Carl Ecija Bautista', role: 'Finance Manager', edu: 'BS Accountancy, UST', since: 'Since 2019', badge: 'Finance', emoji: '👨‍💼' },
      { name: 'Margarette Christel Balbuena', role: 'Chief Accountant', edu: 'BS Accountancy, PLM', since: 'Since 2021', badge: 'Finance', emoji: '👩‍💼' },
    ]
  },
  {
    id: 'operations',
    name: 'Operations',
    desc: 'Oversees CoopMart, loan processing, and member services delivery.',
    officers: [
      { name: 'Hersheay Gayl Abao', role: 'Operations Manager', edu: 'BS Industrial Eng., UPLB', since: 'Since 2017', badge: 'Operations', emoji: '👩‍💼' },

    ]
  },
  {
    id: 'hr',
    name: 'HR & Admin',
    desc: 'Handles staffing, member education, and administrative compliance.',
    officers: [
      { name: 'Dave Adriane Hera', role: 'HR Manager', edu: 'BS Psychology, AdMU', since: 'Since 2019', badge: 'HR & Admin', emoji: '👨‍💼' },
      { name: 'John Carlo Loberiano', role: 'Administrative Officer', edu: 'BS Public Admin, DLSUD', since: 'Since 2023', badge: 'HR & Admin', emoji: '👨‍💼' },
    ]
  },
];

document.addEventListener('DOMContentLoaded', () => {
  const tabsEl = document.getElementById('dept-tabs');
  const sectionsEl = document.getElementById('dept-sections');

  if (!tabsEl || !sectionsEl) return;

  DEPARTMENTS.forEach((dept, i) => {
    // Generate Navigation Category Controls
    const btn = document.createElement('button');
    btn.className = 'dept-tab' + (i === 0 ? ' active' : '');
    btn.textContent = dept.name;
    btn.onclick = () => switchDept(dept.id);
    tabsEl.appendChild(btn);

    // Generate Layout Section Modules
    const sec = document.createElement('div');
    sec.className = 'dept-section' + (i === 0 ? ' visible' : '');
    sec.id = 'dept-' + dept.id;
    sec.innerHTML = `
      <div class="dept-header">
        <div>
          <h2>${dept.name} Department</h2>
          <p>${dept.desc}</p>
        </div>
        <div class="officer-count">${dept.officers.length}<span>officers</span></div>
      </div>
      <div class="officers-list">
        ${dept.officers.map((o, j) => `
          <div class="officer-row" style="animation-delay:${j * .07}s">
            <div class="officer-emoji">${o.emoji}</div>
            <div class="officer-info">
              <div class="officer-name">${o.name}</div>
              <div class="officer-role">${o.role}</div>
              <div class="officer-edu">🎓 ${o.edu}</div>
            </div>
            <div class="officer-meta">
              <div class="officer-since">${o.since}</div>
              <div class="officer-badge">${o.badge}</div>
            </div>
          </div>`).join('')}
      </div>`;
    sectionsEl.appendChild(sec);
  });
});

/* ── VIEW SWITCHING AND ANIMATION RE-TRIGGER MECHANISM ── */
function switchDept(id) {
  document.querySelectorAll('.dept-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.dept-tab').forEach((t, i) => {
    t.classList.toggle('active', DEPARTMENTS[i].id === id);
  });
  
  const targetSection = document.getElementById('dept-' + id);
  if (targetSection) {
    targetSection.classList.add('visible');
    
    // Cycle and refresh component rendering frame animations
    targetSection.querySelectorAll('.officer-row').forEach((r, i) => {
      r.style.animation = 'none';
      r.offsetHeight; // Force layout reflow engine sequence
      r.style.animation = `fadeUp .35s ease ${i * .07}s both`;
    });
  }
}