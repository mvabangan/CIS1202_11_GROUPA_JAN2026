const CHAIRMAN = {
  name: 'Mary Veronica Abangan',
  role: 'Chairman of the Board',
  edu: 'BSIT, University of San Carlos',
  quote: 'A cooperative thrives not on capital alone, but on the collective will of its members to build something greater than themselves.',
  emoji: '👩‍💼'
};

const BOARD_MEMBERS = [
  { name: 'June Jayson Culanag', role: 'Vice-Chairman', edu: 'BS Information Technology, University of San Carlos', term: 'Term: 2023–2026', emoji: '👨‍💼' },
  { name: 'Margarette Christel Balbuena', role: 'Secretary', edu: 'BS Information Technology, University of San Carlos', term: 'Term: 2023–2026', emoji: '👩‍💼' },
  { name: 'Hersheay Gayl Abao', role: 'Treasurer', edu: 'BS Information Technology, University of San Carlos', term: 'Term: 2024–2027', emoji: '👩‍💼' },
  { name: 'John Carl Ecija Bautista', role: 'Director', edu: 'BS Information Technology, University of San Carlos', term: 'Term: 2024–2027', emoji: '👨‍💼' },
  { name: 'Dave Adriane Hera', role: 'Director', edu: 'BS Information Technology, University of San Carlos', term: 'Term: 2022–2025', emoji: '👨‍💼' },
  { name: 'John Carlo Loberiano', role: 'Director', edu: 'BS Information Technology, University of San Carlos', term: 'Term: 2022–2025', emoji: '👨‍💼' },
];

document.addEventListener('DOMContentLoaded', () => {

  const chairmanCard = document.getElementById('chairman-card');
  if (chairmanCard) {
    chairmanCard.innerHTML = `
      <div class="chairman-avatar">${CHAIRMAN.emoji}</div>
      <div class="chairman-info">
        <div class="chairman-role">${CHAIRMAN.role}</div>
        <div class="chairman-name">${CHAIRMAN.name}</div>
        <div class="chairman-edu">${CHAIRMAN.edu}</div>
        <div class="chairman-quote">${CHAIRMAN.quote}</div>
      </div>
    `;
  }

  const bodGrid = document.getElementById('bod-grid');
  if (bodGrid) {
    bodGrid.innerHTML = BOARD_MEMBERS.map((m, i) => `
      <div class="bod-card" style="animation: fadeUp .45s ease both; animation-delay:${.05 + i * .07}s">
        <div class="bod-card-top"></div>
        <div class="bod-avatar-wrap">${m.emoji}</div>
        <div class="bod-card-body">
          <div class="bod-role-tag">${m.role}</div>
          <div class="bod-name">${m.name}</div>
          <div class="bod-edu">${m.edu}</div>
          <div class="bod-term">${m.term}</div>
        </div>
      </div>
    `).join('');
  }

});