const selectedOffers = new Set();

function updateCalcTotal() {
  let total = 0;
  selectedOffers.forEach(id => {
    const offer = OFFERS.find(o => o.id === id);
    if (offer) total += offer.amount;
  });

  const el = document.getElementById('calc-total');
  const countEl = document.getElementById('calc-count');
  if (!el) return;

  el.textContent = total.toLocaleString('ru') + ' ₽';
  el.classList.remove('amount-flash');
  void el.offsetWidth;
  el.classList.add('amount-flash');

  countEl.textContent = `Выбрано: ${selectedOffers.size} оффер${selectedOffers.size === 1 ? '' : selectedOffers.size >= 2 && selectedOffers.size <= 4 ? 'а' : 'ов'}`;
}

function initCalculator() {
  const list = document.getElementById('calc-list');
  if (!list) return;

  list.innerHTML = OFFERS.map(o => `
    <div class="calc-item" data-id="${o.id}">
      <div class="calc-checkbox">✓</div>
      <div class="calc-item-name">${o.bank}</div>
      <div class="calc-item-amount">+${o.amount.toLocaleString('ru')} ₽</div>
    </div>
  `).join('');

  list.querySelectorAll('.calc-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = parseInt(item.dataset.id);
      if (selectedOffers.has(id)) {
        selectedOffers.delete(id);
        item.classList.remove('selected');
      } else {
        selectedOffers.add(id);
        item.classList.add('selected');
      }
      updateCalcTotal();
    });
  });

  updateCalcTotal();
}

document.addEventListener('DOMContentLoaded', initCalculator);
