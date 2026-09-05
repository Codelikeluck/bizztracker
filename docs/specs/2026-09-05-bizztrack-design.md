# BizzTrack Design Spec

## Overview
BizzTrack is a general business toolkit web app designed to run on a cPanel subdomain as a static site.

## Tech Stack
- React 18 + Vite (static build)
- Tailwind CSS (Figma design tokens)
- React Router v6 (client-side routing)
- LocalStorage (data persistence)
- bcrypt.js (PIN/password hashing)

## Modules
1. **Dashboard** - KPI cards, recent activity, quick actions
2. **Contacts** - CRUD contacts, search, groups
3. **Tasks** - Create/track tasks, status, priority, due dates
4. **Notes** - Rich text notes, categories, search
5. **Calendar** - Month/week view, events

## Security
- PIN/password login screen
- bcrypt hashed storage
- Session timeout (30 min inactivity)
- CSRF token protection

## Deployment
- `npm run build` outputs to `dist/`
- Upload `dist/` contents to cPanel subdomain
- No server-side code required
