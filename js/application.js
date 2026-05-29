// Handle Form Submission Logic
document.getElementById('membershipForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('fullName').value;
    
    alert(`Thank you, ${name}! Your membership application has been submitted successfully.`);
    this.reset();
});

// =============================================================
// Standalone Page Bootstrapper (Handles Navbar & Footer Render)
// =============================================================
function initApplicationPage() {
    // 1. Render the team navbar inside your layout slot
    if (typeof window.renderNavbar === 'function') {
        window.renderNavbar('#site-header');
    }
    
    // 2. Render your dynamic database footer layout
    if (typeof window.loadGlobalFooter === 'function') {
        window.loadGlobalFooter();
    }
}

// Safely execute when the HTML DOM layout is completely loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApplicationPage, { once: true });
} else {
    initApplicationPage();
}