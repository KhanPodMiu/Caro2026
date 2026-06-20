/* ============================================================
   RENDER LOGIC
   ============================================================ */

function renderGroups() {
  const grid = document.getElementById('groupGrid');
  grid.innerHTML = GROUPS.map(g => {
    const rows = g.players
      .slice()
      .sort((a, b) => a.rank - b.rank || b.diem - a.diem)
      .map(p => {
        const cls = p.rank === 1 ? 'q1' : (p.rank === 2 ? 'q2' : '');
        return `
          <tr class="player-row ${cls}">
            <td class="num"><span class="rank-badge">${p.rank}</span></td>
            <td>
              <span class="pname">${p.name}</span>
              <span class="pmssv">${p.mssv}</span>
            </td>
            <td class="num pdiem">${p.diem}</td>
          </tr>`;
      }).join('');

    return `
      <div class="group-card">
        <div class="gc-head">
          <span class="gname">Bảng <b>${g.name}</b></span>
          <span class="gstatus">${g.status}</span>
        </div>
        <table>
          <thead><tr><th class="num">#</th><th>Vận động viên</th><th class="num">Điểm</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }).join('');
}

function matchSlotHTML(side, m) {
  const p = m[side];
  const isWinner = m.winner === side;
  const tbd = !p.name;
  const stoneColor = side === 'a' ? 'black' : 'white';
  return `
    <div class="match-slot ${isWinner ? 'winner' : ''} ${tbd ? 'tbd' : ''}">
      <span class="stone ${stoneColor}"></span>
      <span class="mname">${tbd ? 'Chưa xác định' : p.name}</span>
      <span class="mscore">${p.score === null || p.score === undefined ? '–' : p.score}</span>
    </div>`;
}

function matchCardHTML(m, opts = {}) {
  const isLive  = m.status === 'live';
  const isCup   = !!opts.isFinal;
  let metaRight = '';
  if (isLive)                   metaRight = `<span class="live"><span class="blink"></span>Đang diễn ra</span>`;
  else if (m.status === 'done') metaRight = `Đã kết thúc`;
  else                          metaRight = `Chưa thi đấu`;

  return `
    <div class="match ${isLive ? 'is-live' : ''} ${isCup ? 'cup' : ''}">
      ${matchSlotHTML('a', m)}
      ${matchSlotHTML('b', m)}
      <div class="match-meta">
        <span>${m.id}</span>
        ${metaRight}
      </div>
    </div>`;
}

function renderBracket() {
  const rounds = [
    { title: 'Vòng 1/16', sub: `${ROUND_16.length} trận · Bo1`, matches: ROUND_16 },
    { title: 'Vòng 1/8',  sub: `${ROUND_8.length} trận · Bo1`,  matches: ROUND_8 },
    { title: 'Tứ kết',    sub: `${QUARTER.length} trận · Bo3`, matches: QUARTER },
    { title: 'Bán kết',   sub: `${SEMI.length} trận · Bo3`, matches: SEMI },
    { title: 'Chung kết', sub: `Bo5`, matches: FINAL, isFinal: true },
  ];

  const roundClasses = [
    'round16',
    'round8',
    'quarter',
    'semi',
    'final'
  ];

  const grid = document.getElementById('bracketGrid');

  grid.innerHTML = rounds.map((r, i) => `
    <div class="bracket-round ${roundClasses[i]}">
      <div class="round-title">
        <b>${r.title}</b><br>${r.sub}
      </div>

      ${
        r.matches.length
          ? r.matches.map(m =>
              matchCardHTML(m, { isFinal: r.isFinal })
            ).join('')
          : `
            <div
              style="
                color:var(--stone);
                font-size:12px;
                padding:12px;
                text-align:center
              "
            >
              Chưa có dữ liệu
            </div>
          `
      }
    </div>
  `).join('');

  const finalMatch = FINAL[0];
  const championEl = document.getElementById('championName');

  if (finalMatch && finalMatch.winner) {
    championEl.innerHTML = finalMatch[finalMatch.winner].name;
  } else {
    championEl.innerHTML =
      `<span class="tbd">Đang chờ kết quả Chung kết…</span>`;
  }
}

function renderClock() {
  const el = document.getElementById('clock');
  function tick() {
    const now = new Date();
    el.textContent = 'Cập nhật lúc ' + now.toLocaleTimeString('vi-VN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
  tick();
  setInterval(tick, 1000);
}

function initTabs() {
  const btns = document.querySelectorAll('.tab-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    });
  });
}



/* ---- Init ---- */
// renderGroups() và renderBracket() được gọi từ data.js sau khi fetch xong
renderClock();
initTabs();