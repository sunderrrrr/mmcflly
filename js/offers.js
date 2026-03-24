function getAgeTagClass(age) {
  if (age === 14) return 'age-14';
  if (age === 20) return 'age-20';
  return 'age-18';
}

function getTypeLabel(type) {
  const map = { debit: 'Дебетовая', credit: 'Кредитная', invest: 'Инвест. счёт' };
  return map[type] || type;
}

function getTypeTagClass(type) {
  const map = { debit: 'type-debit', credit: 'type-credit', invest: 'type-invest' };
  return map[type] || '';
}

function renderOffers(filter = 'all') {
  const grid = document.getElementById('offers-grid');
  if (!grid) return;

  let filtered = OFFERS;
  if (filter === '14') filtered = OFFERS.filter(o => o.age <= 14);
  else if (filter === '18') filtered = OFFERS.filter(o => o.age === 18);
  else if (filter === '20') filtered = OFFERS.filter(o => o.age === 20);
  else if (filter === 'debit') filtered = OFFERS.filter(o => o.type === 'debit');
  else if (filter === 'credit') filtered = OFFERS.filter(o => o.type === 'credit');

  grid.innerHTML = filtered.map(o => `
    <div class="offer-card" data-age="${o.age}" data-type="${o.type}">
      <div class="offer-header">
        <div class="offer-bank">${o.bank}</div>
        <div class="offer-amount">+${o.amount.toLocaleString('ru')} ₽</div>
      </div>
      <div class="offer-tags">
        <span class="offer-tag ${getAgeTagClass(o.age)}">${o.age}+</span>
        <span class="offer-tag ${getTypeTagClass(o.type)}">${getTypeLabel(o.type)}</span>
      </div>
      <div class="offer-condition">📋 ${o.condition}</div>
      ${o.note ? `<div class="offer-note">* ${o.note}</div>` : ''}
    </div>
  `).join('');
}

function initOffers() {
  renderOffers();

  const btns = document.querySelectorAll('.filter-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderOffers(btn.dataset.filter);
    });
  });
}

document.addEventListener('DOMContentLoaded', initOffers);
