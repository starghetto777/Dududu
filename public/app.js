const state = {
  cases: [],
  selectedCase: null,
  balance: 0,
  inventory: [],
  history: [],
  opening: false
};

const $ = (sel) => document.querySelector(sel);
const casesEl = $('#cases');
const balanceEl = $('#balance');
const openBtn = $('#open-btn');
const currentCaseEl = $('#current-case');
const resultEl = $('#result');
const trackEl = $('#roulette-track');
const invEl = $('#inventory');
const historyEl = $('#history');

const f = (n) => new Intl.NumberFormat('ru-RU').format(n);

async function api(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка запроса');
  return data;
}

function renderCases() {
  casesEl.innerHTML = '';
  for (const c of state.cases) {
    const el = document.createElement('button');
    el.className = `case${state.selectedCase?.id === c.id ? ' active' : ''}`;
    el.innerHTML = `
      <div class="emoji">${c.image}</div>
      <h3>${c.name}</h3>
      <p class="price">${f(c.price)} ₽</p>
      <div class="items">${c.items.slice(0, 4).map((i) => `<span class="tag">${i.name}</span>`).join('')}</div>
    `;
    el.onclick = () => {
      state.selectedCase = c;
      currentCaseEl.textContent = `${c.name} • ${f(c.price)} ₽`;
      openBtn.disabled = false;
      renderCases();
    };
    casesEl.appendChild(el);
  }
}

function renderList(target, arr, type) {
  if (!arr.length) {
    target.className = 'list empty';
    target.textContent = type === 'history' ? 'Пока нет дропов' : 'Пока пусто';
    return;
  }

  target.className = 'list';
  target.innerHTML = arr
    .map((item) => `
      <article class="item rarity-${item.rarity}">
        <p class="name">${item.name || item.item}</p>
        <p class="meta">${item.caseName || 'Drop'}</p>
        <p class="value">${f(item.value)} ₽</p>
      </article>
    `)
    .join('');
}

function drawRoulette(items, winnerName) {
  const extended = [...items];
  const forcedIndex = 28;
  extended[forcedIndex] = items.find((item) => item.name === winnerName) || items[forcedIndex];

  trackEl.innerHTML = extended
    .map((item) => `
      <article class="slot rarity-${item.rarity}">
        <p class="name">${item.name}</p>
        <p class="val">${f(item.value)} ₽</p>
      </article>
    `)
    .join('');

  const finalX = -forcedIndex * 178 + 420;
  trackEl.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${finalX}px)` }], {
    duration: 3500,
    easing: 'cubic-bezier(.09,.8,.22,1)',
    fill: 'forwards'
  });
}

async function refreshProfile() {
  const profile = await api('/api/profile');
  state.balance = profile.balance;
  state.inventory = profile.inventory;
  state.history = profile.history;
  balanceEl.textContent = f(state.balance);
  renderList(invEl, [...state.inventory].reverse(), 'inventory');
  renderList(historyEl, state.history, 'history');
}

async function init() {
  const [caseData] = await Promise.all([api('/api/cases'), refreshProfile()]);
  state.cases = caseData.cases;
  renderCases();
}

openBtn.addEventListener('click', async () => {
  if (!state.selectedCase || state.opening) return;

  state.opening = true;
  openBtn.disabled = true;
  resultEl.className = 'result muted';
  resultEl.textContent = 'Открываем кейс...';

  try {
    const data = await api('/api/open', {
      method: 'POST',
      body: JSON.stringify({ caseId: state.selectedCase.id })
    });

    state.balance = data.balance;
    state.inventory = data.inventory;
    state.history = data.history;
    balanceEl.textContent = f(state.balance);

    drawRoulette(data.roulette, data.drop.name);

    setTimeout(() => {
      resultEl.className = 'result';
      resultEl.textContent = `Дроп: ${data.drop.name} (${f(data.drop.value)} ₽)`;
      renderList(invEl, [...state.inventory].reverse(), 'inventory');
      renderList(historyEl, state.history, 'history');
      state.opening = false;
      openBtn.disabled = false;
    }, 3550);
  } catch (e) {
    state.opening = false;
    openBtn.disabled = false;
    resultEl.className = 'result';
    resultEl.textContent = e.message;
  }
});

document.querySelectorAll('[data-topup]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const amount = Number(btn.dataset.topup);
    const data = await api('/api/topup', { method: 'POST', body: JSON.stringify({ amount }) });
    state.balance = data.balance;
    balanceEl.textContent = f(state.balance);
  });
});

init().catch((e) => {
  resultEl.className = 'result';
  resultEl.textContent = `Ошибка запуска: ${e.message}`;
});
