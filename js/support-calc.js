const loanTypeSelect = document.getElementById('loanType');
const loanAmountInput = document.getElementById('loanAmount');
const loanTermSelect = document.getElementById('loanTerm');
const customRateGroup = document.getElementById('customRateGroup');
const customRateInput = document.getElementById('customRate');
const calculatorForm = document.getElementById('loanCalculatorForm');
const calculatorResults = document.getElementById('calculatorResults');

const loanRates = {
  regular: 7.25,
  special: 6.75,
  emergency: 8.0,
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
};

const formatPercent = (value) => `${value.toFixed(2)}%`;

const getSelectedRate = () => {
  const type = loanTypeSelect.value;
  if (type === 'custom') {
    const customValue = parseFloat(customRateInput.value);
    return Number.isFinite(customValue) && customValue > 0 ? customValue : null;
  }
  return loanRates[type] || null;
};

const toggleCustomRateField = () => {
  if (loanTypeSelect.value === 'custom') {
    customRateGroup.classList.remove('hidden');
    customRateInput.required = true;
  } else {
    customRateGroup.classList.add('hidden');
    customRateInput.required = false;
    customRateInput.value = '';
  }
};

const renderResults = ({ monthlyPayment, totalPayment, totalInterest, annualRate }) => {
  calculatorResults.innerHTML = `
    <div class="result-row">
      <span>Selected APR</span>
      <strong>${formatPercent(annualRate)}</strong>
    </div>
    <div class="result-row">
      <span>Monthly Payment</span>
      <strong>${formatCurrency(monthlyPayment)}</strong>
    </div>
    <div class="result-row">
      <span>Total Paid</span>
      <strong>${formatCurrency(totalPayment)}</strong>
    </div>
    <div class="result-row">
      <span>Total Interest</span>
      <strong>${formatCurrency(totalInterest)}</strong>
    </div>
  `;
};

const showValidationMessage = (message) => {
  calculatorResults.innerHTML = `<p class="result-note">${message}</p>`;
};

const calculatePayment = (principal, annualRate, years) => {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;
  if (monthlyRate === 0) {
    return principal / months;
  }
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
};

loanTypeSelect.addEventListener('change', toggleCustomRateField);

calculatorForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const principal = parseFloat(loanAmountInput.value);
  const years = parseInt(loanTermSelect.value, 10);
  const annualRate = getSelectedRate();

  if (!Number.isFinite(principal) || principal <= 0) {
    showValidationMessage('Please enter a valid loan amount greater than zero.');
    return;
  }

  if (!Number.isFinite(years) || years <= 0) {
    showValidationMessage('Please select a valid repayment term.');
    return;
  }

  if (!Number.isFinite(annualRate) || annualRate <= 0) {
    showValidationMessage('Please enter a valid annual interest rate.');
    return;
  }

  const monthlyPayment = calculatePayment(principal, annualRate, years);
  const totalPayment = monthlyPayment * years * 12;
  const totalInterest = totalPayment - principal;

  renderResults({ monthlyPayment, totalPayment, totalInterest, annualRate });
});

window.addEventListener('load', () => {
  toggleCustomRateField();
  showValidationMessage('Enter loan details and click Calculate Payment to see results.');
});
