let records = JSON.parse(localStorage.getItem("naxianlu_records")) || [];

function saveRecords() {
  localStorage.setItem("naxianlu_records", JSON.stringify(records));
}

function addRecord() {
  const pool = document.getElementById("pool").value;
  const character = document.getElementById("character").value.trim();
  const draws = Number(document.getElementById("draws").value);
  const isUp = document.getElementById("isUp").checked;

  if (!character || !draws || draws < 1) {
    alert("請填寫角色名稱和抽數！");
    return;
  }

  records.push({
    pool: pool,
    character: character,
    draws: draws,
    isUp: isUp,
    date: new Date().toLocaleDateString("zh-TW")
  });

  saveRecords();
  renderRecords();
  renderPoolStats();

  document.getElementById("character").value = "";
  document.getElementById("draws").value = "";
  document.getElementById("isUp").checked = false;
}

function renderRecords() {
  const recordsBox = document.getElementById("records");

  if (records.length === 0) {
    recordsBox.innerHTML =
      '<p class="empty">目前還沒有抽卡紀錄。</p>';
    updateStats();
    return;
  }

  recordsBox.innerHTML = records
    .map((record, index) => `
      <div class="record">
        <strong>${record.character}</strong>
        ${record.isUp ? " ✦ UP" : ""}
        <br>
        <span class="pool-badge">${record.pool}</span>
        ・${record.draws} 抽
        <br>
        <small>${record.date}</small>
      </div>
    `)
    .reverse()
    .join("");

  updateStats();
}

function updateStats() {
  const totalDraws = records.reduce(
    (sum, record) => sum + record.draws,
    0
  );

  const rareCount = records.filter(
    record => record.isUp
  ).length;

  const average =
    rareCount > 0
      ? (totalDraws / rareCount).toFixed(1)
      : 0;

  document.getElementById("totalDraws").textContent = totalDraws;
  document.getElementById("rareCount").textContent = rareCount;
  document.getElementById("averageDraws").textContent = average;
}

function renderPoolStats() {
  const poolStatsBox = document.getElementById("poolStats");

  if (records.length === 0) {
    poolStatsBox.innerHTML =
      '<p class="empty">目前還沒有抽卡紀錄。</p>';
    return;
  }

  // 按卡池分組統計
  const poolGroups = {};
  records.forEach(record => {
    if (!poolGroups[record.pool]) {
      poolGroups[record.pool] = {
        totalDraws: 0,
        upCount: 0,
        records: []
      };
    }
    poolGroups[record.pool].totalDraws += record.draws;
    if (record.isUp) {
      poolGroups[record.pool].upCount += 1;
    }
    poolGroups[record.pool].records.push(record);
  });

  poolStatsBox.innerHTML = Object.entries(poolGroups)
    .map(([pool, stats]) => {
      const average = stats.upCount > 0 
        ? (stats.totalDraws / stats.upCount).toFixed(1) 
        : "N/A";
      return `
        <div class="pool-stat">
          <h3>${pool}</h3>
          <div class="stat-row">
            <span>總抽數：<strong>${stats.totalDraws}</strong></span>
            <span>出金數：<strong>${stats.upCount}</strong></span>
            <span>平均：<strong>${average}</strong></span>
          </div>
        </div>
      `;
    })
    .join("");
}

function clearRecords() {
  if (records.length === 0) return;

  const confirmClear = confirm("確定要清除全部抽卡紀錄嗎？");

  if (confirmClear) {
    records = [];
    saveRecords();
    renderRecords();
    renderPoolStats();
  }
}

renderRecords();
renderPoolStats();
