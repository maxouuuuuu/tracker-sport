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
  Tennis:           { icon: '🎾', lbl: 'Tennis',   color: '#8B5CF6' },
  Natation:         { icon: '🏊', lbl: 'Natation', color: '#3B82F6' },
  Other:            { icon: '💪', lbl: 'Autre',    color: '#9CA3AF' },
};

/** Retourne la config sport ou un fallback */
function sp(type) {
  return SC[type] || { icon: '🏅', lbl: type || 'Activité', color: '#9CA3AF' };
}

/* ════════════════════════════════════════════
   DONNÉES STRAVA (snapshot 10 juin 2026)
   ════════════════════════════════════════════ */
const STRAVA = [
  { id:'stv_18622589541', src:'strava', name:"Petite rando dans l'aprem",   sport_type:'Walk',             date:'2026-05-23', ts:'2026-05-23T11:56:07', dur:193, dist:15.0, cal:1186, elev:449, rpe:4    },
  { id:'stv_18376681573', src:'strava', name:'Run Technogym',                sport_type:'Run',              date:'2026-05-04', ts:'2026-05-04T19:54:25', dur:13,  dist:1.1,  cal:104,  elev:0,   rpe:null },
  { id:'stv_18306233404', src:'strava', name:'Run Technogym',                sport_type:'Run',              date:'2026-04-29', ts:'2026-04-29T13:42:18', dur:7,   dist:0.6,  cal:48,   elev:0,   rpe:null },
  { id:'stv_18295643564', src:'strava', name:'Evening Run',                  sport_type:'Run',              date:'2026-04-28', ts:'2026-04-28T18:30:38', dur:80,  dist:2.5,  cal:327,  elev:0,   rpe:1    },
  { id:'stv_18252506190', src:'strava', name:"Vélo pour aller au resto",     sport_type:'Ride',             date:'2026-04-25', ts:'2026-04-25T11:20:56', dur:112, dist:42.3, cal:1207, elev:28,  rpe:null },
  { id:'stv_18252545342', src:'strava', name:'Sortie vélo le midi',          sport_type:'Ride',             date:'2026-04-25', ts:'2026-04-25T11:19:29', dur:126, dist:44.1, cal:782,  elev:29,  rpe:null },
  { id:'stv_18172327568', src:'strava', name:"J'ai chuté… 🙁",               sport_type:'Ride',             date:'2026-04-19', ts:'2026-04-19T13:47:59', dur:30,  dist:11.2, cal:379,  elev:16,  rpe:6    },
  { id:'stv_18133457121', src:'strava', name:'Afternoon Ride',               sport_type:'Ride',             date:'2026-04-16', ts:'2026-04-16T17:28:17', dur:14,  dist:3.9,  cal:191,  elev:11,  rpe:1    },
  { id:'stv_18132429820', src:'strava', name:'Afternoon Ride',               sport_type:'Ride',             date:'2026-04-16', ts:'2026-04-16T15:12:12', dur:33,  dist:8.6,  cal:371,  elev:26,  rpe:3    },
  { id:'stv_18108506442', src:'strava', name:'Bike Technogym',               sport_type:'Ride',             date:'2026-04-14', ts:'2026-04-14T18:04:04', dur:12,  dist:5.0,  cal:96,   elev:0,   rpe:0    },
  { id:'stv_18063712869', src:'strava', name:'Petite sortie au matin',       sport_type:'Ride',             date:'2026-04-11', ts:'2026-04-11T11:03:54', dur:46,  dist:15.1, cal:516,  elev:199, rpe:5    },
  { id:'stv_18045942811', src:'strava', name:'Run Technogym',                sport_type:'Run',              date:'2026-04-09', ts:'2026-04-09T20:22:02', dur:5,   dist:0.4,  cal:46,   elev:0,   rpe:null },
  { id:'stv_18030800834', src:'strava', name:'Petite sortie vélo',           sport_type:'Ride',             date:'2026-04-08', ts:'2026-04-08T19:02:32', dur:44,  dist:15.6, cal:558,  elev:127, rpe:7    },
  { id:'stv_17891686558', src:'strava', name:'Tennis',                       sport_type:'Workout',          date:'2026-03-28', ts:'2026-03-28T16:21:36', dur:107, dist:5.1,  cal:576,  elev:0,   rpe:1    },
  { id:'stv_17843544189', src:'strava', name:'Run Technogym',                sport_type:'Run',              date:'2026-03-24', ts:'2026-03-24T17:54:23', dur:10,  dist:0.8,  cal:82,   elev:0,   rpe:null },
  { id:'stv_17832463748', src:'strava', name:'Run Technogym',                sport_type:'Run',              date:'2026-03-23', ts:'2026-03-23T20:28:19', dur:8,   dist:0.7,  cal:70,   elev:0,   rpe:null },
  { id:'stv_17832378163', src:'strava', name:'Run Technogym',                sport_type:'Run',              date:'2026-03-23', ts:'2026-03-23T20:20:58', dur:7,   dist:0.6,  cal:51,   elev:0,   rpe:null },
  { id:'stv_17712183659', src:'strava', name:'Run Technogym',                sport_type:'Run',              date:'2026-03-13', ts:'2026-03-13T21:14:43', dur:5,   dist:0.4,  cal:39,   elev:0,   rpe:null },
  { id:'stv_17567035242', src:'strava', name:'Vélo avant le match',          sport_type:'Ride',             date:'2026-03-01', ts:'2026-03-01T15:28:06', dur:76,  dist:26.3, cal:413,  elev:49,  rpe:null },
  { id:'stv_17493503671', src:'strava', name:'Home Trainer - Session midi',  sport_type:'Ride',             date:'2026-02-23', ts:'2026-02-23T12:01:00', dur:31,  dist:13.0, cal:240,  elev:0,   rpe:null },
  { id:'stv_17432376887', src:'strava', name:'Run Technogym',                sport_type:'Run',              date:'2026-02-17', ts:'2026-02-17T20:49:42', dur:10,  dist:0.8,  cal:74,   elev:0,   rpe:null },
  { id:'stv_17382791444', src:'strava', name:"Vélo avant l'école",           sport_type:'Ride',             date:'2026-02-13', ts:'2026-02-13T11:00:13', dur:48,  dist:14.6, cal:253,  elev:37,  rpe:null },
  { id:'stv_17330411108', src:'strava', name:'Vélo quais du Rhône',          sport_type:'Ride',             date:'2026-02-08', ts:'2026-02-08T15:08:26', dur:60,  dist:17.5, cal:258,  elev:23,  rpe:null },
  { id:'stv_17239018077', src:'strava', name:'Randonnée - Mont du Chat',     sport_type:'Hike',             date:'2026-01-31', ts:'2026-01-31T10:16:20', dur:240, dist:15.6, cal:1435, elev:931, rpe:null },
  { id:'stv_17094878301', src:'strava', name:'Sortie en ville',              sport_type:'Ride',             date:'2026-01-18', ts:'2026-01-18T16:21:23', dur:20,  dist:5.0,  cal:79,   elev:14,  rpe:null },
  { id:'stv_16426310543', src:'strava', name:'Marche avec Pierre',           sport_type:'Walk',             date:'2025-11-11', ts:'2025-11-11T14:33:26', dur:116, dist:9.2,  cal:681,  elev:239, rpe:1    },
  { id:'stv_16325836495', src:'strava', name:'Saint bauzille de montmel',    sport_type:'Walk',             date:'2025-11-01', ts:'2025-11-01T22:37:55', dur:31,  dist:2.0,  cal:225,  elev:122, rpe:0    },
  { id:'stv_16022627712', src:'strava', name:'Evening Run',                  sport_type:'Run',              date:'2025-10-03', ts:'2025-10-03T19:19:42', dur:27,  dist:4.4,  cal:351,  elev:3,   rpe:5    },
  { id:'stv_15525422120', src:'strava', name:'Afternoon Ride',               sport_type:'Ride',             date:'2025-08-20', ts:'2025-08-20T14:17:47', dur:40,  dist:10.8, cal:431,  elev:36,  rpe:3    },
  { id:'stv_15425504098', src:'strava', name:'Night Run',                    sport_type:'Run',              date:'2025-08-11', ts:'2025-08-11T22:23:03', dur:17,  dist:2.8,  cal:225,  elev:10,  rpe:4    },
  { id:'stv_15351651609', src:'strava', name:'Afternoon Run',                sport_type:'Run',              date:'2025-08-05', ts:'2025-08-05T13:22:08', dur:20,  dist:3.9,  cal:310,  elev:13,  rpe:5    },
  { id:'stv_15233013285', src:'strava', name:'Sortie VTT en soirée',         sport_type:'MountainBikeRide', date:'2025-07-25', ts:'2025-07-25T13:04:40', dur:172, dist:39.3, cal:814,  elev:94,  rpe:null },
  { id:'stv_15222123909', src:'strava', name:'Belle rando',                  sport_type:'Hike',             date:'2025-07-24', ts:'2025-07-24T11:21:44', dur:260, dist:20.5, cal:1893, elev:107, rpe:null },
  { id:'stv_15201119136', src:'strava', name:'Course à pied le soir',        sport_type:'Run',              date:'2025-07-22', ts:'2025-07-22T19:53:02', dur:14,  dist:3.0,  cal:0,    elev:5,   rpe:null },
  { id:'stv_15178559929', src:'strava', name:'Sortie VTT en soirée',         sport_type:'MountainBikeRide', date:'2025-07-20', ts:'2025-07-20T16:08:37', dur:67,  dist:20.9, cal:0,    elev:13,  rpe:null },
  { id:'stv_15092881512', src:'strava', name:'Course à pied de nuit',        sport_type:'Run',              date:'2025-07-12', ts:'2025-07-12T21:01:14', dur:10,  dist:2.1,  cal:0,    elev:17,  rpe:null },
  { id:'stv_14913375648', src:'strava', name:'Course à pied soir',           sport_type:'Run',              date:'2025-06-25', ts:'2025-06-25T18:25:34', dur:16,  dist:3.0,  cal:0,    elev:14,  rpe:null },
  { id:'stv_14880962791', src:'strava', name:'Sortie VTT',                   sport_type:'MountainBikeRide', date:'2025-06-22', ts:'2025-06-22T13:02:47', dur:80,  dist:13.7, cal:0,    elev:14,  rpe:null },
  { id:'stv_14177339562', src:'strava', name:'Ok faut que je soigne ma périostite', sport_type:'Run',       date:'2025-04-14', ts:'2025-04-14T20:11:17', dur:20,  dist:3.0,  cal:0,    elev:26,  rpe:null },
  { id:'stv_13327451467', src:'strava', name:"Run soir tête d'or",           sport_type:'Run',              date:'2025-01-11', ts:'2025-01-11T18:38:22', dur:27,  dist:3.7,  cal:0,    elev:5,   rpe:null },
  { id:'stv_13318011606', src:'strava', name:'Petite course avec Leane',     sport_type:'Run',              date:'2025-01-10', ts:'2025-01-10T18:22:22', dur:19,  dist:2.9,  cal:0,    elev:22,  rpe:null },
  { id:'stv_13150478443', src:'strava', name:'Run 19/12',                    sport_type:'Run',              date:'2024-12-19', ts:'2024-12-19T19:19:36', dur:32,  dist:5.2,  cal:480,  elev:13,  rpe:null },
];

/* ════════════════════════════════════════════
   STATE
   ════════════════════════════════════════════ */
let manual  = JSON.parse(localStorage.getItem('manual_v2') || '[]');
let goals   = JSON.parse(localStorage.getItem('goals_v2')  || 'null') || { sess: 3, min: 180, runKm: 15, rideKm: 50 };
let acts    = [...STRAVA, ...manual].sort((a, b) => new Date(b.ts || b.date) - new Date(a.ts || a.date));

let curPage  = 'dash';
let curChart = 'radar';
let calMo    = new Date();
let charts   = {};

/* ════════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════════ */
function go(page) {
  document.querySelectorAll('.page').forEach(el => el.classList.remove('on'));
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('on'));
  document.querySelectorAll('.bni').forEach(el => el.classList.remove('on'));

  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('on');

  // Highlight nav links that match this page
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

  // Streak
  const streak = calcStreak();
  document.getElementById('streak-el').innerHTML = streak > 0
    ? `<div class="streak">🔥 ${streak} jour${streak > 1 ? 's' : ''} d'affilée</div>`
    : '';

  // Greeting
  const hr = now.getHours();
  document.getElementById('greet').textContent = (hr < 12 ? 'Bonjour' : 'Bonsoir') + ', Max 👋';

  const JOURS = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  const MOIS  = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  document.getElementById('sub').textContent =
    `${cap(JOURS[now.getDay()])} ${now.getDate()} ${MOIS[now.getMonth()]} · ${wk.length} séance${wk.length !== 1 ? 's' : ''} cette semaine`;

  // Stat cards
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

  // Recent activities
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

  // Build day → activities map
  const dm = {};
  acts.forEach(a => {
    if (!dm[a.date]) dm[a.date] = [];
    dm[a.date].push(a);
  });

  const first      = new Date(yr, mo, 1);
  let   dow        = first.getDay();
  if (dow === 0) dow = 7; // Monday first

  const dCount    = new Date(yr, mo + 1, 0).getDate();
  const prevCount = new Date(yr, mo,     0).getDate();
  const today     = new Date().toISOString().slice(0, 10);

  let html = '';

  // Padding: prev month days
  for (let i = dow - 2; i >= 0; i--) {
    html += `<div class="dc dim"><div class="dn">${prevCount - i}</div></div>`;
  }

  // This month
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

  // Trailing padding
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

/* ── Radar ── */
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
      data: [
        freq,
        Math.min(avgDist / MAX[1] * 10, 10),
        Math.min(avgDur  / MAX[2] * 10, 10),
        Math.min(avgCal  / MAX[3] * 10, 10),
        Math.min(avgElev / MAX[4] * 10, 10),
        avgRpe,
      ],
      backgroundColor:    s.color + '30',
      borderColor:        s.color,
      borderWidth:        2,
      pointBackgroundColor: s.color,
      pointRadius:        4,
    };
  }).filter(Boolean);

  if (charts.radar) charts.radar.destroy();
  charts.radar = new Chart(document.getElementById('radarC'), {
    type: 'radar',
    data: { labels: LABELS, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0, max: 10,
          ticks: { stepSize: 2, font: { size: 10 } },
          grid:  { color: '#e5e7eb' },
          pointLabels: { font: { size: 12, weight: '600' } },
        },
      },
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 16, usePointStyle: true } },
      },
    },
  });
}

/* ── Heatmap ── */
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

  // Start from Monday ~52 weeks ago
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 364);
  while (start.getDay() !== 1) start.setDate(start.getDate() - 1);

  const months  = [];
  let   prevMo  = -1;
  let   weeksHTML = '';
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
        <span style="height:13px"></span>
        <span style="height:13px;display:flex;align-items:center">Lun</span>
        <span style="height:13px"></span>
        <span style="height:13px;display:flex;align-items:center">Mer</span>
        <span style="height:13px"></span>
        <span style="height:13px;display:flex;align-items:center">Ven</span>
        <span style="height:13px"></span>
      </div>
      <div class="hm-grid">${weeksHTML}</div>
    </div>
  `;
}

/* ── Weekly bars ── */
function buildWeekly() {
  const now    = new Date();
  const labels = [];
  const data   = [];

  for (let i = 11; i >= 0; i--) {
    const end = new Date(now); end.setDate(now.getDate() - i * 7); end.setHours(23, 59, 59, 999);
    const st  = new Date(end); st.setDate(end.getDate() - 6);      st.setHours(0, 0, 0, 0);
    const mo  = acts
      .filter(a => { const d = new Date(a.date); return d >= st && d <= end; })
      .reduce((s, a) => s + (a.dur || 0), 0);
    labels.push(`${st.getDate()}/${st.getMonth() + 1}`);
    data.push(mo);
  }

  if (charts.weekly) charts.weekly.destroy();
  charts.weekly = new Chart(document.getElementById('weeklyC'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Minutes', data,
        backgroundColor: '#FF6B3580', borderColor: '#FF6B35',
        borderWidth: 1, borderRadius: 6,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, callback: v => v + ' min' } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

/* ── Evolution line ── */
function buildEvo() {
  const now    = new Date();
  const labels = [];
  const data   = [];
  const M2     = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

  for (let i = 11; i >= 0; i--) {
    const st = new Date(now.getFullYear(), now.getMonth() - i,     1);
    const en = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
    const km = acts
      .filter(a => a.sport_type === 'Run' && new Date(a.date) >= st && new Date(a.date) <= en)
      .reduce((s, a) => s + (a.dist || 0), 0);
    labels.push(M2[st.getMonth()]);
    data.push(+km.toFixed(2));
  }

  if (charts.evo) charts.evo.destroy();
  charts.evo = new Chart(document.getElementById('evoC'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Km courus', data,
        borderColor: '#FF6B35', backgroundColor: '#FF6B3515',
        fill: true, tension: .4,
        pointBackgroundColor: '#FF6B35', pointRadius: 5,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 }, callback: v => v + ' km' } },
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      },
    },
  });
}

/* ── Pie / doughnut ── */
function buildPie() {
  const totals = {};
  acts.forEach(a => {
    const s = sp(a.sport_type);
    if (!totals[s.lbl]) totals[s.lbl] = { min: 0, color: s.color };
    totals[s.lbl].min += (a.dur || 0);
  });

  const sorted = Object.entries(totals).sort((a, b) => b[1].min - a[1].min);
  const total  = sorted.reduce((s, [, v]) => s + v.min, 0);

  if (charts.pie) charts.pie.destroy();
  charts.pie = new Chart(document.getElementById('pieC'), {
    type: 'doughnut',
    data: {
      labels: sorted.map(([k]) => k),
      datasets: [{ data: sorted.map(([, v]) => v.min), backgroundColor: sorted.map(([, v]) => v.color), borderWidth: 0 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.label}: ${c.raw} min` } } },
    },
  });

  document.getElementById('pie-legend').innerHTML = sorted.map(([lbl, v]) => `
    <div style="display:flex;align-items:center;gap:9px;margin-bottom:10px">
      <div style="width:12px;height:12px;border-radius:3px;background:${v.color};flex-shrink:0"></div>
      <div>
        <div style="font-weight:600;font-size:13px">${lbl}</div>
        <div style="color:var(--muted);font-size:12px">${fmtDur(v.min)} · ${Math.round(v.min / total * 100)}%</div>
      </div>
    </div>
  `).join('');
}

/* ════════════════════════════════════════════
   OBJECTIVES
   ════════════════════════════════════════════ */
function renderGoals() {
  const now  = new Date();
  const wk   = getMonday(now);
  const wa   = acts.filter(a => new Date(a.date) >= wk);

  const wSess = wa.length;
  const wMin  = wa.reduce((s, a) => s + (a.dur  || 0), 0);
  const wRun  = wa.filter(a => a.sport_type === 'Run').reduce((s, a) => s + (a.dist || 0), 0);
  const wRide = wa.filter(a => ['Ride','MountainBikeRide'].includes(a.sport_type)).reduce((s, a) => s + (a.dist || 0), 0);

  const items = [
    { ic: '🏅', lbl: 'Séances cette semaine', cur: wSess,  tgt: goals.sess,   unit: 'séances', fmt: v => v,              color: '#8B5CF6' },
    { ic: '⏱️', lbl: 'Temps actif',           cur: wMin,   tgt: goals.min,    unit: 'min',     fmt: fmtDur,              color: '#FF6B35' },
    { ic: '🏃', lbl: 'Distance course',        cur: wRun,   tgt: goals.runKm,  unit: 'km',      fmt: v => v.toFixed(1),   color: '#FF6B35' },
    { ic: '🚴', lbl: 'Distance vélo',          cur: wRide,  tgt: goals.rideKm, unit: 'km',      fmt: v => v.toFixed(1),   color: '#3B82F6' },
  ];

  document.getElementById('goals-content').innerHTML = items.map(o => {
    const pct  = Math.min(o.cur / Math.max(o.tgt, 1) * 100, 100);
    const done = o.cur >= o.tgt;
    return `
      <div class="obj-card">
        <div class="obj-row">
          <div class="obj-title"><span style="font-size:20px">${o.ic}</span>${o.lbl}</div>
          ${done ? '<span style="font-size:18px">✅</span>' : ''}
        </div>
        <div class="pbar"><div class="pfill" style="width:${pct}%;background:${o.color}"></div></div>
        <div class="obj-nums">
          <span>${o.fmt(o.cur)} ${o.unit}</span>
          <span>Objectif : ${o.tgt} ${o.unit}</span>
        </div>
      </div>
    `;
  }).join('');
}

function openGoals() {
  document.getElementById('g-sess').value = goals.sess;
  document.getElementById('g-min').value  = goals.min;
  document.getElementById('g-run').value  = goals.runKm;
  document.getElementById('g-ride').value = goals.rideKm;
  document.getElementById('goals-modal').style.display = 'flex';
}
function closeGoals() { document.getElementById('goals-modal').style.display = 'none'; }

function saveGoals() {
  goals = {
    sess:   parseInt(document.getElementById('g-sess').value)  || 3,
    min:    parseInt(document.getElementById('g-min').value)   || 180,
    runKm:  parseFloat(document.getElementById('g-run').value) || 15,
    rideKm: parseFloat(document.getElementById('g-ride').value)|| 50,
  };
  localStorage.setItem('goals_v2', JSON.stringify(goals));
  closeGoals();
  renderGoals();
}

/* ════════════════════════════════════════════
   ADD ACTIVITY
   ════════════════════════════════════════════ */
function openAdd(ds) {
  document.getElementById('f-date').value = ds || new Date().toISOString().slice(0, 10);
  ['f-name','f-dur','f-cal','f-dist','f-rpe','f-notes'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('add-modal').style.display = 'flex';
}
function closeAdd() { document.getElementById('add-modal').style.display = 'none'; }

function saveAct() {
  const type = document.getElementById('f-sport').value;
  const date = document.getElementById('f-date').value;
  if (!date) { alert('Choisis une date !'); return; }

  const a = {
    id:         'm_' + Date.now(),
    src:        'manual',
    name:       document.getElementById('f-name').value  || sp(type).lbl,
    sport_type: type,
    date,
    ts:         date + 'T12:00:00',
    dur:        parseInt(document.getElementById('f-dur').value)    || 0,
    cal:        parseInt(document.getElementById('f-cal').value)    || 0,
    dist:       parseFloat(document.getElementById('f-dist').value) || 0,
    rpe:        parseInt(document.getElementById('f-rpe').value)    || null,
    elev:       0,
    notes:      document.getElementById('f-notes').value,
  };

  manual.unshift(a);
  localStorage.setItem('manual_v2', JSON.stringify(manual));
  acts = [...acts, a].sort((a, b) => new Date(b.ts || b.date) - new Date(a.ts || a.date));

  closeAdd();
  renderDash();
  renderCal();
  if (curPage === 'stats') renderCharts();
  if (curPage === 'goals') renderGoals();
}

/* ════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════ */

/** Formate une durée en minutes → "1h30" ou "45min" */
function fmtDur(m) {
  if (!m || m === 0) return '—';
  if (m < 60) return m + 'min';
  const h  = Math.floor(m / 60);
  const mn = m % 60;
  return mn > 0 ? `${h}h${String(mn).padStart(2, '0')}` : `${h}h`;
}

/** Formate une date ISO → "Aujourd'hui", "Hier" ou "12 juin" */
function fmtDate(ds) {
  if (!ds) return '';
  const d = new Date(ds + 'T12:00:00');
  const t = new Date();
  const y = new Date(t); y.setDate(t.getDate() - 1);
  if (ds === t.toISOString().slice(0, 10)) return "Aujourd'hui";
  if (ds === y.toISOString().slice(0, 10)) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/** Retourne le lundi de la semaine d'une date donnée */
function getMonday(d) {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  const day = r.getDay() || 7;
  if (day !== 1) r.setDate(r.getDate() - day + 1);
  return r;
}

/** Capitalise la première lettre */
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

/* ════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════ */
renderDash();
renderCal();
