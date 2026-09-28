# Tu Tien Chi Lo - LeetCode

A personal web app for tracking LeetCode practice through a cultivation-themed progression system. Each solved LeetCode problem is recorded as a "technique", which updates the user's realm, title, goals, and practice streak.

## How to Open and Run the App

### Recommended: run the local server

Requirement: 
* [Node.js](https://nodejs.org/) must be installed.

1. Open Terminal or PowerShell in the project directory.
2. Run:

   ```bash
   npm start
   ```

3. Open a browser and visit:

   ```text
   http://localhost:3000
   ```

To stop the app, return to the Terminal window and press `Ctrl + C`.

> The project only uses Node.js built-in modules, so no additional packages need to be installed with `npm install`.

### Deploy with Docker Compose on a Hostinger VPS

Docker Compose requires a Hostinger VPS with Docker Engine and the Compose plugin; it is not supported by shared hosting plans.

1. Upload or clone this project onto the VPS.
2. From the project directory, run:

   ```bash
   docker compose up -d --build
   ```

3. Allow inbound TCP port `3000` in the Hostinger VPS firewall, then open `http://<VPS-IP>:3000`.

Set `APP_PORT` to publish a different host port, for example `APP_PORT=8080 docker compose up -d --build`. For a custom domain and HTTPS, configure a reverse proxy on the VPS to forward requests to port `3000`.

The `app-data` Docker volume stores each player's `db_<slug>.json` and `truyenky_<slug>.json` files. New player files are created when a player is selected or created, and the volume survives container rebuilds. `docker compose down` keeps this data; `docker compose down -v` deletes it.

### Open the HTML file directly

You can open `Tu Tiên Chi Lộ — LeetCode.html` directly in a browser. In this mode, the app stores data in the browser's `localStorage` instead of the JSON files. Some browsers may restrict features when opening a local file, so running the local server is more reliable.

## Main Features

- Support multiple players on the same deployment. On first launch, or when no active player is stored in the browser, choose an existing player or create a new one from the **Chọn đạo hữu** dialog. Use **Đổi đạo hữu** in the header to switch players at any time.
- Support multiple cultivation paths (**đạo**) per player, each with its own topics, practice-language options, daily target, goal, and legendary stories. Switch between paths from **Thiết Lập Thiên Đạo → Chọn Đạo Tu Luyện**. Currently available:
  - **Kiếm Đạo (LeetCode)**: the original 16 topics, recorded with a programming language (Python 3, JavaScript, TypeScript).
  - **Thương Đạo (BA)**: two topics, **Thiên Cơ Yếu Quyết (Kiến thức ngành)** and **Giải Nghiệp Chân Kinh (Solution)**. The practice-language options change based on the selected topic — industry domains (Banking/Fintech, Insurance, Investment/Wealth Management, E-commerce/Payment, EdTech/Education, Travel/International business, Healthcare IT) for Kiến thức ngành, or BA roles (ERP/CRM BA, Product BA, System/Data BA) for Solution.
- Set a cultivation name, daily practice target, and overall problem-solving goal.
- Record solved LeetCode problems with their topic, programming language, and solution code.
- Track progress across 16 topics, including **Chư Thiên Vạn Nghệ** for practice outside LeetCode.
- Automatically calculate cultivation realms and titles based on the total number of recorded techniques.
- Break through tribulations from Hóa Thần onward by solving six additional techniques for each breakthrough. The minimum overall goal is 39 techniques.
- View practice streaks and a calendar covering the last 30 days.
- Search recorded problems by name or filter them by topic.
- Write legendary stories for newly unlocked realms.
- Track low-, mid-, and high-grade spirit stones, artifacts, treasures, and elixirs in the **Nhẫn Trữ Vật** tab.
- Use the **Tông Môn** tab, shown before **Tu Luyện**, to create a sect profile. It starts at “Chưa bái nhập” and lets the player enter a sect name, each relationship's name and description (master, shizun, senior and junior fellow disciples, and dao companion), and a freeform sect description.
- Record joining, leaving, or expulsion from a sect. Leaving or expulsion preserves the profile for the character's story.
- Click any text area to edit its contents in a larger pop-up, then apply or cancel the change.
- Save multiple avatar and background links, choose the active image, and customize avatar cropping, interface colors, and panel opacity.

## Quick Usage Guide

1. Open **Thiết Lập Thiên Đạo** to set the daily target and overall goal.
2. Open **Tu Luyện**, then choose a topic and programming language.
3. Enter the LeetCode problem name and paste the solution code.
4. Click **Đột Phá Cảnh Giới** to save the technique.
5. Review statistics in **Công Pháp**, **Lịch Tu Tập**, and **Lộ Trình Vấn Đạo**.
6. When a new realm is unlocked, open **Truyền Kỳ** to add to the character's story.
7. Open **Nhẫn Trữ Vật** to update spirit-stone amounts and write inventory notes, then click **Lưu nhẫn trữ vật**.
8. Open **Tông Môn** and click **Bái nhập tông môn** to create a profile. Fill in any applicable relationship names and descriptions plus the sect description, then click **Lưu thông tin tông môn**. Use **Rời khỏi tông môn** or **Bị trục xuất khỏi sư môn** to record how the character leaves; the profile remains saved.

## Data Storage

Each player's data is stored in its own pair of files, named after the player's cultivation name with diacritics removed and spaces joined (e.g. "Ngọc Lạc Thần" → `ngoclacthan`):

- `db_<slug>.json`: cultivation name, interface settings, inventory contents, sect profile/status, and per-đạo data (active đạo selection, plus each đạo's daily target, overall goal, and saved problems).
- `truyenky_<slug>.json`: legendary story content, grouped per đạo.

When running with the local server, the `/api/players` endpoint lists all `db_<slug>.json` files found next to the server (or in `DATA_DIR`) to populate the player picker. If a legacy single-player `db.json`/`truyenky.json` pair exists and no `db_<slug>.json` files are present yet, the server automatically migrates them into the new per-player format on startup.

When opening the HTML file directly, data is stored in the browser's `localStorage`, scoped per player in the same way.

Back up a player's JSON files before making major changes. The **Chuyển kiếp** button in **Lịch Tu Tập** permanently deletes all saved progress, inventory contents, sect information, and story data for the active player only.

## Main Project Files

- `Tu Tiên Chi Lộ — LeetCode.html`: page structure and interface.
- `app.js`: application logic, progress calculations, player selection, and data persistence.
- `styles.css`: styling and responsive layout.
- `server.js`: local server, multi-player JSON data API, and legacy data migration.
- `db_<slug>.json`: a player's current cultivation progress.
- `truyenky_<slug>.json`: a player's legendary story data.
