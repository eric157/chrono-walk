# Deployment Guide

## GitHub Pages (Frontend Only)

### Automatic with GitHub Actions
```bash
git push origin main
```
GitHub Actions auto-deploys to GitHub Pages.

### Manual Deploy
```bash
cd frontend
npm run deploy
```

## Backend API (Optional)

Deploy FastAPI backend to:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Heroku**: https://www.heroku.com

```bash
cd backend
python -m uvicorn main:app --reload
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on GitHub | Check `vite.config.js` base URL |
| Old version showing | Hard refresh: Ctrl+Shift+R |
| Build failed | Check GitHub Actions logs |

See README.md for full project info.
