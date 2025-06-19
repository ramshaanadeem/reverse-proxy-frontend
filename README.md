# 🔁 Reverse Proxy Frontend

A modern React + Vite dashboard to manage and monitor a reverse proxy server. Built using **Tailwind CSS**, **shadcn/ui**, **lucide-react**, and **React Router**, this frontend allows users to configure blacklists, whitelists, authentication tokens, and view request logs in real time.

---

## 🚀 Features

- 🔐 Authentication (JWT token-based)
- ⚙️ Proxy settings UI (toggle cache, logging, etc.)
- 📜 View and filter request logs
- ✅ Manage endpoint whitelist and blacklist
- 🧪 Test proxy requests via UI
- 🎨 Built using shadcn/ui components & Tailwind CSS

---

## 📦 Getting Started

### Prerequisites

- Node.js v16+
- npm or pnpm

### Setup

```bash
git clone https://github.com/ramshaanadeem/reverse-proxy-frontend.git
cd reverse-proxy-frontend
npm install
```
 ### Run Development
 ```
npm run dev
```

The frontend assumes the backend proxy server (from your reverse-proxy-server) is running on:

http://localhost:5000

You can adjust the base API URL inside **src/lib/api-client.ts**.

