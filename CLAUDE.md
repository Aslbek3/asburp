@AGENTS.md

# CorePanel — loyiha holati

## Loyiha nima

CorePanel — VPS/hosting boshqaruv admin paneli. Dizayn manbasi: claude.ai/design
loyihasi "Admin dashboard design Q&A" (handoff: `CorePanel.dc.html`, 15 sahifa,
o'zbek tilida spec). Hozir bu panel **shu VPS'ning o'zida** ishlab turadi va
o'zi ustida ishlayotgan serverni real monitoring qiladi.

🔗 Production: **https://paneluz.duckdns.org** (login: `aslbek` / parol siz bilan)

## Joylashuv (MUHIM)

Loyiha shu VPS'da: **`/root/projects/web/corepanel-frontend`**. GitHub repo:
`https://github.com/Aslbek3/asburp` (branch: `master`). Eski Windows
(`D:\Projects\admin-panel`) versiyasi endi ahamiyatsiz — bu fayl shu joy
uchun yozilgan.

PM2 jarayon nomi: **`corepanel-frontend`**, port **3003**. Nginx orqali
`paneluz.duckdns.org` ga proxy qilingan (SSL — Certbot).

```bash
cd /root/projects/web/corepanel-frontend
npm run build
pm2 restart corepanel-frontend
pm2 save
```

## Frontend — holati: tayyor

Stek: Next.js 16 (App Router, Turbopack) + TypeScript (strict) + Tailwind
CSS v4 (CSS-first `@theme`, `tailwind.config.ts` yo'q) + Zustand + TanStack
Query + Recharts + Lucide + cmdk + sonner + Radix (Dialog/Switch/Tabs).

15 sahifa: Dashboard (`/`), Serverlar (`/servers`, `/servers/[id]`),
Loyihalar (`/projects`), Deploy (`/deploy`), Loglar (`/logs`), Domenlar
(`/domains`), SSL (`/ssl`), Databaselar (`/databases`), Fayllar (`/files`),
Email (`/email`), Sheriklar (`/team`), Audit (`/audit`), Sozlamalar
(`/settings`), Login (`/login`).

## Backend — holati: QISMAN REAL (Dashboard + Servers to'liq real)

Backend alohida xizmat emas — Next.js **Route Handler**'lar (`app/api/*`),
shu VPS'ni to'g'ridan-to'g'ri Node `os`/`child_process`/`fs` orqali o'qiydi.
SSH faqat **qo'shilgan boshqa VPS'lar** uchun ishlatiladi (shu serverning
o'ziga emas).

### Real qilingan qismlar

| Qism | Fayl | Manba |
|---|---|---|
| CPU/RAM/Disk/Load/Uptime (shu VPS) | `lib/system-metrics.ts` | `os`, `/proc`, `df` |
| Dashboard metrikalari (1s polling, silliqlangan) | `app/api/metrics/route.ts` | yuqoridagi + EMA smoothing |
| CPU tarixi grafigi | `lib/cpu-sampler.ts` | xotiradagi ring-buffer, har 60s sample |
| PM2 jarayonlar (shu VPS) | `app/api/processes/route.ts` | `pm2 jlist` |
| Serverlar ro'yxati | `app/api/servers/route.ts` | local + masofaviy (pastga qarang) |
| Masofaviy VPS monitoring | `lib/remote-metrics.ts` | SSH (`top`/`free`/`df`/`pm2 jlist`) |
| Domenlar | `lib/nginx-domains.ts` → `app/api/domains/route.ts` | `/etc/nginx/sites-enabled/*` + `openssl x509` (SSL muddati) |
| Ogohlantirishlar | `lib/live-alerts.ts` → `app/api/alerts/route.ts` | disk>=80%, crash-loop (restart>=8 va uptime<5min), offline VPS, tugayotgan SSL |
| Deploylar (PM2 asosida) | `app/api/deploys/route.ts` | `pm2 jlist` dagi oxirgi restartlar (haqiqiy CI/CD emas, proksi) |
| Tezkor amallar | `app/api/quick-actions/route.ts` | `nginx -t`, `ufw status`, `crontab -l`, `pm2 save`, `authorized_keys` soni |
| Login | `app/api/auth/login/route.ts` | `.env` dagi `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH` (sha256, timingSafeEqual) |

### Hali MOCK qolgan qismlar

Loyihalar (`/projects`), SSL sahifasi (`/ssl` — alohida, Domains'dagidan
farqli), Databaselar, Fayllar, Email, Sheriklar (Team), Audit, Sozlamalar.
Manba: `lib/mock-data.ts` (faqat shu qismlar uchun ishlatiladi).

## Ko'p-VPS qo'llab-quvvatlash

- `lib/vps-store.ts` — qo'shilgan masofaviy VPS'lar ro'yxati,
  `data/vps-connections.json` da saqlanadi (**gitignored**, IP/user bor).
- `app/api/vps/route.ts` (GET/POST) va `app/api/vps/[id]/route.ts` (DELETE).
- UI: Servers sahifasidagi **"Yangi server qo'shish"** tugmasi →
  `components/servers/AddServerModal.tsx` → `POST /api/vps`.
- SSH kalit: **`/root/.ssh/corepanel_backend_ed25519`** (shu VPS'da
  generatsiya qilingan, faqat OUTBOUND — bu serverdan boshqa VPS'larga
  ulanish uchun). Yangi VPS qo'shishda: o'sha serverda monitoring
  foydalanuvchi yaratiladi (sudo shart emas), uning
  `~/.ssh/authorized_keys`ga shu kalitning public qismi qo'shiladi.
- **MUHIM (xavfsizlik):** Hech qachon SSH private key yoki boshqa
  kalit/parolni chatga to'liq matn sifatida yozmang yoki so'ramang. Agar
  foydalanuvchi shunday qilsa — diskka yozib, undan keyin chatda
  takrorlamang/eslatmang.

## Auth

Bitta hardcoded admin: login/parol `.env` da (`ADMIN_USERNAME`,
`ADMIN_PASSWORD_HASH` — parolning sha256 hash'i, plaintext emas). Tekshirish
server-side (`app/api/auth/login/route.ts`, `timingSafeEqual`). Client-side
holat (`store/authStore.ts`, Zustand) faqat UI uchun — haqiqiy autentifikatsiya
emas, lekin parol hech qachon client bundle'da yo'q.

`.env` git'ga tushmaydi (`.gitignore`: `.env*`, faqat `!.env.example`
istisno — u shablon, haqiqiy qiymatsiz).

## Fayl tuzilmasi (qisqacha)

```
app/(app)/        — autentifikatsiya talab qiladigan sahifalar
app/login/        — login (shell'siz)
app/api/          — barcha backend route handler'lar
lib/system-metrics.ts, remote-metrics.ts, nginx-domains.ts,
    live-alerts.ts, cpu-sampler.ts, vps-store.ts  — real ma'lumot manbalari
lib/mock-data.ts, api.ts, types.ts, constants.ts  — mock + umumiy tiplar
hooks/            — TanStack Query wrapper'lar (refetchInterval bilan)
store/            — Zustand (UI/auth/server holatlari, localStorage)
components/       — sahifa va umumiy komponentlar
data/vps-connections.json — qo'shilgan masofaviy VPS'lar (gitignored)
```

## Eslatmalar

- Disk/CPU real vaqt o'qish 4 yadroli serverda qisqa sampling oynasi bilan
  shovqinli bo'ladi — `getCpuUsagePercent` 300ms sample + `/api/metrics`da
  EMA smoothing ishlatiladi. Bu qiymatni yana qisqartirmang (100-120ms
  spike beradi).
- GitHub push uchun token kerak (`gh auth status` orqali tekshiring;
  eskirgan bo'lsa foydalanuvchidan yangi PAT so'rang — xotiradagi
  `reference_github_token.md`ga qarang).
- Yangi sahifa/qismni real qilishda: avval `lib/`ga real ma'lumot manbai
  modul yozing, keyin `app/api/`da route handler, keyin `lib/api.ts`dagi
  `fetchX()` ni o'sha endpoint'ga `fetch()` qiluvchi qilib almashtiring —
  mock-data'dagi mos eksportni olib tashlang.
