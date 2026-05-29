import { client } from './sanity-config.js';

const faqList = document.getElementById('faqList');
const inquiryForm = document.getElementById('customerInquiryForm');
const inquirySuccess = document.getElementById('inquirySuccess');

const attachFaqToggleEvents = () => {
  if (!faqList) return;
  const faqItems = faqList.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    if (!button) return;
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      item.classList.toggle('open');
    });
  });
};

const renderFaqItems = (items) => {
  if (!faqList) return;

  if (!items || items.length === 0) {
    faqList.innerHTML = '<p class="faq-empty">No FAQ items are currently available. Please check back soon.</p>';
    return;
  }

  faqList.innerHTML = items
    .map(
      ({ question, answer }) => `
        <article class="faq-item">
          <button class="faq-question" aria-expanded="false">
            <span>${question}</span>
            <span class="faq-toggle">+</span>
          </button>
          <div class="faq-answer">
            <p>${answer}</p>
          </div>
        </article>
      `
    )
    .join('');

  attachFaqToggleEvents();
};

const loadFaqs = async () => {
  if (!faqList) return;

  try {
    const faqItems = await client.fetch(`*[_type == "faqItem"]{question, answer}`);
    renderFaqItems(faqItems);
  } catch (error) {
    console.error('Sanity FAQ fetch failed:', error);
    faqList.innerHTML = '<p class="faq-error">Unable to load FAQs at this time. Please try again later.</p>';
  }
};

const resetFormState = () => {
  inquirySuccess.hidden = true;
};

inquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('customerName').value.trim();
  const email = document.getElementById('customerEmail').value.trim();
  const type = document.getElementById('inquiryType').value;
  const subject = document.getElementById('inquirySubject').value.trim();
  const message = document.getElementById('inquiryMessage').value.trim();

  if (!name || !email || !type || !subject || !message) {
    alert('Please fill in all required fields before submitting.');
    return;
  }

  inquirySuccess.hidden = false;
  inquirySuccess.querySelector('p').textContent = `Thank you, ${name}! Your inquiry about "${subject}" is submitted. Our support team will contact you at ${email}.`;
  inquiryForm.reset();
});

['input', 'change'].forEach((eventType) => {
  inquiryForm.addEventListener(eventType, resetFormState);
});

loadFaqs();
