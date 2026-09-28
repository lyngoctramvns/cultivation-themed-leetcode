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

The `app-data` Docker volume stores `db.json` and `truyenky.json`; it is initialized from the project files on first startup and survives container rebuilds. `docker compose down` keeps this data; `docker compose down -v` deletes it.

### Open the HTML file directly

You can open `Tu Tiên Chi Lộ — LeetCode.html` directly in a browser. In this mode, the app stores data in the browser's `localStorage` instead of the JSON files. Some browsers may restrict features when opening a local file, so running the local server is more reliable.

## Main Features

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

When running with the local server:

- `db.json`: cultivation name, goals, saved problems, interface settings, inventory contents, and sect profile/status.
- `truyenky.json`: legendary story content.

When opening the HTML file directly, data is stored in the browser's `localStorage`.

Back up both JSON files before making major changes. The **Chuyển kiếp** button in **Lịch Tu Tập** permanently deletes all saved progress, inventory contents, sect information, and story data.

## Main Project Files

- `Tu Tiên Chi Lộ — LeetCode.html`: page structure and interface.
- `app.js`: application logic, progress calculations, and data persistence.
- `styles.css`: styling and responsive layout.
- `server.js`: local server and JSON data API.
- `db.json`: current cultivation progress.
- `truyenky.json`: legendary story data.
