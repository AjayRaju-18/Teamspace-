# TeamSpace

A modern team collaboration platform built with Next.js, featuring real-time messaging, video calls, and cloud storage integration.

## Features

- 🔐 **Google OAuth Authentication** via Supabase
- 💬 **Team Channels & Direct Messages** - Slack/Discord-inspired interface
- 📹 **Video/Voice Calls** - Powered by Daily.co
- 📁 **Google Drive Integration** - View and upload files
- 🎨 **Modern UI** - Dark theme with smooth animations
- 💻 **Desktop App** - Native Windows application with Electron

## Quick Start

### Run in Browser

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run as Desktop App

```bash
npm install
npm run electron:dev
```

A native desktop window will open with custom window controls!

**📖 See [QUICK_START.md](./QUICK_START.md) for detailed Electron usage.**

## Project Structure

```
teamspace/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   └── lib/              # Utilities (Supabase client)
├── electron/             # Electron desktop app files
├── public/               # Static assets
└── supabase/             # Database migrations
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run Next.js dev server (browser) |
| `npm run build` | Build for production |
| `npm run electron:dev` | Run Electron desktop app |
| `npm run electron:build` | Build Windows installer |

## Technology Stack

- **Framework**: Next.js 16.3 (App Router)
- **UI**: React 19, Tailwind CSS 4, Framer Motion
- **Auth**: Supabase (Google OAuth)
- **Video**: Daily.co
- **Storage**: Google Drive API
- **Desktop**: Electron

## Environment Variables

Create a `.env.local` file (see `.env.local.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
DAILY_API_KEY=your_daily_api_key
```

## Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started with Electron desktop app
- **[HOW_TO_USE_ELECTRON.md](./HOW_TO_USE_ELECTRON.md)** - Complete Electron usage guide
- **[ELECTRON.md](./ELECTRON.md)** - Technical architecture details

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Daily.co API](https://docs.daily.co/)

## Deploy

### Web Deployment (Vercel)

```bash
npm run build
```

Deploy to [Vercel Platform](https://vercel.com/new) - the easiest way to deploy Next.js apps.

### Desktop Distribution

```bash
npm run electron:build
```

Find the Windows installer in the `dist/` folder. Share `TeamSpace Setup.exe` with users!

## License

Private project - All rights reserved.
