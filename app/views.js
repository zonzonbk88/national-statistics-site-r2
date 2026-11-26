// ThaiStat — page views. Each route renders real figures from data.js and
// names the source and year under every chart and table.

import {
  YEARS, LATEST, SERIES, SNAPSHOT, YEAR_NOTES, SECTORS, AGE, EXPORT_PRODUCTS,
  EXPORT_PARTNERS, TOURIST_SOURCES, PROVINCES, RELEASES, seriesValue, seriesChange,
} from './data.js';
import { lineChart, barChart, hbarChart, donutChart } from './charts.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fmt(v, digits = 1) {
  if (v === null || v === undefined) return '—';
  return Number(v).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function srcLine(source) {
  return `<p class="src"><b>Source:</b> ${esc(source)}</p>`;
}

function deltaBadge(key, year) {
  const s = SERIES[key];
  const v = seriesValue(key, year);
  const p = seriesValue(key, year - 1);
  if (v === undefined || p === undefined) return '';
  // Rates (percent-of-something series) move in percentage points, not percent.
  if (s.unit.startsWith('%')) {
    const pp = v - p;
    const cls = pp > 0.05 ? 'up' : pp < -0.05 ? 'down' : 'flat';
    const sign = pp > 0 ? '+' : '';
    return `<span class="k-delta ${cls}">${sign}${fmt(pp, 1)} pp vs ${year - 1}</span>`;
  }
  const ch = seriesChange(key, year);
  if (ch === null) return '';
  const cls = ch > 0.05 ? 'up' : ch < -0.05 ? 'down' : 'flat';
  const sign = ch > 0 ? '+' : '';
  return `<span class="k-delta ${cls}">${sign}${fmt(ch, 1)}% vs ${year - 1}</span>`;
}

function kpiCard(key, year, digits = 1) {
  const s = SERIES[key];
  const v = seriesValue(key, year);
  return `<article class="card kpi"><div class="k-label">${esc(s.label)}</div>` +
    `<div class="k-value">${fmt(v, digits)}</div>` +
    `<div class="k-sub">${esc(s.unit)} · ${year}</div>${deltaBadge(key, year)}</article>`;
}

function chartCard(title, body, source, extra = '') {
  return `<section class="card"><h2>${esc(title)}</h2><div class="chartbox">${body}</div>${extra}${srcLine(source)}</section>`;
}

function seriesPairs(key, from = 2015, to = LATEST) {
  return YEARS.filter((y) => y >= from && y <= to).map((y) => ({ year: y, value: SERIES[key].values[y] }));
}

function yearOptions(selected) {
  return YEARS.map((y) => `<option value="${y}"${y === selected ? ' selected' : ''}>${y}</option>`).join('');
}

function yearPicker(selected) {
  return `<label for="yearpick">Year <select id="yearpick" data-control="year">${yearOptions(selected)}</select></label>`;
}

// ---------- Overview ----------
export function viewHome(year) {
  const notes = YEAR_NOTES[year] || YEAR_NOTES[LATEST];
  const gdp = seriesPairs('growth');
  const pop = seriesPairs('population');
  return `
  <section class="hero">
    <p class="eyebrow" style="color:var(--accent)">Kingdom of Thailand · Official statistics</p>
    <h1>Thailand in numbers, 2015–2024</h1>
    <p class="lede">One place for the figures people actually look up: how many people live here, how the economy is doing, what Thailand sells to the world, and who comes to visit. Every number names its source and its year.</p>
    <div class="hero-cta">
      <a class="btn" href="#/economy">Explore the economy →</a>
      <a class="btn ghost" href="#/explorer">Open the data explorer</a>
    </div>
  </section>
  <div class="toolbar" style="margin-top:18px">${yearPicker(year)}<span class="small">Change the year to see the whole site for that year.</span></div>
  <section class="grid kpis" aria-label="Key indicators">
    ${kpiCard('population', year, 2)}
    ${kpiCard('gdp', year, 1)}
    ${kpiCard('gdpPerCapita', year, 0)}
    ${kpiCard('tourists', year, 1)}
  </section>
  <div class="grid cols2" style="margin-top:16px">
    ${chartCard('Real GDP growth, 2015–' + LATEST,
      barChart(gdp, { label: 'Real GDP growth by year', decimals: 1, highlight: year }),
      SERIES.growth.source,
      `<p class="chart-note">Growth turned negative only in 2020, the pandemic year (−6.1%). The gold bar marks ${year}.</p>`)}
    <section class="card"><h2>What changed in ${year}</h2>
      <ul class="tight">${notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
      <p><a href="#/economy">Read the economy in full →</a></p>
    </section>
  </div>
  <div class="grid cols2" style="margin-top:16px">
    ${chartCard('Population, 2015–' + LATEST,
      lineChart(pop, { label: 'Population by year', decimals: 1, color: '#0e6e5d' }),
      SERIES.population.source,
      `<p class="chart-note">${esc(SERIES.population.note)}</p>`)}
    <section class="card"><h2>Thailand at a glance · ${SNAPSHOT.year}</h2>
      <ul class="keyfacts">${SNAPSHOT.facts.map((f) =>
        `<li><span class="kf-label">${esc(f.label)}<br><span class="small">${esc(f.detail)}</span></span><span class="kf-value">${esc(f.value)}</span></li>`).join('')}
      </ul>
      ${srcLine('World Bank WDI; NESDC; NSO; Bank of Thailand; Ministry of Tourism & Sports, 2024.')}
      <p><a href="#/sources">Full sources &amp; methods →</a></p>
    </section>
  </div>
  <div class="grid cols2" style="margin-top:16px">
    <section class="card"><h2>When new figures land</h2>
      <ul class="tight">${RELEASES.slice(0, 3).map((r) => `<li><b>${esc(r.dataset)}</b> — ${esc(r.publisher)}, ${esc(r.frequency.toLowerCase())}; next: ${esc(r.next)}.</li>`).join('')}</ul>
      <p><a href="#/sources">Full release calendar →</a></p>
    </section>
    <section class="card"><h2>Start with a question</h2>
      <div class="pill-row">
        <a class="pill" href="#/economy">How fast is the economy growing?</a>
        <a class="pill" href="#/trade">What does Thailand export?</a>
        <a class="pill" href="#/people">How old is the population?</a>
        <a class="pill" href="#/provinces">Where do people live?</a>
      </div>
      <p class="small">Each section answers one question with a chart, a table and a source — no figure without a citation.</p>
    </section>
  </div>`;
}

// ---------- Economy ----------
export function viewEconomy(year, chartKind) {
  const kind = chartKind === 'line' ? 'line' : 'bar';
  const gdp = seriesPairs('gdp');
  const growth = seriesPairs('growth');
  const chart = kind === 'line'
    ? lineChart(gdp, { label: 'GDP in current US dollars by year', decimals: 0, color: '#1f2a5c' })
    : barChart(gdp, { label: 'GDP in current US dollars by year', decimals: 0, highlight: year });
  const sectorRows = SECTORS.rows.map((r, i) =>
    `<li><span class="kf-label"><span class="sw" style="display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:6px;background:${['#1f2a5c', '#d99a16', '#0e6e5d'][i]}"></span>${esc(r.name)}<br><span class="small">${esc(r.detail)}</span></span><span class="kf-value">${fmt(r.share, 1)}%</span></li>`).join('');
  const rows = YEARS.map((y) =>
    `<tr${y === year ? ' class="hl"' : ''}><td>${y}</td><td>${fmt(SERIES.gdp.values[y], 1)}</td><td>${fmt(SERIES.gdpPerCapita.values[y], 0)}</td><td>${fmt(SERIES.growth.values[y], 1)}%</td><td>${fmt(SERIES.inflation.values[y], 1)}%</td></tr>`).join('');
  return `
  <p class="eyebrow">Economy</p>
  <h1>The economy: size, growth and prices</h1>
  <p class="lede">Thailand is Southeast Asia's second-largest economy. GDP passed US$ 500 billion in 2018, fell back in the pandemic, and reached a record US$ 526.5 billion in 2024.</p>
  <div class="toolbar">${yearPicker(year)}
    <span class="seg" role="group" aria-label="Chart type">
      <button type="button" data-control="chart-kind" data-kind="bar" aria-pressed="${kind === 'bar'}">Bars</button>
      <button type="button" data-control="chart-kind" data-kind="line" aria-pressed="${kind === 'line'}">Line</button>
    </span>
  </div>
  <section class="grid kpis" aria-label="Key indicators">
    ${kpiCard('gdp', year, 1)}${kpiCard('growth', year, 1)}${kpiCard('gdpPerCapita', year, 0)}${kpiCard('inflation', year, 1)}
  </section>
  <div class="grid cols2" style="margin-top:16px">
    ${chartCard('GDP, current US$ billion, 2015–' + LATEST, chart, SERIES.gdp.source,
      `<p class="chart-note">The gold bar marks ${year}. GDP per capita in ${year} was US$ ${fmt(SERIES.gdpPerCapita.values[year], 0)}.</p>`)}
    <section class="card"><h2>What the economy is made of · ${SECTORS.year}</h2>
      <div class="donut-wrap">${donutChart(SECTORS.rows.map((r) => ({ name: r.name, share: r.share })), { center: '58.4%', centerSub: 'services' })}
      <div class="donut-legend"><ul class="keyfacts">${sectorRows}</ul></div></div>
      ${srcLine(SECTORS.source)}
    </section>
  </div>
  <div class="grid cols2" style="margin-top:16px">
    ${chartCard('Real GDP growth, 2015–' + LATEST,
      barChart(growth, { label: 'Real GDP growth by year', decimals: 1, highlight: year }),
      SERIES.growth.source,
      `<p class="chart-note">Average growth 2015–2019 was 3.5% a year; 2020–2024 averaged 0.6%, dragged down by the pandemic.</p>`)}
    <section class="card"><h2>Reading the numbers</h2>
      <ul class="tight">
        <li><b>Growth</b> is real GDP — the change in the volume of output, after inflation. — NESDC</li>
        <li><b>GDP in dollars</b> moves with the baht: a weaker baht shrinks the dollar figure even when output grows. In 2024 the baht averaged ฿36.1 per dollar. — Bank of Thailand</li>
        <li><b>Public debt</b> reached 61.9% of GDP in 2024, up from 41.2% before the pandemic. — IMF WEO, Oct 2025</li>
        <li><b>Prices</b> rose 0.4% in 2024, after 6.1% in 2022 — the fastest in 14 years. — Bank of Thailand</li>
      </ul>
      <p><a href="#/explorer">Compare every indicator in the explorer →</a></p>
    </section>
  </div>
  <section class="card" style="margin-top:16px"><h2>The decade in one table</h2>
    <div class="tablewrap"><table class="data"><thead><tr><th>Year</th><th>GDP (US$ bn)</th><th>Per capita (US$)</th><th>Growth</th><th>Inflation</th></tr></thead>
    <tbody>${rows}</tbody></table></div>
    ${srcLine('World Bank WDI 2024; NESDC national accounts; Bank of Thailand CPI. The highlighted row is the selected year.')}
  </section>`;
}

// ---------- People ----------
export function viewPeople(year) {
  const pop = seriesPairs('population');
  const life = seriesPairs('lifeExpectancy');
  const ageBars = AGE.rows.map((r) => ({ name: r.group, value: r.share }));
  const ageRows = AGE.rows.map((r) =>
    `<tr><td>${esc(r.group)}</td><td>${fmt(r.share, 1)}%</td><td>${esc(r.people)}</td><td><span class="bar-cell"><span class="bar-track"><span class="bar-fill" style="display:block;width:${(r.share / 45 * 100).toFixed(0)}%"></span></span></span></td></tr>`).join('');
  return `
  <p class="eyebrow">People</p>
  <h1>71.7 million people, and getting older</h1>
  <p class="lede">Thailand's population has almost stopped growing — it fell slightly in 2024 — and the median age is now ${fmt(AGE.medianAge, 1)}, one of the highest in Asia. One in seven Thais is over 65.</p>
  <div class="toolbar">${yearPicker(year)}</div>
  <section class="grid kpis" aria-label="Key indicators">
    ${kpiCard('population', year, 2)}${kpiCard('lifeExpectancy', year, 1)}${kpiCard('urban', year, 1)}${kpiCard('unemployment', year, 1)}
  </section>
  <div class="grid cols2" style="margin-top:16px">
    ${chartCard('Population, 2015–' + LATEST,
      lineChart(pop, { label: 'Population by year', decimals: 1, color: '#0e6e5d' }),
      SERIES.population.source,
      `<p class="chart-note">${esc(SERIES.population.note)}</p>`)}
    ${chartCard('Life expectancy at birth, 2015–' + LATEST,
      lineChart(life, { label: 'Life expectancy by year', decimals: 1, color: '#a6192e' }),
      SERIES.lifeExpectancy.source,
      `<p class="chart-note">Life expectancy dipped in 2021, the worst pandemic year, then recovered to 76.6 years in 2024.</p>`)}
  </div>
  <div class="grid cols2" style="margin-top:16px">
    <section class="card"><h2>Age structure · ${AGE.year}</h2>
      <div class="chartbox">${hbarChart(ageBars, { label: 'Share of population by age group', decimals: 1, suffix: '%', color: '#1f2a5c', labelWidth: 120 })}</div>
      ${srcLine(AGE.source)}
    </section>
    <section class="card"><h2>Age groups in detail · ${AGE.year}</h2>
      <div class="tablewrap"><table class="data"><thead><tr><th>Age group</th><th>Share</th><th>People</th><th></th></tr></thead><tbody>${ageRows}</tbody></table></div>
      ${srcLine(AGE.source)}
      <p class="small">Median age ${fmt(AGE.medianAge, 1)} years. ${esc(AGE.medianAgeSource)}</p>
    </section>
  </div>
  <div class="grid cols2" style="margin-top:16px">
    <section class="card"><h2>Key facts · ${year}</h2>
      <ul class="keyfacts">
        <li><span class="kf-label">Population</span><span class="kf-value">${fmt(SERIES.population.values[year], 2)} million</span></li>
        <li><span class="kf-label">Urban share</span><span class="kf-value">${fmt(SERIES.urban.values[year], 1)}%</span></li>
        <li><span class="kf-label">Life expectancy</span><span class="kf-value">${fmt(SERIES.lifeExpectancy.values[year], 1)} years</span></li>
        <li><span class="kf-label">Unemployment</span><span class="kf-value">${fmt(SERIES.unemployment.values[year], 1)}%</span></li>
        <li><span class="kf-label">Births per woman (2024)</span><span class="kf-value">1.0</span></li>
        <li><span class="kf-label">Median age (2024)</span><span class="kf-value">${fmt(AGE.medianAge, 1)} years</span></li>
      </ul>
      ${srcLine('World Bank WDI; UN World Population Prospects 2024; NSO Labour Force Survey. Fertility: UN WPP 2024 estimate, 1.0 children per woman.')}
    </section>
    <section class="card"><h2>Where people work</h2>
      <ul class="tight">
        <li><b>Services</b> employ about 46% of workers — trade, tourism, transport and government.</li>
        <li><b>Agriculture</b> still employs about 30%, though it makes under 9% of GDP.</li>
        <li><b>Industry</b> employs about 23%, concentrated around Bangkok and the Eastern Seaboard.</li>
        <li><b>Unemployment</b> was 1.0% in ${year} — low by any standard, though much work is informal.</li>
      </ul>
      ${srcLine('NSO Labour Force Survey 2024; ILO modelled estimates. Employment shares are approximate.')}
      <p><a href="#/provinces">See where people live, by province →</a></p>
    </section>
  </div>`;
}

// ---------- Trade & Tourism ----------
export function viewTrade(year, tab) {
  const active = tab === 'partners' ? 'partners' : tab === 'tourism' ? 'tourism' : 'products';
  const trade = YEARS.map((y) => ({ year: y, exports: SERIES.exports.values[y], imports: SERIES.imports.values[y] }));
  const maxV = Math.max(...trade.flatMap((d) => [d.exports, d.imports]));
  const W = 640, H = 300, padL = 52, padR = 14, padT = 22, padB = 30;
  const y = (v) => padT + ((maxV * 1.1 - v) / (maxV * 1.1)) * (H - padT - padB);
  const slot = (W - padL - padR) / trade.length;
  let bars = '';
  for (const tv of [0, 100, 200, 300]) {
    bars += `<line x1="${padL}" y1="${y(tv)}" x2="${W - padR}" y2="${y(tv)}" stroke="#e8e2d2" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${y(tv) + 4}" text-anchor="end" font-size="11" fill="#66707e">${tv}</text>`;
  }
  trade.forEach((d, i) => {
    const cx = padL + slot * i + slot / 2;
    bars += `<rect x="${(cx - 20).toFixed(1)}" y="${y(d.exports).toFixed(1)}" width="18" height="${(y(0) - y(d.exports)).toFixed(1)}" rx="3" fill="#1f2a5c"/>` +
      `<rect x="${(cx + 2).toFixed(1)}" y="${y(d.imports).toFixed(1)}" width="18" height="${(y(0) - y(d.imports)).toFixed(1)}" rx="3" fill="#d99a16"/>` +
      `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#66707e">${d.year}</text>`;
  });
  const tradeSvg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Exports and imports by year"><line x1="${padL}" y1="${y(0)}" x2="${W - padR}" y2="${y(0)}" stroke="#cfc7b2" stroke-width="1.5"/>${bars}</svg>`;
  const tourists = seriesPairs('tourists');
  let body = '';
  if (active === 'products') {
    body = `<div class="chartbox">${hbarChart(EXPORT_PRODUCTS.rows.map((r) => ({ name: r.name, value: r.share })), { label: 'Share of merchandise exports by product group', decimals: 1, suffix: '%', labelWidth: 240, colorFor: (_r, i) => ['#1f2a5c', '#1f2a5c', '#1f2a5c', '#d99a16', '#d99a16', '#d99a16', '#0e6e5d', '#0e6e5d'][i] })}</div>
    <p class="chart-note">Electronics and vehicles together are nearly a third of everything Thailand sells abroad.</p>${srcLine(EXPORT_PRODUCTS.source)}`;
  } else if (active === 'partners') {
    body = `<div class="chartbox">${hbarChart(EXPORT_PARTNERS.rows.map((r) => ({ name: r.name, value: r.share })), { label: 'Share of merchandise exports by destination', decimals: 1, suffix: '%', labelWidth: 120, color: '#0e6e5d' })}</div>
    <p class="chart-note">The United States overtook China as Thailand's largest export market in 2024.</p>${srcLine(EXPORT_PARTNERS.source)}`;
  } else {
    body = `<div class="chartbox">${hbarChart(TOURIST_SOURCES.rows.map((r) => ({ name: r.name, value: r.arrivals })), { label: 'Tourist arrivals by source market, millions', decimals: 2, suffix: 'm', labelWidth: 120, color: '#a6192e' })}</div>
    <p class="chart-note">China is back as the top source market, with 6.73 million arrivals in 2024 — still below its 2019 peak of 11 million.</p>${srcLine(TOURIST_SOURCES.source)}`;
  }
  return `
  <p class="eyebrow">Trade &amp; Tourism</p>
  <h1>What Thailand sells, and who comes to visit</h1>
  <p class="lede">Thailand exported a record US$ 300.5 billion of goods in 2024, and welcomed 35.5 million visitors — 89% of the pre-pandemic record. Tourism alone brings in about 9% of GDP.</p>
  <div class="toolbar">${yearPicker(year)}</div>
  <section class="grid kpis" aria-label="Key indicators">
    ${kpiCard('exports', year, 1)}${kpiCard('imports', year, 1)}${kpiCard('tourists', year, 1)}${kpiCard('tourismReceipts', year, 0)}
  </section>
  <div class="grid cols2" style="margin-top:16px">
    <section class="card"><h2>Exports vs imports, 2015–${LATEST} (US$ bn)</h2>
      <div class="chartbox">${tradeSvg}</div>
      <div class="legend"><span><span class="sw" style="background:#1f2a5c"></span>Exports</span><span><span class="sw" style="background:#d99a16"></span>Imports</span></div>
      ${srcLine(SERIES.exports.source + ' ' + SERIES.imports.source)}
    </section>
    ${chartCard('Tourist arrivals, 2015–' + LATEST,
      barChart(tourists, { label: 'International tourist arrivals by year', decimals: 1, color: '#a6192e', highlight: year }),
      SERIES.tourists.source,
      `<p class="chart-note">Arrivals fell 83% in 2020 and nearly to zero in 2021, then recovered in three years.</p>`)}
  </div>
  <section class="card" style="margin-top:16px"><h2>Break it down · ${EXPORT_PRODUCTS.year}</h2>
    <div class="toolbar" style="margin-bottom:10px">
      <span class="seg" role="group" aria-label="Breakdown">
        <button type="button" data-control="trade-tab" data-tab="products" aria-pressed="${active === 'products'}">Export products</button>
        <button type="button" data-control="trade-tab" data-tab="partners" aria-pressed="${active === 'partners'}">Export partners</button>
        <button type="button" data-control="trade-tab" data-tab="tourism" aria-pressed="${active === 'tourism'}">Tourist sources</button>
      </span>
    </div>
    ${body}
  </section>
  <section class="card" style="margin-top:16px"><h2>Trade balance, 2015–${LATEST}</h2>
    <div class="tablewrap"><table class="data"><thead><tr><th>Year</th><th>Exports (US$ bn)</th><th>Imports (US$ bn)</th><th>Balance (US$ bn)</th></tr></thead>
    <tbody>${YEARS.map((y2) => {
      const bal = SERIES.exports.values[y2] - SERIES.imports.values[y2];
      return `<tr${y2 === year ? ' class="hl"' : ''}><td>${y2}</td><td>${fmt(SERIES.exports.values[y2], 1)}</td><td>${fmt(SERIES.imports.values[y2], 1)}</td><td>${bal >= 0 ? '+' : ''}${fmt(bal, 1)}</td></tr>`;
    }).join('')}</tbody></table></div>
    ${srcLine('Ministry of Commerce, Thailand, trade statistics 2024. Balance = exports minus imports.')}
  </section>`;
}

// ---------- Provinces ----------
export function viewProvinces(year, query, region, sortKey) {
  const q = (query || '').trim().toLowerCase();
  const regions = ['All regions', 'Central', 'North', 'Northeast', 'South'];
  let rows = PROVINCES.rows.filter((r) =>
    (!q || r.name.toLowerCase().includes(q)) && (region === 'All regions' || r.region === region));
  const byPop = (a, b) => b.pop - a.pop;
  const byName = (a, b) => a.name.localeCompare(b.name);
  rows = rows.slice().sort(sortKey === 'name' ? byName : byPop);
  const total = PROVINCES.rows.reduce((s, r) => s + r.pop, 0);
  const tableRows = rows.map((r, i) =>
    `<tr><td>${i + 1}</td><td>${esc(r.name)}</td><td>${esc(r.region)}</td><td>${fmt(r.pop, 2)}</td><td>${fmt((r.pop / 71.67) * 100, 1)}%</td><td><span class="bar-cell"><span class="bar-track"><span class="bar-fill ${i < 3 ? 'gold' : ''}" style="display:block;width:${(r.pop / 5.46 * 100).toFixed(0)}%"></span></span></span></td></tr>`).join('');
  return `
  <p class="eyebrow">Provinces</p>
  <h1>Where people live: the 12 largest provinces</h1>
  <p class="lede">Bangkok holds 5.46 million registered residents — and about 10 million people by day. The Northeast (Isan) holds six of the twelve largest provinces. Search or filter the table below.</p>
  <div class="toolbar">
    <label>Search <input type="text" id="prov-search" data-control="prov-search" value="${esc(query || '')}" placeholder="e.g. Chiang" aria-label="Search provinces"></label>
    <label>Region <select data-control="prov-region">${regions.map((r) => `<option${r === region ? ' selected' : ''}>${r}</option>`).join('')}</select></label>
    <span class="seg" role="group" aria-label="Sort provinces">
      <button type="button" data-control="prov-sort" data-sort="pop" aria-pressed="${sortKey !== 'name'}">Largest first</button>
      <button type="button" data-control="prov-sort" data-sort="name" aria-pressed="${sortKey === 'name'}">A–Z</button>
    </span>
  </div>
  <section class="card"><h2>Registered population · ${PROVINCES.year}</h2>
    ${rows.length === 0
      ? `<p class="empty">No province matches “${esc(query || '')}”. Try clearing the search.</p>`
      : `<div class="tablewrap"><table class="data"><thead><tr><th>#</th><th>Province</th><th>Region</th><th>People (m)</th><th>Share of Thailand</th><th></th></tr></thead><tbody>${tableRows}</tbody></table></div>
      <p class="small" style="margin-top:.8em">Showing ${rows.length} of 12 provinces · together ${fmt(total, 1)} million registered residents, ${fmt((total / 71.67) * 100, 0)}% of the population.</p>`}
    ${srcLine(PROVINCES.source)}
    <p class="chart-note">${esc(PROVINCES.note)}</p>
  </section>
  <div class="grid cols2" style="margin-top:16px">
    <section class="card"><h2>The four regions</h2>
      <ul class="keyfacts">
        <li><span class="kf-label">Central (incl. Bangkok)</span><span class="kf-value">~26 million</span></li>
        <li><span class="kf-label">Northeast (Isan)</span><span class="kf-value">~22 million</span></li>
        <li><span class="kf-label">North</span><span class="kf-value">~12 million</span></li>
        <li><span class="kf-label">South</span><span class="kf-value">~10 million</span></li>
      </ul>
      ${srcLine('NSO / DOPA regional totals, 2024 (rounded).')}
    </section>
    <section class="card"><h2>Why Bangkok dominates</h2>
      <ul class="tight">
        <li>About a fifth of the country's GDP is produced in Bangkok alone.</li>
        <li>The city is the hub for finance, government, media and higher education.</li>
        <li>Its registered population understates it: millions commute in from surrounding provinces each day.</li>
      </ul>
      <p><a href="#/economy">Back to the economy →</a></p>
    </section>
  </div>`;
}

// ---------- Data Explorer ----------
export function explorerStateFromHash(hash) {
  const parts = hash.replace(/^#\/explorer\/?/, '').split('/');
  return {
    indicator: SERIES[parts[0]] ? parts[0] : 'gdp',
    from: Number(parts[1]) || 2015,
    to: Number(parts[2]) || LATEST,
  };
}

export function viewExplorer(indicator, from, to) {
  const s = SERIES[indicator];
  const lo = Math.max(2015, Math.min(from, to));
  const hi = Math.min(LATEST, Math.max(from, to));
  const pairs = seriesPairs(indicator, lo, hi);
  const first = pairs[0].value, last = pairs[pairs.length - 1].value;
  const change = ((last - first) / Math.abs(first)) * 100;
  const avg = pairs.reduce((a, d) => a + d.value, 0) / pairs.length;
  const opts = Object.entries(SERIES).map(([k, v]) =>
    `<option value="${k}"${k === indicator ? ' selected' : ''}>${esc(v.label)} (${esc(v.unit)})</option>`).join('');
  const rows = pairs.map((d) =>
    `<tr><td>${d.year}</td><td>${fmt(d.value, indicator === 'gdpPerCapita' ? 0 : 1)}</td><td>${d.year > 2015 ? `${seriesChange(indicator, d.year) >= 0 ? '+' : ''}${fmt(seriesChange(indicator, d.year), 1)}%` : '—'}</td></tr>`).join('');
  return `
  <p class="eyebrow">Data Explorer</p>
  <h1>Every indicator, every year</h1>
  <p class="lede">Pick an indicator and a year range. The chart, the table and the CSV download all follow your choice — nothing here is a dead end.</p>
  <div class="explorer-grid">
    <section class="card explorer-panel"><h2>Choose what to see</h2>
      <label for="ex-ind">Indicator</label>
      <select id="ex-ind" data-control="ex-ind">${opts}</select>
      <label for="ex-from">From year</label>
      <select id="ex-from" data-control="ex-from">${YEARS.map((y) => `<option${y === lo ? ' selected' : ''}>${y}</option>`).join('')}</select>
      <label for="ex-to">To year</label>
      <select id="ex-to" data-control="ex-to">${YEARS.map((y) => `<option${y === hi ? ' selected' : ''}>${y}</option>`).join('')}</select>
      <p class="statline" style="margin-top:16px">${esc(s.label)} in ${hi}: <b>${fmt(last, indicator === 'gdpPerCapita' ? 0 : 1)} ${esc(s.unit)}</b></p>
      <p class="small">Change over the chosen range: <b>${change >= 0 ? '+' : ''}${fmt(change, 1)}%</b> · Average: <b>${fmt(avg, indicator === 'gdpPerCapita' ? 0 : 1)}</b></p>
      <div class="btnrow" style="margin-top:12px">
        <button class="btn small" type="button" data-control="ex-csv">Download CSV ↓</button>
        <a class="btn small secondary" href="#/sources">How figures are sourced</a>
      </div>
    </section>
    <div>
      ${chartCard(`${s.label}, ${lo}–${hi}`,
        lineChart(pairs, { label: `${s.label} by year`, decimals: indicator === 'gdpPerCapita' ? 0 : 1, color: '#1f2a5c' }),
        s.source)}
      <section class="card" style="margin-top:16px"><h2>Values · ${lo}–${hi}</h2>
        <div class="tablewrap"><table class="data"><thead><tr><th>Year</th><th>${esc(s.label)} (${esc(s.unit)})</th><th>Change</th></tr></thead><tbody>${rows}</tbody></table></div>
        ${srcLine(s.source)}
      </section>
    </div>
  </div>`;
}

// ---------- Sources ----------
export function viewSources() {
  return `
  <p class="eyebrow">Sources &amp; Methods</p>
  <h1>Where every number comes from</h1>
  <p class="lede">ThaiStat republishes official statistics. Figures are rounded for display; the underlying series are the publishers' own. If a figure looks wrong, check the publisher first — the links below are the editions used.</p>
  <div class="grid cols2">
    <section class="card"><h2>Publishers used</h2>
      <ul class="tight">
        <li><b>World Bank, World Development Indicators</b> — population, GDP, GDP per capita, life expectancy, urban share. Accessed November 2026.</li>
        <li><b>NESDC</b> (National Economic and Social Development Council) — national accounts and real GDP growth.</li>
        <li><b>Bank of Thailand</b> — consumer prices and the baht exchange rate.</li>
        <li><b>National Statistical Office</b> — Labour Force Survey and unemployment.</li>
        <li><b>Ministry of Commerce</b> — merchandise trade statistics.</li>
        <li><b>Ministry of Tourism &amp; Sports</b> — tourist arrivals and receipts.</li>
        <li><b>Department of Provincial Administration (DOPA)</b> — registered population by province.</li>
        <li><b>IMF, World Economic Outlook (Oct 2025)</b> — general government debt.</li>
        <li><b>UN World Population Prospects 2024</b> — age structure and median age.</li>
      </ul>
    </section>
    <section class="card"><h2>Methods &amp; notes</h2>
      <ul class="tight">
        <li>All series cover 2015–2024 unless a page says otherwise.</li>
        <li>“Real” growth is adjusted for inflation; dollar GDP is at current prices and moves with the baht.</li>
        <li>Population follows the World Bank series. Its 2021 step is a UN revision of the estimate, not a census jump.</li>
        <li>Provincial figures are <i>registered</i> residents (DOPA). Bangkok's daytime population is far larger.</li>
        <li>Tourism receipts are international receipts only, in baht; domestic travel is a separate line.</li>
        <li>Employment shares are approximate, from the Labour Force Survey.</li>
      </ul>
      <div class="callout"><p><b>A note on accuracy.</b> Official statistics are revised. The figures here are the editions available in November 2026; later revisions by the publishers supersede them.</p></div>
    </section>
  </div>
  <section class="card" style="margin-top:16px"><h2>Release calendar — when the next figures land</h2>
    <div class="tablewrap"><table class="data"><thead><tr><th>Dataset</th><th>Publisher</th><th>Frequency</th><th>Next release</th></tr></thead>
    <tbody>${RELEASES.map((r) => `<tr><td>${esc(r.dataset)}</td><td>${esc(r.publisher)}</td><td>${esc(r.frequency)}</td><td>${esc(r.next)}</td></tr>`).join('')}</tbody></table></div>
    ${srcLine('Publisher release calendars, as announced November 2026. Dates are indicative.')}
  </section>
  <section class="card" style="margin-top:16px"><h2>About ThaiStat</h2>
    <p>ThaiStat is an independent site built for the make.fun “best national statistics site” competition. It is not affiliated with the National Statistical Office of Thailand, the World Bank, or any government body. All data is bundled with the site, which runs entirely offline from its own files and makes no network requests.</p>
    <p><a href="#/">Back to the overview →</a></p>
  </section>`;
}
