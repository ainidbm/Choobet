/* ================================================================
   喝什么？— 扭蛋奶茶选择器
   纯静态 · 零依赖 · localStorage 持久化
   ================================================================ */

// ==============================
//  DOM refs
// ==============================
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const boardTabs    = $('#board-tabs');
const stage        = $('#stage');
const stageInner   = $('#stage-inner');
const stageIdle    = $('#stage-idle');
const logoImg      = $('#logo-img');
const logoFallback = $('#logo-fallback');
const resultSlot   = $('#result-slot');
const resultDrink  = $('#result-drink');
const resultShop   = $('#result-shop');
const resultPrice  = $('#result-price');
const selectBtn    = $('#select-btn');
const noRepeatCb   = $('#no-repeat');
const resetBtn     = $('#reset-btn');
const historySec   = $('#history');
const historyList  = $('#history-list');
const removedSec   = $('#removed');
const removedCount = $('#removed-count');
const removedList  = $('#removed-list');
const likeBtn      = $('#like-btn');
const likeCount    = $('#like-count');
const priceToggle  = $('#price-toggle');
const poolModal    = $('#pool-modal');
const poolNameInp  = $('#pool-name');
const drinkGrid    = $('#drink-grid');
const drinkSearch  = $('#drink-search');
const poolSaveBtn  = $('#pool-save');
const poolCancelBtn = $('#pool-cancel');
const editPoolBtn  = $('#edit-pool-btn');

// ==============================
//  State
// ==============================
let currentBoard   = 'main';
let isAnimating    = false;
let editingPoolId  = null;       // non-null when modal is editing an existing pool
let brokenLogos    = new Set();  // logo URLs that failed to load
let lastResult     = null;       // { drink, shop } of current stage result
const logoToName   = {};         // logo URL → shop name mapping

// Build logo→name lookup + preload all logos
SHOPS.forEach(s => { logoToName[s.logo] = s.name; });

function preloadLogos() {
  return Promise.allSettled(
    SHOPS.map(shop => new Promise((resolve) => {
      const img = new Image();
      img.onload  = () => resolve({ logo: shop.logo, ok: true });
      img.onerror = () => resolve({ logo: shop.logo, ok: false });
      img.src = shop.logo;
    }))
  ).then(results => {
    results.forEach(r => {
      if (r.value && !r.value.ok) brokenLogos.add(r.value.logo);
    });
  });
}

// ==============================
//  localStorage helpers
// ==============================
const LS_KEYS = {
  removed:     (bid) => `removed_${bid}`,
  history:     (bid) => `history_${bid}`,
  customPools: 'custom_pools',
  priceVisible: 'price_visible',
  likeCount:   'like_count',
  likeToday:   'like_today',
};

function loadJSON(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch (_) { return fallback; }
}
function saveJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

function getRemoved(boardId)      { return new Set(loadJSON(LS_KEYS.removed(boardId), [])); }
function saveRemoved(boardId, s)  { saveJSON(LS_KEYS.removed(boardId), [...s]); }
function addRemoved(boardId, id)  { const s = getRemoved(boardId); s.add(id); saveRemoved(boardId, s); }
function resetRemoved(boardId)    { const s = getRemoved(boardId); s.clear(); saveRemoved(boardId, s); }

function getHistory(boardId)      { return loadJSON(LS_KEYS.history(boardId), []); }
function addHistory(boardId, entry) {
  const h = getHistory(boardId);
  h.unshift(entry);
  if (h.length > 20) h.length = 20;
  saveJSON(LS_KEYS.history(boardId), h);
}

function getCustomPools()         { return loadJSON(LS_KEYS.customPools, []); }
function saveCustomPools(pools)   { saveJSON(LS_KEYS.customPools, pools); }

let priceVisible = loadJSON(LS_KEYS.priceVisible, false);
let userLikeCount = loadJSON(LS_KEYS.likeCount, 0);
let userLikeToday = loadJSON(LS_KEYS.likeToday, '');

// ==============================
//  Drink helpers
// ==============================
function getEligibleDrinks(boardId) {
  const all = getDrinksForBoard(boardId);
  if (!noRepeatCb.checked) return all;
  const removed = getRemoved(boardId);
  return all.filter(d => !removed.has(d.id));
}

function getBoardShops(boardId) {
  return getShopsForBoard(boardId);
}

// ==============================
//  Animation engine
// ==============================
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function animateSelection(boardId) {
  const eligible = getEligibleDrinks(boardId);
  if (!eligible.length) return null;

  // Pick random winner
  const winner = eligible[Math.floor(Math.random() * eligible.length)];
  const shop = SHOPS.find(s => s.id === winner.shopId);
  const boardShops = getBoardShops(boardId);

  // Show stage
  stageIdle.hidden = true;
  stageInner.hidden = false;
  resultSlot.classList.remove('revealed');
  logoImg.classList.add('spinning');
  logoImg.style.opacity = '';
  logoFallback.hidden = true;

  // Carousel: fast swaps → gradual deceleration → land
  await carousel(boardShops, shop);

  // Logo landed — show final state with text fallback if needed
  logoImg.classList.remove('spinning');
  logoImg.classList.add('landed');
  showLogoForShop(shop);

  // Brief pause — user recognizes the shop
  await sleep(350);

  // Reveal drink
  lastResult = { drink: winner, shop };
  resultDrink.textContent = winner.name;
  resultShop.textContent = shop.name;
  resultPrice.textContent = priceVisible ? `¥${winner.price}` : '';
  resultSlot.classList.add('revealed');
  spawnParticles(stageInner);

  // Update state
  if (noRepeatCb.checked) {
    addRemoved(boardId, winner.id);
  }
  addHistory(boardId, { drinkId: winner.id, drinkName: winner.name, shopName: shop.name, ts: Date.now() });

  // Result stays visible — only resets on next spin
  return { drink: winner, shop };
}

// Show a shop's logo (or text fallback if logo is broken)
function showLogoForShop(shop) {
  if (brokenLogos.has(shop.logo)) {
    logoImg.style.opacity = '0';
    logoFallback.textContent = shop.name;
    logoFallback.hidden = false;
  } else {
    logoImg.style.opacity = '';
    logoImg.src = shop.logo;
    logoFallback.hidden = true;
  }
}

function carousel(shops, targetShop) {
  return new Promise(resolve => {
    let count = 0;
    let lastIdx = -1;
    const fastCount = 12;
    const decelCount = 3;
    const fastInterval = 75;

    // Pick a random shop index that differs from the previous frame
    function nextIdx(avoidTarget = false) {
      if (shops.length <= 1) return 0;
      const pool = avoidTarget
        ? shops.filter((_, i) => i !== lastIdx && shops[i].id !== targetShop.id)
        : shops.filter((_, i) => i !== lastIdx);
      const pick = pool.length ? pool : shops;
      const idx = shops.indexOf(pick[Math.floor(Math.random() * pick.length)]);
      lastIdx = idx;
      return idx;
    }

    function swap() {
      if (count < fastCount) {
        // Phase 1: fast random, never two same in a row
        showLogoForShop(shops[nextIdx()]);
        count++;
        setTimeout(swap, fastInterval);
      } else if (count < fastCount + decelCount) {
        const decelIdx = count - fastCount;
        const delays = [120, 200, 320];

        if (decelIdx === decelCount - 1) {
          // Last decel swap: avoid target if possible (single-shop pool → fallback)
          const nonTarget = shops.filter(s => s.id !== targetShop.id);
          const pick = nonTarget.length
            ? nonTarget[Math.floor(Math.random() * nonTarget.length)]
            : shops[0];
          showLogoForShop(pick);
          lastIdx = shops.indexOf(pick);
        } else {
          showLogoForShop(shops[nextIdx()]);
        }
        count++;
        setTimeout(swap, delays[decelIdx]);
      } else {
        // Phase 3: land on target
        showLogoForShop(targetShop);
        resolve();
      }
    }

    swap();
  });
}

function spawnParticles(container) {
  const colors = ['#f0b8a5', '#b8d4a6', '#f5d6a0', '#c8b8d8', '#a8d0d8', '#f0c0b8'];
  const rect = container.getBoundingClientRect();
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.setProperty('--x', `${(Math.random() - 0.5) * 120}px`);
    p.style.setProperty('--y', `${-40 - Math.random() * 60}px`);
    p.style.setProperty('--c', colors[i % colors.length]);
    p.style.setProperty('--d', `${Math.random() * 0.25}s`);
    p.style.setProperty('--s', `${4 + Math.random() * 5}px`);
    p.style.left = `${30 + Math.random() * 40}%`;
    p.style.top = '50%';
    container.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

// ==============================
//  Rendering
// ==============================
function renderTabs() {
  const pools = getCustomPools();

  // Remove old pool tabs
  $$('.tab-pool').forEach(t => t.remove());

  // Rebuild pool tabs
  pools.forEach(pool => {
    const btn = document.createElement('button');
    btn.className = 'tab tab-pool';
    btn.dataset.board = pool.id;
    btn.textContent = `📦 ${pool.name}`;
    btn.addEventListener('click', () => switchBoard(pool.id));
    // Delete pool on long-press / right-click
    btn.addEventListener('contextmenu', (e) => { e.preventDefault(); deletePool(pool.id); });
    boardTabs.appendChild(btn);
  });

  // Highlight current
  $$('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.board === currentBoard);
  });
}

function renderBoard() {
  const eligible = getEligibleDrinks(currentBoard);
  const removed = getRemoved(currentBoard);
  const allDrinks = getDrinksForBoard(currentBoard);

  // Select button state
  selectBtn.disabled = eligible.length === 0 || isAnimating;
  if (eligible.length === 0 && allDrinks.length > 0) {
    selectBtn.querySelector('.select-btn-text').textContent = '已全部选过';
  } else {
    selectBtn.querySelector('.select-btn-text').textContent = '扭 一 扭';
  }

  // Edit pool button visibility (only on custom pool boards)
  editPoolBtn.hidden = !currentBoard.startsWith('pool_');

  // Clear cached result
  lastResult = null;

  // Reset stage
  stageInner.hidden = true;
  stageIdle.hidden = false;
  logoImg.src = '';
  logoFallback.hidden = true;
  logoImg.style.opacity = '';
  resultSlot.classList.remove('revealed');

  // History
  renderHistory();
  // Removed drinks (minimized)
  renderRemoved();
}

function renderHistory() {
  const h = getHistory(currentBoard);
  if (!h.length) {
    historySec.hidden = true;
    return;
  }
  historySec.hidden = false;
  historyList.innerHTML = h.slice(0, 10).map(e => {
    const result = findDrink(e.drinkId);
    const price = result ? result.drink.price : null;
    return `
      <li class="history-item">
        <span class="history-drink">${e.drinkName}</span>
        <span class="history-shop">${e.shopName}</span>
        ${priceVisible && price ? `<span class="history-price">¥${price}</span>` : ''}
      </li>
    `;
  }).join('');
}

function renderRemoved() {
  const removed = getRemoved(currentBoard);
  if (!removed.size) {
    removedSec.hidden = true;
    return;
  }
  removedSec.hidden = false;
  removedCount.textContent = removed.size;

  // Resolve drink IDs → names
  const items = [...removed].map(id => {
    const result = findDrink(id);
    return result
      ? { name: result.drink.name, shop: result.shop.name }
      : { name: id, shop: '未知' };
  });

  removedList.innerHTML = items.map(i => `
    <li class="removed-item">
      <span class="ri-drink">${i.name}</span>
      <span class="ri-shop">${i.shop}</span>
    </li>
  `).join('');
}

function renderLikeButton() {
  const today = new Date().toISOString().slice(0, 10);
  const alreadyLiked = userLikeToday === today;
  likeCount.textContent = userLikeCount;
  likeBtn.classList.toggle('liked', alreadyLiked);
  likeBtn.disabled = alreadyLiked;
  if (alreadyLiked) {
    likeBtn.title = '今天已点过赞了 ❤️';
  } else {
    likeBtn.title = '点个赞吧';
  }
}

// ==============================
//  Board switching
// ==============================
function switchBoard(boardId) {
  currentBoard = boardId;
  renderTabs();
  renderBoard();
}

// ==============================
//  Pool management
// ==============================
function openPoolModal(poolId = null) {
  editingPoolId = poolId;

  const allDrinks = SHOPS.flatMap(s =>
    s.drinks.map(d => ({ ...d, shopName: s.name, shopId: s.id }))
  );

  let checkedSet = new Set();

  if (poolId) {
    // Edit mode: pre-fill with existing pool data
    const pools = getCustomPools();
    const pool = pools.find(p => p.id === poolId);
    if (pool) {
      poolNameInp.value = pool.name;
      checkedSet = new Set(pool.drinkIds);
    }
  } else {
    // Create mode
    poolNameInp.value = '';
  }

  poolSaveBtn.disabled = poolId
    ? false // editing: already has drinks checked
    : true;
  poolSaveBtn.textContent = poolId ? '保存修改' : '保存';

  // Render all drinks grouped by shop
  drinkSearch.value = '';
  const grouped = new Map();
  allDrinks.forEach(d => {
    if (!grouped.has(d.shopName)) grouped.set(d.shopName, []);
    grouped.get(d.shopName).push(d);
  });

  drinkGrid.innerHTML = [...grouped].map(([shopName, drinks]) => `
    <div class="shop-group" data-shop="${shopName}">
      <h4 class="shop-group-header">${shopName}</h4>
      <div class="shop-group-cards">
        ${drinks.map(d => `
          <label class="drink-card" data-drink-id="${d.id}" data-shop="${d.shopName}" data-name="${d.name}" onclick="void(0)">
            <input type="checkbox" class="drink-card-check" value="${d.id}" ${checkedSet.has(d.id) ? 'checked' : ''}>
            <span class="drink-card-body">
              <span class="drink-card-name">${d.name}</span>
              <span class="drink-card-shop">${d.shopName}</span>
            </span>
          </label>
        `).join('')}
      </div>
    </div>
  `).join('');

  // Update hint visibility based on initial state
  updatePoolSaveState();

  poolModal.removeAttribute('hidden');
  poolNameInp.focus();
}

// Search filter for drink cards
function filterDrinks(query) {
  const q = query.trim().toLowerCase();
  $$('.drink-card').forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    const shop = (card.dataset.shop || '').toLowerCase();
    card.classList.toggle('filtered-out', q !== '' && !name.includes(q) && !shop.includes(q));
  });
  // Hide empty shop groups
  $$('.shop-group').forEach(group => {
    const visible = [...group.querySelectorAll('.drink-card')].some(c => !c.classList.contains('filtered-out'));
    group.style.display = q === '' ? '' : (visible ? '' : 'none');
  });
}
drinkSearch.addEventListener('input', () => filterDrinks(drinkSearch.value));

// Modal validation — attached once, checks state each time
function updatePoolSaveState() {
  if (poolModal.hidden) return;
  const checked = $$('.drink-card-check:checked');
  const hasName = poolNameInp.value.trim() !== '';
  poolSaveBtn.disabled = checked.length === 0 || !hasName;

  // Toggle hint: show greyed-out hint when satisfied, full hint when drinks needed
  const hint = $('#drink-hint');
  if (hint) {
    hint.classList.toggle('satisfied', checked.length > 0);
    hint.textContent = checked.length > 0 ? `已选 ${checked.length} 款饮品` : '请至少勾选一款饮品';
  }
}
drinkGrid.addEventListener('change', updatePoolSaveState);
poolNameInp.addEventListener('input', updatePoolSaveState);

function closePoolModal() {
  poolModal.hidden = true;
  editingPoolId = null;
  poolSaveBtn.textContent = '保存';
}

function savePool() {
  const name = poolNameInp.value.trim();
  const checked = [...$$('.drink-card-check:checked')].map(cb => cb.value);
  if (!name || !checked.length) return;

  const pools = getCustomPools();

  if (editingPoolId) {
    // Update existing pool
    const idx = pools.findIndex(p => p.id === editingPoolId);
    if (idx !== -1) {
      pools[idx].name = name;
      pools[idx].drinkIds = checked;
      saveCustomPools(pools);
      closePoolModal();
      renderTabs();
      // Re-render board if currently viewing this pool
      if (currentBoard === editingPoolId) {
        renderBoard();
      }
    }
  } else {
    // Create new pool
    const id = 'pool_' + Date.now();
    pools.push({ id, name, drinkIds: checked });
    saveCustomPools(pools);
    closePoolModal();
    renderTabs();
    switchBoard(id);
  }
}

function deletePool(poolId) {
  if (!confirm('删除这个饮品池？')) return;
  const pools = getCustomPools().filter(p => p.id !== poolId);
  saveCustomPools(pools);
  // Remove related data
  localStorage.removeItem(LS_KEYS.removed(poolId));
  localStorage.removeItem(LS_KEYS.history(poolId));
  if (currentBoard === poolId) {
    switchBoard('main');
  } else {
    renderTabs();
  }
}

// ==============================
//  Event bindings
// ==============================
selectBtn.addEventListener('click', async () => {
  if (isAnimating) return;
  isAnimating = true;
  selectBtn.disabled = true;
  const result = await animateSelection(currentBoard);
  isAnimating = false;
  if (result) {
    renderHistory();
    renderRemoved();
    renderTabs();
  }
  // Re-enable button without resetting the stage result
  const eligible = getEligibleDrinks(currentBoard);
  const allDrinks = getDrinksForBoard(currentBoard);
  selectBtn.disabled = eligible.length === 0;
  selectBtn.querySelector('.select-btn-text').textContent =
    eligible.length === 0 && allDrinks.length > 0 ? '已全部选过' : '扭 一 扭';
});

noRepeatCb.addEventListener('change', () => {
  // Persist preference per board? Not strictly required — just affects filtering.
  // But we need the removed set to be visible. Toggling doesn't change data.
});

resetBtn.addEventListener('click', () => {
  resetRemoved(currentBoard);
  renderBoard();
});

// Board tab clicks
boardTabs.addEventListener('click', (e) => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  if (tab.classList.contains('tab-pool')) return; // handled by pool tab's own listener
  const boardId = tab.dataset.board;
  if (boardId && boardId !== currentBoard) {
    switchBoard(boardId);
  }
});

// Pool modal
poolCancelBtn.addEventListener('click', closePoolModal);
poolSaveBtn.addEventListener('click', savePool);
poolModal.addEventListener('click', (e) => {
  if (e.target === poolModal) closePoolModal();
});
editPoolBtn.addEventListener('click', () => {
  openPoolModal(currentBoard);
});

// Price toggle
priceToggle.addEventListener('click', () => {
  priceVisible = !priceVisible;
  saveJSON(LS_KEYS.priceVisible, priceVisible);
  priceToggle.classList.toggle('on', priceVisible);

  // Update current stage result price
  if (!stageInner.hidden && resultSlot.classList.contains('revealed') && lastResult) {
    resultPrice.textContent = priceVisible ? `¥${lastResult.drink.price}` : '';
  }

  // Update history items
  renderHistory();
});

// Like button
likeBtn.addEventListener('click', () => {
  const today = new Date().toISOString().slice(0, 10);
  if (userLikeToday === today) return;
  userLikeCount++;
  userLikeToday = today;
  saveJSON(LS_KEYS.likeCount, userLikeCount);
  saveJSON(LS_KEYS.likeToday, userLikeToday);
  renderLikeButton();
});

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && !isAnimating && document.activeElement === document.body) {
    e.preventDefault();
    selectBtn.click();
  }
  if (e.key === 'Escape' && !poolModal.hidden) {
    closePoolModal();
  }
});

// ==============================
//  Init
// ==============================
async function init() {
  // Preload logos to detect broken ones before first spin
  await preloadLogos();

  // Restore price toggle visual
  priceToggle.classList.toggle('on', priceVisible);

  // Pool creation link (moved out of tab bar)
  $('#create-pool-link').addEventListener('click', () => openPoolModal());

  renderTabs();
  renderBoard();
  renderLikeButton();
}

init();
