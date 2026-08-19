/* ============================================================
   charts.js — Generator Grafik SVG Murni (Radar & Pareto Scatter)
   Ringan, interaktif, bebas dependensi eksternal, dan responsif.
   ============================================================ */

import { el, esc, usd } from './ui.js';

export const PALETTE = [
  { stroke: '#7c8cff', fill: 'rgba(124, 140, 255, 0.28)', dot: '#7c8cff' },
  { stroke: '#28e0c8', fill: 'rgba(40, 224, 200, 0.28)',  dot: '#28e0c8' },
  { stroke: '#ffb454', fill: 'rgba(255, 180, 84, 0.28)',  dot: '#ffb454' },
  { stroke: '#ff6b81', fill: 'rgba(255, 107, 129, 0.28)', dot: '#ff6b81' },
];

/**
 * Membuat SVG Radar / Spider Chart untuk 1–4 model
 */
export function createRadarChart(models = [], categories = [], lang = 'id') {
  const size = 520;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const rMax = 180;
  const numCats = categories.length;
  const angleStep = (Math.PI * 2) / numCats;
  const startAngle = -Math.PI / 2; // Mulai dari atas

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${size} ${size + 40}`);
  svg.setAttribute('class', 'radar-chart-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', lang === 'id' ? 'Grafik Radar Kemampuan Model' : 'Model Capability Radar Chart');

  // Defs untuk filter glow
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  defs.innerHTML = `
    <filter id="radar-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  `;
  svg.appendChild(defs);

  // Group Background grid
  const gridG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridG.setAttribute('class', 'radar-grid');

  // 5 Tingkatan Konsentris (20, 40, 60, 80, 100)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
  levels.forEach((lvl, idx) => {
    const levelR = rMax * lvl;
    const pts = [];
    for (let i = 0; i < numCats; i++) {
      const a = startAngle + i * angleStep;
      pts.push(`${cx + levelR * Math.cos(a)},${cy + levelR * Math.sin(a)}`);
    }
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('fill', idx % 2 === 1 ? 'var(--surface-2)' : 'var(--surface)');
    poly.setAttribute('stroke', 'var(--line-strong)');
    poly.setAttribute('stroke-width', '1');
    poly.setAttribute('stroke-dasharray', lvl === 1.0 ? 'none' : '2,3');
    gridG.appendChild(poly);

    // Label level nilai (20, 40, 60, 80, 100)
    const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lbl.setAttribute('x', cx + 4);
    lbl.setAttribute('y', cy - levelR + 10);
    lbl.setAttribute('fill', 'var(--text-mute)');
    lbl.setAttribute('font-size', '9.5px');
    lbl.setAttribute('font-family', 'var(--mono)');
    lbl.textContent = String(Math.round(lvl * 100));
    gridG.appendChild(lbl);
  });

  // Sumbu radial dan label kategori
  categories.forEach((cat, i) => {
    const a = startAngle + i * angleStep;
    const xEnd = cx + rMax * Math.cos(a);
    const yEnd = cy + rMax * Math.sin(a);

    // Garis jari-jari
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', cx);
    line.setAttribute('y1', cy);
    line.setAttribute('x2', xEnd);
    line.setAttribute('y2', yEnd);
    line.setAttribute('stroke', 'var(--line)');
    line.setAttribute('stroke-width', '1');
    gridG.appendChild(line);

    // Posisi teks label (di luar poligon terluar)
    const labelDistance = rMax + 26;
    const lx = cx + labelDistance * Math.cos(a);
    const ly = cy + labelDistance * Math.sin(a);

    let textAnchor = 'middle';
    if (Math.cos(a) > 0.3) textAnchor = 'start';
    else if (Math.cos(a) < -0.3) textAnchor = 'end';

    const textG = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textG.setAttribute('x', lx);
    textG.setAttribute('y', ly);
    textG.setAttribute('text-anchor', textAnchor);
    textG.setAttribute('dominant-baseline', 'central');
    textG.setAttribute('class', 'radar-axis-label');
    textG.setAttribute('fill', 'var(--text)');
    textG.setAttribute('font-size', '11.5px');
    textG.setAttribute('font-weight', '600');

    const catName = cat.name[lang] || cat.name.en;
    const catWeightPct = Math.round(cat.weight * 100) + '%';
    textG.textContent = `${cat.icon} ${catName} (${catWeightPct})`;
    gridG.appendChild(textG);
  });
  svg.appendChild(gridG);

  // Group Poligon Model
  const dataG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  dataG.setAttribute('class', 'radar-data');

  models.forEach((m, mIdx) => {
    if (!m) return;
    const color = PALETTE[mIdx % PALETTE.length];
    const pts = [];
    const dots = [];

    categories.forEach((cat, i) => {
      const a = startAngle + i * angleStep;
      const score = m.scores[cat.id] != null ? m.scores[cat.id] : 50;
      const r = (score / 100) * rMax;
      const px = cx + r * Math.cos(a);
      const py = cy + r * Math.sin(a);
      pts.push(`${px},${py}`);
      dots.push({ px, py, score, catName: cat.name[lang] || cat.name.en, icon: cat.icon });
    });

    // Poligon terisi
    const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('fill', color.fill);
    poly.setAttribute('stroke', color.stroke);
    poly.setAttribute('stroke-width', '2.5');
    poly.setAttribute('stroke-linejoin', 'round');
    poly.setAttribute('class', `radar-poly radar-poly-${mIdx}`);
    dataG.appendChild(poly);

    // Titik-titik sudut interaktif
    dots.forEach((dot) => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', dot.px);
      circle.setAttribute('cy', dot.py);
      circle.setAttribute('r', '4.5');
      circle.setAttribute('fill', color.dot);
      circle.setAttribute('stroke', 'var(--bg-elev)');
      circle.setAttribute('stroke-width', '1.5');
      circle.setAttribute('class', 'radar-dot');

      // Title untuk tooltip native SVG
      const tip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      tip.textContent = `${m.name} → ${dot.icon} ${dot.catName}: ${dot.score}`;
      circle.appendChild(tip);

      dataG.appendChild(circle);
    });
  });
  svg.appendChild(dataG);

  return svg;
}

/**
 * Membuat SVG Scatter Plot Harga vs Kinerja dengan Kurva Pareto Frontier
 */
export function createParetoChart(models = [], lang = 'id', onPickModel) {
  const w = 720;
  const h = 420;
  const padL = 58;
  const padR = 30;
  const padT = 30;
  const padB = 54;

  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  // Domain X: Blended Price ($/1M token, log scale dari 0.05 s/d 25.0)
  const minPrice = 0.06;
  const maxPrice = 25.0;
  const logMin = Math.log10(minPrice);
  const logMax = Math.log10(maxPrice);

  const scaleX = (price) => {
    const val = Math.max(minPrice, Math.min(maxPrice, price));
    const ratio = (Math.log10(val) - logMin) / (logMax - logMin);
    return padL + ratio * innerW;
  };

  // Domain Y: Overall Score (75 s/d 98)
  const minY = 75;
  const maxY = 98;
  const scaleY = (score) => {
    const ratio = (score - minY) / (maxY - minY);
    return padT + innerH - ratio * innerH;
  };

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  svg.setAttribute('class', 'pareto-chart-svg');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', lang === 'id' ? 'Grafik Pareto Harga vs Kinerja' : 'Price vs Performance Pareto Chart');

  // Background Grid Lines
  const gridG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridG.setAttribute('class', 'pareto-grid');

  // X ticks: $0.1, $0.25, $0.5, $1.0, $2.5, $5.0, $10.0, $20.0
  const xTicks = [0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0, 20.0];
  xTicks.forEach((tick) => {
    const x = scaleX(tick);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x);
    line.setAttribute('y1', padT);
    line.setAttribute('x2', x);
    line.setAttribute('y2', padT + innerH);
    line.setAttribute('stroke', 'var(--line)');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', '3,3');
    gridG.appendChild(line);

    const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lbl.setAttribute('x', x);
    lbl.setAttribute('y', padT + innerH + 18);
    lbl.setAttribute('text-anchor', 'middle');
    lbl.setAttribute('fill', 'var(--text-mute)');
    lbl.setAttribute('font-size', '10.5px');
    lbl.setAttribute('font-family', 'var(--mono)');
    lbl.textContent = '$' + (tick < 1 ? tick.toFixed(2) : tick.toFixed(0));
    gridG.appendChild(lbl);
  });

  // Y ticks: 80, 85, 90, 95
  const yTicks = [75, 80, 85, 90, 95];
  yTicks.forEach((tick) => {
    const y = scaleY(tick);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', padL);
    line.setAttribute('y1', y);
    line.setAttribute('x2', padL + innerW);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'var(--line)');
    line.setAttribute('stroke-width', '1');
    line.setAttribute('stroke-dasharray', '3,3');
    gridG.appendChild(line);

    const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lbl.setAttribute('x', padL - 8);
    lbl.setAttribute('y', y + 3.5);
    lbl.setAttribute('text-anchor', 'end');
    lbl.setAttribute('fill', 'var(--text-mute)');
    lbl.setAttribute('font-size', '10.5px');
    lbl.setAttribute('font-family', 'var(--mono)');
    lbl.textContent = String(tick);
    gridG.appendChild(lbl);
  });
  svg.appendChild(gridG);

  // Axis Titles
  const titleX = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  titleX.setAttribute('x', padL + innerW / 2);
  titleX.setAttribute('y', h - 10);
  titleX.setAttribute('text-anchor', 'middle');
  titleX.setAttribute('fill', 'var(--text-dim)');
  titleX.setAttribute('font-size', '11.5px');
  titleX.setAttribute('font-weight', '600');
  titleX.textContent = lang === 'id' ? 'Biaya Blended per 1M Token (USD, Skala Logaritmik)' : 'Blended Cost per 1M Tokens (USD, Log Scale)';
  svg.appendChild(titleX);

  const titleY = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  titleY.setAttribute('x', -padT - innerH / 2);
  titleY.setAttribute('y', 16);
  titleY.setAttribute('transform', 'rotate(-90)');
  titleY.setAttribute('text-anchor', 'middle');
  titleY.setAttribute('fill', 'var(--text-dim)');
  titleY.setAttribute('font-size', '11.5px');
  titleY.setAttribute('font-weight', '600');
  titleY.textContent = lang === 'id' ? 'Skor Agregat BenchLM (0–100)' : 'BenchLM Aggregate Score (0–100)';
  svg.appendChild(titleY);

  // Hitung Pareto Frontier Points (model paling optimal di tiap rentang harga)
  const sortedByPrice = [...models].sort((a, b) => a.blend - b.blend);
  const paretoPoints = [];
  let currentMaxScore = -Infinity;

  sortedByPrice.forEach((m) => {
    if (m.overall > currentMaxScore) {
      currentMaxScore = m.overall;
      paretoPoints.push(m);
    }
  });

  // Gambar Garis Pareto Frontier
  if (paretoPoints.length > 1) {
    const paretoPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const d = paretoPoints.map((m, idx) => {
      const px = scaleX(m.blend);
      const py = scaleY(m.overall);
      return (idx === 0 ? 'M' : 'L') + ` ${px} ${py}`;
    }).join(' ');

    paretoPath.setAttribute('d', d);
    paretoPath.setAttribute('fill', 'none');
    paretoPath.setAttribute('stroke', 'var(--accent-2)');
    paretoPath.setAttribute('stroke-width', '2');
    paretoPath.setAttribute('stroke-dasharray', '4,4');
    paretoPath.setAttribute('opacity', '0.75');
    svg.appendChild(paretoPath);
  }

  // Model Bubbles
  const dotsG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  dotsG.setAttribute('class', 'pareto-dots');

  models.forEach((m) => {
    const cx = scaleX(m.blend);
    const cy = scaleY(m.overall);
    const isOpen = m.license === 'Open Weights';
    const isPareto = paretoPoints.some((p) => p.id === m.id);

    // Radius berdasarkan context window (6px s/d 14px)
    const r = m.ctx >= 1500000 ? 12 : m.ctx >= 200000 ? 9 : 7;
    const fillColor = isPareto
      ? (isOpen ? '#3ddc97' : '#7c8cff')
      : (isOpen ? '#ffb454' : 'var(--text-dim)');

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'pareto-node');
    g.setAttribute('style', 'cursor: pointer;');
    if (onPickModel) {
      g.addEventListener('click', () => onPickModel(m));
    }

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', String(r));
    circle.setAttribute('fill', fillColor);
    circle.setAttribute('fill-opacity', isPareto ? '0.88' : '0.65');
    circle.setAttribute('stroke', isPareto ? 'var(--text)' : 'var(--bg-elev)');
    circle.setAttribute('stroke-width', isPareto ? '2' : '1');

    // Label model di sebelah bubble
    const lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    lbl.setAttribute('x', cx + r + 4);
    lbl.setAttribute('y', cy + 3.5);
    lbl.setAttribute('fill', isPareto ? 'var(--text)' : 'var(--text-dim)');
    lbl.setAttribute('font-size', '10px');
    lbl.setAttribute('font-weight', isPareto ? '700' : '500');
    lbl.textContent = m.name;

    const tip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    tip.textContent = `${m.name} (${m.vendor})\n` +
      `Skor: ${m.overall}\n` +
      `Biaya Blended: $${m.blend}/1M\n` +
      `Konteks: ${m.ctx / 1000}k token\n` +
      `Kecepatan: ${m.speed} tok/s\n` +
      (isPareto ? '★ Pareto Frontier Optimal' : '');
    g.appendChild(tip);

    g.appendChild(circle);
    g.appendChild(lbl);
    dotsG.appendChild(g);
  });
  svg.appendChild(dotsG);

  return svg;
}
