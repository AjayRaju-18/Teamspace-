# How to Use TeamSpace Desktop App

## Quick Start

### Running in Development Mode

1. Open your terminal in the project folder
2. Run this command:
   ```bash
   npm run electron:dev
   ```
3. Wait a few seconds for the Next.js server to start
4. The TeamSpace desktop window will automatically open

### Using the Desktop App

#### Window Controls (Top-Left Traffic Lights)

- **🔴 Red button** - Close the app completely
- **🟡 Yellow button** - Minimize to taskbar
- **🟢 Green button** - Maximize to full screen (click again to restore)

#### Moving the Window

- Click and drag anywhere on the **top title bar** (the dark strip at the top)
- The window will move with your mouse

#### Features Available

All TeamSpace features work in the desktop app:

1. **Login** - Sign in with Google OAuth
2. **Workspace** - Access channels, DMs, and team chat
3. **Files** - View and upload files to Google Drive
4. **Video Calls** - Start voice/video calls with Daily.co

## Building for Distribution

### Create a Windows Installer

1. Build the production version:
   ```bash
   npm run electron:build
   ```

2. Find your installer in the `dist` folder:
   - Look for: `TeamSpace Setup X.X.X.exe`

3. Share this installer file with others
   - They can install TeamSpace on their Windows PC
   - No need for Node.js or npm on their computer

### Installing the App

1. Double-click `TeamSpace Setup.exe`
2. Follow the installation wizard
3. Launch TeamSpace from your Start Menu or Desktop

## Development Tips

### Hot Reload
- When running `npm run electron:dev`, changes to your code automatically refresh
- Edit any `.tsx`, `.ts`, or `.css` file
- The Electron window will reload with your changes

### Opening DevTools
- DevTools open automatically in development mode
- Use them to debug, inspect elements, or check console logs
- Press `F12` to toggle DevTools (if configured)

### Stopping the App

**From Terminal:**
- Press `Ctrl+C` to stop both Next.js and Electron

**From App Window:**
- Click the red 🔴 button to close

## Troubleshooting

### "Electron binary downloading..."
- First run downloads Electron (~200MB)
- Wait 1-2 minutes for download to complete
- Subsequent runs will be instant

### Window won't open
1. Check if port 3000 is available
2. Make sure no other Next.js dev server is running
3. Try closing and restarting with `npm run electron:dev`

### "Cannot find module" errors
- Run `npm install` to ensure all packages are installed
- Check that `electron/main.js` and `electron/preload.js` exist

### Title bar missing
- The custom title bar only shows in Electron
- It won't appear when running `npm run dev` in a browser
- This is expected behavior!

## File Structure

```
teamspace/
├── electron/
│   ├── main.js           # Electron main process
│   └── preload.js        # Security bridge
├── src/
│   ├── components/
│   │   └── TitleBar.tsx  # Custom window controls
│   └── types/
│       └── electron.d.ts # TypeScript definitions
├── dist/                 # Build output (created after build)
└── package.json          # Electron scripts & config
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run electron:dev` | Run in development mode with hot reload |
| `npm run electron:build` | Build Windows installer for production |
| `npm run dev` | Run Next.js only (browser mode, no Electron) |
| `npm run build` | Build Next.js only (no Electron) |

## Next Steps

1. **Customize the App**
   - Edit `electron/main.js` to change window size
   - Modify `src/components/TitleBar.tsx` for different controls
   - Update app icon and product name in `package.json`

2. **Add More Features**
   - System tray integration
   - Auto-updates
   - Native notifications
   - Custom keyboard shortcuts

3. **Deploy**
   - Build installer with `npm run electron:build`
   - Test on different Windows versions
   - Distribute via website, GitHub releases, or Microsoft Store

---

**Need help?** Check `ELECTRON.md` for technical architecture details.
