const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

function renderNavbar(mountPoint = '#site-header') {
  const target = document.querySelector(mountPoint) || document.body;

  target.innerHTML = `
    <header class="site-header">
      <div class="container navbar" role="navigation" aria-label="Primary">
        <a class="navbar__brand" href="#home">Cooperative</a>
        <ul class="navbar__links">
          ${NAV_ITEMS.map((item) => `<li><a href="${item.href}">${item.label}</a></li>`).join('')}
        </ul>
      </div>
    </header>
  `;
}

window.renderNavbar = renderNavbar;
