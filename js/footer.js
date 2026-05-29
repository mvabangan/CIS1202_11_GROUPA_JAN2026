async function loadGlobalFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;

    // GROQ query targeting the siteSettings schema rules exactly as defined in SCHEMAS.md
    const FOOTER_QUERY = `*[_type == "siteSettings"][0]{
        address,
        contactNumbers,
        emails,
        openingHours,
        socialLinks[]{ platform, url }
    }`;

    let data = null;

    try {
        // 1. Check if the global team client is available and running
        if (window.coopSanityClient && typeof window.coopSanityClient.fetch === 'function') {
            data = await window.coopSanityClient.fetch(FOOTER_QUERY);
        } else {
            // 2. Fallback: Use standard browser fetch to communicate directly with the project database
            // This prevents the script from crashing if individual pages don't load external scripts
            const projectId = "ltk0qh4a";
            const dataset = "production";
            const apiVersion = "2024-01-01";
            const encodedQuery = encodeURIComponent(FOOTER_QUERY);
            const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodedQuery}`;
            
            const response = await fetch(url);
            const result = await response.json();
            data = result.result;
        }
        
        if (!data) {
            console.error("Footer Error: No siteSettings document found in Sanity database.");
            return;
        }

        const phones = (data.contactNumbers || []).map(num => `<li>${num}</li>`).join('');
        const emails = (data.emails || []).map(em => `<li><a href="mailto:${em}" style="color: #FFFDD0;">${em}</a></li>`).join('');
        const socials = (data.socialLinks || []).map(link => `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer" style="color: #FFFDD0; text-decoration: none; margin-right: 12px; font-weight: bold;">
                ${link.platform}
            </a>
        `).join('');

        footerContainer.innerHTML = `
            <footer style="background-color: #23743B; color: #FFFFFF; padding: 40px 24px; font-family: system-ui, sans-serif; margin-top: 60px;">
                <div style="max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 32px;">
                    <div>
                        <h3 style="color: #FFFDD0; font-size: 18px; margin-top: 0;">Our Office</h3>
                        <p style="font-size: 14px; line-height: 1.5;">${data.address || 'Address coming soon from CMS'}</p>
                        <p style="font-size: 14px;"><strong>Hours:</strong> ${data.openingHours || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 style="color: #FFFDD0; font-size: 18px; margin-top: 0;">Contact Us</h3>
                        <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; line-height: 1.6;">
                            ${phones || '<li>No contacts listed</li>'}
                        </ul>
                    </div>
                    <div>
                        <h3 style="color: #FFFDD0; font-size: 18px; margin-top: 0;">Emails</h3>
                        <ul style="list-style: none; padding: 0; margin: 0; font-size: 14px; line-height: 1.6;">
                            ${emails || '<li>No emails listed</li>'}
                        </ul>
                    </div>
                    <div>
                        <h3 style="color: #FFFDD0; font-size: 18px; margin-top: 0;">Socials</h3>
                        <div style="font-size: 14px; margin-top: 8px;">
                            ${socials || 'No links listed'}
                        </div>
                    </div>
                </div>
                <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.2); margin: 30px 0 20px;">
                <div style="text-align: center; font-size: 12px; color: #FFFDD0;">
                    &copy; ${new Date().getFullYear()} Cooperative. All Rights Reserved.
                </div>
            </footer>
        `;
    } catch (error) {
        console.error("Footer could not fetch data from Sanity:", error);
    }
}

// Make the function available globally
window.loadGlobalFooter = loadGlobalFooter;

document.addEventListener('DOMContentLoaded', loadGlobalFooter);