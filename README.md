# StudyPilot AI Starter - Local Auth Admin V3

A colorful Next.js product starter with:

- Local frontend-only login and sign up
- Hard-coded student/admin demo accounts
- Student My Page with orders and history
- Separate Admin page with all demo data and product editing UI
- Products showcase page with search/filter/sort interactions
- Settings page linked from the top navigation after login
- Colorful gradients and a self-contained SVG visual hero
- Multi-agent-style project analysis API mock

## Demo accounts

Student:

```txt
student@studypilot.ai
student123
```

Admin:

```txt
admin@studypilot.ai
admin123
```

## Run locally on Windows

```powershell
npm install
copy .env.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000
```

Login page:

```txt
http://localhost:3000/login
```

## Notes

This version does not require Supabase or OpenAI for local testing. Authentication is simulated in the browser using `localStorage`, so it is only for frontend demo purposes.

The placeholder `.env.local` values are fine for this local version. If you later add real Supabase auth, restore and configure the backend connection.


## v5 update
- Refined the home hero spacing and title scale so the first screen feels more balanced under the navigation bar.
