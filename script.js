const cases = [
  {
    id: 'street-rush',
    name: 'Street Rush Case',
    price: 149,
    items: [
      { name: 'Glock-18 | Weasel', rarity: 'common', value: 64, chance: 39 },
      { name: 'UMP-45 | Primal Saber', rarity: 'rare', value: 138, chance: 28 },
      { name: 'AWP | Neo-Noir', rarity: 'epic', value: 520, chance: 20 },
      { name: 'M4A1-S | Player Two', rarity: 'legendary', value: 1270, chance: 10 },
      { name: 'Karambit | Doppler', rarity: 'mythic', value: 14500, chance: 3 }
    ]
  },
  {
    id: 'gamma-hunt',
    name: 'Gamma Hunt Case',
    price: 299,
    items: [
      { name: 'P250 | See Ya Later', rarity: 'common', value: 110, chance: 36 },
      { name: 'AK-47 | Neon Rider', rarity: 'rare', value: 430, chance: 30 },
      { name: 'USP-S | Kill Confirmed', rarity: 'epic', value: 930, chance: 21 },
      { name: 'M9 Bayonet | Autotronic', rarity: 'legendary', value: 18200, chance: 9 },
      { name: 'Sport Gloves | Vice', rarity: 'mythic', value: 35800, chance: 4 }
    ]
  },
  {
    id: 'royal-protocol',
    name: 'Royal Protocol Case',
    price: 599,
    items: [
      { name: 'Desert Eagle | Printstream', rarity: 'rare', value: 800, chance: 39 },
      { name: 'AK-47 | Bloodsport', rarity: 'epic', value: 1780, chance: 28 },
      { name: 'AWP | Oni Taiji', rarity: 'epic', value: 3000, chance: 16 },
      { name: 'Butterfly Knife | Slaughter', rarity: 'legendary', value: 45000, chance: 11 },
      { name: 'Pandora\'s Box Gloves', rarity: 'mythic', value: 132000, chance: 6 }
    ]
  }
];

const rarityLabels = {
  common: 'common',
  rare: 'rare',
  epic: 'epic',
  legendary: 'legendary',
  mythic: 'mythic'
};

let selectedCase = null;
let balance = 1200;
const inventory = [];
let isRolling = false;

const caseGrid = document.getElementById('case-grid');
const selectedCaseEl = document.getElementById('selected-case');
const selectedPriceEl = document.getElementById('selected-price');
const openBtn = document.getElementById('open-btn');
const rouletteTrack = document.getElementById('roulette-track');
const dropResult = document.getElementById('drop-result');
const inventoryEl = document.getElementById('inventory');
const balanceEl = document.getElementById('balance');
const addBalanceBtn = document.getElementById('add-balance');

function formatRuble(number) {
  return new Intl.NumberFormat('ru-RU').format(number);
}

function pickWeightedItem(items) {
  const total = items.reduce((sum, item) => sum + item.chance, 0);
  let roll = Math.random() * total;

  for (const item of items) {
    roll -= item.chance;
    if (roll <= 0) {
      return item;
    }
  }
  return items[items.length - 1];
}

function updateBalance() {
  balanceEl.textContent = formatRuble(balance);
}

function renderCases() {
  const template = document.getElementById('case-card-template');
  caseGrid.innerHTML = '';

  for (const c of cases) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.dataset.caseId = c.id;
    node.querySelector('.case-name').textContent = c.name;
    node.querySelector('.case-price').textContent = `${formatRuble(c.price)} ₽`;

    const tags = c.items
      .slice(0, 4)
      .map((item) => `<span class="tag">${item.name}</span>`)
      .join('');
    node.querySelector('.case-items').innerHTML = tags;

    node.addEventListener('click', () => {
      selectedCase = c;
      document.querySelectorAll('.case-card').forEach((el) => el.classList.remove('active'));
      node.classList.add('active');
      selectedCaseEl.textContent = c.name;
      selectedPriceEl.textContent = `${formatRuble(c.price)} ₽`;
      openBtn.disabled = false;
      dropResult.className = 'drop-result muted';
      dropResult.textContent = 'Нажми «Открыть кейс», чтобы начать анимацию.';
      rouletteTrack.innerHTML = '';
    });

    caseGrid.appendChild(node);
  }
}

function renderInventory() {
  const template = document.getElementById('inventory-item-template');

  if (!inventory.length) {
    inventoryEl.className = 'inventory empty';
    inventoryEl.textContent = 'Пока пусто. Открой первый кейс.';
    return;
  }

  inventoryEl.className = 'inventory';
  inventoryEl.innerHTML = '';

  for (const item of [...inventory].reverse()) {
    const node = template.content.firstElementChild.cloneNode(true);
    node.classList.add(`rarity-${item.rarity}`);
    node.querySelector('.inv-name').textContent = item.name;
    node.querySelector('.inv-rarity').textContent = rarityLabels[item.rarity];
    node.querySelector('.inv-price').textContent = `${formatRuble(item.value)} ₽`;
    inventoryEl.appendChild(node);
  }
}

function spinCase() {
  if (!selectedCase || isRolling) return;

  if (balance < selectedCase.price) {
    dropResult.className = 'drop-result';
    dropResult.textContent = 'Недостаточно средств. Пополни баланс и попробуй снова.';
    return;
  }

  isRolling = true;
  openBtn.disabled = true;
  balance -= selectedCase.price;
  updateBalance();

  const winner = pickWeightedItem(selectedCase.items);
  const slots = [];

  for (let i = 0; i < 35; i += 1) {
    slots.push(pickWeightedItem(selectedCase.items));
  }
  const winIndex = 27;
  slots[winIndex] = winner;

  rouletteTrack.innerHTML = slots
    .map(
      (item) => `
      <article class="slot rarity-${item.rarity}">
        <p class="slot-name">${item.name}</p>
        <p class="slot-price">${formatRuble(item.value)} ₽</p>
      </article>
    `
    )
    .join('');

  const slotWidth = 173;
  const centerOffset = 420;
  const finalX = -winIndex * slotWidth + centerOffset;

  rouletteTrack.animate(
    [
      { transform: 'translateX(0px)' },
      { transform: `translateX(${finalX}px)` }
    ],
    {
      duration: 4200,
      easing: 'cubic-bezier(.07,.85,.18,1)',
      fill: 'forwards'
    }
  );

  setTimeout(() => {
    inventory.push(winner);
    renderInventory();
    dropResult.className = 'drop-result';
    dropResult.textContent = `Ты выбил: ${winner.name} (${formatRuble(winner.value)} ₽)`;
    isRolling = false;
    openBtn.disabled = false;
  }, 4250);
}

openBtn.addEventListener('click', spinCase);
addBalanceBtn.addEventListener('click', () => {
  balance += 500;
  updateBalance();
});

renderCases();
renderInventory();
updateBalance();
