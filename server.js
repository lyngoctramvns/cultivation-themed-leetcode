// Minimal local server: serves the app and persists all data to db.json on disk.
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || ROOT;
const HTML_FILE = path.join(ROOT, "Tu Tiên Chi Lộ — LeetCode.html");
const DB_FILE = path.join(DATA_DIR, "db.json");
const LEGENDS_FILE = path.join(DATA_DIR, "truyenky.json");
const STATIC_FILES = {
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

function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return defaultDB();
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
}

function readLegends() {
  try {
    const raw = fs.readFileSync(LEGENDS_FILE, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function writeLegends(data) {
  fs.writeFileSync(LEGENDS_FILE, JSON.stringify(data, null, 2), "utf8");
}

const server = http.createServer((req, res) => {
  if (req.url === "/api/db" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(readDB()));
    return;
  }

  if (req.url === "/api/db" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        writeDB(data);
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ ok: false, error: "Invalid JSON" }));
      }
    });
    return;
  }

  if (req.url === "/api/legends" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify(readLegends()));
    return;
  }

  if (req.url === "/api/legends" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body || "{}");
        writeLegends(data);
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify({ ok: false, error: "Invalid JSON" }));
      }
    });
    return;
  }

  const staticFile = STATIC_FILES[req.url];
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

  if (req.url === "/" || req.url === "/index.html") {
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
  console.log(`Data is saved to ${DB_FILE}`);
});
