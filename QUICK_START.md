# TeamSpace Desktop - Quick Start Guide

## 🚀 Run the Desktop App

Open your terminal in the `teamspace` folder and run:

```bash
npm run electron:dev
```

**That's it!** The TeamSpace window will open in a few seconds.

---

## 🎮 Using the App

### Window Controls
```
┌─────────────────────────────────────────┐
│ 🔴 🟡 🟢    TeamSpace                   │  ← Drag here to move
├─────────────────────────────────────────┤
│                                         │
│         Your TeamSpace App              │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

- **🔴 Red** → Close app
- **🟡 Yellow** → Minimize  
- **🟢 Green** → Maximize/Restore

### Drag to Move
Click and hold anywhere on the **top bar** (where it says "TeamSpace") and drag to move the window.

---

## 🛠️ Build an Installer

Want to share TeamSpace with others?

```bash
npm run electron:build
```

Find your installer in the `dist` folder:
- `TeamSpace Setup 0.1.0.exe`

Double-click to install on any Windows PC!

---

## 🔄 Development Workflow

### 1. Start Development
```bash
npm run electron:dev
```

### 2. Make Changes
Edit any file in `src/` - the app will auto-refresh!

### 3. Stop Development
Press `Ctrl+C` in the terminal

---

## 💡 Tips

- **First run?** Electron downloads automatically (~200MB, one time only)
- **DevTools open?** That's normal in dev mode - use it to debug!
- **Want browser mode?** Use `npm run dev` instead (no Electron)
- **Title bar missing in browser?** It only shows in Electron desktop app

---

## ❓ Common Issues

### Electron won't start?
- Wait for "Downloading Electron binary..." to complete
- Make sure port 3000 isn't in use
- Try: Close terminal, reopen, run `npm run electron:dev` again

### "Cannot find module"?
```bash
npm install
```

### Build fails?
Make sure you run `npm run build` first (Next.js build) before Electron build.

---

## 📚 More Information

- **Technical details**: See `ELECTRON.md`
- **Full usage guide**: See `HOW_TO_USE_ELECTRON.md`
- **Project setup**: See `README.md`

---

**Enjoy your TeamSpace desktop app!** 🎉
