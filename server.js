// Minimal local server: serves the app and persists per-player data to db_<slug>.json / truyenky_<slug>.json.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || ROOT;
const HTML_FILE = path.join(ROOT, "Tu Tiên Chi Lộ — LeetCode.html");
const LEGACY_DB_FILE = path.join(DATA_DIR, "db.json");
const LEGACY_LEGENDS_FILE = path.join(DATA_DIR, "truyenky.json");
const PLAYER_FILE_RE = /^db_([a-z0-9]{1,60})\.json$/;
const STAGES_DIR = path.join(ROOT, "stages");
const STAGE_IMAGE_RE = /^\/stages\/([a-z_]+\.jpg)$/;
const SECTS_FILE = path.join(DATA_DIR, "sects.json");
const DAOS_FILE = path.join(DATA_DIR, "dao.json");
const SECT_ROLE_KEYS = [
  "master",
  "shizun",
  "seniorSister",
  "juniorSister",
  "seniorBrother",
  "juniorBrother",
  "daoCompanion",
];
const STATIC_FILES = {
  "/manifest.webmanifest": {
    file: path.join(ROOT, "manifest.webmanifest"),
    type: "application/manifest+json; charset=utf-8",
  },
  "/sw.js": {
    file: path.join(ROOT, "sw.js"),
    type: "application/javascript; charset=utf-8",
  },
  "/icon.svg": {
    file: path.join(ROOT, "icon.svg"),
    type: "image/svg+xml",
  },
  "/styles.css": {
    file: path.join(ROOT, "styles.css"),
    type: "text/css; charset=utf-8",
  },
  "/app.js": {
    file: path.join(ROOT, "app.js"),
    type: "application/javascript; charset=utf-8",
  },
};

function defaultDB() {
  return { player: { name: "", dailyTarget: 1 }, problems: [], settings: {} };
}

function slugify(name) {
  return String(name || "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function isValidSlug(slug) {
  return typeof slug === "string" && /^[a-z0-9]{1,60}$/.test(slug);
}

function dbFileForSlug(slug) {
  return path.join(DATA_DIR, `db_${slug}.json`);
}
function legendsFileForSlug(slug) {
  return path.join(DATA_DIR, `truyenky_${slug}.json`);
}

function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return fallback;
  }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

// Shared registry of known sects/people so any player can reuse existing names and descriptions.
function readSectsRegistry() {
  const data = readJSON(SECTS_FILE, {});
  return data && typeof data === "object" ? data : {};
}
function writeSectsRegistry(registry) {
  writeJSON(SECTS_FILE, registry);
}
function mergeSectIntoRegistry(registry, sect) {
  sect = sect || {};
  const name = typeof sect.name === "string" ? sect.name.trim() : "";
  if (!name) return registry;
  const sectSlug = slugify(name) || "tongmon";
  const entry = registry[sectSlug] || { name, description: "", roles: {} };
  entry.name = name;
  const description = typeof sect.description === "string" ? sect.description.trim() : "";
  if (description) entry.description = sect.description;
  entry.roles = entry.roles || {};
  SECT_ROLE_KEYS.forEach((key) => {
    const personName = typeof sect[key] === "string" ? sect[key].trim() : "";
    if (!personName) return;
    const personSlug = slugify(personName) || personName.toLowerCase();
    entry.roles[key] = entry.roles[key] || {};
    const person = entry.roles[key][personSlug] || { name: personName, description: "" };
    person.name = personName;
    const personDescription =
      typeof sect[`${key}Description`] === "string" ? sect[`${key}Description`].trim() : "";
    if (personDescription) person.description = sect[`${key}Description`];
    entry.roles[key][personSlug] = person;
  });
  registry[sectSlug] = entry;
  return registry;
}

// Shared registry of custom-built đạo (tên đạo + công pháp + ngôn ngữ) reusable across players.
function readDaosRegistry() {
  const data = readJSON(DAOS_FILE, {});
  return data && typeof data === "object" ? data : {};
}
function writeDaosRegistry(registry) {
  writeJSON(DAOS_FILE, registry);
}

function countProblems(data) {
  if (Array.isArray(data.problems)) return data.problems.length;
  if (data.paths && typeof data.paths === "object") {
    return Object.values(data.paths).reduce(
      (sum, p) => sum + (Array.isArray(p && p.problems) ? p.problems.length : 0),
      0,
    );
  }
  return 0;
}

function listPlayers() {
  let entries;
  try {
    entries = fs.readdirSync(DATA_DIR);
  } catch (e) {
    return [];
  }
  const players = [];
  entries.forEach((entry) => {
    const match = entry.match(PLAYER_FILE_RE);
    if (!match) return;
    const data = readJSON(path.join(DATA_DIR, entry), null);
    if (!data) return;
    players.push({
      slug: match[1],
      name: (data.player && data.player.name) || match[1],
      problemCount: countProblems(data),
    });
  });
  players.sort((a, b) => a.name.localeCompare(b.name, "vi"));
  return players;
}

function migrateLegacyData() {
  if (!fs.existsSync(LEGACY_DB_FILE)) return;
  let alreadyHasPlayers = false;
  try {
    alreadyHasPlayers = fs
      .readdirSync(DATA_DIR)
      .some((entry) => PLAYER_FILE_RE.test(entry));
  } catch (e) {
    /* DATA_DIR unreadable — skip migration */
  }
  if (alreadyHasPlayers) return;
  const legacyData = readJSON(LEGACY_DB_FILE, null);
  if (!legacyData) return;
  const slug =
    slugify((legacyData.player && legacyData.player.name) || "") || "daohuu";
  const targetDb = dbFileForSlug(slug);
  if (fs.existsSync(targetDb)) return;
  writeJSON(targetDb, legacyData);
  writeJSON(legendsFileForSlug(slug), readJSON(LEGACY_LEGENDS_FILE, {}));
  console.log(`Migrated legacy single-player data to ${targetDb}`);
}

function sendJSON(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

migrateLegacyData();

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = requestUrl.pathname;
  const slug = requestUrl.searchParams.get("player");

  if (pathname === "/api/players" && req.method === "GET") {
    sendJSON(res, 200, listPlayers());
    return;
  }

  if (pathname === "/api/players" && req.method === "DELETE") {
    if (!isValidSlug(slug)) {
      sendJSON(res, 400, { ok: false, error: "Missing or invalid player" });
      return;
    }
    let deleted = false;
    [dbFileForSlug(slug), legendsFileForSlug(slug)].forEach((file) => {
      try {
        fs.unlinkSync(file);
        deleted = true;
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    });
    sendJSON(res, deleted ? 200 : 404, { ok: deleted });
    return;
  }

  if (pathname === "/api/db" && req.method === "GET") {
    if (!isValidSlug(slug)) {
      sendJSON(res, 400, { error: "Missing or invalid player" });
      return;
    }
    sendJSON(res, 200, readJSON(dbFileForSlug(slug), defaultDB()));
    return;
  }

  if (pathname === "/api/db" && req.method === "POST") {
    if (!isValidSlug(slug)) {
      sendJSON(res, 400, { error: "Missing or invalid player" });
      return;
    }
    try {
      const body = await readRequestBody(req);
      const data = JSON.parse(body || "{}");
      writeJSON(dbFileForSlug(slug), data);
      sendJSON(res, 200, { ok: true });
    } catch (e) {
      sendJSON(res, 400, { ok: false, error: "Invalid JSON" });
    }
    return;
  }

  if (pathname === "/api/legends" && req.method === "GET") {
    if (!isValidSlug(slug)) {
      sendJSON(res, 400, { error: "Missing or invalid player" });
      return;
    }
    sendJSON(res, 200, readJSON(legendsFileForSlug(slug), {}));
    return;
  }

  if (pathname === "/api/legends" && req.method === "POST") {
    if (!isValidSlug(slug)) {
      sendJSON(res, 400, { error: "Missing or invalid player" });
      return;
    }
    try {
      const body = await readRequestBody(req);
      const data = JSON.parse(body || "{}");
      writeJSON(legendsFileForSlug(slug), data);
      sendJSON(res, 200, { ok: true });
    } catch (e) {
      sendJSON(res, 400, { ok: false, error: "Invalid JSON" });
    }
    return;
  }

  // Shared across all players (not player-scoped) so sects/people can be reused.
  if (pathname === "/api/sects" && req.method === "GET") {
    sendJSON(res, 200, readSectsRegistry());
    return;
  }

  if (pathname === "/api/sects" && req.method === "DELETE") {
    if (!isValidSlug(slug)) {
      sendJSON(res, 400, { ok: false, error: "Missing or invalid sect" });
      return;
    }
    const registry = readSectsRegistry();
    if (!Object.prototype.hasOwnProperty.call(registry, slug)) {
      sendJSON(res, 404, { ok: false, error: "Sect not found" });
      return;
    }
    delete registry[slug];
    writeSectsRegistry(registry);
    sendJSON(res, 200, { ok: true });
    return;
  }

  if (pathname === "/api/sects" && req.method === "POST") {
    try {
      const body = await readRequestBody(req);
      const payload = JSON.parse(body || "{}");
      const registry = readSectsRegistry();
      mergeSectIntoRegistry(registry, payload && payload.sect);
      writeSectsRegistry(registry);
      sendJSON(res, 200, { ok: true });
    } catch (e) {
      sendJSON(res, 400, { ok: false, error: "Invalid JSON" });
    }
    return;
  }

  // Shared registry of custom đạo (path configs) so any player can reuse/edit/delete them.
  if (pathname === "/api/daos" && req.method === "GET") {
    sendJSON(res, 200, readDaosRegistry());
    return;
  }

  if (pathname === "/api/daos" && req.method === "DELETE") {
    const daoId = requestUrl.searchParams.get("id");
    if (!isValidSlug(daoId)) {
      sendJSON(res, 400, { ok: false, error: "Missing or invalid dao id" });
      return;
    }
    const registry = readDaosRegistry();
    if (!Object.prototype.hasOwnProperty.call(registry, daoId)) {
      sendJSON(res, 404, { ok: false, error: "Dao not found" });
      return;
    }
    delete registry[daoId];
    writeDaosRegistry(registry);
    sendJSON(res, 200, { ok: true });
    return;
  }

  if (pathname === "/api/daos" && req.method === "POST") {
    try {
      const body = await readRequestBody(req);
      const payload = JSON.parse(body || "{}");
      const dao = payload && payload.dao;
      if (!dao || typeof dao.id !== "string" || !isValidSlug(dao.id)) {
        sendJSON(res, 400, { ok: false, error: "Invalid dao" });
        return;
      }
      const registry = readDaosRegistry();
      registry[dao.id] = dao;
      writeDaosRegistry(registry);
      sendJSON(res, 200, { ok: true });
    } catch (e) {
      sendJSON(res, 400, { ok: false, error: "Invalid JSON" });
    }
    return;
  }

  const staticFile = STATIC_FILES[pathname];
  if (staticFile && req.method === "GET") {
    fs.readFile(staticFile.file, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": staticFile.type });
      res.end(content);
    });
    return;
  }

  const stageMatch = req.method === "GET" ? pathname.match(STAGE_IMAGE_RE) : null;
  if (stageMatch) {
    const filePath = path.join(STAGES_DIR, stageMatch[1]);
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(content);
    });
    return;
  }

  if (pathname === "/" || pathname === "/index.html") {
    fs.readFile(HTML_FILE, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading HTML");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(content);
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Tu Tien Chi Lo running at http://localhost:${PORT}`);
  console.log(`Player data is saved under ${DATA_DIR} as db_<slug>.json / truyenky_<slug>.json`);
});
