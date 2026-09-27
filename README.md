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

### Open the HTML file directly

You can open `Tu Tiên Chi Lộ — LeetCode.html` directly in a browser. In this mode, the app stores data in the browser's `localStorage` instead of the JSON files. Some browsers may restrict features when opening a local file, so running the local server is more reliable.

## Main Features

- Set a cultivation name, daily practice target, and overall problem-solving goal.
- Record solved LeetCode problems with their topic, programming language, and solution code.
- Track progress across 15 topics with cultivation-style names that retain the original topic in parentheses.
- Automatically calculate cultivation realms and titles based on the total number of recorded techniques.
- Break through tribulations from Hóa Thần onward by solving six additional techniques for each breakthrough. The minimum overall goal is 39 techniques.
- View practice streaks and a calendar covering the last 30 days.
- Search recorded problems by name or filter them by topic.
- Write legendary stories for newly unlocked realms.
- Track low-, mid-, and high-grade spirit stones, artifacts, treasures, and elixirs in the **Nhẫn Trữ Vật** tab.
- Customize the avatar, background image, interface colors, and panel opacity.

## Quick Usage Guide

1. Open **Thiết Lập Thiên Đạo** to set the daily target and overall goal.
2. Open **Tu Luyện**, then choose a topic and programming language.
3. Enter the LeetCode problem name and paste the solution code.
4. Click **Đột Phá Cảnh Giới** to save the technique.
5. Review statistics in **Công Pháp**, **Lịch Tu Tập**, and **Lộ Trình Vấn Đạo**.
6. When a new realm is unlocked, open **Truyền Kỳ** to add to the character's story.
7. Open **Nhẫn Trữ Vật** to update spirit-stone amounts and write inventory notes, then click **Lưu nhẫn trữ vật**.

## Data Storage

When running with the local server:

- `db.json`: cultivation name, goals, saved problems, interface settings, and inventory contents.
- `truyenky.json`: legendary story content.

When opening the HTML file directly, data is stored in the browser's `localStorage`.

Back up both JSON files before making major changes. The **Chuyển kiếp** button in **Lịch Tu Tập** permanently deletes all saved progress, inventory contents, and story data.

## Main Project Files

- `Tu Tiên Chi Lộ — LeetCode.html`: page structure and interface.
- `app.js`: application logic, progress calculations, and data persistence.
- `styles.css`: styling and responsive layout.
- `server.js`: local server and JSON data API.
- `db.json`: current cultivation progress.
- `truyenky.json`: legendary story data.
