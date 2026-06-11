/* ═══════════════════════════════════════════════════════
   SPORT TRACKER — app.js
   ═══════════════════════════════════════════════════════ */

/* ── Sport configuration ── */
const SC = {
  Run:              { icon: '🏃', lbl: 'Course',   color: '#FF6B35' },
  Ride:             { icon: '🚴', lbl: 'Vélo',     color: '#3B82F6' },
  MountainBikeRide: { icon: '🚵', lbl: 'VTT',      color: '#10B981' },
  Walk:             { icon: '🚶', lbl: 'Marche',   color: '#06B6D4' },
  Hike:             { icon: '🥾', lbl: 'Rando',    color: '#06B6D4' },
  Workout:          { icon: '🏅', lbl: 'Sport',    color: '#8B5CF6' },
  Musculation:      { icon: '🏋️', lbl: 'Muscu',    color: '#8B5CF6' },
  WeightTraining:   { icon: '🏋️', lbl: 'Muscu',    color: '#8B5CF6' },
  Tennis:           { icon: '🎾', lbl: 'Tennis',   color: '#8B5CF6' },
  Natation:         { icon: '🏊', lbl: 'Natation', color: '#3B82F6' },
  Other:            { icon: '💪', lbl: 'Autre',    color: '#9CA3AF' },
};

function sp(type) {
  return SC[type] || { icon: '🏅', lbl: type || 'Activité', color: '#9CA3AF' };
}

/* ════════════════════════════════════════════
   STATE
   ════════════════════════════════════════════ */
let STRAVA  = [];
let manual  = JSON.parse(localStorage.getItem('manual_v2') || '[]');
let goals   = JSON.parse(localStorage.getItem('goals_v2')  || 'null') || { sess: 3, min: 180, runKm: 15, rideKm: 50 };
let acts    = [...manual].sort((a, b) => new Date(b.ts || b.date) - new Date(a.ts || a.date));

let curPage  = 'dash';
let curChart = 'radar';
let calMo    = new Date();
let charts   = {};

function rebuildActs() {
  acts = [...STRAVA, ...manual].sort((a, b) => new Date(b.ts || b.date) - new Date(a.ts || a.date));
}

/* ════════════════════════════════════════════
   CHARGEMENT DATA.JSON (généré par GitHub Actions)
   ════════════════════════════════════════════ */
async function loadStravaData() {
  try {
    const resp = await fetch('./data.json?v=' + Date.now());
    if (!resp.ok) throw new Error('data.json introuvable');
    STRAVA = await resp.json();
    localStorage.setItem('strava_cache', JSON.stringify(STRAVA));
    return true;
  } catch (e) {
    // Fallback sur le cache localStorage
    const cache = JSON.parse(localStorage.getItem('strava_cache') || '[]');
    if (cache.length) {
      STRAVA = cache;
      console.log('📦 Données Strava chargées depuis le cache');
      return true;
    }
    return false;
  }
}

/* ════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════ */
function go(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('on'));
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('on'));
  document.querySelectorAll('.bni').forEach(el => el.classList.remove('on'));

  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('on');

  document.querySelectorAll(`[onclick="go('${page}')"]`).forEach(el => el.classList.add('on'));

  curPage = page;
  if (page === 'stats') setTimeout(() => renderCharts(), 80);
  if (page === 'goals') renderGoals();
  if (page === 'cal')   renderCal();
}

/* ════════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════════ */
function renderDash() {
  const now   = new Date();
  const wkSt  = getMonday(now);
  const moSt  = new Date(now.getFullYear(), now.getMonth(), 1);

  const wk = acts.filter(a => new Date(a.date) >= wkSt);
  const mo = acts.filter(a => new Date(a.date) >= moSt);

  const streak = calcStreak();
  document.getElementById('streak-el').innerHTML = streak > 0
    ? `<div class="streak">🔥 ${streak} jour${streak > 1 ? 's' : ''} d'affilée</div>`
    : '';

  const hr = now.getHours();
  document.getElementById('greet').textContent = (hr < 12 ? 'Bonjour' : 'Bonsoir') + ', Max 👋';

  const JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const MOIS  = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  document.getElementById('sub').textContent =
    `${cap(JOURS[now.getDay()])} ${now.getDate()} ${MOIS[now.getMonth()]} · ${wk.length} séance${wk.length !== 1 ? 's' : ''} cette semaine`;

  const moMin = mo.reduce((s, a) => s + (a.dur  || 0), 0);
  const moKm  = mo.reduce((s, a) => s + (a.dist || 0), 0);
  const moCal = mo.reduce((s, a) => s + (a.cal  || 0), 0);

  document.getElementById('stat-cards').innerHTML = `
    <div class="sc">
      <div class="lbl">Séances ce mois</div>
      <div class="val">${mo.length}</div>
      <div class="sub">${wk.length} cette semaine</div>
    </div>
    <div class="sc">
      <div class="lbl">Temps actif (mois)</div>
      <div class="val">${fmtDur(moMin)}</div>
      <div class="sub">Moy. ${fmtDur(Math.round(moMin / Math.max(mo.length, 1)))}/séance</div>
    </div>
    <div class="sc">
      <div class="lbl">Distance (mois)</div>
      <div class="val">${moKm.toFixed(1)}<span style="font-size:15px;font-weight:500"> km</span></div>
      <div class="sub">Course + Vélo + VTT</div>
    </div>
    <div class="sc">
      <div class="lbl">Calories (mois)</div>
      <div class="val">${moCal > 0 ? moCal.toLocaleString('fr-FR') : '—'}</div>
      <div class="sub">kcal estimées</div>
    </div>
  `;

  const recent = acts.slice(0, 10);
  document.getElementById('rec-acts').innerHTML = recent.map(a => {
    const s        = sp(a.sport_type);
    const distStr  = a.dist > 0 ? `${a.dist.toFixed(1)} km` : '';
    const durStr   = a.dur  > 0 ? `${a.dur} min`           : '';
    return `
      <div class="ar">
        <div class="ai" style="background:${s.color}22">${s.icon}</div>
        <div class="an">
          <div class="nm">${a.name || s.lbl}</div>
          <div class="mt">
            ${fmtDate(a.date)} ·
            <span class="badge" style="background:${s.color}18;color:${s.color}">${s.lbl}</span>
            ${a.src === 'strava' ? ' · <span style="font-size:10px;color:var(--muted)">Strava</span>' : ''}
          </div>
        </div>
        <div class="as">
          ${distStr || durStr}
          <div class="sub">
            ${distStr && durStr ? durStr : ''}
            ${a.cal > 0 ? '<br>' + a.cal + ' kcal' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function calcStreak() {
  const days = new Set(acts.map(a => a.date));
  let n = 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  while (days.has(d.toISOString().slice(0, 10))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/* ════════════════════════════════════════════
   CALENDAR
   ════════════════════════════════════════════ */
function renderCal() {
  const yr = calMo.getFullYear();
  const mo = calMo.getMonth();

  const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  document.getElementById('cal-lbl').textContent = `${MOIS[mo]} ${yr}`;

  const dm = {};
  acts.forEach(a => {
    if (!dm[a.date]) dm[a.date] = [];
    dm[a.date].push(a);
  });

  const first      = new Date(yr, mo, 1);
  let   dow        = first.getDay();
  if (dow === 0) dow = 7;

  const dCount    = new Date(yr, mo + 1, 0).getDate();
  const prevCount = new Date(yr, mo,     0).getDate();
  const today     = new Date().toISOString().slice(0, 10);

  let html = '';

  for (let i = dow - 2; i >= 0; i--) {
    html += `<div class="dc dim"><div class="dn">${prevCount - i}</div></div>`;
  }

  for (let d = 1; d <= dCount; d++) {
    const ds = `${yr}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const aa = dm[ds] || [];
    const isToday = ds === today;

    if (aa.length > 0) {
      const mainSp = sp(aa[0].sport_type);
      const c      = mainSp.color;
      const icons  = aa.slice(0, 2).map(a => sp(a.sport_type).icon).join(' ');
      const extra  = aa.length > 2
        ? `<div class="dex" style="color:${c}">+${aa.length - 2} autre${aa.length - 2 > 1 ? 's' : ''}</div>`
        : '';
      const multi = aa.length > 1 && sp(aa[1].sport_type).color !== c;
      const bg    = multi
        ? `linear-gradient(135deg, ${c}38 0%, ${sp(aa[1].sport_type).color}38 100%)`
        : c + '30';

      html += `
        <div class="dc${isToday ? ' tod' : ''}"
             style="background:${bg};border-color:${c}70"
             onclick="dayClick('${ds}', event)">
          <div class="dn" style="color:${c}">${d}</div>
          <div class="dic">${icons}</div>
          ${extra}
        </div>
      `;
    } else {
      html += `
        <div class="dc empty${isToday ? ' tod' : ''}" onclick="dayClick('${ds}', event)">
          <div class="dn">${d}</div>
        </div>
      `;
    }
  }

  const total = Math.ceil((dow - 1 + dCount) / 7) * 7;
  for (let d = 1; d <= total - (dow - 1 + dCount); d++) {
    html += `<div class="dc dim"><div class="dn">${d}</div></div>`;
  }

  document.getElementById('cal-body').innerHTML = html;
}

function calShift(n) {
  calMo.setMonth(calMo.getMonth() + n);
  renderCal();
}

function dayClick(ds, e) {
  const aa  = acts.filter(a => a.date === ds);
  const tip = document.getElementById('tip');

  if (aa.length === 0) { openAdd(ds); return; }

  const label = new Date(ds + 'T12:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  tip.innerHTML = `
    <div style="font-weight:700;margin-bottom:9px">${cap(label)}</div>
    ${aa.map(a => {
      const s = sp(a.sport_type);
      return `
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:7px">
          <span>${s.icon}</span>
          <div>
            <div style="font-weight:600">${a.name || s.lbl}</div>
            <div style="color:var(--muted);font-size:12px">
              ${a.dur  ? a.dur + ' min' : ''}
              ${a.dist ? ' · ' + a.dist.toFixed(1) + ' km' : ''}
            </div>
          </div>
        </div>
      `;
    }).join('')}
  `;

  const rect = e.currentTarget.getBoundingClientRect();
  tip.style.left    = Math.min(rect.left, window.innerWidth - 220) + 'px';
  tip.style.top     = (rect.bottom + 6 + window.scrollY) + 'px';
  tip.style.display = 'block';

  setTimeout(() => document.addEventListener('click', () => { tip.style.display = 'none'; }, { once: true }), 100);
}

/* ════════════════════════════════════════════
   CHARTS
   ════════════════════════════════════════════ */
function showChart(t) {
  curChart = t;
  ['radar','heatmap','weekly','evo','pie'].forEach(c => {
    document.getElementById('ch-' + c).style.display = c === t ? 'block' : 'none';
  });
  document.querySelectorAll('.tabs .tab').forEach((el, i) =>
    el.classList.toggle('on', ['radar','heatmap','weekly','evo','pie'][i] === t)
  );
  renderCharts(t);
}

function renderCharts(t) {
  t = t || curChart;
  if (t === 'radar')   buildRadar();
  if (t === 'heatmap') buildHeatmap();
  if (t === 'weekly')  buildWeekly();
  if (t === 'evo')     buildEvo();
  if (t === 'pie')     buildPie();
}

function buildRadar() {
  const SPORTS = [
    { type: 'Run',              lbl: 'Course' },
    { type: 'Ride',             lbl: 'Vélo'   },
    { type: 'MountainBikeRide', lbl: 'VTT'    },
  ];
  const LABELS = ['Fréquence','Distance moy.','Durée moy.','Calories moy.','Dénivelé moy.','Intensité moy.'];
  const MAX    = [10, 50, 120, 800, 500, 10];

  const datasets = SPORTS.map(({ type, lbl }) => {
    const aa = acts.filter(a => a.sport_type === type);
    if (!aa.length) return null;
    const s       = sp(type);
    const freq    = Math.min(aa.length / 3, 10);
    const avgDist = aa.reduce((s, a) => s + (a.dist || 0), 0) / aa.length;
    const avgDur  = aa.reduce((s, a) => s + (a.dur  || 0), 0) / aa.length;
    const avgCal  = aa.reduce((s, a) => s + (a.cal  || 0), 0) / aa.length;
    const avgElev = aa.reduce((s, a) => s + (a.elev || 0), 0) / aa.length;
    const rpeActs = aa.filter(a => a.rpe);
    const avgRpe  = rpeActs.length ? rpeActs.reduce((s, a) => s + (a.rpe || 0), 0) / rpeActs.length : 0;
    return {
      label: lbl,
      data: [freq, Math.min(avgDist/MAX[1]*10,10), Math.min(avgDur/MAX[2]*10,10), Math.min(avgCal/MAX[3]*10,10), Math.min(avgElev/MAX[4]*10,10), avgRpe],
      backgroundColor: s.color+'30', borderColor: s.color, borderWidth: 2,
      pointBackgroundColor: s.color, pointRadius: 4,
    };
  }).filter(Boolean);

  if (charts.radar) charts.radar.destroy();
  charts.radar = new Chart(document.getElementById('radarC'), {
    type: 'radar',
    data: { labels: LABELS, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      scales: { r: { min: 0, max: 10, ticks: { stepSize: 2, font: { size: 10 } }, grid: { color: '#e5e7eb' }, pointLabels: { font: { size: 12, weight: '600' } } } },
      plugins: { legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 16, usePointStyle: true } } },
    },
  });
}

function buildHeatmap() {
  const dm = {};
  acts.forEach(a => { dm[a.date] = (dm[a.date] || 0) + (a.dur || 30); });
  const maxMin = Math.max(...Object.values(dm).filter(v => v > 0), 60);

  const col = m => {
    if (!m) return '#ebedf0';
    const r = m / maxMin;
    if (r < .25) return '#ffd5c4';
    if (r < .5)  return '#ffac8a';
    if (r < .75) return '#ff7040';
    return '#FF6B35';
  };

  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 364);
  while (start.getDay() !== 1) start.setDate(start.getDate() - 1);

  const months = []; let prevMo = -1; let weeksHTML = '';
  const d = new Date(start);

  for (let w = 0; w < 53; w++) {
    let wk = '';
    for (let day = 0; day < 7; day++) {
      const ds = d.toISOString().slice(0, 10);
      const m  = dm[ds] || 0;
      wk += `<div class="hm-cell" style="background:${col(m)}" title="${m > 0 ? ds + ' : ' + m + ' min' : ds}"></div>`;
      if (d.getDate() <= 7 && d.getMonth() !== prevMo) {
        months.push({ w, lbl: ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'][d.getMonth()] });
        prevMo = d.getMonth();
      }
      d.setDate(d.getDate() + 1);
    }
    weeksHTML += `<div class="hm-col">${wk}</div>`;
  }

  let moRow = '<div style="display:flex;gap:3px;margin-left:28px;margin-bottom:5px;font-size:10px;color:var(--muted)">';
  for (let w = 0; w < 53; w++) {
    const m = months.find(x => x.w === w);
    moRow += `<div style="width:13px">${m ? m.lbl : ''}</div>`;
  }
  moRow += '</div>';

  document.getElementById('hm-inner').innerHTML = `
    ${moRow}
    <div style="display:flex;align-items:flex-start">
      <div style="display:flex;flex-direction:column;gap:3px;margin-right:6px;font-size:10px;color:var(--muted)">
        <span style="height:13px"></span><span style="height:13px;display:flex;align-items:center">Lun</span>
        <span style="height:13px"></span><span style="height:13px;display:flex;align-items:center">Mer</span>
        <span style="height:13px"></span><span style="height:13px;display:flex;align-items:center">Ven</span>
        <span style="height:13px"></span>
      </div>
      <div class="hm-grid">${weeksHTML}</div>
    </div>
  `;
}

function buildWeekly() {
  const now = new Date(); const labels = []; const data = [];
  for (let i = 11; i >= 0; i--) {
    const end = new Date(now); end.setDate(now.getDate() - i * 7); end.setHours(23,59,59,999);
    const st  = new Date(end); st.setDate(end.getDate() - 6);      st.setHours(0,0,0,0);
    const mo  = acts.filter(a => { const d = new Date(a.date); return d >= st && d <= end; }).reduce((s,a) => s + (a.dur||0), 0);
    labels.push(`${st.getDate()}/${st.getMonth()+1}`); data.push(mo);
  }
  if (charts.weekly) charts.weekly.destroy();
  charts.weekly = new Chart(document.getElementById('weeklyC'), {
    type: 'bar',
    data: { labels, datasets: [{ label: 'Minutes', data, backgroundColor: '#FF6B3580', borderColor: '#FF6B35', borderWidth: 1, borderRadius: 6 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, callback: v => v+' min' } }, x: { grid: { display: false }, ticks: { font: { size: 11 } } } } },
  });
}

function buildEvo() {
  const now = new Date(); const labels = []; const data = [];
  const M2 = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
  for (let i = 11; i >= 0; i--) {
    const st = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const en = new Date(now.getFullYear(), now.getMonth()-i+1, 0);
    const km = acts.filter(a => a.sport_type==='Run' && new Date(a.date)>=st && new Date(a.date)<=en).reduce((s,a)=>s+(a.dist||0),0);
    labels.push(M2[st.getMonth()]); data.push(+km.toFixed(2));
  }
  if (charts.evo) charts.evo.destroy();
  charts.evo = new Chart(document.getElementById('evoC'), {
    type: 'line',
    data: { labels, datasets: [{ label: 'Km courus', data, borderColor: '#FF6B35', backgroundColor: '#FF6B3515', fill: true, tension: .4, pointBackgroundColor: '#FF6B35', pointRadius: 5 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, callback: v => v+' km' } }, x: { grid: { display: false }, ticks: { font: { size: 11 } } } } },
  });
}

function buildPie() {
  const totals = {};
  acts.forEach(a => { const s = sp(a.sport_type); if (!totals[s.lbl]) totals[s.lbl] = { min: 0, color: s.color }; totals[s.lbl].min += (a.dur||0); });
  const sorted = Object.entries(totals).sort((a,b) => b[1].min - a[1].min);
  const total  = sorted.reduce((s,[,v]) => s+v.min, 0);
  if (charts.pie) charts.pie.destroy();
  charts.pie = new Chart(document.getElementById('pieC'), {
    type: 'doughnut',
    data: { labels: sorted.map(([k])=>k), datasets: [{ data: sorted.map(([,v])=>v.min), backgroundColor: sorted.map(([,v])=>v.color), borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.label}: ${c.raw} min` } } } },
  });
  document.getElementById('pie-legend').innerHTML = sorted.map(([lbl,v]) => `
    <div style="display:flex;align-items:center;gap:9px;margin-bottom:10px">
      <div style="width:12px;height:12px;border-radius:3px;background:${v.color};flex-shrink:0"></div>
      <div><div style="font-weight:600;font-size:13px">${lbl}</div><div style="color:var(--muted);font-size:12px">${fmtDur(v.min)} · ${Math.round(v.min/total*100)}%</div></div>
    </div>
  `).join('');
}

/* ════════════════════════════════════════════
   OBJECTIVES
   ════════════════════════════════════════════ */
function renderGoals() {
  const now = new Date(); const wk = getMonday(now);
  const wa  = acts.filter(a => new Date(a.date) >= wk);
  const wSess = wa.length;
  const wMin  = wa.reduce((s,a) => s+(a.dur||0), 0);
  const wRide = wa.filter(a => ['Ride','MountainBikeRide'].includes(a.sport_type)).reduce((s,a) => s+(a.dist||0), 0);

  const items = [
    { ic: '🏅', lbl: 'Séances cette semaine', cur: wSess,  tgt: goals.sess,   unit: 'séances', fmt: v => v,            color: '#8B5CF6' },
    { ic: '⏱️', lbl: 'Temps actif',           cur: wMin,   tgt: goals.min,    unit: 'min',     fmt: fmtDur,            color: '#FF6B35' },
    { ic: '🚴', lbl: 'Distance vélo',          cur: wRide,  tgt: goals.rideKm, unit: 'km',      fmt: v => v.toFixed(1), color: '#3B82F6' },
  ];

  document.getElementById('goals-content').innerHTML = items.map(o => {
    const pct = Math.min(o.cur / Math.max(o.tgt,1) * 100, 100);
    return `
      <div class="obj-card">
        <div class="obj-row">
          <div class="obj-title"><span style="font-size:20px">${o.ic}</span>${o.lbl}</div>
          ${o.cur >= o.tgt ? '<span style="font-size:18px">✅</span>' : ''}
        </div>
        <div class="pbar"><div class="pfill" style="width:${pct}%;background:${o.color}"></div></div>
        <div class="obj-nums"><span>${o.fmt(o.cur)} ${o.unit}</span><span>Objectif : ${o.tgt} ${o.unit}</span></div>
      </div>
    `;
  }).join('');
}

function openGoals() {
  document.getElementById('g-sess').value  = goals.sess;
  document.getElementById('g-min').value   = goals.min;
  document.getElementById('g-run').value   = goals.runKm;
  document.getElementById('g-ride').value  = goals.rideKm;
  document.getElementById('goals-modal').style.display = 'flex';
}
function closeGoals() { document.getElementById('goals-modal').style.display = 'none'; }
function saveGoals() {
  goals = { sess: parseInt(document.getElementById('g-sess').value)||3, min: parseInt(document.getElementById('g-min').value)||180, runKm: parseFloat(document.getElementById('g-run').value)||15, rideKm: parseFloat(document.getElementById('g-ride').value)||50 };
  localStorage.setItem('goals_v2', JSON.stringify(goals));
  closeGoals(); renderGoals();
}

/* ════════════════════════════════════════════
   ADD ACTIVITY
   ════════════════════════════════════════════ */
function openAdd(ds) {
  document.getElementById('f-date').value = ds || new Date().toISOString().slice(0,10);
  ['f-name','f-dur','f-cal','f-dist','f-rpe','f-notes'].forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('add-modal').style.display = 'flex';
}
function closeAdd() { document.getElementById('add-modal').style.display = 'none'; }

function saveAct() {
  const type = document.getElementById('f-sport').value;
  const date = document.getElementById('f-date').value;
  if (!date) { alert('Choisis une date !'); return; }
  const a = {
    id: 'm_' + Date.now(), src: 'manual',
    name: document.getElementById('f-name').value || sp(type).lbl,
    sport_type: type, date, ts: date + 'T12:00:00',
    dur:  parseInt(document.getElementById('f-dur').value)    || 0,
    cal:  parseInt(document.getElementById('f-cal').value)    || 0,
    dist: parseFloat(document.getElementById('f-dist').value) || 0,
    rpe:  parseInt(document.getElementById('f-rpe').value)    || null,
    elev: 0, notes: document.getElementById('f-notes').value,
  };
  manual.unshift(a);
  localStorage.setItem('manual_v2', JSON.stringify(manual));
  acts = [...acts, a].sort((a,b) => new Date(b.ts||b.date) - new Date(a.ts||a.date));
  closeAdd(); renderDash(); renderCal();
  if (curPage === 'stats') renderCharts();
  if (curPage === 'goals') renderGoals();
}

/* ════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════ */
function fmtDur(m) {
  if (!m) return '—';
  if (m < 60) return m + 'min';
  const h = Math.floor(m/60), mn = m%60;
  return mn > 0 ? `${h}h${String(mn).padStart(2,'0')}` : `${h}h`;
}
function fmtDate(ds) {
  if (!ds) return '';
  const d = new Date(ds+'T12:00:00'), t = new Date(), y = new Date(t);
  y.setDate(t.getDate()-1);
  if (ds === t.toISOString().slice(0,10)) return "Aujourd'hui";
  if (ds === y.toISOString().slice(0,10)) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}
function getMonday(d) {
  const r = new Date(d); r.setHours(0,0,0,0);
  const day = r.getDay() || 7;
  if (day !== 1) r.setDate(r.getDate() - day + 1);
  return r;
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════ */
async function init() {
  // Afficher immédiatement avec les activités manuelles + cache
  const cache = JSON.parse(localStorage.getItem('strava_cache') || '[]');
  if (cache.length) { STRAVA = cache; rebuildActs(); }
  renderDash();
  renderCal();

  // Charger data.json en arrière-plan
  const ok = await loadStravaData();
  if (ok) {
    rebuildActs();
    renderDash();
    renderCal();
    if (curPage === 'stats') renderCharts();
    if (curPage === 'goals') renderGoals();
  }
}

init();
