const DAO_LIST = [
  { id: "leetcode", name: "Kiếm Đạo (LeetCode)" },
  { id: "ba", name: "Thương Đạo (BA)" },
];
const DEFAULT_PATH = "leetcode";
const PATH_DEFS = {
  leetcode: {
    languageMode: "fixed",
    languages: [
      { id: "python3", label: "Python 3" },
      { id: "javascript", label: "JavaScript" },
      { id: "typescript", label: "TypeScript" },
    ],
    topics: [
      { id: "Array", name: "Vạn Tượng Kiếm Trận", subtitle: "Array" },
      { id: "String", name: "Ngôn Linh Chân Quyết", subtitle: "String" },
      { id: "Hash Table", name: "Nhất Niệm Tàng Vạn Pháp", subtitle: "Hash Table" },
      { id: "Linked List", name: "Trường Sinh Liên Hoàn", subtitle: "Linked List" },
      { id: "Stack & Queue", name: "Luân Hồi Pháp Trận", subtitle: "Stack & Queue" },
      { id: "Two Pointers", name: "Song Sinh Kiếm Ý", subtitle: "Two Pointers" },
      { id: "Sliding Window", name: "Lưu Quang Kết Giới", subtitle: "Sliding Window" },
      { id: "Binary Search", name: "Thiên Cơ Truy Tầm", subtitle: "Binary Search" },
      { id: "Tree", name: "Linh Mộc Đạo Chủng", subtitle: "Tree" },
      { id: "Graph", name: "Chư Thiên Độn Đồ", subtitle: "Graph" },
      { id: "Backtracking", name: "Nghịch Mệnh Hồi Thiên", subtitle: "Backtracking" },
      { id: "Dynamic Programming", name: "Cửu Chuyển Diễn Đạo", subtitle: "Dynamic Programming" },
      { id: "Greedy", name: "Đoạt Thiên Cơ", subtitle: "Greedy" },
      { id: "Heap", name: "Thiên Cơ Tranh Tiên Quyết", subtitle: "Heap" },
      { id: "Sorting", name: "Vạn Pháp Quy Nguyên", subtitle: "Sorting" },
      { id: "Khác", name: "Chư Thiên Vạn Nghệ", subtitle: "Khác - ngoài LeetCode" },
    ],
  },
  ba: {
    languageMode: "byTopic",
    topics: [
      {
        id: "Kiến thức ngành",
        name: "Thiên Cơ Yếu Quyết",
        subtitle: "Kiến thức ngành",
        languages: [
          { id: "banking_fintech", label: "Banking / Fintech" },
          { id: "insurance", label: "Insurance" },
          { id: "investment_wealth", label: "Investment / Wealth Management" },
          { id: "ecommerce_payment", label: "E-commerce / Payment" },
          { id: "edtech_education", label: "EdTech / Education" },
          { id: "travel_international", label: "Travel / International business" },
          { id: "healthcare_it", label: "Healthcare IT" },
        ],
      },
      {
        id: "Solution",
        name: "Giải Nghiệp Chân Kinh",
        subtitle: "Solution",
        languages: [
          { id: "erp_crm_ba", label: "ERP / CRM BA" },
          { id: "product_ba", label: "Product BA" },
          { id: "system_data_ba", label: "System/Data BA" },
        ],
      },
    ],
  },
};
function getAllPathDefs() {
  return { ...PATH_DEFS, ...customDaos };
}
function getAllDaoList() {
  return [
    ...DAO_LIST,
    ...Object.values(customDaos).map((d) => ({ id: d.id, name: d.name })),
  ];
}
function getActivePath() {
  return getAllPathDefs()[db.settings.activePath] ? db.settings.activePath : DEFAULT_PATH;
}
function getPathConfig(pathId = getActivePath()) {
  return getAllPathDefs()[pathId] || getAllPathDefs()[DEFAULT_PATH];
}
function getActiveTopics() {
  return getPathConfig().topics;
}
function getTopicConfig(topicId, pathId = getActivePath()) {
  return getPathConfig(pathId).topics.find((t) => t.id === topicId);
}
function tenCongPhap(topicId) {
  const topic = getTopicConfig(topicId);
  if (!topic) return topicId;
  return topic.subtitle ? `${topic.name} (${topic.subtitle})` : topic.name;
}
function getLanguageOptionsFor(topicId) {
  const cfg = getPathConfig();
  if (cfg.languageMode === "byTopic") {
    const topic = getTopicConfig(topicId);
    return (topic && topic.languages) || [];
  }
  return cfg.languages || [];
}
function tenNgonNgu(problem) {
  const direct = getLanguageOptionsFor(problem.congPhap).find((o) => o.id === problem.lang);
  if (direct) return direct.label;
  const cfg = getPathConfig();
  const all =
    cfg.languageMode === "byTopic"
      ? cfg.topics.flatMap((t) => t.languages || [])
      : cfg.languages || [];
  const found = all.find((o) => o.id === problem.lang);
  return found ? found.label : problem.lang;
}
function currentPathData() {
  return db.paths[getActivePath()];
}
function currentLegends() {
  const path = getActivePath();
  if (!legends[path] || typeof legends[path] !== "object") legends[path] = {};
  return legends[path];
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
const REALM_LORE = {
  "Phàm Nhân": {
    breakthrough:
      "Chưa chính thức bước vào tu luyện, thân thể phàm tục, khí huyết vận hành theo lẽ tự nhiên.",
    qi: "Không thể hấp thụ linh khí trời đất, chỉ hô hấp trọc khí như người thường.",
    core: "Chưa có khái niệm đan điền hay kim đan.",
    lifespan: "Thọ nguyên trung bình 70–100 năm.",
    power: "Sức mạnh ngang người phàm, không có pháp lực.",
    image: "pham_nhan.jpg",
  },
  "Luyện Khí": {
    breakthrough:
      "Khai mở kinh mạch, dẫn động chân khí lưu chuyển theo đại tiểu chu thiên, đả thông đan điền để tích trữ linh khí.",
    qi: "Bắt đầu hô hấp và hấp thụ linh khí trời đất qua thổ nạp, chuyển hóa trọc khí thành chân nguyên.",
    core: "Chân khí tích lũy dần trong đan điền, hình thành nền móng đầu tiên cho việc ngưng đan sau này.",
    lifespan: "Thọ nguyên tăng thêm khoảng 50–100 năm, đạt mốc 150–200 năm.",
    power: "Có thể ngự khí phòng thân, thi triển pháp thuật sơ cấp, sức mạnh hơn hẳn người thường.",
    image: "luyen_khi.jpg",
  },
  "Trúc Cơ": {
    breakthrough:
      "Dùng chân khí tích lũy đủ độ thuần khiết để đúc thành nền tảng đạo cơ vững chắc trong đan điền, thường phải vượt qua cửa ải Trúc Cơ đan hoặc dựa vào thiên phú lĩnh ngộ.",
    qi: "Hấp thụ linh khí trời đất với tốc độ và mật độ cao hơn hẳn, có thể ngự kiếm/ngự khí bay lượn ngắn.",
    core: "Nền móng đan điền được củng cố kiên cố, chuẩn bị không gian để ngưng kết kim đan.",
    lifespan: "Thọ nguyên tăng thêm khoảng 100–200 năm, đạt mốc 300–400 năm.",
    power: "Uy lực tăng vọt, một chưởng có thể phá vỡ đá tảng, so tài ngang ngửa mãnh thú sơ cấp.",
    image: "truc_co.jpg",
  },
  "Kim Đan": {
    breakthrough:
      "Vận chuyển toàn bộ chân khí trong đan điền, nén ép và tôi luyện liên tục cho đến khi ngưng kết thành một khối kim đan sáng rực — cột mốc quan trọng bậc nhất của người tu tiên.",
    qi: "Linh khí trời đất được hấp thụ ồ ạt để nuôi dưỡng và làm kim đan thêm tinh thuần, mỗi vòng vận chuyển đều luyện hóa tạp chất.",
    core: "Kim đan chính thức hình thành, trở thành nguồn năng lượng lõi, thay thế đan điền phàm tục.",
    lifespan: "Thọ nguyên tăng thêm khoảng 200–300 năm, đạt mốc 600–800 năm.",
    power: "Có thể ngự kiếm bay xa vạn dặm, một đợt công kích đủ sức san phẳng núi nhỏ.",
    image: "kim_dan.jpg",
  },
  "Nguyên Anh": {
    breakthrough:
      "Kim đan vỡ ra, nguyên thần ngưng tụ thành một nguyên anh nhỏ bé mang hình dáng bản thân, ẩn cư trong khí hải.",
    qi: "Linh khí được hấp thụ trực tiếp để bồi dưỡng nguyên anh, giúp nguyên thần ngày càng vững chắc.",
    core: "Kim đan tan biến, nhường chỗ cho nguyên anh — một dạng &quot;đan&quot; cao cấp hơn, gần như bất diệt trừ khi nguyên thần bị hủy.",
    lifespan: "Thọ nguyên tăng thêm khoảng 400–600 năm, đạt mốc 1000–1500 năm.",
    power: "Nguyên anh có thể xuất khiếu, thi triển thần thông, một kiếm chém ngang có thể phá thành lớn.",
    image: "nguyen_anh.jpg",
  },
  "Hóa Thần": {
    breakthrough:
      "Nguyên anh hòa hợp cùng thiên địa pháp tắc, hóa thành nguyên thần chân chính, bắt đầu cảm ứng được thiên kiếp.",
    qi: "Không chỉ hấp thụ linh khí, còn học cách dung hòa quy tắc trời đất vào bản thân.",
    core: "Nguyên anh chuyển hóa thành nguyên thần, pháp lực vận hành tự nhiên như hơi thở.",
    lifespan: "Thọ nguyên tăng thêm khoảng 600–1000 năm, đạt mốc 2000–2500 năm.",
    power: "Có thể khống chế một vùng trời đất nhỏ, uy lực đủ sức lay chuyển sông núi. Từ đây trở đi, mỗi lần đột phá phải vượt qua thiên kiếp.",
    image: "hoa_than.jpg",
  },
  "Luyện Hư": {
    breakthrough:
      "Luyện hóa nguyên thần dung nhập vào hư không, thân thể dần thoát ly ràng buộc của thực chất.",
    qi: "Hấp thụ linh khí ở tầng không gian hư vô, linh khí thô thiển của phàm giới không còn đủ để bồi dưỡng.",
    core: "Nguyên thần và hư không hòa làm một, có thể phân thân, ẩn hiện khó lường.",
    lifespan: "Thọ nguyên tăng thêm khoảng 1000–1500 năm, đạt mốc 3000–3500 năm.",
    power: "Một niệm có thể khuynh đảo phong vân, sức mạnh sánh ngang thiên tai.",
    image: "luyen_hu.jpg",
  },
  "Hợp Thể": {
    breakthrough:
      "Dung hợp nhục thân phàm tục với nguyên thần đã luyện hư, hợp nhất thành một thể hoàn chỉnh cận tiên.",
    qi: "Linh khí trời đất được hấp thụ và chuyển hóa trực tiếp thành huyết nhục, thân thể cứng như tiên khí ngưng tụ.",
    core: "Không còn phân biệt đan điền – nguyên thần, toàn thân là một khối năng lượng thuần khiết.",
    lifespan: "Thọ nguyên tăng thêm khoảng 1500–2000 năm, đạt mốc 4000–4500 năm.",
    power: "Nhục thân cường đến mức đao thương bất nhập, một quyền có thể phá vỡ hư không nhỏ.",
    image: "hop_the.jpg",
  },
  "Đại Thừa": {
    breakthrough:
      "Tu vi đạt đến đỉnh phong của phàm giới, thấu hiểu gần trọn quy luật thiên đạo, chỉ còn chờ một kiếp cuối cùng để phi thăng.",
    qi: "Linh khí trời đất tự động quy tụ về người tu luyện, gần như không còn giới hạn hấp thụ.",
    core: "Toàn thân đã là một &quot;đại đan&quot; sống, sẵn sàng chuyển hóa hoàn toàn thành tiên thể.",
    lifespan: "Thọ nguyên tăng thêm khoảng 2000–3000 năm, đạt mốc 5000–6000 năm.",
    power: "Uy áp ngang tầm bán tiên, một chiêu có thể hủy diệt cả một vùng đại lục nếu không kiêng dè.",
    image: "dai_thua.jpg",
  },
  "Độ Kiếp": {
    breakthrough:
      "Chủ động dẫn thiên kiếp giáng xuống, dùng ý chí và pháp lực gồng mình chống chọi từng đợt sét trời để tẩy tận phàm thai, đổi sang tiên cốt.",
    qi: "Không còn hấp thụ linh khí theo cách thông thường — thay vào đó hòa mình vào long mạch thiên địa để mượn lực chống kiếp.",
    core: "Toàn bộ tu vi được tôi luyện qua lửa kiếp, kết tinh thành &quot;tiên thai&quot;, tiền đề để phi thăng thượng giới.",
    lifespan: "Vượt qua thiên kiếp, thọ nguyên tăng vọt thêm khoảng 5000 năm, chính thức bước chân vào hàng bán tiên trường sinh.",
    power: "Uy lực đạt đến mức nghiêng trời lệch đất — không vượt qua được sẽ hồn phi phách tán, nhưng vượt qua được thì uy danh chấn động tam giới.",
    image: "do_kiep.jpg",
  },
};
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
  return Math.max(MIN_TOTAL_GOAL, currentPathData().totalGoal || 150);
}
function getPerCpGoal() {
  return Math.max(
    1,
    Math.ceil(getTotalGoal() / getActiveTopics().length),
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
const ACTIVE_PLAYER_KEY = "congphap_active_player";
const SECTS_REGISTRY_KEY = "congphap_sects_registry";
const SECTS_API_URL = "/api/sects";
const DAOS_KEY = "congphap_custom_daos";
const DAOS_API_URL = "/api/daos";
let USE_API = false; // becomes true once /api/db (server.js + db.json) is confirmed reachable
let USE_SECTS_API = false;
let USE_DAOS_API = false;
let legends = {};
let sectsRegistry = {};
let customDaos = {};
let activePlayerSlug = null;
function slugifyName(name) {
  return String(name || "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}
function uniqueSlugFor(name, players) {
  const base = slugifyName(name) || "daohuu";
  const taken = new Set((players || []).map((p) => p.slug));
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}${i}`)) i++;
  return `${base}${i}`;
}
function dbLocalKey() {
  return `${DB_KEY}:${activePlayerSlug}`;
}
function legendsLocalKey() {
  return `${LEGENDS_KEY}:${activePlayerSlug}`;
}
function apiDbUrl() {
  return `${API_URL}?player=${encodeURIComponent(activePlayerSlug)}`;
}
function apiLegendsUrl() {
  return `${LEGENDS_API_URL}?player=${encodeURIComponent(activePlayerSlug)}`;
}
function countAllProblems(data) {
  if (Array.isArray(data.problems)) return data.problems.length;
  if (data.paths && typeof data.paths === "object") {
    return Object.values(data.paths).reduce(
      (sum, p) => sum + (Array.isArray(p && p.problems) ? p.problems.length : 0),
      0,
    );
  }
  return 0;
}
function getLocalPlayers() {
  const players = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(`${DB_KEY}:`)) continue;
    const slug = key.slice(DB_KEY.length + 1);
    try {
      const data = JSON.parse(localStorage.getItem(key));
      players.push({
        slug,
        name: (data.player && data.player.name) || slug,
        problemCount: countAllProblems(data),
      });
    } catch (e) {
      /* skip corrupt local entry */
    }
  }
  players.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  return players;
}
async function fetchPlayerList() {
  try {
    const res = await fetch("/api/players", { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    /* server.js not running — caller falls back to local players */
  }
  return null;
}
async function listAvailablePlayers() {
  const serverPlayers = await fetchPlayerList();
  return serverPlayers !== null ? serverPlayers : getLocalPlayers();
}
const SECT_RELATIONS = [
  { key: "master", inputId: "sectMaster" },
  { key: "shizun", inputId: "sectShizun" },
  { key: "seniorSister", inputId: "sectSeniorSister" },
  { key: "juniorSister", inputId: "sectJuniorSister" },
  { key: "seniorBrother", inputId: "sectSeniorBrother" },
  { key: "juniorBrother", inputId: "sectJuniorBrother" },
  { key: "daoCompanion", inputId: "sectDaoCompanion" },
];

function defaultSect() {
  return {
    status: "unaffiliated",
    name: "",
    master: "",
    shizun: "",
    seniorSister: "",
    juniorSister: "",
    seniorBrother: "",
    juniorBrother: "",
    daoCompanion: "",
    description: "",
    masterDescription: "",
    shizunDescription: "",
    seniorSisterDescription: "",
    juniorSisterDescription: "",
    seniorBrotherDescription: "",
    juniorBrotherDescription: "",
    daoCompanionDescription: "",
  };
}
function normalizeSect(sect) {
  const defaults = defaultSect();
  sect = sect || {};
  const normalized = {
    ...defaults,
    status: ["joined", "left", "expelled"].includes(sect.status)
      ? sect.status
      : defaults.status,
    name: typeof sect.name === "string" ? sect.name : defaults.name,
    master: typeof sect.master === "string" ? sect.master : defaults.master,
    shizun: typeof sect.shizun === "string" ? sect.shizun : defaults.shizun,
    seniorSister:
      typeof sect.seniorSister === "string"
        ? sect.seniorSister
        : defaults.seniorSister,
    juniorSister:
      typeof sect.juniorSister === "string"
        ? sect.juniorSister
        : defaults.juniorSister,
    seniorBrother:
      typeof sect.seniorBrother === "string"
        ? sect.seniorBrother
        : defaults.seniorBrother,
    juniorBrother:
      typeof sect.juniorBrother === "string"
        ? sect.juniorBrother
        : defaults.juniorBrother,
    daoCompanion:
      typeof sect.daoCompanion === "string"
        ? sect.daoCompanion
        : defaults.daoCompanion,
    description:
      typeof sect.description === "string"
        ? sect.description
        : defaults.description,
  };
  SECT_RELATIONS.forEach(({ key }) => {
    const descriptionKey = `${key}Description`;
    normalized[descriptionKey] =
      typeof sect[descriptionKey] === "string"
        ? sect[descriptionKey]
        : defaults[descriptionKey];
  });
  return normalized;
}
function defaultPathData() {
  return { dailyTarget: 1, totalGoal: 150, problems: [] };
}
function defaultDB() {
  const paths = {};
  Object.keys(getAllPathDefs()).forEach((id) => {
    paths[id] = defaultPathData();
  });
  return {
    player: { name: "" },
    settings: { activePath: DEFAULT_PATH },
    paths,
    inventory: {
      spiritStones: { low: 0, medium: 0, high: 0 },
      artifacts: "",
      elixirs: "",
    },
    sect: defaultSect(),
  };
}
function normalizeDB(d) {
  d = d || {};
  d.player = d.player || {};
  d.player.name = typeof d.player.name === "string" ? d.player.name : "";
  d.settings = d.settings || {};
  if (!getAllPathDefs()[d.settings.activePath]) d.settings.activePath = DEFAULT_PATH;

  const legacyProblems = Array.isArray(d.problems) ? d.problems : null;
  const legacyDailyTarget = Number(d.player.dailyTarget) > 0 ? Number(d.player.dailyTarget) : null;
  const legacyTotalGoal = Number(d.player.totalGoal) > 0 ? Number(d.player.totalGoal) : null;
  delete d.player.dailyTarget;
  delete d.player.totalGoal;
  delete d.problems;

  d.paths = d.paths && typeof d.paths === "object" ? d.paths : {};
  Object.keys(getAllPathDefs()).forEach((pathId) => {
    const existing =
      d.paths[pathId] && typeof d.paths[pathId] === "object" ? d.paths[pathId] : {};
    d.paths[pathId] = {
      dailyTarget:
        Number(existing.dailyTarget) ||
        (pathId === DEFAULT_PATH && legacyDailyTarget) ||
        1,
      totalGoal:
        Number(existing.totalGoal) ||
        (pathId === DEFAULT_PATH && legacyTotalGoal) ||
        150,
      problems: Array.isArray(existing.problems)
        ? existing.problems
        : (pathId === DEFAULT_PATH && legacyProblems) || [],
    };
  });

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
  d.sect = normalizeSect(d.sect);
  return d;
}
function loadDBFromLocalStorage() {
  try {
    return normalizeDB(JSON.parse(localStorage.getItem(dbLocalKey())));
  } catch (e) {
    return defaultDB();
  }
}
async function loadDB() {
  try {
    const res = await fetch(apiDbUrl(), { cache: "no-store" });
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
    localStorage.setItem(dbLocalKey(), JSON.stringify(db));
  } catch (e) {}
  if (USE_API) {
    fetch(apiDbUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(db),
    }).catch(() => {
      USE_API = false;
    });
  }
}

// Shared registry of known sects/people (across all players) so names/descriptions can be reused.
function mergeSectIntoRegistry(registry, sect) {
  sect = sect || {};
  const name = (sect.name || "").trim();
  if (!name) return registry;
  const sectSlug = slugifyName(name) || "tongmon";
  const entry = registry[sectSlug] || { name, description: "", roles: {} };
  entry.name = name;
  const description = (sect.description || "").trim();
  if (description) entry.description = sect.description;
  entry.roles = entry.roles || {};
  SECT_RELATIONS.forEach(({ key }) => {
    const personName = (sect[key] || "").trim();
    if (!personName) return;
    const personSlug = slugifyName(personName) || personName.toLowerCase();
    entry.roles[key] = entry.roles[key] || {};
    const person = entry.roles[key][personSlug] || { name: personName, description: "" };
    person.name = personName;
    const personDescription = (sect[`${key}Description`] || "").trim();
    if (personDescription) person.description = sect[`${key}Description`];
    entry.roles[key][personSlug] = person;
  });
  registry[sectSlug] = entry;
  return registry;
}
function loadLocalSectsRegistry() {
  try {
    return JSON.parse(localStorage.getItem(SECTS_REGISTRY_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveLocalSectsRegistry() {
  try {
    localStorage.setItem(SECTS_REGISTRY_KEY, JSON.stringify(sectsRegistry));
  } catch (e) {}
}
async function loadSectsRegistry() {
  try {
    const res = await fetch(SECTS_API_URL, { cache: "no-store" });
    if (res.ok) {
      USE_SECTS_API = true;
      return await res.json();
    }
  } catch (e) {
    /* server.js not running — fall back to local registry */
  }
  USE_SECTS_API = false;
  return loadLocalSectsRegistry();
}
function persistSectToRegistry(sect) {
  sectsRegistry = mergeSectIntoRegistry(sectsRegistry, sect);
  saveLocalSectsRegistry();
  if (USE_SECTS_API) {
    fetch(SECTS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sect }),
    }).catch(() => {
      USE_SECTS_API = false;
    });
  }
}

// Shared registry of user-created "đạo" (custom path: name + công pháp + ngôn ngữ), reusable across players.
function loadLocalDaos() {
  try {
    return JSON.parse(localStorage.getItem(DAOS_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function saveLocalDaos() {
  try {
    localStorage.setItem(DAOS_KEY, JSON.stringify(customDaos));
  } catch (e) {}
}
async function loadDaos() {
  try {
    const res = await fetch(DAOS_API_URL, { cache: "no-store" });
    if (res.ok) {
      USE_DAOS_API = true;
      return await res.json();
    }
  } catch (e) {
    /* server.js not running — fall back to local registry */
  }
  USE_DAOS_API = false;
  return loadLocalDaos();
}
function persistDao(dao) {
  customDaos[dao.id] = dao;
  saveLocalDaos();
  if (USE_DAOS_API) {
    fetch(DAOS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dao }),
    }).catch(() => {
      USE_DAOS_API = false;
    });
  }
}
async function removeDao(id) {
  delete customDaos[id];
  saveLocalDaos();
  if (USE_DAOS_API) {
    try {
      const res = await fetch(`${DAOS_API_URL}?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok && res.status !== 404) USE_DAOS_API = false;
    } catch (e) {
      USE_DAOS_API = false;
    }
  }
}

let db = defaultDB();

async function loadLegends() {
  try {
    const res = await fetch(apiLegendsUrl(), { cache: "no-store" });
    if (res.ok) return await res.json();
  } catch (e) {
    /* server.js not running — use browser fallback */
  }
  try {
    return JSON.parse(localStorage.getItem(legendsLocalKey())) || {};
  } catch (e) {
    return {};
  }
}
function saveLegends() {
  try {
    localStorage.setItem(legendsLocalKey(), JSON.stringify(legends));
  } catch (e) {}
  if (USE_API) {
    fetch(apiLegendsUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(legends),
    }).catch(() => {});
  }
}
function normalizeLegends(raw) {
  const data = raw && typeof raw === "object" ? raw : {};
  const looksLegacyFlat = REALM_NAMES.some((name) => typeof data[name] === "string");
  return looksLegacyFlat ? { [DEFAULT_PATH]: { ...data } } : data;
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
document.getElementById("downloadDataBtn").onclick = () => {
  downloadJSON(`db_${activePlayerSlug}.json`, db);
  setTimeout(() => downloadJSON(`truyenky_${activePlayerSlug}.json`, legends), 300);
};

function isDbShape(data) {
  return !!data && typeof data === "object" && ("player" in data || "problems" in data || "paths" in data);
}
document.getElementById("restoreDataBtn").onclick = () => {
  document.getElementById("restoreDataInput").click();
};
document.getElementById("restoreDataInput").onchange = async (event) => {
  const files = Array.from(event.target.files || []);
  const status = document.getElementById("restoreDataStatus");
  event.target.value = "";
  if (!files.length) return;
  let importedDb = null;
  let importedLegends = null;
  try {
    for (const file of files) {
      const parsed = JSON.parse(await file.text());
      if (isDbShape(parsed)) importedDb = parsed;
      else importedLegends = parsed;
    }
  } catch (e) {
    status.textContent = "Tệp không hợp lệ. Hãy chọn đúng db.json và/hoặc truyenky.json.";
    return;
  }
  if (!importedDb && !importedLegends) {
    status.textContent = "Không tìm thấy dữ liệu hợp lệ trong tệp đã chọn.";
    return;
  }
  if (
    !confirm(
      "Hồi sinh kiếp cũ sẽ ghi đè toàn bộ tiến độ hiện tại. Xác nhận tiếp tục?",
    )
  ) {
    return;
  }
  if (importedDb) {
    db = normalizeDB(importedDb);
    saveDB(db);
  }
  if (importedLegends) {
    legends = normalizeLegends(importedLegends);
    saveLegends();
  }
  populateSelects();
  applyBackground();
  applyColors();
  applyAvatar();
  populateSettingsExtras();
  renderAll();
  status.textContent = "Đã hồi sinh kiếp cũ thành công.";
};

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

const nameDialog = document.getElementById("nameDialog");
const nameDialogInput = document.getElementById("nameDialogInput");
const nameDialogError = document.getElementById("nameDialogError");

function requestPlayerName(title, initialValue) {
  document.getElementById("nameDialogTitle").textContent = title;
  nameDialogInput.value = initialValue;
  nameDialogError.style.display = "none";
  nameDialog.returnValue = "";
  const closed = new Promise((resolve) => {
    nameDialog.addEventListener(
      "close",
      () => resolve(nameDialog.returnValue === "save" ? nameDialogInput.value.trim() : null),
      { once: true },
    );
  });
  nameDialog.showModal();
  nameDialogInput.focus();
  nameDialogInput.select();
  return closed;
}

document.getElementById("nameDialogForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = nameDialogInput.value.trim();
  if (!name) {
    nameDialogError.style.display = "block";
    nameDialogInput.focus();
    return;
  }
  nameDialog.close("save");
});

document.getElementById("cancelNameDialog").onclick = () =>
  nameDialog.close("cancel");

// Dao wizard: lets a (new or existing) player define a custom đạo — name, số lượng
// công pháp, and ngôn ngữ riêng cho từng công pháp — instead of fixed PATH_DEFS.
const daoWizardDialog = document.getElementById("daoWizardDialog");
const daoWizardForm = document.getElementById("daoWizardForm");
const daoWizardNameField = document.getElementById("daoWizardNameField");
const daoWizardPlayerName = document.getElementById("daoWizardPlayerName");
const daoWizardPlayerNameError = document.getElementById("daoWizardPlayerNameError");
const daoWizardDaoName = document.getElementById("daoWizardDaoName");
const daoWizardDaoNameError = document.getElementById("daoWizardDaoNameError");
const daoWizardTopicCount = document.getElementById("daoWizardTopicCount");
const daoWizardTopicsList = document.getElementById("daoWizardTopicsList");
const daoWizardError = document.getElementById("daoWizardError");
const daoWizardPreview = document.getElementById("daoWizardPreview");
const cancelDaoWizard = document.getElementById("cancelDaoWizard");
let daoWizardEditingId = null;

function readDaoTopicRows() {
  return Array.from(daoWizardTopicsList.querySelectorAll(".dao-topic-row")).map((row) => ({
    name: row.querySelector(".dao-topic-name").value.trim(),
    langsText: row.querySelector(".dao-topic-langs").value.trim(),
  }));
}
function renderDaoTopicRows(count, previousRows) {
  const rows = previousRows || readDaoTopicRows();
  daoWizardTopicsList.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const data = rows[i] || { name: "", langsText: "" };
    const row = document.createElement("div");
    row.className = "dao-topic-row";
    row.innerHTML = `
      <div>
        <label>Công pháp #${i + 1} — Tên</label>
        <input type="text" class="dao-topic-name" placeholder="Vd: Kiếm Pháp Nhập Môn" value="${data.name.replace(/"/g, "&quot;")}">
      </div>
      <div>
        <label>Ngôn ngữ / chủ đề (cách nhau bởi dấu phẩy)</label>
        <input type="text" class="dao-topic-langs" placeholder="Vd: Python, JavaScript" value="${data.langsText.replace(/"/g, "&quot;")}">
      </div>`;
    daoWizardTopicsList.appendChild(row);
  }
  renderDaoWizardPreview();
}
function renderDaoWizardPreview() {
  const rows = readDaoTopicRows();
  if (!rows.some((r) => r.name || r.langsText)) {
    daoWizardPreview.innerHTML = `<div class="setup-note">Điền thông tin công pháp để xem trước.</div>`;
    return;
  }
  const items = rows
    .map(
      (r, i) =>
        `<tr><td>${r.name || `Công pháp #${i + 1}`}</td><td>${r.langsText || "—"}</td></tr>`,
    )
    .join("");
  daoWizardPreview.innerHTML = `<table><thead><tr><th>Công pháp</th><th>Ngôn ngữ</th></tr></thead><tbody>${items}</tbody></table>`;
}
daoWizardTopicsList.addEventListener("input", renderDaoWizardPreview);
daoWizardTopicCount.addEventListener("input", () => {
  const count = Math.min(20, Math.max(1, parseInt(daoWizardTopicCount.value, 10) || 1));
  renderDaoTopicRows(count);
});

function buildDaoFromWizard(initialDao) {
  const daoName = daoWizardDaoName.value.trim();
  const rows = readDaoTopicRows();
  const usedTopicIds = new Set();
  const topics = [];
  for (let i = 0; i < rows.length; i++) {
    const { name, langsText } = rows[i];
    if (!name || !langsText) return null;
    const existingTopic = initialDao && initialDao.topics[i];
    const id =
      (existingTopic && existingTopic.id) ||
      (() => {
        let base = slugifyName(name) || `congphap${i + 1}`;
        let candidate = base;
        let suffix = 2;
        while (usedTopicIds.has(candidate)) candidate = `${base}${suffix++}`;
        return candidate;
      })();
    usedTopicIds.add(id);
    const existingLangs =
      (existingTopic && existingTopic.languages) || (initialDao && initialDao.languages) || [];
    const usedLangIds = new Set();
    const languages = langsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((label) => {
        const existingLang = (existingLangs || []).find(
          (l) => l.label.toLowerCase() === label.toLowerCase(),
        );
        let base = (existingLang && existingLang.id) || slugifyName(label) || "ngonngu";
        let candidate = base;
        let suffix = 2;
        while (usedLangIds.has(candidate)) candidate = `${base}${suffix++}`;
        usedLangIds.add(candidate);
        return { id: candidate, label };
      });
    if (!languages.length) return null;
    topics.push({ id, name, subtitle: "", languages });
  }
  if (!daoName || !topics.length) return null;
  const id =
    (initialDao && initialDao.id) ||
    (() => {
      const existingIds = new Set(getAllDaoList().map((d) => d.id));
      let base = slugifyName(daoName) || "dao";
      let candidate = base;
      let suffix = 2;
      while (existingIds.has(candidate)) candidate = `${base}${suffix++}`;
      return candidate;
    })();
  return { id, name: daoName, languageMode: "byTopic", topics };
}

function openDaoWizard({ requirePlayerName = false, initialPlayerName = "", initialDao = null, allowCancel = true } = {}) {
  daoWizardEditingId = initialDao ? initialDao.id : null;
  document.getElementById("daoWizardTitle").textContent = initialDao
    ? "Chỉnh Sửa Đạo"
    : "Khai Mở Đạo Tu Luyện";
  daoWizardNameField.style.display = requirePlayerName ? "block" : "none";
  daoWizardPlayerName.value = initialPlayerName;
  daoWizardPlayerNameError.style.display = "none";
  daoWizardDaoName.value = initialDao ? initialDao.name : "";
  daoWizardDaoNameError.style.display = "none";
  daoWizardError.style.display = "none";
  cancelDaoWizard.style.display = allowCancel ? "inline-block" : "none";
  const topicCount = initialDao ? initialDao.topics.length : 3;
  daoWizardTopicCount.value = topicCount;
  const initialRows = initialDao
    ? initialDao.topics.map((t) => ({
        name: t.name,
        langsText: (t.languages || initialDao.languages || [])
          .map((l) => l.label)
          .join(", "),
      }))
    : [];
  renderDaoTopicRows(topicCount, initialRows);
  daoWizardDialog.returnValue = "";
  const onCancel = (event) => {
    if (!allowCancel) event.preventDefault();
  };
  daoWizardDialog.addEventListener("cancel", onCancel);
  const closed = new Promise((resolve) => {
    daoWizardDialog.addEventListener(
      "close",
      () => {
        daoWizardDialog.removeEventListener("cancel", onCancel);
        if (daoWizardDialog.returnValue !== "save") {
          resolve(null);
          return;
        }
        const dao = buildDaoFromWizard(initialDao);
        const playerName = requirePlayerName ? daoWizardPlayerName.value.trim() : null;
        resolve(dao ? { dao, playerName } : null);
      },
      { once: true },
    );
  });
  daoWizardDialog.showModal();
  (requirePlayerName && !initialPlayerName ? daoWizardPlayerName : daoWizardDaoName).focus();
  return closed;
}

daoWizardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const requirePlayerName = daoWizardNameField.style.display !== "none";
  if (requirePlayerName && !daoWizardPlayerName.value.trim()) {
    daoWizardPlayerNameError.style.display = "block";
    daoWizardPlayerName.focus();
    return;
  }
  if (!daoWizardDaoName.value.trim()) {
    daoWizardDaoNameError.style.display = "block";
    daoWizardDaoName.focus();
    return;
  }
  const rows = readDaoTopicRows();
  if (!rows.length || rows.some((r) => !r.name || !r.langsText)) {
    daoWizardError.style.display = "block";
    return;
  }
  daoWizardDialog.close("save");
});
cancelDaoWizard.onclick = () => daoWizardDialog.close("cancel");


const playerDialogList = document.getElementById("playerDialogList");
const playerDialogEmpty = document.getElementById("playerDialogEmpty");
const playerDialogInput = document.getElementById("playerDialogInput");
const playerDialogError = document.getElementById("playerDialogError");
const playerDialogForm = document.getElementById("playerDialogForm");

function renderPlayerList(currentPlayers) {
  playerDialogList.replaceChildren();
  playerDialogEmpty.style.display = currentPlayers.length ? "none" : "block";
  currentPlayers.forEach((p) => {
    const item = document.createElement("div");
    item.className = "player-item";
    item.dataset.slug = p.slug;
    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.className = "player-select";
    const nameSpan = document.createElement("span");
    nameSpan.textContent = p.name;
    const metaSpan = document.createElement("span");
    metaSpan.className = "player-item-meta";
    metaSpan.textContent = `${p.problemCount || 0} chiêu thức`;
    selectButton.append(nameSpan, metaSpan);
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "player-delete";
    deleteButton.dataset.slug = p.slug;
    deleteButton.textContent = "Xóa";
    deleteButton.title = `Xóa ${p.name}`;
    deleteButton.setAttribute("aria-label", `Xóa ${p.name}`);
    item.append(selectButton, deleteButton);
    playerDialogList.appendChild(item);
  });
}

function choosePlayer(players) {
  renderPlayerList(players);
  playerDialogInput.value = "";
  playerDialogError.style.display = "none";
  playerDialog.returnValue = "";
  const onCancel = (event) => event.preventDefault();
  playerDialog.addEventListener("cancel", onCancel);
  const closed = new Promise((resolve) => {
    playerDialog.addEventListener(
      "close",
      () => {
        playerDialog.removeEventListener("cancel", onCancel);
        resolve(playerDialog.returnValue || null);
      },
      { once: true },
    );
  });
  playerDialog.showModal();
  return closed;
}

async function deletePlayerData(slug) {
  try {
    const response = await fetch(`/api/players?player=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (response.ok) return true;
  } catch (error) {
    /* server.js not running — use local storage below */
  }
  const dbKey = `${DB_KEY}:${slug}`;
  const legendsKey = `${LEGENDS_KEY}:${slug}`;
  const existed = localStorage.getItem(dbKey) !== null || localStorage.getItem(legendsKey) !== null;
  localStorage.removeItem(dbKey);
  localStorage.removeItem(legendsKey);
  return existed;
}

playerDialogList.addEventListener("click", async (event) => {
  const deleteButton = event.target.closest(".player-delete");
  if (deleteButton) {
    event.stopPropagation();
    const item = deleteButton.closest(".player-item");
    const name = item.querySelector(".player-select span")?.textContent || "đạo hữu này";
    if (!window.confirm(`Xóa ${name} và toàn bộ tiến độ tu luyện?`)) return;
    const deleted = await deletePlayerData(deleteButton.dataset.slug);
    if (!deleted) return;
    if (deleteButton.dataset.slug === activePlayerSlug) {
      localStorage.removeItem(ACTIVE_PLAYER_KEY);
      playerDialog.close();
      window.location.reload();
      return;
    }
    renderPlayerList(await listAvailablePlayers());
    return;
  }
  const selectButton = event.target.closest(".player-select");
  if (!selectButton) return;
  playerDialog.close(selectButton.closest(".player-item").dataset.slug);
});

let pendingNewDaoConfig = null;
playerDialogForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = playerDialogInput.value.trim();
  if (!name) {
    playerDialogError.style.display = "block";
    playerDialogInput.focus();
    return;
  }
  const result = await openDaoWizard({ requirePlayerName: false });
  if (!result) return;
  pendingNewDaoConfig = result.dao;
  playerDialog.close(`__new__:${name}`);
});

async function determineActivePlayer() {
  const players = await listAvailablePlayers();
  const storedSlug = localStorage.getItem(ACTIVE_PLAYER_KEY);
  if (storedSlug && players.some((p) => p.slug === storedSlug)) {
    return { slug: storedSlug, isNew: false };
  }
  if (players.length === 0) {
    const result = await openDaoWizard({ requirePlayerName: true, allowCancel: false });
    const name = (result && result.playerName) || "Vô Danh";
    return {
      slug: uniqueSlugFor(name, players),
      isNew: true,
      newName: name,
      newDao: result && result.dao,
    };
  }
  const choice = await choosePlayer(players);
  if (choice && choice.startsWith("__new__:")) {
    const name = choice.slice("__new__:".length) || "Vô Danh";
    const newDao = pendingNewDaoConfig;
    pendingNewDaoConfig = null;
    return { slug: uniqueSlugFor(name, players), isNew: true, newName: name, newDao };
  }
  return { slug: choice, isNew: false };
}

async function activatePlayer(slug, isNew, newName, newDao) {
  activePlayerSlug = slug;
  localStorage.setItem(ACTIVE_PLAYER_KEY, slug);
  customDaos = await loadDaos();
  if (newDao) persistDao(newDao);
  const [loadedDb, loadedLegends, loadedSectsRegistry] = await Promise.all([
    loadDB(),
    loadLegends(),
    loadSectsRegistry(),
  ]);
  db = loadedDb;
  legends = normalizeLegends(loadedLegends);
  sectsRegistry = loadedSectsRegistry || {};
  if (isNew) db.player.name = newName || "Vô Danh";
  if (isNew && newDao) db.settings.activePath = newDao.id;
  populateSelects();
  await ensureName();
  saveDB(db);
  applyBackground();
  applyColors();
  applyAvatar();
  populateSettingsExtras();
  renderAll();
}

document.getElementById("switchPlayerBtn").onclick = async () => {
  const players = await listAvailablePlayers();
  const choice = await choosePlayer(players);
  if (!choice) return;
  if (choice.startsWith("__new__:")) {
    const name = choice.slice("__new__:".length) || "Vô Danh";
    const newDao = pendingNewDaoConfig;
    pendingNewDaoConfig = null;
    await activatePlayer(uniqueSlugFor(name, players), true, name, newDao);
  } else if (choice !== activePlayerSlug) {
    await activatePlayer(choice, false);
  }
};

async function ensureName() {
  if (!db.player.name) {
    const name = await requestPlayerName("Chọn đạo hiệu", "");
    db.player.name = name || "Vô Danh";
    saveDB(db);
  }
}
document.getElementById("renameBtn").onclick = async () => {
  const name = await requestPlayerName("Đổi đạo hiệu", db.player.name || "");
  if (name) {
    db.player.name = name;
    saveDB(db);
    renderAll();
  }
};

function populateSelects() {
  const pathSelect = document.getElementById("pathSelect");
  pathSelect.innerHTML = "";
  getAllDaoList().forEach((p) => {
    pathSelect.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });
  pathSelect.value = getActivePath();

  const cp = document.getElementById("cpSelect");
  const fc = document.getElementById("filterCp");
  cp.innerHTML = "";
  fc.innerHTML = '<option value="">Tất cả công pháp</option>';
  getActiveTopics().forEach((t) => {
    const label = tenCongPhap(t.id);
    cp.innerHTML += `<option value="${t.id}">${label}</option>`;
    fc.innerHTML += `<option value="${t.id}">${label}</option>`;
  });
  populateLangSelect();
}
function populateLangSelect() {
  const lang = document.getElementById("langSelect");
  const options = getLanguageOptionsFor(document.getElementById("cpSelect").value);
  lang.innerHTML = options
    .map((o) => `<option value="${o.id}">${o.label}</option>`)
    .join("");
}
document.getElementById("cpSelect").addEventListener("change", populateLangSelect);
document.getElementById("savePathBtn").onclick = () => {
  const newPath = document.getElementById("pathSelect").value;
  if (!getAllPathDefs()[newPath]) return;
  db.settings.activePath = newPath;
  if (!db.paths[newPath]) db.paths[newPath] = defaultPathData();
  saveDB(db);
  populateSelects();
  renderAll();
};

function renderCustomDaoList() {
  const wrap = document.getElementById("customDaoList");
  const empty = document.getElementById("customDaoEmpty");
  if (!wrap) return;
  const allDefs = getAllPathDefs();
  const daoIds = [...new Set([...Object.keys(PATH_DEFS), ...Object.keys(customDaos)])];
  const nameById = Object.fromEntries(getAllDaoList().map((d) => [d.id, d.name]));
  empty.style.display = daoIds.length ? "none" : "block";
  wrap.innerHTML = "";
  daoIds.forEach((id) => {
    const dao = { ...allDefs[id], id, name: nameById[id] || allDefs[id].name || id };
    const isBuiltIn = !!PATH_DEFS[id];
    const hasOverride = !!customDaos[id];
    const item = document.createElement("div");
    item.className = "custom-dao-item";
    const meta = document.createElement("div");
    meta.className = "custom-dao-item-meta";
    const badge = isBuiltIn ? " <span class=\"custom-dao-item-tag\">có sẵn</span>" : "";
    meta.innerHTML = `<strong>${dao.name}</strong>${badge}<div>${dao.topics.length} công pháp — ${dao.topics.map((t) => t.name).join(", ")}</div>`;
    const actions = document.createElement("div");
    actions.className = "custom-dao-item-actions";
    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "ghost";
    editBtn.textContent = "Sửa";
    editBtn.onclick = async () => {
      const result = await openDaoWizard({ requirePlayerName: false, initialDao: dao });
      if (!result) return;
      persistDao(result.dao);
      if (!db.paths[result.dao.id]) db.paths[result.dao.id] = defaultPathData();
      saveDB(db);
      populateSelects();
      renderAll();
      renderCustomDaoList();
    };
    actions.append(editBtn);
    if (isBuiltIn) {
      const resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.className = "ghost";
      resetBtn.textContent = "Khôi phục mặc định";
      resetBtn.disabled = !hasOverride;
      resetBtn.onclick = async () => {
        if (!confirm(`Khôi phục đạo "${dao.name}" về công pháp mặc định ban đầu?`)) return;
        await removeDao(id);
        populateSelects();
        renderAll();
        renderCustomDaoList();
      };
      actions.append(resetBtn);
    } else {
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "ghost";
      deleteBtn.textContent = "Xóa";
      deleteBtn.onclick = async () => {
        if (!confirm(`Xóa đạo "${dao.name}"? Tiến độ công pháp đã lưu theo đạo này sẽ không còn hiển thị.`)) return;
        await removeDao(id);
        if (getActivePath() === id) {
          db.settings.activePath = DEFAULT_PATH;
          saveDB(db);
        }
        populateSelects();
        renderAll();
        renderCustomDaoList();
      };
      actions.append(deleteBtn);
    }
    item.append(meta, actions);
    wrap.appendChild(item);
  });
}
document.getElementById("createDaoBtn").onclick = async () => {
  const result = await openDaoWizard({ requirePlayerName: false });
  if (!result) return;
  persistDao(result.dao);
  if (!db.paths[result.dao.id]) db.paths[result.dao.id] = defaultPathData();
  saveDB(db);
  populateSelects();
  renderAll();
  renderCustomDaoList();
};
document.getElementById("downloadDaosBtn").onclick = () => {
  downloadJSON("dao.json", customDaos);
};

const tabNavigation = document.querySelector(".tabs");
const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
const mobileNavCurrent = document.querySelector(".mobile-nav-current");

function closeMobileNav(restoreFocus = false) {
  tabNavigation.classList.remove("open");
  mobileNavToggle.setAttribute("aria-expanded", "false");
  if (restoreFocus) mobileNavToggle.focus();
}

function updateMobileMenuSpace() {
  const availableHeight =
    window.innerHeight - mobileNavToggle.getBoundingClientRect().bottom - 12;
  tabNavigation.style.setProperty(
    "--mobile-menu-max-height",
    `${Math.max(0, availableHeight)}px`,
  );
}

// Switch to the dropdown nav whenever the pill row would actually clip a tab —
// not just below a fixed viewport width — so it also kicks in on narrower desktop windows.
function updateTabsCompactMode() {
  const wasCompact = tabNavigation.classList.contains("is-compact");
  if (wasCompact) tabNavigation.classList.remove("is-compact");
  const overflowing = tabNavigation.scrollWidth > tabNavigation.clientWidth + 1;
  const shouldBeCompact = window.innerWidth <= 700 || overflowing;
  tabNavigation.classList.toggle("is-compact", shouldBeCompact);
  if (!shouldBeCompact) closeMobileNav();
}
window.addEventListener("resize", updateTabsCompactMode);
window.addEventListener("load", updateTabsCompactMode);
document.fonts?.ready.then(updateTabsCompactMode);
updateTabsCompactMode();

const mobileSelectMedia = window.matchMedia("(max-width: 700px)");
const mobileSelectMenu = document.createElement("div");
const mobileSelectPickers = new Map();
let activeMobileSelect = null;

mobileSelectMenu.className = "mobile-select-menu";
mobileSelectMenu.id = "mobileSelectMenu";
mobileSelectMenu.setAttribute("role", "listbox");
mobileSelectMenu.hidden = true;
document.body.appendChild(mobileSelectMenu);

function syncMobileSelectPicker(select) {
  const picker = mobileSelectPickers.get(select);
  if (!picker) return;
  const selectedText = select.options[select.selectedIndex]?.textContent || "";
  picker.value.textContent = selectedText;
  picker.value.title = selectedText;
  picker.trigger.setAttribute(
    "aria-label",
    picker.label ? `${picker.label}: ${selectedText}` : selectedText,
  );
  picker.trigger.disabled = select.disabled;
}

function positionMobileSelectMenu() {
  if (!activeMobileSelect) return;
  const picker = mobileSelectPickers.get(activeMobileSelect);
  const rect = picker.trigger.getBoundingClientRect();
  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = window.visualViewport?.height || window.innerHeight;
  const menuHeight = Math.min(mobileSelectMenu.scrollHeight, 320);
  const roomAbove = Math.max(0, rect.top - 8);
  const roomBelow = Math.max(0, viewportHeight - rect.bottom - 8);
  const openAbove = roomBelow < menuHeight && roomAbove > roomBelow;
  const availableHeight = openAbove ? roomAbove : roomBelow;
  const height = Math.min(menuHeight, availableHeight);
  const width = Math.min(
    Math.max(rect.width, Math.min(280, viewportWidth - 16)),
    viewportWidth - 16,
  );

  mobileSelectMenu.style.maxHeight = `${height}px`;
  mobileSelectMenu.style.width = `${width}px`;
  mobileSelectMenu.style.left = `${Math.max(
    8,
    Math.min(rect.left, viewportWidth - width - 8),
  )}px`;
  mobileSelectMenu.style.top = openAbove
    ? `${Math.max(8, rect.top - height - 4)}px`
    : `${rect.bottom + 4}px`;
}

function closeMobileSelectPicker(restoreFocus = false) {
  if (!activeMobileSelect) return;
  const picker = mobileSelectPickers.get(activeMobileSelect);
  picker.trigger.setAttribute("aria-expanded", "false");
  mobileSelectMenu.hidden = true;
  mobileSelectMenu.replaceChildren();
  activeMobileSelect = null;
  if (restoreFocus) picker.trigger.focus();
}

function openMobileSelectPicker(select) {
  if (activeMobileSelect === select) {
    closeMobileSelectPicker();
    return;
  }
  closeMobileSelectPicker();
  const picker = mobileSelectPickers.get(select);
  syncMobileSelectPicker(select);
  mobileSelectMenu.replaceChildren();
  Array.from(select.options).forEach((option) => {
    const item = document.createElement("div");
    item.className = "mobile-select-option";
    item.setAttribute("role", "option");
    item.setAttribute("aria-selected", String(option.selected));
    item.tabIndex = -1;
    item.dataset.value = option.value;
    item.textContent = option.textContent;
    if (option.disabled) item.setAttribute("aria-disabled", "true");
    mobileSelectMenu.appendChild(item);
  });
  activeMobileSelect = select;
  picker.trigger.setAttribute("aria-expanded", "true");
  mobileSelectMenu.hidden = false;
  positionMobileSelectMenu();
  const selected = mobileSelectMenu.querySelector('[aria-selected="true"]');
  (selected || mobileSelectMenu.querySelector('[role="option"]'))?.focus();
}

function setupMobileSelectPickers() {
  document.querySelectorAll("select").forEach((select) => {
    const parent = select.parentElement;
    const label = select.labels?.[0] || parent.querySelector("label");
    const wrapper = document.createElement("div");
    const trigger = document.createElement("button");
    const value = document.createElement("span");
    const accessibleLabel = label
      ? label.textContent.trim()
      : select.id === "filterCp"
        ? "Lọc công pháp"
        : "";
    wrapper.className = "select-picker";
    trigger.className = "select-picker-trigger";
    value.className = "select-picker-value";
    trigger.type = "button";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.setAttribute("aria-controls", mobileSelectMenu.id);
    trigger.appendChild(value);
    if (accessibleLabel) trigger.setAttribute("aria-label", accessibleLabel);

    parent.insertBefore(wrapper, select);
    wrapper.append(select, trigger);
    mobileSelectPickers.set(select, { wrapper, trigger, value, label: accessibleLabel });
    trigger.addEventListener("click", () => {
      if (mobileSelectMedia.matches) openMobileSelectPicker(select);
    });
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        openMobileSelectPicker(select);
      }
    });
    select.addEventListener("change", () => syncMobileSelectPicker(select));
    new MutationObserver(() => syncMobileSelectPicker(select)).observe(select, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true,
    });
    syncMobileSelectPicker(select);
  });
  updateMobileSelectPresentation();
}

function updateMobileSelectPresentation() {
  const isMobile = mobileSelectMedia.matches;
  mobileSelectPickers.forEach(({ trigger }, select) => {
    if (isMobile) {
      select.setAttribute("aria-hidden", "true");
      select.tabIndex = -1;
    } else {
      select.removeAttribute("aria-hidden");
      select.removeAttribute("tabindex");
    }
    trigger.setAttribute("aria-hidden", String(!isMobile));
    syncMobileSelectPicker(select);
  });
  if (!isMobile) closeMobileSelectPicker();
}

setupMobileSelectPickers();

function setupDatalistPickers() {
  document.querySelectorAll("input[list]").forEach((input) => {
    const list = document.getElementById(input.getAttribute("list"));
    if (!list || input.closest(".datalist-picker")) return;

    const wrapper = document.createElement("div");
    const menu = document.createElement("div");
    wrapper.className = "datalist-picker";
    menu.className = "datalist-picker-menu";
    menu.setAttribute("role", "listbox");
    input.parentElement.insertBefore(wrapper, input);
    wrapper.append(input, menu);
    input.removeAttribute("list");

    function getOptions() {
      return Array.from(list.options)
        .map((option) => option.value.trim())
        .filter((value, index, values) => value && values.indexOf(value) === index);
    }

    function renderOptions() {
      const query = input.value.trim().toLocaleLowerCase("vi");
      const options = getOptions().filter((value) =>
        value.toLocaleLowerCase("vi").includes(query),
      );
      menu.replaceChildren();
      options.forEach((value) => {
        const option = document.createElement("button");
        option.type = "button";
        option.className = "datalist-picker-option";
        option.setAttribute("role", "option");
        option.dataset.value = value;
        option.textContent = value;
        option.classList.toggle("selected", value === input.value.trim());
        menu.appendChild(option);
      });
      menu.classList.toggle("open", options.length > 0);
    }

    function closeMenu() {
      menu.classList.remove("open");
    }

    input.addEventListener("focus", renderOptions);
    input.addEventListener("click", renderOptions);
    input.addEventListener("input", renderOptions);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }
      if (event.key === "ArrowDown" && menu.classList.contains("open")) {
        event.preventDefault();
        menu.querySelector(".datalist-picker-option")?.focus();
      }
    });
    menu.addEventListener("click", (event) => {
      const option = event.target.closest(".datalist-picker-option");
      if (!option) return;
      input.value = option.dataset.value;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      closeMenu();
      input.focus();
    });
    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        input.focus();
      }
    });
    new MutationObserver(renderOptions).observe(list, {
      childList: true,
      subtree: true,
    });
  });
}

setupDatalistPickers();

mobileNavToggle.addEventListener("click", () => {
  const isOpen = tabNavigation.classList.toggle("open");
  mobileNavToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) updateMobileMenuSpace();
});

window.addEventListener("resize", () => {
  if (tabNavigation.classList.contains("open")) updateMobileMenuSpace();
  if (activeMobileSelect) positionMobileSelectMenu();
});
window.addEventListener("scroll", () => {
  if (tabNavigation.classList.contains("open")) updateMobileMenuSpace();
  if (activeMobileSelect) positionMobileSelectMenu();
}, { passive: true });
mobileSelectMedia.addEventListener("change", updateMobileSelectPresentation);
window.visualViewport?.addEventListener("resize", positionMobileSelectMenu);
window.visualViewport?.addEventListener("scroll", positionMobileSelectMenu);

document.addEventListener("click", (event) => {
  if (!tabNavigation.contains(event.target)) closeMobileNav();
  document.querySelectorAll(".datalist-picker-menu.open").forEach((menu) => {
    if (!menu.parentElement.contains(event.target)) menu.classList.remove("open");
  });
  if (
    activeMobileSelect &&
    !mobileSelectMenu.contains(event.target) &&
    !mobileSelectPickers.get(activeMobileSelect).wrapper.contains(event.target)
  ) {
    closeMobileSelectPicker();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeMobileSelect) {
    closeMobileSelectPicker(true);
    return;
  }
  if (event.key === "Escape" && tabNavigation.classList.contains("open")) {
    closeMobileNav(true);
  }
});

mobileSelectMenu.addEventListener("click", (event) => {
  const item = event.target.closest("[role=option]");
  if (!item || item.getAttribute("aria-disabled") === "true") return;
  activeMobileSelect.value = item.dataset.value;
  activeMobileSelect.dispatchEvent(new Event("change", { bubbles: true }));
  closeMobileSelectPicker(true);
});

mobileSelectMenu.addEventListener("keydown", (event) => {
  const items = Array.from(
    mobileSelectMenu.querySelectorAll('[role="option"]:not([aria-disabled="true"])'),
  );
  const index = items.indexOf(document.activeElement);
  let nextIndex = null;
  if (event.key === "ArrowDown") nextIndex = Math.min(items.length - 1, index + 1);
  if (event.key === "ArrowUp") nextIndex = Math.max(0, index - 1);
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = items.length - 1;
  if (nextIndex !== null && items.length) {
    event.preventDefault();
    items[nextIndex].focus();
  } else if (
    (event.key === "Enter" || event.key === " ") &&
    document.activeElement.matches('[role="option"]')
  ) {
    event.preventDefault();
    document.activeElement.click();
  }
});

document.addEventListener("focusin", (event) => {
  if (
    activeMobileSelect &&
    !mobileSelectMenu.contains(event.target) &&
    !mobileSelectPickers.get(activeMobileSelect).trigger.contains(event.target)
  ) {
    closeMobileSelectPicker();
  }
});

mobileSelectMenu.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeMobileSelectPicker(true);
  }
});

document.querySelectorAll(".tab").forEach((t) => {
  t.onclick = () => {
    document
      .querySelectorAll(".tab")
      .forEach((x) => {
        x.classList.remove("active");
        x.removeAttribute("aria-current");
      });
    document
      .querySelectorAll(".panel")
      .forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    t.setAttribute("aria-current", "page");
    mobileNavCurrent.textContent = t.textContent;
    document.getElementById("panel-" + t.dataset.tab).classList.add("active");
    closeMobileNav();
  };
});

const textareaEditor = document.getElementById("textareaEditor");
const textareaEditorInput = document.getElementById("textareaEditorInput");
let textareaBeingEdited = null;

document.addEventListener("click", (event) => {
  const textarea = event.target.closest("textarea");
  if (!textarea || textareaEditor.contains(textarea)) return;

  textareaBeingEdited = textarea;
  textareaEditorInput.value = textarea.value;
  textareaEditorInput.classList.toggle("code-editor", textarea.id === "codeInput");
  document.getElementById("textareaEditorTitle").textContent =
    textarea.dataset.editorTitle ||
    textarea.labels?.[0]?.textContent.trim() ||
    textarea.closest(".card")?.querySelector("h3, h4")?.textContent.trim() ||
    "Chỉnh sửa nội dung";
  textareaEditor.showModal();
  textareaEditorInput.focus();
});

function closeTextareaEditor(applyChanges) {
  if (!textareaBeingEdited) return;
  const target = textareaBeingEdited;
  if (applyChanges) {
    target.value = textareaEditorInput.value;
    target.dispatchEvent(new Event("input", { bubbles: true }));
    target.dispatchEvent(new Event("change", { bubbles: true }));
  }
  textareaBeingEdited = null;
  textareaEditor.close();
  target.focus({ preventScroll: true });
}

document.getElementById("applyTextareaEditor").onclick = () =>
  closeTextareaEditor(true);
document.getElementById("cancelTextareaEditor").onclick = () =>
  closeTextareaEditor(false);
document.getElementById("closeTextareaEditor").onclick = () =>
  closeTextareaEditor(false);

document.getElementById("saveTarget").onclick = () => {
  const v = parseInt(document.getElementById("dailyTarget").value) || 1;
  currentPathData().dailyTarget = v;
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

function renderSect() {
  const sect = db.sect;
  const isJoined = sect.status === "joined";
  const sectName = sect.name.trim() || "tông môn";
  const status = document.getElementById("sectStatus");
  if (sect.status === "joined") {
    status.textContent = `Đang bái nhập ${sectName}.`;
  } else if (sect.status === "left") {
    status.textContent = `Đã rời khỏi ${sectName}.`;
  } else if (sect.status === "expelled") {
    status.textContent = `Đã bị trục xuất khỏi ${sectName}.`;
  } else {
    status.textContent = "Chưa bái nhập tông môn.";
  }
  status.className = `today-status ${isJoined ? "ok" : "warn"}`;

  const joinButton = document.getElementById("joinSect");
  joinButton.style.display = isJoined ? "none" : "inline-block";
  joinButton.textContent =
    sect.status === "unaffiliated" ? "Bái nhập tông môn" : "Bái nhập tông môn mới";
  document.getElementById("sectDetails").style.display = isJoined
    ? "block"
    : "none";

  document.getElementById("sectName").value = sect.name;
  SECT_RELATIONS.forEach(({ key, inputId }) => {
    document.getElementById(inputId).value = sect[key];
    document.getElementById(`${inputId}Description`).value =
      sect[`${key}Description`];
  });
  document.getElementById("sectDescription").value = sect.description;
  populateSectNameDatalist();
  populateSectRoleDatalists(getRegistrySectEntry(sect.name));
  renderSectRegistry();
}

function fillDatalist(id, labels) {
  const list = document.getElementById(id);
  if (!list) return;
  list.innerHTML = [...new Set(labels.map((label) => String(label || "").trim()).filter(Boolean))]
    .map((label) => `<option value="${escapeHtml(label)}"></option>`)
    .join("");
}
function getRegistrySectEntry(name) {
  const slug = slugifyName((name || "").trim());
  return slug ? sectsRegistry[slug] : undefined;
}
function populateSectNameDatalist() {
  fillDatalist(
    "sectNameList",
    Object.values(sectsRegistry)
      .map((entry) => entry.name)
      .concat(db.sect.name),
  );
}
function populateSectRoleDatalists(entry) {
  const selectedSectName = document.getElementById("sectName").value;
  const isCurrentSect =
    slugifyName(selectedSectName) === slugifyName(db.sect.name);
  SECT_RELATIONS.forEach(({ key, inputId }) => {
    const people = (entry && entry.roles && entry.roles[key]) || {};
    fillDatalist(
      `${inputId}List`,
      Object.values(people)
        .map((p) => p.name)
        .concat(isCurrentSect ? db.sect[key] : ""),
    );
  });
}

function renderSectRegistry() {
  const list = document.getElementById("sectRegistryList");
  const empty = document.getElementById("sectRegistryEmpty");
  if (!list || !empty) return;
  list.replaceChildren();
  const entries = Object.entries(sectsRegistry).filter(([, entry]) => entry?.name);
  empty.style.display = entries.length ? "none" : "block";
  entries.forEach(([slug, entry]) => {
    const item = document.createElement("div");
    item.className = "sect-registry-item";
    const name = document.createElement("div");
    name.className = "sect-registry-name";
    name.textContent = entry.name;
    const actions = document.createElement("div");
    actions.className = "sect-registry-actions";
    const selectButton = document.createElement("button");
    selectButton.type = "button";
    selectButton.className = "ghost sect-select-button";
    selectButton.dataset.slug = slug;
    selectButton.textContent = "Chọn";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "ghost sect-delete-button";
    deleteButton.dataset.slug = slug;
    deleteButton.textContent = "Xóa";
    deleteButton.setAttribute("aria-label", `Xóa tông môn ${entry.name}`);
    actions.append(selectButton, deleteButton);
    item.append(name, actions);
    list.appendChild(item);
  });
}

function loadSectIntoForm(entry) {
  const sect = normalizeSect({ ...entry, status: "joined" });
  document.getElementById("sectDetails").style.display = "block";
  document.getElementById("sectName").value = sect.name;
  SECT_RELATIONS.forEach(({ key, inputId }) => {
    document.getElementById(inputId).value = sect[key];
    document.getElementById(`${inputId}Description`).value =
      sect[`${key}Description`];
  });
  document.getElementById("sectDescription").value = sect.description;
  populateSectRoleDatalists(entry);
  document.getElementById("sectFormStatus").textContent =
    `Đã nạp thông tin ${sect.name}. Bấm lưu để áp dụng cho đạo hữu hiện tại.`;
}

function clearSectForm() {
  document.getElementById("sectDetails").style.display = "block";
  document.getElementById("sectName").value = "";
  SECT_RELATIONS.forEach(({ inputId }) => {
    document.getElementById(inputId).value = "";
    document.getElementById(`${inputId}Description`).value = "";
  });
  document.getElementById("sectDescription").value = "";
  populateSectRoleDatalists(null);
  document.getElementById("sectFormStatus").textContent =
    "Đã mở form tông môn mới.";
  document.getElementById("sectName").focus();
}

async function deleteSectFromRegistry(slug) {
  if (USE_SECTS_API) {
    try {
      const response = await fetch(`/api/sects?player=${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!response.ok) return false;
    } catch (error) {
      USE_SECTS_API = false;
    }
  }
  if (!USE_SECTS_API) {
    delete sectsRegistry[slug];
    saveLocalSectsRegistry();
  } else {
    delete sectsRegistry[slug];
    saveLocalSectsRegistry();
  }
  return true;
}

document.getElementById("sectName").addEventListener("input", () => {
  populateSectRoleDatalists(
    getRegistrySectEntry(document.getElementById("sectName").value),
  );
});
document.getElementById("sectName").addEventListener("change", () => {
  const entry = getRegistrySectEntry(document.getElementById("sectName").value);
  const descField = document.getElementById("sectDescription");
  if (entry && entry.description && !descField.value.trim()) {
    descField.value = entry.description;
  }
});
SECT_RELATIONS.forEach(({ key, inputId }) => {
  document.getElementById(inputId).addEventListener("change", () => {
    const sectEntry = getRegistrySectEntry(
      document.getElementById("sectName").value,
    );
    const personSlug = slugifyName(
      document.getElementById(inputId).value.trim(),
    );
    const person =
      sectEntry && sectEntry.roles && sectEntry.roles[key] && personSlug
        ? sectEntry.roles[key][personSlug]
        : undefined;
    const descField = document.getElementById(`${inputId}Description`);
    if (person && person.description && !descField.value.trim()) {
      descField.value = person.description;
    }
  });
});

function readSectForm() {
  const sect = {
    status: "joined",
    name: document.getElementById("sectName").value.trim(),
    description: document.getElementById("sectDescription").value,
  };
  SECT_RELATIONS.forEach(({ key, inputId }) => {
    sect[key] = document.getElementById(inputId).value.trim();
    sect[`${key}Description`] =
      document.getElementById(`${inputId}Description`).value;
  });
  return sect;
}

document.getElementById("joinSect").onclick = () => {
  db.sect.status = "joined";
  saveDB(db);
  renderSect();
  document.getElementById("sectFormStatus").textContent =
    "Hồ sơ tông môn đã sẵn sàng để điền.";
};

document.getElementById("saveSect").onclick = () => {
  db.sect = readSectForm();
  saveDB(db);
  persistSectToRegistry(db.sect);
  populateSectNameDatalist();
  populateSectRoleDatalists(getRegistrySectEntry(db.sect.name));
  renderSectRegistry();
  document.getElementById("sectStatus").textContent =
    `Đang bái nhập ${db.sect.name || "tông môn"}.`;
  document.getElementById("sectFormStatus").textContent =
    "Thông tin tông môn đã được lưu.";
};

document.getElementById("addSectBtn").onclick = clearSectForm;
document.getElementById("sectRegistryList").addEventListener("click", async (event) => {
  const selectButton = event.target.closest(".sect-select-button");
  if (selectButton) {
    loadSectIntoForm(sectsRegistry[selectButton.dataset.slug]);
    return;
  }
  const deleteButton = event.target.closest(".sect-delete-button");
  if (!deleteButton) return;
  const entry = sectsRegistry[deleteButton.dataset.slug];
  if (!entry || !confirm(`Xóa tông môn ${entry.name} khỏi danh sách chung?`)) return;
  const deleted = await deleteSectFromRegistry(deleteButton.dataset.slug);
  if (!deleted) return;
  renderSectRegistry();
  populateSectNameDatalist();
  document.getElementById("sectRegistryStatus").textContent =
    `Đã xóa tông môn ${entry.name} khỏi danh sách chung.`;
});

function endSectMembership(status) {
  const message =
    status === "left"
      ? "Xác nhận rời khỏi tông môn?"
      : "Xác nhận nhân vật bị trục xuất khỏi sư môn?";
  if (!confirm(message)) return;
  db.sect = { ...readSectForm(), status };
  saveDB(db);
  persistSectToRegistry(db.sect);
  renderSect();
}

document.getElementById("leaveSect").onclick = () =>
  endSectMembership("left");
document.getElementById("expelSect").onclick = () =>
  endSectMembership("expelled");

document.getElementById("saveTotalGoal").onclick = () => {
  const v = Math.max(
    MIN_TOTAL_GOAL,
    parseInt(document.getElementById("totalGoal").value) || MIN_TOTAL_GOAL,
  );
  currentPathData().totalGoal = v;
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
  const url = document.getElementById("avatarLinkSelect").value;
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
function getSavedImageLinks(listKey, selectedKey) {
  const links = Array.isArray(db.settings[listKey])
    ? db.settings[listKey]
        .filter((url) => typeof url === "string" && url.trim())
        .map((url) => url.trim())
    : [];
  const selected =
    typeof db.settings[selectedKey] === "string"
      ? db.settings[selectedKey].trim()
      : "";
  if (selected && !links.includes(selected)) links.unshift(selected);
  db.settings[listKey] = [...new Set(links)];
  db.settings[selectedKey] = selected;
  return db.settings[listKey];
}
function renderImageLinkSelect(selectId, removeButtonId, listKey, selectedKey, emptyLabel) {
  const select = document.getElementById(selectId);
  const links = getSavedImageLinks(listKey, selectedKey);
  select.replaceChildren();
  const emptyOption = document.createElement("option");
  emptyOption.value = "";
  emptyOption.textContent = emptyLabel;
  select.appendChild(emptyOption);
  links.forEach((url, index) => {
    const option = document.createElement("option");
    option.value = url;
    option.textContent = `${index + 1}. ${url}`;
    select.appendChild(option);
  });
  select.value = db.settings[selectedKey];
  document.getElementById(removeButtonId).disabled = !select.value;
}
function renderImageLinkSelects() {
  renderImageLinkSelect(
    "avatarLinkSelect",
    "removeAvatarLink",
    "avatarLinks",
    "avatarUrl",
    "Chưa có ảnh đại diện",
  );
  renderImageLinkSelect(
    "bgImageLinkSelect",
    "removeBgImageLink",
    "bgImageLinks",
    "bgImage",
    "Chưa có ảnh nền",
  );
}
function addImageLink(inputId, listKey, selectedKey, updateImage) {
  const input = document.getElementById(inputId);
  const url = input.value.trim();
  if (!url) return;
  const links = getSavedImageLinks(listKey, selectedKey);
  if (!links.includes(url)) links.push(url);
  db.settings[listKey] = links;
  db.settings[selectedKey] = url;
  input.value = "";
  renderImageLinkSelects();
  saveDB(db);
  updateImage();
}
function removeSelectedImageLink(listKey, selectedKey, updateImage) {
  const selected = db.settings[selectedKey];
  if (!selected) return;
  db.settings[listKey] = getSavedImageLinks(listKey, selectedKey).filter(
    (url) => url !== selected,
  );
  db.settings[selectedKey] = db.settings[listKey][0] || "";
  renderImageLinkSelects();
  saveDB(db);
  updateImage();
}
function populateSettingsExtras() {
  renderImageLinkSelects();
  document.getElementById("avatarUrlInput").value = "";
  const crop = getAvatarCrop();
  document.getElementById("avatarZoomInput").value = crop.zoom;
  document.getElementById("avatarZoomVal").textContent =
    Math.round(crop.zoom * 100) + "%";
  document.getElementById("avatarXInput").value = crop.x;
  document.getElementById("avatarXVal").textContent = crop.x + "%";
  document.getElementById("avatarYInput").value = crop.y;
  document.getElementById("avatarYVal").textContent = crop.y + "%";
  document.getElementById("bgImageInput").value = "";
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
  renderCustomDaoList();
}

document.getElementById("saveAvatar").onclick = () => {
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
document.getElementById("avatarLinkSelect").onchange = () => {
  db.settings.avatarUrl = document.getElementById("avatarLinkSelect").value;
  saveDB(db);
  applyAvatar();
};
document.getElementById("addAvatarLink").onclick = () =>
  addImageLink("avatarUrlInput", "avatarLinks", "avatarUrl", applyAvatar);
document.getElementById("removeAvatarLink").onclick = () =>
  removeSelectedImageLink("avatarLinks", "avatarUrl", applyAvatar);
document.getElementById("bgImageLinkSelect").onchange = () => {
  db.settings.bgImage = document.getElementById("bgImageLinkSelect").value;
  saveDB(db);
  applyBackground();
};
document.getElementById("addBgImageLink").onclick = () =>
  addImageLink("bgImageInput", "bgImageLinks", "bgImage", applyBackground);
document.getElementById("removeBgImageLink").onclick = () =>
  removeSelectedImageLink("bgImageLinks", "bgImage", applyBackground);
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
  db.settings.bgImage = document.getElementById("bgImageLinkSelect").value;
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
  currentPathData().problems.push({
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
  const target = currentPathData().dailyTarget || 1;
  const doneToday = currentPathData().problems.filter((p) => p.date === todayStr()).length;
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
  const total = currentPathData().problems.length;
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
  const perCp = Math.ceil(goal / getActiveTopics().length);
  document.getElementById("goalDistNote").textContent =
    `Đại nguyện chia đều cho ${getActiveTopics().length} công pháp: mỗi công pháp cần khoảng ${perCp} chiêu thức để viên mãn. Mức tối thiểu ${MIN_TOTAL_GOAL} chiêu gồm 9 bậc tu vi và 5 thiên kiếp.`;
  const total = currentPathData().problems.length;
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
  const perCpGoal = Math.ceil(goal / getActiveTopics().length);
  const problems = currentPathData().problems;
  getActiveTopics().forEach((topic) => {
    const count = problems.filter((p) => p.congPhap === topic.id).length;
    const realm = realmForTopic(count);
    const pct = Math.min(100, Math.round((count / perCpGoal) * 100));
    wrap.innerHTML += `<div class="cp-progress">
      <div class="cp-row"><span>${tenCongPhap(topic.id)}</span><span style="color:var(--gold)">${realm} · ${count}/${perCpGoal} chiêu</span></div>
      <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
    </div>`;
  });
}

function renderTable() {
  const q = document.getElementById("searchInput").value.toLowerCase();
  const fc = document.getElementById("filterCp").value;
  const list = currentPathData().problems
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
    tr.innerHTML = `<td>${escapeHtml(p.chieuThuc)}</td><td><span class="pill">${tenCongPhap(p.congPhap)}</span></td><td>${escapeHtml(tenNgonNgu(p))}</td><td>${p.date}</td>`;
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
  const doneSet = new Set(currentPathData().problems.map((p) => p.date));
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
    `Đại nguyện ${goal} ÷ ${getActiveTopics().length} công pháp ≈ ${perCp} chiêu thức mỗi công pháp — đây là mốc để một công pháp đạt Độ Kiếp riêng của nó.`;

  renderRealmLore();
}

function renderRealmLore() {
  const wrap = document.getElementById("realmLoreList");
  if (!wrap) return;
  wrap.innerHTML = REALM_NAMES.map((name) => {
    const lore = REALM_LORE[name];
    if (!lore) return "";
    const imageHtml = lore.image
      ? `<img src="/stages/${lore.image}" alt="${name}" loading="lazy">`
      : `<span>Chưa có tranh minh họa</span>`;
    return `
      <div class="realm-lore-item">
        <div class="realm-lore-image${lore.image ? "" : " no-image"}">${imageHtml}</div>
        <div class="realm-lore-text">
          <h4 class="serif">${name}</h4>
          <ul>
            <li><strong>Đột phá:</strong> ${lore.breakthrough}</li>
            <li><strong>Hấp thụ linh khí:</strong> ${lore.qi}</li>
            <li><strong>Kết đan:</strong> ${lore.core}</li>
            <li><strong>Thọ nguyên:</strong> ${lore.lifespan}</li>
            <li><strong>Uy lực:</strong> ${lore.power}</li>
          </ul>
        </div>
      </div>`;
  }).join("");
}

function renderLegends() {
  const wrap = document.getElementById("legendList");
  if (!wrap) return;
  const total = currentPathData().problems.length;
  const realms = getRealms();
  const pathLegends = currentLegends();
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
    textarea.dataset.editorTitle = title.textContent;
    textarea.placeholder = unlocked
      ? "Viết giai thoại về lần đột phá cảnh giới này..."
      : "Chương truyện còn phong ấn.";
    textarea.value = pathLegends[realm.name] || "";
    textarea.disabled = !unlocked;
    const button = document.createElement("button");
    button.className = "ghost";
    button.textContent = "Lưu chương truyện";
    button.disabled = !unlocked;
    button.onclick = () => {
      pathLegends[realm.name] = textarea.value;
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
  renderSect();
}

(async function init() {
  const chosen = await determineActivePlayer();
  await activatePlayer(chosen.slug, chosen.isNew, chosen.newName, chosen.newDao);
})();
