# BusQueue Frontend

This is a [Next.js](https://nextjs.org/) project bootstrapped with Tailwind CSS and Turbo.

## Getting Started

First, install the dependencies:

```bash
npm install
```
"# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.


```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Turbo** - Build system
- **JavaScript** - Programming language
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **React Icons** - Icon library

## Backend Connection

The frontend connects to the backend API at `http://localhost:3001/api` by default.

Set `NEXT_PUBLIC_VERCEL_BACKEND_URL` in `.env.local` / Vercel env vars to change the backend host (example: `https://your-backend.vercel.app`).

If `NEXT_PUBLIC_VERCEL_BACKEND_URL` is not set, the app falls back to `NEXT_PUBLIC_API_URL`.

### Authentication

- JWT tokens are stored in localStorage
- Tokens are automatically included in API requests
- Use `logout()` from `lib/auth.js` to clear session

### API Client

All API calls go through `lib/api_client.js` which:
- Handles authentication headers
- Transforms responses
- Manages errors
- Converts snake_case to camelCase