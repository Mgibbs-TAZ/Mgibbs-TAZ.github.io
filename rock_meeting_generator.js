let rockCount = 0, personCount = 0, todoCount = 0, expCount = 0;

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstChild;
}

/* ---------- ROCKS ---------- */
function addRock(data) {
  data = data || {};
  const id = 'rock' + (rockCount++);
  const node = el(`
    <div class="item-block" id="${id}">
      <div class="item-header">
        <strong>Rock</strong>
        <button class="small-btn remove-btn" onclick="document.getElementById('${id}').remove()">Remove</button>
      </div>
      <div class="row">
        <div style="flex:0 0 70px;">
          <label>Initials</label>
          <input type="text" class="rock-initials" placeholder="RN" value="${data.initials||''}">
        </div>
        <div>
          <label>Description</label>
          <input type="text" class="rock-desc" placeholder="Update Remote Support Access in ITGlue" value="${data.desc||''}">
        </div>
        <div style="flex:0 0 130px;">
          <label>Status</label>
          <select class="rock-status" onchange="toggleFollowup('${id}')">
            <option value="DONE" ${data.status==='DONE'?'selected':''}>DONE</option>
            <option value="NOT DONE" ${data.status==='NOT DONE'?'selected':''}>NOT DONE</option>
          </select>
        </div>
      </div>
      <div class="rock-followup-wrap" style="display:${data.status==='NOT DONE'?'block':'none'};">
        <label>New Rock (follow-up line, e.g. "ROCK #1 (MS) Schedule 2 x FF Trainings")</label>
        <input type="text" class="rock-followup" value="${data.followup||''}">
      </div>
    </div>
  `);
  document.getElementById('rockList').appendChild(node);
}
function toggleFollowup(id) {
  const block = document.getElementById(id);
  const status = block.querySelector('.rock-status').value;
  block.querySelector('.rock-followup-wrap').style.display = status === 'NOT DONE' ? 'block' : 'none';
  recalcRockPct();
}

/* ---------- PEOPLE ---------- */
function addPerson(data) {
  data = data || {};
  const id = 'person' + (personCount++);
  const node = el(`
    <div class="item-block" id="${id}">
      <div class="item-header">
        <strong>Team Member</strong>
        <button class="small-btn remove-btn" onclick="document.getElementById('${id}').remove()">Remove</button>
      </div>
      <label>Name</label>
      <input type="text" class="p-name" value="${data.name||''}">
      <div class="row">
        <div>
          <label>Good News — Personal</label>
          <input type="text" class="p-goodPersonal" value="${data.goodPersonal||''}">
        </div>
        <div>
          <label>Good News — Professional</label>
          <input type="text" class="p-goodProf" value="${data.goodProf||''}">
        </div>
      </div>
      <label>Working (one per line)</label>
      <textarea class="p-working" rows="2">${data.working||''}</textarea>
      <label>Not Working (one per line)</label>
      <textarea class="p-notWorking" rows="2">${data.notWorking||''}</textarea>
      <label>Expectations</label>
      <input type="text" class="p-expect" value="${data.expect||''}">
      <label>Personal Rock (this quarter)</label>
      <input type="text" class="p-rock" value="${data.rock||''}">
      <label>Action Items</label>
      <div class="p-actions"></div>
      <button class="small-btn" onclick="addActionLine(this)">+ Add Action Item</button>
    </div>
  `);
  document.getElementById('peopleList').appendChild(node);
  const actions = data.actions || [''];
  actions.forEach(a => addActionLineTo(node.querySelector('.p-actions'), a));
}
function addActionLine(btn) {
  const wrap = btn.previousElementSibling;
  addActionLineTo(wrap, '');
}
function addActionLineTo(wrap, value, isRock, rockInitials, rockDesc) {
  const line = el(`
    <div class="action-item-wrap" style="border:1px solid var(--border);border-radius:6px;padding:8px;margin-bottom:6px;background:#fff;">
      <div class="action-line" style="margin-bottom:0;">
        <input type="text" class="p-action-item" placeholder='e.g. ROCK #2 (CS): Scorecard: 4 weeks with < 10 7 day old SD tickets' value="${(value||'').replace(/"/g,'&quot;')}">
        <button class="small-btn remove-btn" onclick="this.closest('.action-item-wrap').remove()">×</button>
      </div>
      <label style="display:flex;align-items:center;gap:6px;font-size:11px;margin:6px 0 0 0;cursor:pointer;">
        <input type="checkbox" class="p-action-isrock" style="width:auto;" ${isRock?'checked':''} onchange="toggleRockFields(this)">
        Carry forward as a new ROCK for next meeting
      </label>
      <div class="rock-carry-fields" style="display:${isRock?'flex':'none'};gap:8px;margin-top:6px;">
        <input type="text" class="p-action-rock-initials" placeholder="Initials (e.g. MS)" style="flex:0 0 120px;" value="${rockInitials||''}">
        <input type="text" class="p-action-rock-desc" placeholder="Rock description for next meeting" value="${rockDesc||''}">
      </div>
    </div>
  `);
  wrap.appendChild(line);
}
function toggleRockFields(checkbox) {
  const fields = checkbox.closest('.action-item-wrap').querySelector('.rock-carry-fields');
  fields.style.display = checkbox.checked ? 'flex' : 'none';
}

/* ---------- TODOS ---------- */
function addTodo(value) {
  const id = 'todo' + (todoCount++);
  const node = el(`
    <div class="action-line" id="${id}">
      <input type="text" class="todo-item" placeholder='e.g. To Do (GT): Communicate meeting minutes from Rock Setting to team' value="${(value||'').replace(/"/g,'&quot;')}">
      <button class="small-btn remove-btn" onclick="document.getElementById('${id}').remove()">×</button>
    </div>
  `);
  document.getElementById('todoList').appendChild(node);
}

/* ---------- EXPECTATIONS ---------- */
function addExp(data) {
  data = data || {};
  const id = 'exp' + (expCount++);
  const node = el(`
    <div class="exp-row" id="${id}">
      <input type="text" class="exp-name" placeholder="Name" value="${data.name||''}">
      <select class="exp-met">
        <option value="Yes" ${data.met==='Yes'?'selected':''}>Yes</option>
        <option value="No" ${data.met==='No'?'selected':''}>No</option>
      </select>
      <input type="text" class="exp-rating" placeholder="10" value="${data.rating||''}">
      <button class="small-btn remove-btn" onclick="document.getElementById('${id}').remove()">×</button>
    </div>
  `);
  document.getElementById('expList').appendChild(node);
}

/* ---------- TEAM ROSTERS PER DEPARTMENT (edit these lists to add/remove people) ---------- */
const TEAM_ROSTERS = {
  'Service Desk': ['Grant', 'Roean', 'Jared', 'Martin', 'Megan', 'Caleb', 'Cyndi'],
  'Sales': ['Tavis', 'Grant', 'Audrey', 'Sam', 'Aubrey'],
  'Field': ['Grant', 'Tony', 'Dan', 'Dustin', 'Zach', 'Steve']
};
const DEPT_ABBREV = { 'Service Desk': 'SD', 'Sales': 'Sales', 'Field': 'FT' };

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function currentDepartment() {
  return document.getElementById('metaDepartment').value;
}

function seed() {
  const order = shuffle(TEAM_ROSTERS[currentDepartment()]);

  // Personal Rock Reviews — one blank card per team member, in a fresh random order each load
  order.forEach(name => addPerson({ name }));

  // Recurring meeting-level to-do
  addTodo('To Do (GT): Communicate meeting minutes from Rock Setting to team');

  // Expectations and Rating — same random order, one blank row per team member
  order.forEach(name => addExp({ name }));
}
seed();

function onDepartmentChange() {
  // Clear out the previous department's people/expectations, then reseed fresh
  document.getElementById('peopleList').innerHTML = '';
  document.getElementById('expList').innerHTML = '';
  const order = shuffle(TEAM_ROSTERS[currentDepartment()]);
  order.forEach(name => addPerson({ name }));
  order.forEach(name => addExp({ name }));
}

/* ---------- MEETING TIMER ---------- */
let timerSeconds = 0, timerInterval = null, timerRunning = false;
function formatTimer(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(v => String(v).padStart(2, '0')).join(':');
}
function updateActualTimeField() {
  const hours = timerSeconds / 3600;
  document.getElementById('metaTimeActual').value = hours.toFixed(2);
}
function tick() {
  timerSeconds++;
  document.getElementById('timerDisplay').textContent = formatTimer(timerSeconds);
  updateActualTimeField();
}
function toggleTimer() {
  const btn = document.getElementById('timerStartBtn');
  if (timerRunning) {
    clearInterval(timerInterval);
    timerRunning = false;
    btn.textContent = 'Start';
  } else {
    timerInterval = setInterval(tick, 1000);
    timerRunning = true;
    btn.textContent = 'Pause';
  }
}
function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = 0;
  document.getElementById('timerDisplay').textContent = '00:00:00';
  document.getElementById('timerStartBtn').textContent = 'Start';
  updateActualTimeField();
}

/* ---------- AUTO-CALCULATED ROCK COMPLETION % ---------- */
function recalcRockPct() {
  const statuses = Array.from(document.querySelectorAll('.rock-status')).map(s => s.value);
  const field = document.getElementById('companyRockPct');
  if (!statuses.length) { field.value = ''; return; }
  const done = statuses.filter(s => s === 'DONE').length;
  const pct = Math.round((done / statuses.length) * 100);
  field.value = pct + '%';
}
new MutationObserver(recalcRockPct).observe(document.getElementById('rockList'), { childList: true });
recalcRockPct();

/* ---------- AUTO-CALCULATED AVERAGE RATING ---------- */
function recalcAvgRating() {
  const ratings = Array.from(document.querySelectorAll('.exp-rating'))
    .map(i => parseFloat(i.value))
    .filter(v => !isNaN(v));
  const field = document.getElementById('metaAvgRating');
  field.value = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
    : '';
}
document.getElementById('expList').addEventListener('input', e => {
  if (e.target.classList.contains('exp-rating')) recalcAvgRating();
});
new MutationObserver(recalcAvgRating).observe(document.getElementById('expList'), { childList: true });
recalcAvgRating();

/* ---------- ROCK CARRYOVER (export from this meeting / import into next) ---------- */
function exportRocksForNextMeeting() {
  const rocks = [];
  document.querySelectorAll('.action-item-wrap').forEach(wrap => {
    const checked = wrap.querySelector('.p-action-isrock').checked;
    if (!checked) return;
    const initials = wrap.querySelector('.p-action-rock-initials').value.trim();
    const desc = wrap.querySelector('.p-action-rock-desc').value.trim();
    if (initials || desc) rocks.push({ initials, desc });
  });
  if (!rocks.length) {
    alert('No action items are checked as "Carry forward as a new ROCK" yet. Check the ones you want carried over, then export again.');
    return;
  }
  const blob = new Blob([JSON.stringify(rocks, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rocks_for_next_meeting.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function importRocks(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const rocks = JSON.parse(reader.result);
      if (!Array.isArray(rocks)) throw new Error('Invalid file');
      rocks.forEach(r => addRock({ initials: r.initials || '', desc: r.desc || '', status: 'NOT DONE' }));
    } catch (err) {
      alert('Could not read that file. Make sure it\'s a rocks_for_next_meeting.json export from this tool.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

/* ---------- CLOUD SYNC (via same Worker that serves this page — private KV storage) ---------- */
function ghSetStatus(msg, color) {
  const el = document.getElementById('ghStatus');
  el.textContent = msg;
  el.style.color = color || 'var(--muted)';
}
async function saveRocksToGitHub() {
  const rocks = [];
  document.querySelectorAll('.action-item-wrap').forEach(wrap => {
    const checked = wrap.querySelector('.p-action-isrock').checked;
    if (!checked) return;
    const initials = wrap.querySelector('.p-action-rock-initials').value.trim();
    const desc = wrap.querySelector('.p-action-rock-desc').value.trim();
    if (initials || desc) rocks.push({ initials, desc });
  });
  if (!rocks.length) {
    ghSetStatus('No action items are checked as "Carry forward as a new ROCK" yet.', '#b23a3a');
    return;
  }
  const department = currentDepartment();
  const stats = {
    companyRockPct: document.getElementById('companyRockPct').value,
    avgRating: document.getElementById('metaAvgRating').value,
    title: document.getElementById('metaTitle').value
  };
  ghSetStatus('Saving…');
  try {
    const res = await fetch('/api/rocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ department, deptAbbrev: DEPT_ABBREV[department] || department, rocks, stats })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      ghSetStatus(`Saved ${data.count} rock(s) for ${department} (${data.key}).`, '#1f7a4d');
    } else {
      ghSetStatus(`Error: ${data.error || res.status}`, '#b23a3a');
    }
  } catch (e) {
    ghSetStatus(`Request failed: ${e.message}`, '#b23a3a');
  }
}
async function loadRocksFromGitHub() {
  const department = currentDepartment();
  const abbrev = DEPT_ABBREV[department] || department;
  ghSetStatus('Loading…');
  try {
    const res = await fetch(`/api/rocks?dept=${encodeURIComponent(abbrev)}`, { method: 'GET' });
    const data = await res.json();
    if (!res.ok) {
      ghSetStatus(`Error: ${data.error || res.status}`, '#b23a3a');
      return;
    }
    const rocks = data.rocks || [];
    rocks.forEach(r => addRock({ initials: r.initials || '', desc: r.desc || '', status: 'NOT DONE' }));
    ghSetStatus(rocks.length
      ? `Loaded ${rocks.length} rock(s) for ${department} from ${data.period || 'last saved meeting'}.`
      : `No saved rocks found yet for ${department}.`, '#1f7a4d');
  } catch (e) {
    ghSetStatus(`Failed to load: ${e.message}`, '#b23a3a');
  }
}

/* ---------- GENERATE WORD DOC ---------- */
function esc(s) {
  return (s||'').toString()
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function linesToParas(text, indent) {
  return (text||'').split('\n').map(l=>l.trim()).filter(Boolean)
    .map(l=>`<p style="margin:0 0 2px 0;margin-left:${indent}px;">${esc(l)}</p>`).join('');
}

function generateDoc() {
  const department = currentDepartment();
  const title = document.getElementById('metaTitle').value;
  const timeObj = document.getElementById('metaTimeObj').value;
  const timeActual = document.getElementById('metaTimeActual').value;
  const avgRating = document.getElementById('metaAvgRating').value;
  const rockLabel = document.getElementById('companyRockLabel').value;
  const rockPct = document.getElementById('companyRockPct').value;
  const reviewedLine = document.getElementById('reviewedLine').value;

  let html = '';
  html += `<p style="text-align:center;font-weight:bold;font-size:14pt;margin-bottom:0;">${esc(title)}</p>`;
  html += `<p style="text-align:center;margin:2px 0;">Department: ${esc(department)}</p>`;
  html += `<p style="text-align:center;margin:2px 0;">Time objective: ${esc(timeObj)} Actual time: ${esc(timeActual)}</p>`;
  html += `<p style="text-align:center;margin:2px 0 16px 0;">Average rating: ${esc(avgRating)}</p>`;

  html += `<p style="font-weight:bold;margin-bottom:4px;">ROCK Completion - Any to be carried over from last quarter?</p>`;
  document.querySelectorAll('#rockList .item-block').forEach(block=>{
    const initials = block.querySelector('.rock-initials').value;
    const desc = block.querySelector('.rock-desc').value;
    const status = block.querySelector('.rock-status').value;
    html += `<p style="margin:0 0 2px 0;">(${esc(initials)}) - ${esc(desc)} - ${esc(status)}</p>`;
    if (status === 'NOT DONE') {
      const fu = block.querySelector('.rock-followup').value;
      if (fu) html += `<p style="margin:0 0 2px 0;margin-left:24px;">${esc(fu)}</p>`;
    }
  });

  html += `<p style="margin-top:12px;">${esc(rockLabel)} ${esc(rockPct)}</p>`;
  html += `<p style="margin-top:6px;">${esc(reviewedLine)}</p>`;
  html += `<p style="margin-top:12px;font-style:italic;">Best news 90 days? What is and isn't working? Expectations? Personal Rock for the quarter?</p>`;

  document.querySelectorAll('#peopleList .item-block').forEach(block=>{
    const name = block.querySelector('.p-name').value;
    const goodPersonal = block.querySelector('.p-goodPersonal').value;
    const goodProf = block.querySelector('.p-goodProf').value;
    const working = block.querySelector('.p-working').value;
    const notWorking = block.querySelector('.p-notWorking').value;
    const expect = block.querySelector('.p-expect').value;
    const rock = block.querySelector('.p-rock').value;
    const actions = Array.from(block.querySelectorAll('.p-action-item')).map(i=>i.value).filter(Boolean);

    html += `<p style="font-weight:bold;margin-top:14px;margin-bottom:2px;">${esc(name)}:</p>`;
    html += `<p style="margin:0 0 2px 0;">- Good news: Personal: ${esc(goodPersonal)}, Professional: ${esc(goodProf)}</p>`;
    html += `<p style="margin:0 0 2px 0;">- Working: ${esc(working.split('\n')[0]||'')}</p>`;
    working.split('\n').slice(1).map(l=>l.trim()).filter(Boolean).forEach(l=>{
      html += `<p style="margin:0 0 2px 0;margin-left:24px;">${esc(l)}</p>`;
    });
    html += `<p style="margin:0 0 2px 0;">- Not Working:</p>`;
    notWorking.split('\n').map(l=>l.trim()).filter(Boolean).forEach(l=>{
      html += `<p style="margin:0 0 2px 0;margin-left:24px;">o ${esc(l)}</p>`;
    });

    html += `<p style="margin:0 0 2px 0;">- Expectations: ${esc(expect)}</p>`;
    html += `<p style="margin:0 0 2px 0;">- Personal Rock: ${esc(rock)}</p>`;
    if (actions.length) {
      html += `<p style="margin:0 0 2px 0;margin-left:24px;">o Action items:</p>`;
      actions.forEach(a=>{
        html += `<p style="margin:0 0 2px 0;margin-left:48px;">${esc(a)}</p>`;
      });
    }
  });

  const idsNow = document.getElementById('idsNow').value;
  html += `<p style="font-weight:bold;margin-top:16px;margin-bottom:2px;">IDS Now:</p>`;
  const idsLines = idsNow.split('\n').map(l=>l.trim()).filter(Boolean);
  if (idsLines.length) {
    idsLines.forEach(l=>{ html += `<p style="margin:0 0 2px 0;">- ${esc(l)}</p>`; });
  } else {
    html += `<p style="margin:0 0 2px 0;">- Anything?</p>`;
  }

  const todos = Array.from(document.querySelectorAll('.todo-item')).map(i=>i.value).filter(Boolean);
  todos.forEach(t=>{ html += `<p style="margin:14px 0 2px 0;">${esc(t)}</p>`; });

  html += `<p style="font-weight:bold;margin-top:16px;margin-bottom:4px;">Expectations and Rating:</p>`;
  document.querySelectorAll('#expList .exp-row').forEach(row=>{
    const name = row.querySelector('.exp-name').value;
    const met = row.querySelector('.exp-met').value;
    const rating = row.querySelector('.exp-rating').value;
    if (name) html += `<p style="margin:0 0 2px 0;">${esc(name)}: ${esc(met)}, ${esc(rating)}</p>`;
  });

  const fullHtml = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${esc(title)}</title>
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #000; }
p { margin: 0 0 4px 0; }
</style>
</head>
<body>${html}</body>
</html>`;

  const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = (title || 'Rock_Meeting_Minutes').replace(/[^\w\- ]/g,'').trim().replace(/\s+/g,'_');
  a.href = url;
  a.download = `${DEPT_ABBREV[department] || department}_${safeTitle}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
