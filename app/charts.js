// ThaiStat — chart builders. Plain SVG, no libraries: line charts, bar charts,
// horizontal bars and donuts, all drawn from the data in data.js.

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fmt(v, digits = 1) {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  return Number(v).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function niceTicks(min, max, count = 4) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const stepRaw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(stepRaw)));
  const norm = stepRaw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let t = lo; t <= hi + step * 0.001; t += step) ticks.push(Number(t.toFixed(10)));
  return { lo, hi, ticks };
}

// Line chart with labelled points and a shaded area. `series` is [{year, value}].
export function lineChart(series, opts = {}) {
  const W = opts.width || 640, H = opts.height || 300;
  const padL = 52, padR = 14, padT = 16, padB = 30;
  const vals = series.map((d) => d.value).filter((v) => v !== null && v !== undefined);
  let min = Math.min(...vals), max = Math.max(...vals);
  if (opts.zero !== false) min = Math.min(0, min);
  const t = niceTicks(min, max, 4);
  const x = (i) => padL + (i * (W - padL - padR)) / Math.max(1, series.length - 1);
  const y = (v) => padT + ((t.hi - v) / (t.hi - t.lo)) * (H - padT - padB);
  const color = opts.color || '#1f2a5c';
  const pts = series.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const area = `M${x(0).toFixed(1)},${y(t.lo).toFixed(1)} ` +
    series.map((d, i) => `L${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ') +
    ` L${x(series.length - 1).toFixed(1)},${y(t.lo).toFixed(1)} Z`;
  let g = '';
  for (const tv of t.ticks) {
    g += `<line x1="${padL}" y1="${y(tv)}" x2="${W - padR}" y2="${y(tv)}" stroke="#e8e2d2" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${y(tv) + 4}" text-anchor="end" font-size="11" fill="#66707e">${fmt(tv, 0)}</text>`;
  }
  g += `<path d="${area}" fill="${color}" opacity="0.08"/>` +
    `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  series.forEach((d, i) => {
    const show = i === 0 || i === series.length - 1 || i % 2 === 0;
    g += `<circle cx="${x(i)}" cy="${y(d.value)}" r="3.5" fill="#fffdf8" stroke="${color}" stroke-width="2"/>`;
    if (show) g += `<text x="${x(i)}" y="${y(d.value) - 9}" text-anchor="middle" font-size="11" font-weight="700" fill="${color}">${fmt(d.value, opts.decimals ?? 1)}</text>`;
    g += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#66707e">${d.year}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || 'Line chart')}">${g}</svg>`;
}

// Vertical bar chart. Negative values draw below the zero line.
export function barChart(series, opts = {}) {
  const W = opts.width || 640, H = opts.height || 300;
  const padL = 52, padR = 14, padT = 22, padB = 30;
  const vals = series.map((d) => d.value);
  const min = Math.min(0, ...vals), max = Math.max(0, ...vals);
  const t = niceTicks(min, max, 4);
  const y = (v) => padT + ((t.hi - v) / (t.hi - t.lo)) * (H - padT - padB);
  const slot = (W - padL - padR) / series.length;
  const bw = Math.min(44, slot * 0.62);
  const color = opts.color || '#1f2a5c';
  const negColor = opts.negColor || '#a6192e';
  let g = '';
  for (const tv of t.ticks) {
    g += `<line x1="${padL}" y1="${y(tv)}" x2="${W - padR}" y2="${y(tv)}" stroke="#e8e2d2" stroke-width="1"/>` +
      `<text x="${padL - 8}" y="${y(tv) + 4}" text-anchor="end" font-size="11" fill="#66707e">${fmt(tv, 0)}</text>`;
  }
  g += `<line x1="${padL}" y1="${y(0)}" x2="${W - padR}" y2="${y(0)}" stroke="#cfc7b2" stroke-width="1.5"/>`;
  series.forEach((d, i) => {
    const cx = padL + slot * i + slot / 2;
    const top = y(Math.max(0, d.value)), bot = y(Math.min(0, d.value));
    const fill = d.value < 0 ? negColor : (opts.highlight === d.year ? '#d99a16' : color);
    g += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(1, bot - top).toFixed(1)}" rx="3" fill="${fill}"/>`;
    g += `<text x="${cx}" y="${(d.value < 0 ? bot + 14 : top - 6).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="${d.value < 0 ? negColor : color}">${fmt(d.value, opts.decimals ?? 1)}</text>`;
    g += `<text x="${cx}" y="${H - 8}" text-anchor="middle" font-size="11" fill="#66707e">${d.year}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || 'Bar chart')}">${g}</svg>`;
}

// Horizontal bars with labels, e.g. top export products. `rows` is [{name, value}].
export function hbarChart(rows, opts = {}) {
  const rowH = opts.rowHeight || 34, padL = 0;
  const max = Math.max(...rows.map((r) => r.value));
  const W = opts.width || 640;
  const H = rows.length * rowH + 8;
  const color = opts.color || '#1f2a5c';
  const labelW = opts.labelWidth || 210;
  let g = '';
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const barW = ((W - labelW - 70) * r.value) / max;
    const fill = opts.colorFor ? opts.colorFor(r, i) : color;
    g += `<text x="${padL}" y="${y + 15}" font-size="12.5" fill="#22252e">${esc(r.name)}</text>`;
    g += `<rect x="${labelW}" y="${y + 4}" width="${Math.max(2, barW).toFixed(1)}" height="14" rx="4" fill="${fill}"/>`;
    g += `<text x="${labelW + barW + 8}" y="${y + 16}" font-size="12" font-weight="700" fill="${fill}">${fmt(r.value, opts.decimals ?? 1)}${opts.suffix || ''}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label || 'Horizontal bar chart')}">${g}</svg>`;
}

// Donut chart. `rows` is [{name, share}]; shares should sum to ~100.
export function donutChart(rows, opts = {}) {
  const size = opts.size || 190;
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, hole = r * 0.58;
  const colors = opts.colors || ['#1f2a5c', '#d99a16', '#0e6e5d', '#a6192e', '#2456a6', '#7a5c1e'];
  const total = rows.reduce((s, row) => s + row.share, 0);
  let angle = -Math.PI / 2;
  let paths = '';
  rows.forEach((row, i) => {
    const frac = row.share / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + hole * Math.cos(a1), yi1 = cy + hole * Math.sin(a1);
    const xi0 = cx + hole * Math.cos(a0), yi0 = cy + hole * Math.sin(a0);
    paths += `<path d="M${x0.toFixed(1)},${y0.toFixed(1)} A${r},${r} 0 ${large} 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${xi1.toFixed(1)},${yi1.toFixed(1)} A${hole},${hole} 0 ${large} 0 ${xi0.toFixed(1)},${yi0.toFixed(1)} Z" fill="${colors[i % colors.length]}" stroke="#fffdf8" stroke-width="2"/>`;
  });
  const mid = `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="24" font-weight="700" fill="#141d42" font-family="Georgia, serif">${esc(opts.center || '')}</text>` +
    `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11.5" fill="#66707e">${esc(opts.centerSub || '')}</text>`;
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(opts.label || 'Donut chart')}">${paths}${mid}</svg>`;
}
