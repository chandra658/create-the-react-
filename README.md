# Food Recipe App (React + Vite)

A React single-page version of the Food Recipe App. Recipe information is loaded from TheMealDB API, alongside user-contributed recipes stored in browser Local Storage.

## Key Features
- **Recipe Exploration:** Browse, search, filter by cuisine and category.
- **User Module & Profile:** Dedicated dashboard for registered users to manage their recipes, track culinary progress, and earn titles.
- **Add Recipe:** Create and publish custom recipes with names, categories, cuisines, ingredients, step-by-step instructions, and photo URLs.
- **👨‍🍳 Chef Title Reward System:** When a user publishes **more than 10 recipes** (> 10), they automatically unlock the prestigious **Chef** title. The title is displayed across the header, user module, published recipe cards, and admin dashboard.
- **Quick Testing Helpers:** Buttons to autofill sample recipes or instantly add 11 sample recipes to verify the Chef title threshold without manual typing.
- **Admin Dashboard:** Monitor registered users, inspect recipes published per user, and verify Chef designations.

## Requirements
- Node.js 20.19+ or 22.12+
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (normally http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Demo Accounts
- **Admin Account:**
  - Email: `admin@foodrecipe.com`
  - Password: `admin123`
- **User Account:**
  - Create any account via **Sign Up** to test the User Module, or sign in with an existing user.

## Local Storage keys
- `users`: registered demo accounts (includes `title: 'Chef'` for qualifying users)
- `loggedInUser`: current demo login session
- `userRecipes`: recipes created and published by users
- `savedRecipes`: saved / bookmarked recipe objects

## Deploy to Vercel
1. Push this folder to a GitHub repository.
2. In Vercel choose **Add New → Project**, import the repository.
3. Framework preset: **Vite**; Build command: `npm run build`; Output directory: `dist`.
4. Click **Deploy**. The included `vercel.json` supports React Router page refreshes.
