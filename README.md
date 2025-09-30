# datahaven
# DataHaven Quiz (Local Web App)

A simple mobile/desktop-friendly quiz app built with HTML/CSS/JS. It includes:

- Seeded 20 DataHaven questions shown one-by-one with Next/Submit.
- Add-only form so users can add their own questions with a Discord name.
- Admin-only removal via code prompt.
- Weekly leaderboard (top 1 earns 5 keys/week – informational note).
- Local storage persistence. Export/Import buttons for backup.

## Run

- Open `index.html` in any modern browser (Chrome/Edge/Firefox). No server required.

## Tabs

- **Quiz**: Enter Discord name and start. One question per page. Next/Submit at the end. Score saved to weekly leaderboard.
- **Add Question**: Add new multiple-choice questions with options A–D, choose the correct answer, and include your Discord name. Only add is allowed.
- **Leaderboard**: Shows best score per user for current week (ISO week). Resets logically every Monday 00:00 (based on ISO week id). Also shows contribution counts.
- **Admin**: Enter admin code to unlock Delete for user-added questions. Seed questions cannot be deleted.

## Admin Code

- Default admin code: `datahaven-admin`
- Change it inside `app.js` at `ADMIN_CODE`.

## Data

- Stored in browser localStorage keys:
  - `dh_user_questions` – user-added questions
  - `dh_scores` – quiz attempts with name, score, weekId, timestamp

Use Export/Import in footer to backup/restore JSON.

## Branding

- The app shows the project name: DataHaven. A simple inline logo placeholder is used in `styles.css`. You can replace with your own image or the provided logo.

## Notes

- If you need to merge user-added questions into the quiz rotation, you can update `startQuiz()` in `app.js` to include `getUserQuestions()`.
- For a multi-user production setup, connect a backend/database and replace localStorage with API calls.
