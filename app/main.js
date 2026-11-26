// ThaiStat — router and controls. Hash routes: #/ (overview), #/economy,
// #/people, #/trade, #/provinces, #/explorer, #/sources. The year picker,
// chart toggles, province search/filter/sort and the explorer controls all
// re-render through here, so every control does what it says.

import { LATEST, YEARS, SERIES } from './data.js';
import {
  viewHome, viewEconomy, viewPeople, viewTrade, viewProvinces,
  viewExplorer, viewSources, explorerStateFromHash,
} from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('[data-nav]')];

let state = {
  year: LATEST,
  chartKind: 'bar',
  tradeTab: 'products',
  provQuery: '',
  provRegion: 'All regions',
  provSort: 'pop',
};

function parseHash() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\/?/, '').split('/');
  return { route: parts[0] || '', rest: parts.slice(1) };
}

function render() {
  const { route } = parseHash();
  let html = '';
  let nav = 'home';
  if (route === '' || route === 'home') {
    html = viewHome(state.year);
  } else if (route === 'economy') {
    nav = 'economy';
    html = viewEconomy(state.year, state.chartKind);
  } else if (route === 'people') {
    nav = 'people';
    html = viewPeople(state.year);
  } else if (route === 'trade') {
    nav = 'trade';
    html = viewTrade(state.year, state.tradeTab);
  } else if (route === 'provinces') {
    nav = 'provinces';
    html = viewProvinces(state.year, state.provQuery, state.provRegion, state.provSort);
  } else if (route === 'explorer') {
    nav = 'explorer';
    const ex = explorerStateFromHash(location.hash);
    html = viewExplorer(ex.indicator, ex.from, ex.to);
  } else if (route === 'sources') {
    nav = 'sources';
    html = viewSources();
  } else {
    html = `<section class="card"><h1>Page not found</h1><p class="lede">There is no “${route}” section on ThaiStat. Try one of the sections above.</p><p><a href="#/">Back to the overview →</a></p></section>`;
  }
  app.innerHTML = html;
  for (const link of navLinks) link.classList.toggle('active', link.dataset.nav === nav);
  window.scrollTo(0, 0);
  wireControls();
}

function goExplorer(indicator, from, to) {
  location.hash = `#/explorer/${indicator}/${from}/${to}`;
}

function wireControls() {
  // Year picker (overview, economy, people, trade).
  const yearPick = app.querySelector('[data-control="year"]');
  if (yearPick) {
    yearPick.addEventListener('change', () => {
      const y = Number(yearPick.value);
      if (YEARS.includes(y)) { state.year = y; render(); }
    });
  }
  // Economy chart kind toggle.
  for (const btn of app.querySelectorAll('[data-control="chart-kind"]')) {
    btn.addEventListener('click', () => {
      state.chartKind = btn.dataset.kind === 'line' ? 'line' : 'bar';
      render();
    });
  }
  // Trade breakdown tabs.
  for (const btn of app.querySelectorAll('[data-control="trade-tab"]')) {
    btn.addEventListener('click', () => {
      state.tradeTab = btn.dataset.tab;
      render();
    });
  }
  // Province search (live, keeps focus), region filter and sort.
  const search = app.querySelector('[data-control="prov-search"]');
  if (search) {
    search.addEventListener('input', () => {
      state.provQuery = search.value;
      const pos = search.selectionStart;
      render();
      const again = app.querySelector('[data-control="prov-search"]');
      if (again) { again.focus(); again.setSelectionRange(pos, pos); }
    });
  }
  const region = app.querySelector('[data-control="prov-region"]');
  if (region) {
    region.addEventListener('change', () => {
      state.provRegion = region.value;
      render();
    });
  }
  for (const btn of app.querySelectorAll('[data-control="prov-sort"]')) {
    btn.addEventListener('click', () => {
      state.provSort = btn.dataset.sort;
      render();
    });
  }
  // Explorer controls.
  const exInd = app.querySelector('[data-control="ex-ind"]');
  const exFrom = app.querySelector('[data-control="ex-from"]');
  const exTo = app.querySelector('[data-control="ex-to"]');
  if (exInd && exFrom && exTo) {
    const current = () => explorerStateFromHash(location.hash);
    exInd.addEventListener('change', () => {
      const c = current();
      goExplorer(exInd.value, c.from, c.to);
    });
    exFrom.addEventListener('change', () => {
      const c = current();
      goExplorer(c.indicator, Number(exFrom.value), c.to);
    });
    exTo.addEventListener('change', () => {
      const c = current();
      goExplorer(c.indicator, c.from, Number(exTo.value));
    });
  }
  // Explorer CSV download: builds the file in the browser, no network.
  const csvBtn = app.querySelector('[data-control="ex-csv"]');
  if (csvBtn) {
    csvBtn.addEventListener('click', () => {
      const c = explorerStateFromHash(location.hash);
      const s = SERIES[c.indicator];
      const lo = Math.max(2015, Math.min(c.from, c.to));
      const hi = Math.min(LATEST, Math.max(c.from, c.to));
      const lines = [`year,${s.label.replace(/,/g, '')} (${s.unit})`];
      for (let y = lo; y <= hi; y++) lines.push(`${y},${s.values[y]}`);
      const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'thaistat-indicator.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
}

window.addEventListener('hashchange', render);
render();
