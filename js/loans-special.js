import client from './sanity-config.js';

const container = document.getElementById('loans-container');

const GROQ_QUERY = `*[_type == "loan" && loanCategory == "special"]{
  title,
  marketingDescription,
  interestRate,
  maxTerm,
  availability,
  requirements,
  category,
  loanCategory
}`;

function renderRequirements(requirements) {
  if (requirements && requirements.length > 0) {
    return `<ul>${requirements.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  }
  return '<p>No specific requirements required.</p>';
}

function displayLoans(loans) {
  return loans
    .map((loan) => {
      const title = loan.title || 'Standard Loan Option';
      const requirementsHtml = renderRequirements(loan.requirements);

      return `
        <div class="card card-accent loan-card category-${loan.category}">
          <div class="card-header">
            <h3>${title}</h3>
          </div>
          <div class="card-body">
            <p>${loan.marketingDescription ?? ''}</p>
            <p class="rate"><strong>Interest Rate:</strong> ${loan.interestRate ?? 'N/A'}</p>
            <p class="term"><strong>Max Term:</strong> ${loan.maxTerm ?? 'N/A'}</p>
            <p><strong>Availability:</strong> ${loan.availability ?? 'N/A'}</p>
            <div class="loan-requirements">
              <strong>Requirements:</strong>
              ${requirementsHtml}
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

async function fetchSpecialLoans() {
  if (!container) return;

  try {
    const loans = await client.fetch(GROQ_QUERY);

    if (!loans || loans.length === 0) {
      container.innerHTML =
        '<p>No special loan products are available at this time. Please check back later.</p>';
      return;
    }

    container.innerHTML = displayLoans(loans);
  } catch (error) {
    console.error('Error fetching special loans:', error);
    container.innerHTML =
      '<p>Unable to load special loan products at this time. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', fetchSpecialLoans);
