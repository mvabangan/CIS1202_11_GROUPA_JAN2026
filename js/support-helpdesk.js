const faqItems = document.querySelectorAll('.faq-item');
const inquiryForm = document.getElementById('customerInquiryForm');
const inquirySuccess = document.getElementById('inquirySuccess');

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isExpanded));
    item.classList.toggle('open');
  });
});

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
