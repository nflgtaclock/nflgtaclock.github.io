# Droughts in Vice & Liberty (`nflgtaclock.github.io`)

Measuring NFL franchise postseason misery in Grand Theft Auto release eras across all 32 teams. Inspired by an NFLSE conversation during the Ravens "rebuild your franchise" video in 2026.

**Live Organization Site:** https://nflgtaclock.github.io/

## Local Development

```bash
npm install
npm run dev
```

## Deploying to the `nflgtaclock` GitHub Organization Page

1. Create a public repository named **`nflgtaclock.github.io`** under the [`nflgtaclock`](https://github.com/nflgtaclock) organization.
2. Push this codebase to the `main` branch:
   ```bash
   git init -b main
   git add .
   git commit -m "Initial deploy: Droughts in Vice & Liberty"
   git remote add origin https://github.com/nflgtaclock/nflgtaclock.github.io.git
   git push -u origin main
   ```
3. In GitHub, open **Settings → Pages** for `nflgtaclock/nflgtaclock.github.io` and set **Build and deployment → Source** to **GitHub Actions**.
4. The included `.github/workflows/deploy.yml` workflow will build the Vite bundle and publish it to **`https://nflgtaclock.github.io/`** on every push to `main`.
