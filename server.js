const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = process.env.PORT || 4173;
const PUBLIC_DIR = path.join(__dirname, 'public');

const cases = [
  {
    id: 'street-rush',
    name: 'Street Rush Case',
    price: 149,
    image: '🧨',
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
    image: '🟩',
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
    image: '👑',
    items: [
      { name: 'Desert Eagle | Printstream', rarity: 'rare', value: 800, chance: 39 },
      { name: 'AK-47 | Bloodsport', rarity: 'epic', value: 1780, chance: 28 },
      { name: 'AWP | Oni Taiji', rarity: 'epic', value: 3000, chance: 16 },
      { name: 'Butterfly Knife | Slaughter', rarity: 'legendary', value: 45000, chance: 11 },
      { name: "Pandora's Box Gloves", rarity: 'mythic', value: 132000, chance: 6 }
    ]
  }
];

const state = {
  balance: 2000,
  inventory: [],
  history: []
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function pickWeightedItem(items) {
  const total = items.reduce((sum, item) => sum + item.chance, 0);
  let roll = Math.random() * total;

  for (const item of items) {
    roll -= item.chance;
    if (roll <= 0) return item;
  }
  return items[items.length - 1];
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 1e6) req.destroy();
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function getMime(filepath) {
  const ext = path.extname(filepath);
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8'
  };
  return map[ext] || 'text/plain; charset=utf-8';
}

function serveStatic(res, pathname) {
  const safePath = path.normalize(path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname));
  if (!safePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(safePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': getMime(safePath) });
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/cases' && req.method === 'GET') {
    return sendJson(res, 200, { cases });
  }

  if (url.pathname === '/api/profile' && req.method === 'GET') {
    return sendJson(res, 200, {
      balance: state.balance,
      inventory: state.inventory,
      history: state.history.slice(-12).reverse()
    });
  }

  if (url.pathname === '/api/topup' && req.method === 'POST') {
    const body = await parseBody(req).catch(() => null);
    const amount = Number(body?.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) {
      return sendJson(res, 400, { error: 'Некорректная сумма пополнения.' });
    }
    state.balance += Math.floor(amount);
    return sendJson(res, 200, { balance: state.balance });
  }

  if (url.pathname === '/api/open' && req.method === 'POST') {
    const body = await parseBody(req).catch(() => null);
    const selected = cases.find((item) => item.id === body?.caseId);
    if (!selected) return sendJson(res, 404, { error: 'Кейс не найден.' });
    if (state.balance < selected.price) {
      return sendJson(res, 400, { error: 'Недостаточно средств.' });
    }

    const drop = pickWeightedItem(selected.items);
    state.balance -= selected.price;
    state.inventory.push({ ...drop, caseName: selected.name, droppedAt: new Date().toISOString() });
    state.history.push({ item: drop.name, rarity: drop.rarity, value: drop.value, caseName: selected.name, droppedAt: new Date().toISOString() });

    return sendJson(res, 200, {
      drop,
      balance: state.balance,
      inventory: state.inventory,
      history: state.history.slice(-12).reverse(),
      roulette: Array.from({ length: 36 }, () => pickWeightedItem(selected.items))
    });
  }

  if (req.method === 'GET') {
    return serveStatic(res, url.pathname);
  }

  res.writeHead(405);
  res.end('Method not allowed');
});

server.listen(PORT, () => {
  console.log(`DropForge is running on http://localhost:${PORT}`);
});
