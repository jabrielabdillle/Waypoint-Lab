import { createIcons, Activity, ArrowUpRight, Box, ChevronLeft, ChevronRight, Database, Download, FlaskConical, GitBranch, LayoutDashboard, Play, Pause, RotateCcw, Search, ShieldCheck, Terminal, X } from 'lucide';
import { createDatabase, query, families, label } from './database';
import smoke from '../../reports/m0a-smoke.json';
import './style.css';

const icons = { Activity, ArrowUpRight, Box, ChevronLeft, ChevronRight, Database, Download, FlaskConical, GitBranch, LayoutDashboard, Play, Pause, RotateCcw, Search, ShieldCheck, Terminal, X };
const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
const number = value => Number(value).toLocaleString('en-US');
let db, view = 'overview', method = 'all', family = 'all', page = 0, search = '', frame = 0, playing = false, timer;
const pageSize = 12;
const repo = 'https://github.com/jabrielabdillle/realtime-recommendation-pipeline';

function filters() {
  const clauses = [], values = [];
  if (method !== 'all') { clauses.push('method = ?'); values.push(method); }
  if (family !== 'all') { clauses.push('family = ?'); values.push(family); }
  if (search) { clauses.push('run_id LIKE ?'); values.push(`%${search}%`); }
  return { where: clauses.length ? ` WHERE ${clauses.join(' AND ')}` : '', values };
}

function shell() {
  document.querySelector('#app').innerHTML = `
    <aside class="sidebar">
      <a class="brand" href="#overview" aria-label="Adaptive Robotics overview"><span class="brand-mark">${icon('box')}</span><span>Adaptive<span class="brand-small">Robotics lab</span></span></a>
      <div class="workspace"><span class="workspace-icon">R</span><div>Navigation research<small>Local experiment workspace</small></div><span class="version">v0.1</span></div>
      <p class="nav-label">Workspace</p>
      <nav aria-label="Main navigation">
        ${[['overview','layout-dashboard','Overview'],['episodes','database','Episode explorer'],['research','flask-conical','Research notes']].map(([id,i,text]) => `<button data-view="${id}" class="nav-item ${view===id?'selected':''}" ${view===id?'aria-current="page"':''}>${icon(i)}${text}${id==='episodes'?'<span class="nav-count">18k</span>':''}</button>`).join('')}
      </nav>
      <div class="sidebar-bottom"><div class="stack-note">${icon('git-branch')}<span>Public demo<small>Training runs locally</small></span></div><a class="source-link" href="${repo}" target="_blank" rel="noreferrer">View source ${icon('arrow-up-right')}</a></div>
    </aside>
    <div class="main-shell"><header class="topbar"><span>Workspace <span class="slash">/</span> ${view==='overview'?'Training overview':view==='episodes'?'Episode explorer':'Research notes'}</span><span class="status"><span></span> Browser SQLite</span></header>
      <main id="main" tabindex="-1"></main>
      <footer>Adaptive Robotics Training Platform <span>Simulated navigation · No physical robot control</span></footer>
    </div>
    <dialog id="detail"><button class="icon-button close" aria-label="Close episode details">${icon('x')}</button><div id="detail-content"></div></dialog>`;
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.view)));
  document.querySelector('.brand').addEventListener('click', e => { e.preventDefault(); navigate('overview'); });
  document.querySelector('.close').addEventListener('click', () => document.querySelector('dialog').close());
  render();
}

function navigate(next) { stop(); if(next !== 'episodes'){search='';page=0;} view = next; location.hash = next; shell(); document.querySelector('#main').focus({ preventScroll: true }); }

function toolbar() {
  return `<div class="filters"><label>Curriculum<select id="method"><option value="all">All curricula</option>${['adaptive','uniform','fixed'].map(v=>`<option value="${v}" ${method===v?'selected':''}>${label(v)}</option>`).join('')}</select></label><label>Scenario family<select id="family"><option value="all">All scenarios</option>${families.map(v=>`<option value="${v}" ${family===v?'selected':''}>${label(v)}</option>`).join('')}</select></label><span class="filter-note">Seeded dataset · November 15, 2026</span></div>`;
}

function render() {
  const main = document.querySelector('#main');
  const { where, values } = filters();
  const totals = query(db, `SELECT count(*) n, count(DISTINCT run_id) runs, avg(success) success, avg(steps) steps, sum(collisions)*100.0/sum(steps) collision FROM episodes${where}`, values)[0];
  if (view==='research') { main.innerHTML = research(); bind(); return; }
  main.innerHTML = `<div class="page-heading"><div><p class="eyebrow">Warehouse navigation</p><h1>${view==='overview'?'Robot training overview':'Episode explorer'}</h1><p>${view==='overview'?'See what the robot practiced, where it struggled, and what comes next.':'Query every simulated episode in the local SQLite database.'}</p></div><button class="button secondary" id="export">${icon('download')}Export ${view==='overview'?'database':'filtered CSV'}</button></div>
    <div class="notice">${icon('flask-conical')}<span><strong>Mock data workspace.</strong> The 18,000 database episodes are generated for this demo. The PPO replay below comes from a real, separate feasibility run.</span></div>
    ${toolbar()}
    ${view==='overview'?`
    <div class="metrics">
      <article><span>Training episodes</span><strong>${number(totals.n)}</strong><small>${totals.runs} matching mock experiment runs</small><div class="mini-bars">${[20,32,26,40,34,52,44,58,48,66,54,76,68,90,82].map(h=>`<b style="height:${h}%"></b>`).join('')}</div></article>
      <article><span>Completion rate</span><strong>${((totals.success||0)*100).toFixed(1)}<em>%</em></strong><small>Across the selected mock episodes</small></article>
      <article><span>Steps per episode</span><strong>${(totals.steps||0).toFixed(0)}</strong><small>200-step timeout limit</small></article>
      <article><span>Collisions / 100 steps</span><strong>${(totals.collision||0).toFixed(1)}</strong><small>Wall and boundary contact</small></article>
    </div>
    <div class="analysis-grid"><section class="panel learning"><div class="panel-heading"><div><h2>Learning curves</h2><p>Mock completion rate by training block</p></div><span class="tag">Illustrative</span></div><div class="chart-wrap">${chart()}</div><div class="legend"><span><b class="adaptive"></b>Adaptive</span><span><b class="uniform"></b>Uniform</span><span><b class="fixed"></b>Fixed schedule</span></div></section>
    <section class="panel replay"><div class="panel-heading"><div><h2>Policy replay</h2><p>Measured PPO · fixed starter task</p></div><span class="tag real">Real run</span></div><canvas id="world" width="480" height="480" role="img" aria-label="12 by 12 warehouse. The trained robot travels three cells east to the goal."></canvas><div class="replay-controls"><button class="button primary" id="play">${icon('play')}Watch robot replay</button><button class="icon-button" id="reset" aria-label="Reset replay">${icon('rotate-ccw')}</button><span id="step">Step ${frame} / 3</span></div><div class="replay-facts"><span>16,384 training steps</span><span>100 / 100 task successes</span></div></section></div>
    <div class="lower-grid"><section class="panel"><div class="panel-heading"><div><h2>Scenario performance</h2><p>Mock completion across all nine difficulty buckets</p></div>${icon('activity')}</div>${buckets()}</section><section class="panel protocol"><span class="protocol-symbol">${icon('git-branch')}</span><h2>Two loops. One learner.</h2><p>PPO learns how to navigate. The curriculum chooses which scenario the robot should practice next.</p><ol><li><span>01</span> Run a navigation episode</li><li><span>02</span> Compute performance features</li><li><span>03</span> Recommend the next scenario</li></ol><button id="read-research" class="text-button">Read the experiment protocol ${icon('arrow-up-right')}</button></section></div>`:`<div class="search-line"><label for="search">Find an experiment run</label><div>${icon('search')}<input id="search" type="search" maxlength="80" placeholder="e.g. mock-adaptive-1" value="${search.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;')}"></div></div>`}
    <section class="panel episode-panel"><div class="panel-heading"><div><h2>${view==='overview'?'Recent episodes':'Episode results'}</h2><p>${number(totals.n)} matching records · open an episode for details</p></div>${view==='overview'?'<button id="all-episodes" class="text-button">See all episodes →</button>':''}</div>${table()}</section>`;
  bind();
  if(view==='overview') draw();
}

function chart() {
  const { where, values } = filters();
  const rows=query(db,`SELECT method, CAST((episode_index-1)/100 AS INTEGER) block, avg(success)*100 rate FROM episodes${where} GROUP BY method, block ORDER BY method, block`,values);
  const colors={adaptive:'#c9a45a',uniform:'#7a9cae',fixed:'#a89c8b'};
  return `<svg viewBox="0 0 650 270" role="img" aria-label="Illustrative completion curves from mock data; not evidence of curriculum improvement.">${[0,25,50,75,100].map(v=>`<line x1="45" x2="630" y1="${230-v*2}" y2="${230-v*2}" stroke="#302a22" stroke-dasharray="3 4"/><text x="5" y="${235-v*2}" fill="#a49c91" font-size="11">${v}%</text>`).join('')}${Object.entries(colors).map(([m,c])=>{const points=rows.filter(r=>r.method===m).map(r=>`${45+r.block*53},${230-r.rate*2}`).join(' ');return `<polyline points="${points}" fill="none" stroke="${c}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;}).join('')}${[0,3,6,9,11].map(b=>`<text x="${45+b*53}" y="260" text-anchor="middle" fill="#a49c91" font-size="11">${(b+1)*100}</text>`).join('')}</svg><span class="axis-label">Episodes per run</span>`;
}

function buckets() {
  const {where,values}=filters();
  const rows=query(db,`SELECT family,difficulty,avg(success)*100 rate FROM episodes${where} GROUP BY family,difficulty ORDER BY family,difficulty`,values);
  return `<div class="bucket-table"><div class="bucket-header"><span>Scenario family</span><span>Easy</span><span>Medium</span><span>Hard</span></div>${families.filter(f=>family==='all'||family===f).map(f=>`<div class="bucket-row"><span>${label(f)}</span>${[1,2,3].map(d=>{const r=rows.find(x=>x.family===f&&x.difficulty===d);return `<span class="heat" style="--heat:${r?(r.rate/140).toFixed(2):0}">${r?r.rate.toFixed(0)+'%':'—'}</span>`;}).join('')}</div>`).join('')}</div>`;
}

function table() {
  const {where,values}=filters();
  const count=query(db,`SELECT count(*) n FROM episodes${where}`,values)[0].n;
  page=Math.max(0,Math.min(page,Math.ceil(count/pageSize)-1));
  const rows=query(db,`SELECT * FROM episodes${where} ORDER BY id DESC LIMIT ? OFFSET ?`,[...values,view==='overview'?5:pageSize,page*pageSize]);
  return `<div class="table-scroll"><table><thead><tr><th>Episode</th><th>Scenario</th><th>Curriculum</th><th>Result</th><th>Steps</th><th>Reward</th><th>Details</th></tr></thead><tbody>${rows.length?rows.map(r=>`<tr><td class="mono">EP-${String(r.id).padStart(5,'0')}</td><td>${label(r.family)} <span class="subtle">L${r.difficulty}</span></td><td>${label(r.method)}</td><td><span class="result ${r.success?'success':'timeout'}">${r.success?'Completed':'Timed out'}</span></td><td class="mono">${r.steps}</td><td class="mono">${r.reward.toFixed(2)}</td><td><button class="row-button" data-episode="${r.id}" aria-label="View episode ${r.id}">${icon('arrow-up-right')}</button></td></tr>`).join(''):'<tr><td colspan="7" class="empty">No matching episodes. Try another run name or filter.</td></tr>'}</tbody></table></div>${view==='episodes'?`<div class="pagination"><span>Page ${page+1} of ${Math.max(1,Math.ceil(count/pageSize))}</span><div><button class="icon-button" id="previous" aria-label="Previous page" ${page===0?'disabled':''}>${icon('chevron-left')}</button><button class="icon-button" id="next" aria-label="Next page" ${(page+1)*pageSize>=count?'disabled':''}>${icon('chevron-right')}</button></div></div>`:''}`;
}

function research() { return `<div class="page-heading"><div><p class="eyebrow">Evidence and limitations</p><h1>Research notes</h1><p>Separate measured behavior from the demonstration dataset.</p></div></div>
  <div class="research-grid"><section class="panel research-card"><span class="tag real">Measured · M0a</span><h2>A robot that learns to navigate</h2><p>The actual PPO feasibility experiment used one fixed, open-floor layout and seed 42. It trained for 16,384 steps on CPU.</p><div class="comparison"><div><span>Random actions</span><strong>64%</strong><small>108.5 mean steps</small></div><div><span>Trained PPO</span><strong>100%</strong><small>3 mean steps</small></div></div><p>Each policy was evaluated for 100 episodes on the same starter task. This is a learnability check, not held-out generalization or evidence of a better curriculum.</p><a class="button secondary" href="${repo}/blob/main/reports/m0a-smoke.json" target="_blank" rel="noreferrer">Read the measured report ${icon('arrow-up-right')}</a></section>
  <section class="panel research-card"><span class="tag">Mock dataset</span><h2>18,000 episodes for exploration</h2><p>The database contains 15 fictional runs, three curricula, three scenario families and three difficulty levels. Seed 42 reproduces the dataset in your browser.</p><p>Learning curves and completion statistics are generated, not measured. They cannot establish that adaptive training outperforms uniform or fixed curricula.</p><p>SQLite runs locally through WebAssembly. Filters use parameterized SQL. There is no shared database, account, server write or cloud training job.</p><button id="export" class="button secondary">${icon('download')}Export database</button></section>
  <section class="panel research-card wide"><span class="tag">Planned comparison</span><h2>The experiment still to run</h2><div class="protocol-columns"><div><h3>Equal budgets</h3><p>Five paired seeds for each curriculum, up to one million environment steps per run.</p></div><div><h3>Independent evaluation</h3><p>Disjoint training, validation and test layouts. Evaluation episodes never change training features.</p></div><div><h3>Honest outcomes</h3><p>Report unsuccessful runs, uncertainty and negative results. The 20% efficiency improvement is a target.</p></div></div><a class="text-button" href="${repo}/blob/main/docs/EXPERIMENTS.md" target="_blank" rel="noreferrer">Read the full protocol ${icon('arrow-up-right')}</a></section></div>`; }

function bind() {
  createIcons({icons});
  for(const [id,set] of [['method',v=>method=v],['family',v=>family=v]]) document.getElementById(id)?.addEventListener('change',e=>{set(e.target.value); page=0; stop(); render();});
  document.getElementById('all-episodes')?.addEventListener('click',()=>navigate('episodes'));
  document.getElementById('read-research')?.addEventListener('click',()=>navigate('research'));
  document.getElementById('search')?.addEventListener('input',e=>{const pos=e.target.selectionStart; search=e.target.value;page=0;render();const input=document.getElementById('search');input.focus();try{input.setSelectionRange(pos,pos)}catch{}});
  document.getElementById('previous')?.addEventListener('click',()=>{page--;render()});
  document.getElementById('next')?.addEventListener('click',()=>{page++;render()});
  document.getElementById('play')?.addEventListener('click',()=>{if(playing)stop();else{if(frame===3)frame=0;playing=true;timer=setInterval(()=>{frame++;draw();if(frame>=3)stop()},600)} updatePlay();});
  document.getElementById('reset')?.addEventListener('click',()=>{stop();frame=0;draw()});
  document.getElementById('export')?.addEventListener('click',download);
  document.querySelectorAll('[data-episode]').forEach(b=>b.addEventListener('click',()=>details(Number(b.dataset.episode))));
}

function stop() { playing=false; clearInterval(timer); updatePlay(); }
function updatePlay(){const b=document.getElementById('play');if(b){b.innerHTML=`${icon(playing?'pause':'play')}${playing?'Pause replay':'Watch robot replay'}`;createIcons({icons})}}
function draw(){const canvas=document.getElementById('world');if(!canvas)return;const c=canvas.getContext('2d'),cell=36,offset=24;
  c.fillStyle='#100e0c';c.fillRect(0,0,480,480);
  for(let r=0;r<12;r++)for(let col=0;col<12;col++){c.fillStyle=(r+col)%2?'#1e1b16':'#1b1814';c.fillRect(offset+col*cell,offset+r*cell,cell-2,cell-2)}
  c.strokeStyle='#7d6740';c.lineWidth=2;c.setLineDash([4,5]);c.beginPath();c.moveTo(offset+1.5*cell,offset+1.5*cell);c.lineTo(offset+4.5*cell,offset+1.5*cell);c.stroke();c.setLineDash([]);
  c.fillStyle='#375e48';c.fillRect(offset+4*cell+4,offset+cell+4,cell-10,cell-10);c.strokeStyle='#95bc9e';c.strokeRect(offset+4*cell+9,offset+cell+9,cell-20,cell-20);
  const [r,col]=smoke.ppo.trace[frame];c.fillStyle='#c9a45a';c.beginPath();c.roundRect(offset+col*cell+5,offset+r*cell+5,cell-12,cell-12,5);c.fill();c.fillStyle='#31271a';c.fillRect(offset+col*cell+20,offset+r*cell+11,4,4);c.fillRect(offset+col*cell+20,offset+r*cell+20,4,4);
  document.getElementById('step').textContent=`Step ${frame} / 3`;
}
function details(id){const r=query(db,'SELECT * FROM episodes WHERE id=?',[id])[0];document.getElementById('detail-content').innerHTML=`<span class="tag">Mock episode</span><h2>EP-${String(id).padStart(5,'0')}</h2><dl>${Object.entries(r).map(([key,value])=>`<div><dt>${label(key)}</dt><dd>${value}</dd></div>`).join('')}</dl>`;document.querySelector('dialog').showModal();}
function download(){let data,type,name;if(view==='episodes'){const {where,values}=filters();const rows=query(db,`SELECT * FROM episodes${where} ORDER BY id`,values);const keys=['id','run_id','method','family','difficulty','episode_index','success','steps','collisions','reward','source','ended_at'];data=[keys.join(','),...rows.map(r=>keys.map(k=>JSON.stringify(r[k])).join(','))].join('\n');type='text/csv';name='robotics-mock-episodes.csv'}else{data=db.export();type='application/vnd.sqlite3';name='robotics-mock.sqlite'}const url=URL.createObjectURL(new Blob([data],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

try { db=await createDatabase();view=['overview','episodes','research'].includes(location.hash.slice(1))?location.hash.slice(1):'overview';shell(); }
catch(error){document.querySelector('#app').innerHTML='<div class="boot"><h1>The database could not open</h1><p>Reload the page to try again. Your browser must support WebAssembly.</p><button onclick="location.reload()">Reload database</button></div>';console.error(error);}
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
