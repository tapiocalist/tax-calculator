function formatCurrency(amount) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatInputCurrency(input) {
  // Remove any non-numeric characters except decimal point
  let value = input.value.replace(/[^0-9.]/g, "");

  // Ensure only one decimal point
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts.slice(1).join("");
  }

  // Update the input value with clean number
  input.value = value;
}

function formatOnBlur(input) {
  const value = input.value.replace(/[^0-9.]/g, "");
  const number = parseFloat(value);
  if (!isNaN(number)) {
    input.value = formatCurrency(number).replace("AUD", "").trim();
  }
}

function calculateTax() {
  // Get income value and clean it up
  const incomeStr = document
    .getElementById("income")
    .value.replace(/[^0-9.]/g, "");
  const income = parseFloat(incomeStr);
  let tax = 0;
  let medicare = 0;

  // Validate input
  if (isNaN(income) || income < 0) {
    alert("Please enter a valid income amount");
    return;
  }

  // Calculate tax based on 2024-25 tax brackets
  if (income <= 18200) {
    tax = 0;
  } else if (income <= 45000) {
    tax = (income - 18200) * 0.16;
  } else if (income <= 135000) {
    tax = 4288 + (income - 45000) * 0.3;
  } else if (income <= 180000) {
    tax = 31288 + (income - 135000) * 0.37;
  } else {
    tax = 47938 + (income - 180000) * 0.45;
  }

  // Calculate Medicare Levy (2%)
  if (income <= 24276) {
    medicare = 0;
  } else {
    medicare = income * 0.02;
  }

  // Display results
  const results = document.getElementById("results");
  results.style.display = "block";
  results.innerHTML = `
    <h3>Tax Calculation Results</h3>
    <div class="result-item">
      <span class="result-label">Gross Income (Before Tax):</span>
      <span class="result-value">${formatCurrency(income)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Income Tax:</span>
      <span class="result-value">${formatCurrency(tax)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Medicare Levy:</span>
      <span class="result-value">${formatCurrency(medicare)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Total Tax:</span>
      <span class="result-value">${formatCurrency(tax + medicare)}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Net Income (After Tax):</span>
      <span class="result-value">${formatCurrency(
        income - tax - medicare
      )}</span>
    </div>
  `;
}

// Add event listeners when the document loads
document.addEventListener("DOMContentLoaded", function () {
  const incomeInput = document.getElementById("income");

  // Only clean the input as user types (allow numbers and single decimal point)
  incomeInput.addEventListener("input", function () {
    formatInputCurrency(this);
  });

  // Format as currency when input loses focus
  incomeInput.addEventListener("blur", function () {
    formatOnBlur(this);
  });
});
