const currentPage = window.location.pathname.split('/').pop() || 'index.html';

const navLinks = [
  { href: 'index.html', label: 'Home' },
  { href: currentPage === 'index.html' ? '#about' : 'index.html#about', label: 'About' },
  { href: currentPage === 'index.html' ? '#services' : 'index.html#services', label: 'Services' },
  { href: 'support-calculator.html', label: 'Loan Calculator' },
  { href: 'support-helpdesk.html', label: 'Help Desk' },
  { href: currentPage === 'index.html' ? '#contact' : 'index.html#contact', label: 'Contact' },
];

const renderNav = () => {
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (!navPlaceholder) return;

  const navHtml = `
    <nav aria-label="Main Navigation">
      <div class="container">
        <div class="nav-brand">Cooperative</div>
        <ul class="nav-links">
          ${navLinks
            .map(
              (link) => `
            <li>
              <a href="${link.href}">${link.label}</a>
            </li>`
            )
            .join('')}
        </ul>
      </div>
    </nav>
  `;

  navPlaceholder.innerHTML = navHtml;
};

renderNav();
