# TeamSpace - Electron Desktop App

TeamSpace can run as a native desktop application using Electron.

## Features

- **Frameless window** with custom title bar
- **macOS-style traffic light controls** (red, yellow, green)
- **Native window controls**: minimize, maximize/restore, close
- **Custom drag region** for moving the window
- **1200×800 default size** with 1000×700 minimum dimensions

## Development

Run the app in development mode (hot reload enabled):

```bash
npm run electron:dev
```

This will:
1. Start the Next.js development server on http://localhost:3000
2. Wait for the server to be ready
3. Launch the Electron window

## Building for Production

Build a Windows installer:

```bash
npm run electron:build
```

This will:
1. Build the Next.js app for production
2. Create an Electron package
3. Generate a Windows installer in the `dist` folder

## Architecture

- **electron/main.js** - Electron main process (window management, IPC handlers)
- **electron/preload.js** - Secure IPC bridge between main and renderer
- **src/components/TitleBar.tsx** - Custom title bar with window controls
- **src/types/electron.d.ts** - TypeScript definitions for window.electronAPI

## Window Controls

The custom title bar provides three buttons:
- **Red** (left): Close the application
- **Yellow** (center): Minimize to taskbar
- **Green** (right): Maximize/restore window size

## Notes

- The title bar only renders when running in Electron (not in browser)
- In development, DevTools are opened automatically
- The window background color matches the app theme (#0A0A0A)
