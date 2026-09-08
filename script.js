let records = JSON.parse(localStorage.getItem("naxianlu_records")) || [];

function saveRecords() {
  localStorage.setItem("naxianlu_records", JSON.stringify(records));
}

function addRecord() {
  const character = document.getElementById("character").value.trim();
  const rarity = document.getElementById("rarity").value;
  const draws = Number(document.getElementById("draws").value);
  const isUp = document.getElementById("isUp").checked;

  if (!character || !draws || draws < 1) {
    alert("請填寫角色名稱和抽數！");
    return;
  }

  records.push({
    character: character,
    rarity: rarity,
    draws: draws,
    isUp: isUp,
    date: new Date().toLocaleDateString("zh-TW")
  });

  saveRecords();
  renderRecords();

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
        ${record.rarity === "rare" ? "稀有" : "普通"}
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

  const rareRecords = records.filter(
    record => record.rarity === "rare"
  );

  const rareCount = rareRecords.length;

  const average =
    rareCount > 0
      ? (totalDraws / rareCount).toFixed(1)
      : 0;

  document.getElementById("totalDraws").textContent = totalDraws;
  document.getElementById("rareCount").textContent = rareCount;
  document.getElementById("averageDraws").textContent = average;
}

function clearRecords() {
  if (records.length === 0) return;

  const confirmClear = confirm("確定要清除全部抽卡紀錄嗎？");

  if (confirmClear) {
    records = [];
    saveRecords();
    renderRecords();
  }
}

renderRecords();
