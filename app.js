const CONG_PHAP = [
  "Array",
  "String",
  "Hash Table",
  "Linked List",
  "Stack & Queue",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Tree",
  "Graph",
  "Backtracking",
  "Dynamic Programming",
  "Greedy",
  "Heap",
  "Sorting",
];
const CONG_PHAP_NAMES = {
  Array: "Vạn Tượng Kiếm Trận",
  String: "Ngôn Linh Chân Quyết",
  "Hash Table": "Nhất Niệm Tàng Vạn Pháp",
  "Linked List": "Trường Sinh Liên Hoàn",
  "Stack & Queue": "Luân Hồi Pháp Trận",
  "Two Pointers": "Song Sinh Kiếm Ý",
  "Sliding Window": "Lưu Quang Kết Giới",
  "Binary Search": "Thiên Cơ Truy Tầm",
  Tree: "Linh Mộc Đạo Chủng",
  Graph: "Chư Thiên Độn Đồ",
  Backtracking: "Nghịch Mệnh Hồi Thiên",
  "Dynamic Programming": "Cửu Chuyển Diễn Đạo",
  Greedy: "Đoạt Thiên Cơ",
  Heap: "Thiên Cơ Tranh Tiên Quyết",
  Sorting: "Vạn Pháp Quy Nguyên",
};
function tenCongPhap(topic) {
  return `${CONG_PHAP_NAMES[topic] || topic} (${topic})`;
}

const REALM_NAMES = [
  "Phàm Nhân",
  "Luyện Khí",
  "Trúc Cơ",
  "Kim Đan",
  "Nguyên Anh",
  "Hóa Thần",
  "Luyện Hư",
  "Hợp Thể",
  "Đại Thừa",
  "Độ Kiếp",
];
const TITLE_NAMES = [
  "Phàm Nhân",
  "Tu Sĩ",
  "Đạo Hữu",
  "Chân Nhân",
  "Trưởng Lão",
  "Tiên Quân",
  "Tiên Tôn",
  "Đại Tiên",
];
const REALM_STEP_WEIGHTS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const TITLE_STEP_WEIGHTS = [3, 5, 11, 14, 17, 22, 28];
const TRIBULATION_FROM_INDEX = 5;
const TRIBULATION_REQUIREMENT = 6;
const MIN_TOTAL_GOAL =
  REALM_STEP_WEIGHTS.length +
  (REALM_NAMES.length - TRIBULATION_FROM_INDEX) * TRIBULATION_REQUIREMENT;
function computeThresholds(
  names,
  stepWeights,
  max,
  tribulationFromIndex = Infinity,
) {
  const tribulationCount = Math.max(0, names.length - tribulationFromIndex);
  const progressionGoal = Math.max(
    stepWeights.length,
    max - tribulationCount * TRIBULATION_REQUIREMENT,
  );
  const totalWeight = stepWeights.reduce((a, b) => a + b, 0);
  const progressionSteps = stepWeights.map((weight) =>
    Math.max(1, Math.floor((weight / totalWeight) * progressionGoal)),
  );
  let allocated = progressionSteps.reduce((sum, step) => sum + step, 0);
  while (allocated < progressionGoal) {
    let nextIndex = 0;
    let largestRemainder = -Infinity;
    stepWeights.forEach((weight, i) => {
      const remainder =
        (weight / totalWeight) * progressionGoal - progressionSteps[i];
      if (remainder > largestRemainder) {
        largestRemainder = remainder;
        nextIndex = i;
      }
    });
    progressionSteps[nextIndex]++;
    allocated++;
  }
  const mins = [0];
  let cum = 0;
  progressionSteps.forEach((step, i) => {
    const tribulation = i + 1 >= tribulationFromIndex
      ? TRIBULATION_REQUIREMENT
      : 0;
    cum += step + tribulation;
    mins.push(cum);
  });
  const last = mins.length - 1;
  mins[last] = Math.max(max, mins[last - 1] + 1);
  return names.map((name, i) => ({
    min: mins[i],
    name,
    tribulation: i >= tribulationFromIndex ? TRIBULATION_REQUIREMENT : 0,
  }));
}
function getTotalGoal() {
  return Math.max(MIN_TOTAL_GOAL, db.player.totalGoal || 150);
}
function getPerCpGoal() {
  return Math.max(
    1,
    Math.ceil(getTotalGoal() / CONG_PHAP.length),
  );
}
function getRealms() {
  return computeThresholds(
    REALM_NAMES,
    REALM_STEP_WEIGHTS,
    getTotalGoal(),
    TRIBULATION_FROM_INDEX,
  );
}
function getTopicRealms() {
  return computeThresholds(REALM_NAMES, REALM_STEP_WEIGHTS, getPerCpGoal());
}
function getTitles() {
  return computeThresholds(
    TITLE_NAMES,
    TITLE_STEP_WEIGHTS,
    getTotalGoal(),
  );
}
function realmForTopic(count) {
  const R = getTopicRealms();
  let r = R[0];
  for (const x of R) if (count >= x.min) r = x;
  return r.name;
}

const DB_KEY = "congphap_db";
const API_URL = "/api/db";
const LEGENDS_KEY = "congphap_legends";
const LEGENDS_API_URL = "/api/legends";
let USE_API = false; // becomes true once /api/db (server.js + db.json) is confirmed reachable
let legends = {};

function defaultDB() {
  return {
    player: { name: "", dailyTarget: 1 },
    problems: [],
    settings: {},
    inventory: {
      spiritStones: { low: 0, medium: 0, high: 0 },
      artifacts: "",
      elixirs: "",
    },
  };
}
function normalizeDB(d) {
  d = d || {};
  d.player = d.player || { name: "", dailyTarget: 1 };
  d.problems = d.problems || [];
  d.settings = d.settings || {};
  const inventory = d.inventory || {};
  const spiritStones = inventory.spiritStones || {};
  d.inventory = {
    spiritStones: {
      low: Number(spiritStones.low) || 0,
      medium: Number(spiritStones.medium) || 0,
      high: Number(spiritStones.high) || 0,
    },
    artifacts: inventory.artifacts || "",
    elixirs: inventory.elixirs || "",
  };
  return d;
}
function loadDBFromLocalStorage() {
  try {
    return normalizeDB(JSON.parse(localStorage.getItem(DB_KEY)));
  } catch (e) {
    return defaultDB();
  }
}
async function loadDB() {
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (res.ok) {
      USE_API = true;
      return normalizeDB(await res.json());
    }
  } catch (e) {
    /* server.js not running (e.g. opened as a plain file) — fall back below */
  }
  USE_API = false;
  return loadDBFromLocalStorage();
}
function saveDB(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {}
  if (USE_API) {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(db),
    }).catch(() => {
      USE_API = false;
    });
  }
}
let db = defaultDB();

async function loadLegends() {
  try {
    const res = await fetch(LEGENDS_API_URL, { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    /* server.js not running — use browser fallback */
  }
  try {
    return JSON.parse(localStorage.getItem(LEGENDS_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveLegends() {
  try {
    localStorage.setItem(LEGENDS_KEY, JSON.stringify(legends));
  } catch (e) {}
  if (USE_API) {
    fetch(LEGENDS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(legends),
    }).catch(() => {});
  }
}

function realmFor(count) {
  const R = getRealms();
  let r = R[0];
  for (const x of R) if (count >= x.min) r = x;
  return r.name;
}
function tribulationProgress(count) {
  const nextRealm = getRealms().find(
    (realm) => realm.tribulation && count < realm.min,
  );
  if (!nextRealm) return "";
  const tribulationStartsAt = nextRealm.min - TRIBULATION_REQUIREMENT;
  if (count < tribulationStartsAt) return "";
  const solved = Math.min(count - tribulationStartsAt, TRIBULATION_REQUIREMENT);
  return `Thiên kiếp ${nextRealm.name}: ${solved}/${TRIBULATION_REQUIREMENT} chiêu`;
}
function titleFor(count) {
  const T = getTitles();
  let t = T[0];
  for (const x of T) if (count >= x.min) t = x;
  return t.name;
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function ensureName() {
  if (!db.player.name) {
    const n = prompt("Đạo hiệu của đạo hữu là gì?", "");
    db.player.name = n && n.trim() ? n.trim() : "Vô Danh";
    saveDB(db);
  }
}
document.getElementById("renameBtn").onclick = () => {
  const n = prompt("Đổi đạo hiệu:", db.player.name || "");
  if (n && n.trim()) {
    db.player.name = n.trim();
    saveDB(db);
    renderAll();
  }
};

function populateSelects() {
  const cp = document.getElementById("cpSelect");
  const fc = document.getElementById("filterCp");
  cp.innerHTML = "";
  fc.innerHTML = '<option value="">Tất cả công pháp</option>';
  CONG_PHAP.forEach((c) => {
    const label = tenCongPhap(c);
    cp.innerHTML += `<option value="${c}">${label}</option>`;
    fc.innerHTML += `<option value="${c}">${label}</option>`;
  });
}

document.querySelectorAll(".tab").forEach((t) => {
  t.onclick = () => {
    document
      .querySelectorAll(".tab")
      .forEach((x) => x.classList.remove("active"));
    document
      .querySelectorAll(".panel")
      .forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    document.getElementById("panel-" + t.dataset.tab).classList.add("active");
  };
});

document.getElementById("saveTarget").onclick = () => {
  const v = parseInt(document.getElementById("dailyTarget").value) || 1;
  db.player.dailyTarget = v;
  saveDB(db);
  renderTodayStatus();
};

function renderInventory() {
  const inventory = db.inventory;
  document.getElementById("spiritStoneLow").value = inventory.spiritStones.low;
  document.getElementById("spiritStoneMedium").value =
    inventory.spiritStones.medium;
  document.getElementById("spiritStoneHigh").value =
    inventory.spiritStones.high;
  document.getElementById("inventoryArtifacts").value = inventory.artifacts;
  document.getElementById("inventoryElixirs").value = inventory.elixirs;
}

document.getElementById("saveInventory").onclick = () => {
  const readAmount = (id) =>
    Math.max(0, Math.floor(Number(document.getElementById(id).value) || 0));
  db.inventory = {
    spiritStones: {
      low: readAmount("spiritStoneLow"),
      medium: readAmount("spiritStoneMedium"),
      high: readAmount("spiritStoneHigh"),
    },
    artifacts: document.getElementById("inventoryArtifacts").value,
    elixirs: document.getElementById("inventoryElixirs").value,
  };
  saveDB(db);
  document.getElementById("inventoryStatus").textContent =
    "Nhẫn trữ vật đã được lưu.";
};

document.getElementById("saveTotalGoal").onclick = () => {
  const v = Math.max(
    MIN_TOTAL_GOAL,
    parseInt(document.getElementById("totalGoal").value) || MIN_TOTAL_GOAL,
  );
  db.player.totalGoal = v;
  saveDB(db);
  renderGoal();
  renderCpProgress();
  renderRoadmap();
  renderLegends();
};

function applyBackground() {
  const layer = document.getElementById("bgLayer");
  const img = db.settings.bgImage;
  const opacity = db.settings.bgOpacity != null ? db.settings.bgOpacity : 0.35;
  if (img) {
    layer.style.backgroundImage = `url("${img}")`;
    layer.style.opacity = opacity;
  } else {
    layer.style.backgroundImage = "none";
    layer.style.opacity = 0;
  }
}
function applyAvatar() {
  const holder = document.getElementById("avatarHolder");
  const img = document.getElementById("avatarImg");
  applyAvatarCrop();
  if (db.settings.avatarUrl) {
    holder.classList.add("has-avatar");
    img.src = db.settings.avatarUrl;
    img.style.display = "block";
    img.onerror = () => {
      holder.classList.remove("has-avatar");
      img.style.display = "none";
    };
  } else {
    holder.classList.remove("has-avatar");
    img.style.display = "none";
    img.removeAttribute("src");
  }
  updateAvatarPreview();
}
function closeAvatarLightbox() {
  document.getElementById("avatarLightbox").classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("avatarHolder").onclick = () => {
  if (!db.settings.avatarUrl) return;
  const lightbox = document.getElementById("avatarLightbox");
  const lightboxImg = document.getElementById("avatarLightboxImg");
  lightboxImg.src = db.settings.avatarUrl;
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
};
document.getElementById("avatarLightboxClose").onclick = closeAvatarLightbox;
document.getElementById("avatarLightbox").onclick = (e) => {
  if (e.target.id === "avatarLightbox") closeAvatarLightbox();
};
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAvatarLightbox();
});
function getAvatarCrop() {
  const crop = db.settings.avatarCrop || {};
  return {
    zoom: crop.zoom != null ? crop.zoom : 1,
    x: crop.x != null ? crop.x : 50,
    y: crop.y != null ? crop.y : 50,
  };
}
function applyAvatarCrop(crop = getAvatarCrop()) {
  applyCropToImage(document.getElementById("avatarImg"), crop);
  applyCropToImage(document.getElementById("avatarPreviewImg"), crop);
}
function applyCropToImage(img, crop) {
  const baseScale = Math.max(crop.zoom, 1.08);
  const offsetX = ((50 - crop.x) / 100) * (baseScale - 1) * 100;
  img.style.objectPosition = `${crop.x}% ${crop.y}%`;
  img.style.transform = `translate(${offsetX}%, 0) scale(${baseScale})`;
}
function updateAvatarPreview() {
  const holder = document.getElementById("avatarPreview");
  const img = document.getElementById("avatarPreviewImg");
  const input = document.getElementById("avatarUrlInput");
  const url = input.value.trim();
  applyCropToImage(img, {
    zoom: parseFloat(document.getElementById("avatarZoomInput").value),
    x: parseInt(document.getElementById("avatarXInput").value, 10),
    y: parseInt(document.getElementById("avatarYInput").value, 10),
  });
  if (!url) {
    holder.classList.remove("has-avatar");
    img.style.display = "none";
    img.removeAttribute("src");
    return;
  }
  holder.classList.add("has-avatar");
  img.src = url;
  img.style.display = "block";
  img.onerror = () => {
    holder.classList.remove("has-avatar");
    img.style.display = "none";
  };
}
function applyColors() {
  const c = db.settings.colors || {};
  const panel = c.panel || "#151C33";
  const panelOpacity = c.panelOpacity != null ? c.panelOpacity : 0.92;
  const root = document.documentElement.style;
  root.setProperty("--gold", c.gold || "#D4AF37");
  root.setProperty("--jade", c.jade || "#4A9C6D");
  root.setProperty("--bg", c.bg || "#0B0E1A");
  root.setProperty("--panel", panel);
  root.setProperty("--panel-bg", hexToRgba(panel, panelOpacity));
  root.setProperty("--tab-bg", hexToRgba(panel, panelOpacity));
  root.setProperty("--text", c.text || "#EDE4D3");
}
function hexToRgba(hex, opacity) {
  const value = hex.replace("#", "");
  const full = value.length === 3 ? value.split("").map((x) => x + x).join("") : value;
  const red = parseInt(full.slice(0, 2), 16);
  const green = parseInt(full.slice(2, 4), 16);
  const blue = parseInt(full.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}
function populateSettingsExtras() {
  document.getElementById("avatarUrlInput").value = db.settings.avatarUrl || "";
  const crop = getAvatarCrop();
  document.getElementById("avatarZoomInput").value = crop.zoom;
  document.getElementById("avatarZoomVal").textContent =
    Math.round(crop.zoom * 100) + "%";
  document.getElementById("avatarXInput").value = crop.x;
  document.getElementById("avatarXVal").textContent = crop.x + "%";
  document.getElementById("avatarYInput").value = crop.y;
  document.getElementById("avatarYVal").textContent = crop.y + "%";
  document.getElementById("bgImageInput").value = db.settings.bgImage || "";
  const op = db.settings.bgOpacity != null ? db.settings.bgOpacity : 0.35;
  document.getElementById("bgOpacityInput").value = op;
  document.getElementById("bgOpacityVal").textContent =
    Math.round(op * 100) + "%";
  const c = db.settings.colors || {};
  document.getElementById("colorGold").value = c.gold || "#D4AF37";
  document.getElementById("colorJade").value = c.jade || "#4A9C6D";
  document.getElementById("colorBg").value = c.bg || "#0B0E1A";
  document.getElementById("colorPanel").value = c.panel || "#151C33";
  const panelOpacity = c.panelOpacity != null ? c.panelOpacity : 0.92;
  document.getElementById("panelOpacityInput").value = panelOpacity;
  document.getElementById("panelOpacityVal").textContent =
    Math.round(panelOpacity * 100) + "%";
  document.getElementById("colorText").value = c.text || "#EDE4D3";
  updateAvatarPreview();
}

document.getElementById("saveAvatar").onclick = () => {
  db.settings.avatarUrl = document
    .getElementById("avatarUrlInput")
    .value.trim();
  db.settings.avatarCrop = {
    zoom: parseFloat(document.getElementById("avatarZoomInput").value),
    x: parseInt(document.getElementById("avatarXInput").value, 10),
    y: parseInt(document.getElementById("avatarYInput").value, 10),
  };
  saveDB(db);
  applyAvatar();
};
document.getElementById("avatarZoomInput").oninput = (e) => {
  document.getElementById("avatarZoomVal").textContent =
    Math.round(e.target.value * 100) + "%";
  applyAvatarCropFromControls();
};
document.getElementById("avatarXInput").oninput = (e) => {
  document.getElementById("avatarXVal").textContent = e.target.value + "%";
  applyAvatarCropFromControls();
};
document.getElementById("avatarYInput").oninput = (e) => {
  document.getElementById("avatarYVal").textContent = e.target.value + "%";
  applyAvatarCropFromControls();
};
document.getElementById("avatarUrlInput").oninput = updateAvatarPreview;
function applyAvatarCropFromControls() {
  applyAvatarCrop({
    zoom: parseFloat(document.getElementById("avatarZoomInput").value),
    x: parseInt(document.getElementById("avatarXInput").value, 10),
    y: parseInt(document.getElementById("avatarYInput").value, 10),
  });
  updateAvatarPreview();
}
document.getElementById("bgOpacityInput").oninput = (e) => {
  document.getElementById("bgOpacityVal").textContent =
    Math.round(e.target.value * 100) + "%";
};
document.getElementById("panelOpacityInput").oninput = (e) => {
  document.getElementById("panelOpacityVal").textContent =
    Math.round(e.target.value * 100) + "%";
};
document.getElementById("saveBg").onclick = () => {
  db.settings.bgImage = document.getElementById("bgImageInput").value.trim();
  db.settings.bgOpacity =
    parseFloat(document.getElementById("bgOpacityInput").value) || 0;
  saveDB(db);
  applyBackground();
};
document.getElementById("saveColors").onclick = () => {
  db.settings.colors = {
    gold: document.getElementById("colorGold").value,
    jade: document.getElementById("colorJade").value,
    bg: document.getElementById("colorBg").value,
    panel: document.getElementById("colorPanel").value,
    panelOpacity: parseFloat(document.getElementById("panelOpacityInput").value),
    text: document.getElementById("colorText").value,
  };
  saveDB(db);
  applyColors();
};
document.getElementById("resetColors").onclick = () => {
  db.settings.colors = null;
  saveDB(db);
  applyColors();
  populateSettingsExtras();
};

document.getElementById("submitBtn").onclick = () => {
  const cp = document.getElementById("cpSelect").value;
  const name = document.getElementById("chieuThucInput").value.trim();
  const lang = document.getElementById("langSelect").value;
  const code = document.getElementById("codeInput").value.trim();
  const err = document.getElementById("formErr");
  if (!name || !code) {
    err.style.display = "block";
    return;
  }
  err.style.display = "none";
  db.problems.push({
    id: Date.now(),
    congPhap: cp,
    chieuThuc: name,
    lang,
    code,
    date: todayStr(),
  });
  saveDB(db);
  document.getElementById("chieuThucInput").value = "";
  document.getElementById("codeInput").value = "";
  renderAll();
};

document.getElementById("resetBtn").onclick = () => {
  if (
    confirm("Xác nhận chuyển kiếp? Toàn bộ tiến độ tu luyện sẽ mất vĩnh viễn.")
  ) {
    db = defaultDB();
    legends = {};
    saveDB(db);
    saveLegends();
    applyBackground();
    applyColors();
    applyAvatar();
    populateSettingsExtras();
    renderAll();
  }
};

document.getElementById("searchInput").oninput = renderTable;
document.getElementById("filterCp").onchange = renderTable;

function renderTodayStatus() {
  const el = document.getElementById("todayStatus");
  const target = db.player.dailyTarget || 1;
  const doneToday = db.problems.filter((p) => p.date === todayStr()).length;
  document.getElementById("dailyTarget").value = target;
  if (doneToday >= target) {
    el.className = "today-status ok";
    el.textContent = `Hôm nay đạo hữu đã luyện ${doneToday}/${target} chiêu thức. Công phu tinh tấn!`;
  } else {
    el.className = "today-status warn";
    el.textContent = `Hôm nay đạo hữu mới luyện ${doneToday}/${target} chiêu thức. Yêu cầu luyện chiêu thức ngay!`;
  }
}

function renderHeader() {
  document.getElementById("nameSpan").textContent = db.player.name || "?";
  const total = db.problems.length;
  const titleSpan = document.getElementById("titleSpan");
  const title = titleFor(total);
  titleSpan.textContent = title === "Phàm Nhân" ? "" : ` — ${title}`;
  document.getElementById("totalCount").textContent =
    `${total} chiêu thức đã lĩnh ngộ`;
  document.getElementById("realmOverall").textContent =
    (db.player.name || "?") + " · " + realmFor(total);
  const tribulationStatus = document.getElementById("tribulationStatus");
  tribulationStatus.textContent = tribulationProgress(total);
  tribulationStatus.style.display = tribulationStatus.textContent ? "block" : "none";
}

function renderGoal() {
  const goal = getTotalGoal();
  document.getElementById("totalGoal").value = goal;
  const perCp = Math.ceil(goal / CONG_PHAP.length);
  document.getElementById("goalDistNote").textContent =
    `Đại nguyện chia đều cho ${CONG_PHAP.length} công pháp: mỗi công pháp cần khoảng ${perCp} chiêu thức để viên mãn. Mức tối thiểu ${MIN_TOTAL_GOAL} chiêu gồm 9 bậc tu vi và 5 thiên kiếp.`;
  const total = db.problems.length;
  const pct = Math.min(100, Math.round((total / goal) * 100));
  document.getElementById("goalProgressLabel").textContent =
    `${total} / ${goal} chiêu thức`;
  document.getElementById("goalProgressPct").textContent = `${pct}%`;
  document.getElementById("goalProgressBar").style.width = pct + "%";
}

function renderCpProgress() {
  const wrap = document.getElementById("cpProgressList");
  wrap.innerHTML = "";
  const goal = getTotalGoal();
  const perCpGoal = Math.ceil(goal / CONG_PHAP.length);
  CONG_PHAP.forEach((cp) => {
    const count = db.problems.filter((p) => p.congPhap === cp).length;
    const realm = realmForTopic(count);
    const pct = Math.min(100, Math.round((count / perCpGoal) * 100));
    wrap.innerHTML += `<div class="cp-progress">
      <div class="cp-row"><span>${tenCongPhap(cp)}</span><span style="color:var(--gold)">${realm} · ${count}/${perCpGoal} chiêu</span></div>
      <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
    </div>`;
  });
}

function renderTable() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const fc = document.getElementById("filterCp").value;
  const list = db.problems
    .filter(
      (p) =>
        (!fc || p.congPhap === fc) &&
        (!q || p.chieuThuc.toLowerCase().includes(q)),
    )
    .sort((a, b) => b.id - a.id);
  const body = document.getElementById("tblBody");
  body.innerHTML = "";
  document.getElementById("tblEmpty").style.display = list.length
    ? "none"
    : "block";
  list.forEach((p) => {
    const tr = document.createElement("tr");
    tr.className = "solved-row";
    tr.innerHTML = `<td>${escapeHtml(p.chieuThuc)}</td><td><span class="pill">${tenCongPhap(p.congPhap)}</span></td><td>${p.lang}</td><td>${p.date}</td>`;
    const codeRow = document.createElement("tr");
    const codeTd = document.createElement("td");
    codeTd.colSpan = 4;
    const pre = document.createElement("div");
    pre.className = "code-view";
    pre.textContent = p.code;
    codeTd.appendChild(pre);
    codeRow.appendChild(codeTd);
    tr.onclick = () => {
      pre.style.display = pre.style.display === "block" ? "none" : "block";
    };
    body.appendChild(tr);
    body.appendChild(codeRow);
  });
}

function escapeHtml(s) {
  return s.replace(
    /[&<>"']/g,
    (m) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        m
      ],
  );
}

function renderCalendar() {
  const grid = document.getElementById("calGrid");
  grid.innerHTML = "";
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const doneSet = new Set(db.problems.map((p) => p.date));
  days.forEach((d) => {
    const cell = document.createElement("div");
    cell.className =
      "cal-cell" +
      (doneSet.has(d) ? " done" : "") +
      (d === todayStr() ? " today" : "");
    cell.textContent = d.slice(8, 10);
    grid.appendChild(cell);
  });
  // streak calc
  let streak = 0;
  for (let i = 0; ; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    if (doneSet.has(ds)) streak++;
    else break;
  }
  document.getElementById("streakVal").textContent = streak;
}

function renderRoadmap() {
  const goal = getTotalGoal();
  const perCp = getPerCpGoal();
  const REALMS = getRealms();
  const TITLES = getTitles();

  const rBody = document.getElementById("realmTableBody");
  rBody.innerHTML = "";
  let realmReached = REALMS[0].name;
  REALMS.forEach((r, i) => {
    const next = REALMS[i + 1];
    const range = next ? `${r.min} – ${next.min - 1}` : `${r.min}+`;
    const isGoalRow = goal >= r.min && (!next || goal < next.min);
    if (isGoalRow) realmReached = r.name;
    const tribulation = r.tribulation
      ? `${r.tribulation} chiêu trước khi đột phá`
      : "—";
    rBody.innerHTML += `<tr class="${isGoalRow ? "goal-row" : ""}"><td><span class="pill">${r.name}</span></td><td>${range} chiêu thức</td><td>${tribulation}</td></tr>`;
  });
  document.getElementById("goalRealmNote").textContent =
    `Hoàn thành đại nguyện ${goal} chiêu thức sẽ đưa đạo hữu lên cảnh giới ${realmReached}. Từ Hóa Thần trở lên cần vượt thiên kiếp bằng 6 chiêu; các mốc đã tính trong đại nguyện.`;

  const tBody = document.getElementById("titleTableBody");
  tBody.innerHTML = "";
  let titleReached = TITLES[0].name;
  TITLES.forEach((t, i) => {
    const next = TITLES[i + 1];
    const range = next ? `${t.min} – ${next.min - 1}` : `${t.min}+`;
    const isGoalRow = goal >= t.min && (!next || goal < next.min);
    if (isGoalRow) titleReached = t.name;
    tBody.innerHTML += `<tr class="${isGoalRow ? "goal-row" : ""}"><td><span class="pill">${t.name}</span></td><td>${range} chiêu thức</td></tr>`;
  });
  document.getElementById("goalTitleNote").textContent =
    `Hoàn thành đại nguyện ${goal} chiêu thức sẽ đưa đạo hữu lên danh xưng ${titleReached}.`;

  document.getElementById("perTopicNote").textContent =
    `Đại nguyện ${goal} ÷ 15 công pháp ≈ ${perCp} chiêu thức mỗi công pháp — đây là mốc để một công pháp đạt Độ Kiếp riêng của nó.`;
}

function renderLegends() {
  const wrap = document.getElementById("legendList");
  if (!wrap) return;
  const total = db.problems.length;
  const realms = getRealms();
  wrap.innerHTML = "";
  realms.forEach((realm, index) => {
    const unlocked = total >= realm.min;
    const card = document.createElement("div");
    card.className = "card legend-card" + (unlocked ? "" : " locked");
    const title = document.createElement("h3");
    title.className = "serif";
    title.style.marginTop = "0";
    title.textContent = `Chương ${index + 1}: ${realm.name}`;
    const status = document.createElement("div");
    status.className = "legend-status";
    status.textContent = unlocked
      ? `Đã khai mở ở ${realm.min} chiêu thức.`
      : `Cần ${realm.min} chiêu thức để khai mở chương này.`;
    const textarea = document.createElement("textarea");
    textarea.className = "legend-text";
    textarea.placeholder = unlocked
      ? "Viết giai thoại về lần đột phá cảnh giới này..."
      : "Chương truyện còn phong ấn.";
    textarea.value = legends[realm.name] || "";
    textarea.disabled = !unlocked;
    const button = document.createElement("button");
    button.className = "ghost";
    button.textContent = "Lưu chương truyện";
    button.disabled = !unlocked;
    button.onclick = () => {
      legends[realm.name] = textarea.value;
      saveLegends();
      status.textContent = `Đã lưu truyền kỳ của ${realm.name}.`;
    };
    card.append(title, status, textarea, button);
    wrap.appendChild(card);
  });
}

function renderAll() {
  renderHeader();
  renderTodayStatus();
  renderGoal();
  renderCpProgress();
  renderTable();
  renderCalendar();
  renderRoadmap();
  renderLegends();
  renderInventory();
}

(async function init() {
  [db, legends] = await Promise.all([loadDB(), loadLegends()]);
  populateSelects();
  ensureName();
  applyBackground();
  applyColors();
  applyAvatar();
  populateSettingsExtras();
  renderAll();
})();
