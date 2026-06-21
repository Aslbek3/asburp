# CorePanel

VPS/hosting boshqaruv admin paneli — bir nechta serverni, ulardagi PM2 jarayonlarini, nginx domenlarini va SSL sertifikatlarini bitta joydan kuzatish va boshqarish uchun.

🔗 Ishlab turgan nusxa: **https://paneluz.duckdns.org**

## Imkoniyatlar

Panel **shu turgan serverning o'zida** ishlaydi va o'zi ustida ishlab turgan VPS'ni to'g'ridan-to'g'ri (SSH'siz) kuzatadi, qolgan barcha qo'shilgan serverlarni esa SSH orqali masofadan monitoring qiladi.

- **Dashboard** — CPU/RAM/Disk/Tarmoq real vaqtda (har soniyada), CPU tarixi grafigi, PM2 jarayonlar, real ogohlantirishlar (disk to'lishi, crash-loop, offline server, tugayotgan SSL), nginx domenlari, va ishlaydigan tezkor amallar (`nginx -t`, `ufw status`, `pm2 save` va h.k.)
- **Serverlar** — har bir VPS uchun CPU/RAM/Disk, load average, uptime, PM2 jarayon ro'yxati; "Yangi server qo'shish" orqali istalgan VPS'ni SSH kalit bilan ulash
- **Domenlar** — `/etc/nginx/sites-enabled/` dan real domen ro'yxati + SSL muddati (`openssl x509`)
- **Loyihalar, Deploy, Loglar, SSL, Databaselar, Fayllar, Email, Sheriklar, Audit, Sozlamalar** — qolgan sahifalar (hozircha qisman mock, bosqichma-bosqich real ma'lumotga o'tkazilmoqda)

## Texnologiyalar

- **Next.js 16** (App Router, Turbopack) + **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme`, alohida `tailwind.config.ts` yo'q)
- **Zustand** — UI/auth/server holatlari (localStorage persisted)
- **TanStack Query** — server state, avtomatik real-vaqt yangilanish (`refetchInterval`)
- **Recharts**, **Radix UI** (Dialog/Switch/Tabs), **cmdk** (⌘K buyruqlar paleti), **sonner** (toast)
- Backend: Next.js **Route Handlers** (`app/api/*`) — Node `os`/`child_process`/`fs` orqali to'g'ridan-to'g'ri tizimni o'qiydi, alohida server kerak emas

## Loyiha tuzilmasi

```
app/
  (app)/          — autentifikatsiya talab qiladigan sahifalar (Dashboard, Servers, Domains, ...)
  login/          — login sahifasi (shell'siz)
  api/            — backend route handler'lar (servers, processes, metrics, domains, alerts, deploys, vps, ...)
components/       — sahifa va umumiy (shared) komponentlar
hooks/            — TanStack Query wrapper'lar
lib/
  system-metrics.ts   — shu VPS'ning real CPU/RAM/Disk/PM2 ma'lumotlari (os/proc/pm2 jlist)
  remote-metrics.ts   — qo'shilgan VPS'larga SSH orqali ulanib metrika olish
  nginx-domains.ts    — /etc/nginx/sites-enabled dan real domen+SSL ma'lumoti
  live-alerts.ts      — real metrikalardan dinamik ogohlantirish generatsiyasi
  cpu-sampler.ts      — CPU tarixi uchun xotiradagi ring-buffer sampler
  vps-store.ts        — qo'shilgan masofaviy VPS ulanishlari (data/vps-connections.json, gitignored)
  mock-data.ts, api.ts, types.ts — hali real qilinmagan sahifalar uchun mock ma'lumot
store/            — Zustand store'lar
```

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:3000
```

Productionda:

```bash
npm run build
npm run start -- -p 3003
```

PM2 bilan:

```bash
pm2 start npm --name corepanel-frontend --cwd <loyiha-yo'li> -- start -- -p 3003
pm2 save
```

## Yangi VPS qo'shish

1. Yangi serverda monitoring foydalanuvchi yarating (sudo shart emas, faqat o'qish huquqlari kifoya):
   ```bash
   useradd -m -s /bin/bash corepanel
   ```
2. Panel serverida generatsiya qilingan SSH public key'ni o'sha foydalanuvchining `~/.ssh/authorized_keys` ga qo'shing.
3. Dashboard → **Serverlar** → **Yangi server qo'shish** orqali nom, IP, SSH port va foydalanuvchi nomini kiriting.

Panel SSH orqali ulanib `top`/`free`/`df`/`pm2 jlist` natijasini o'qiydi va serverni avtomatik ro'yxatga qo'shadi; ulanib bo'lmasa "offline" deb ko'rsatadi.

## Muhit o'zgaruvchilari

Hozircha alohida `.env` shart emas — barcha ma'lumot to'g'ridan-to'g'ri shu VPS'dan o'qiladi. Masofaviy VPS ulanishlari `data/vps-connections.json` da saqlanadi (git'ga tushmaydi).
