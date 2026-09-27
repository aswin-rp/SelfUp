# SelfUp — your personal productivity app

This is the full app: Tasks, Habits (with a heatmap), Journal, and a simple Savings tracker,
all on one dashboard. It syncs between devices because everything is stored in Supabase
(a free hosted database), not on one device.

Follow these steps in order. Do each one fully before moving to the next.

## Step 1 — Install Node.js (if you haven't already)

Go to nodejs.org, download the **LTS** version, install it. Confirm by opening Command
Prompt and typing `node -v` — you should see a version number.

## Step 2 — Unzip this project

Unzip the folder you downloaded somewhere easy to find, e.g. `C:\Users\YourName\selfup`.

## Step 3 — Open it in VS Code

Open VS Code → File → Open Folder → select the `selfup` folder.

## Step 4 — Install the project's dependencies

In VS Code, open a terminal: **Terminal → New Terminal**. Then type:

```
npm install
```

This downloads all the code libraries the app depends on (React, Supabase's client, etc.)
into a `node_modules` folder. This can take a minute.

## Step 5 — Create your Supabase project

1. Go to supabase.com and sign up (free).
2. Click **New Project**. Give it any name, set a database password (save it somewhere),
   pick the region closest to you.
3. Wait about a minute for it to finish setting up.

## Step 6 — Create the database tables

1. In your Supabase project, click **SQL Editor** in the left sidebar → **New query**.
2. Open the file `supabase/schema.sql` from this project (in VS Code), copy all of it.
3. Paste it into the Supabase SQL editor and click **Run**.

This creates the tables for tasks, habits, journal entries, and savings goals, and locks
each row so only the person who created it can see or edit it.

## Step 7 — Connect the app to your Supabase project

1. In Supabase, go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.
3. In VS Code, duplicate the file `.env.example` and rename the copy to `.env`.
4. Paste your URL and key into `.env` so it looks like:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

Never share this `.env` file publicly — the `.gitignore` file already makes sure GitHub
won't see it.

## Step 8 — Run the app locally

In the VS Code terminal:

```
npm run dev
```

It will print a local address like `http://localhost:5173`. Open that in your browser.
You should see a sign-in screen. Click "Sign up", create an account with any email/password
(6+ characters), then sign in.

If Supabase asks for email confirmation and you don't receive an email, go to
**Authentication → Providers → Email** in Supabase and turn off "Confirm email" for
easier testing — you can turn it back on later.

## Step 9 — Try it out

Add a task, mark a habit complete on today's date, write a journal entry, add a savings
goal. Everything should appear on the Dashboard.

## Step 10 — Put it online (so your phone can reach it too)

This step needs GitHub and Vercel accounts — tell me when you're ready and I'll walk you
through pushing this code to GitHub and deploying it on Vercel for free, then installing
it on your Android phone as an app (PWA).

## Project structure (for reference)

```
src/
  pages/       one file per screen (Dashboard, Tasks, Habits, Journal, Savings, Login)
  components/  reusable pieces (TaskForm, HabitHeatmap, etc.)
  contexts/    shared app-wide state (who's logged in)
  lib/         the Supabase connection
  types/       shared TypeScript definitions
supabase/
  schema.sql   the database structure — only needs to be run once
```

Each feature lives in its own page file, so adding a new feature later means adding a new
page and, if needed, a new table — without touching the others.

## Notifications

Not built yet, on purpose — that's Stage 4 in our plan, after tasks are solid. The task
form already has the on/off toggle and stores your notification preferences (time, repeat)
in the database, so nothing needs to change there when we add real notifications later.
