const toastMessages = [
  { icon: '💸', text: 'Макс получил 1 300 ₽ за Тинькофф' },
  { icon: '✅', text: 'Аня оформила Альфа дебетку — +700 ₽' },
  { icon: '🎉', text: 'Кирилл заработал 1 500 ₽ за 8 минут' },
  { icon: '💳', text: 'Дима получил 1 200 ₽ за Займер' },
  { icon: '🔥', text: 'Саша открыл ИП и получил 2 000 ₽' },
  { icon: '⚡', text: 'Катя — +1 000 ₽ на СБП мгновенно' },
  { icon: '💰', text: 'Никита заработал 750 ₽ за ОТП карту' },
  { icon: '🚀', text: 'Рита: +500 ₽ за ВТБ дебетку' },
];
function generateRandomHex() {
  // Generate a random number up to the max value of a 6-digit hex (FFFFFF in decimal)
  const randomNumber = Math.floor(Math.random() * 16777215);
  // Convert to a base-16 (hexadecimal) string
  const hexString = randomNumber.toString(16);
  // Pad with leading zeros to ensure a length of 6 characters
  return `#${hexString.padStart(6, '0')}`;
}
function showToast({ icon, text }) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const id = generateRandomHex()
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span class="toast-icon">${icon}</span> ${text} ID:${id}`;
  container.appendChild(el);

  setTimeout(() => el.remove(), 4200);
}

function startToasts() {
  let i = 0;
  const show = () => {
    showToast(toastMessages[i % toastMessages.length]);
    i++;
    const next = 100000 + Math.random() * 70000;
    setTimeout(show, next);
  };
  setTimeout(show, 3000);
}

document.addEventListener('DOMContentLoaded', startToasts);
