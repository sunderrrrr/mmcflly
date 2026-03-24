function initTicker() {
  const track = document.getElementById('ticker-track');
  if (!track) return;

  const items = OFFERS.map(o =>
    `<span class="ticker-item">💳 <strong>${o.bank}</strong> <span class="ti-sep">—</span> <span class="ti-amount">${o.amount.toLocaleString('ru')} ₽</span></span>`
  ).join('');

  // Duplicate for seamless loop
  track.innerHTML = items + items;
}

document.addEventListener('DOMContentLoaded', initTicker);
