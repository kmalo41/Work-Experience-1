let formLoadTime = new Date().getTime();

const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  statusEl.textContent = '';
  statusEl.className = 'form-status';
  
  const data = Object.fromEntries(new FormData(form));
  const honeypot = document.getElementById('honeypot').value;

  let formSubmitTime = new Date().getTime();
  let timeTaken = formSubmitTime - formLoadTime;
  
  // if honeypot has value or if the time sub is less than 3k then return
  if (timeTaken < 3000 || honeypot) {
    form.reset();
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add('form-status--success');
    return
  }
  
  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.error || 'Something went wrong.');
    }

    form.reset();
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add('form-status--success');
  } catch (error) {
    statusEl.textContent = error.message || 'Something went wrong. Please email hello@calicomedia.co instead.';
    statusEl.classList.add('form-status--error');
  } finally {
    button.disabled = false;
  }
});