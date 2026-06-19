@AGENTS.md

# CorePanel — loyiha holati

## Loyiha nima

CorePanel — VPS/hosting boshqaruv admin paneli. Dizayn manbasi: claude.ai/design
loyihasi "Admin dashboard design Q&A"
(projectId `61a10b30-b6da-4ec6-a052-e942867b97cc`), handoff fayli
`design_handoff_corepanel/CorePanel.dc.html` + shu yondagi `README.md`
(to'liq spec, o'zbek tilida — texnologiya steki, design tokenlar, 15 sahifa
tavsifi, responsive qoidalar).

## Joylashuv (MUHIM)

Loyiha **`D:\Projects\admin-panel`** da joylashgan, asl repo papkasida emas
(`C:\Users\aslbe\OneDrive\Desktop\just\admin panel`). Sabab: C: diskda joy
qolmagan edi (85GB/85GB to'lgan, atigi ~373MB bo'sh), `npm install` ENOSPC
xatosi bilan yiqilgan. `.git` tarixi D: ga ko'chirildi, keyingi barcha ish
shu yerda davom etadi. Yangi sessiyada ishlashda **avval shu yo'lga o'tish
kerak**, asl C: dagi papka deyarli bo'sh (faqat `.git` qoldiqlari bo'lishi
mumkin).

## Frontend — holati: tayyor (mock data bilan)

Stek: Next.js 16 (App Router) + TypeScript (strict) + Tailwind CSS v4
(CSS-first `@theme` config, `tailwind.config.ts` yo'q) + Zustand + TanStack
Query + Recharts + Lucide + cmdk + sonner + Radix (Dialog/Switch/Tabs).

Barcha **15 sahifa** qurilgan va `npm run build` toza o'tadi:
Dashboard (`/`), Serverlar (`/servers`, `/servers/[id]`), Loyihalar
(`/projects`), Deploy (`/deploy`), Loglar (`/logs`), Domenlar (`/domains`),
SSL (`/ssl`), Databaselar (`/databases`), Fayllar (`/files`), Email
(`/email`), Sheriklar (`/team`), Audit (`/audit`), Sozlamalar (`/settings`),
Login (`/login`).

Asosiy fayl tuzilmasi:
- `lib/types.ts`, `lib/mock-data.ts`, `lib/api.ts` — barcha mock ma'lumotlar
  va ularni qaytaruvchi `fetchX()` funksiyalar (Promise-wrapped, real API
  bilan almashtirish uchun shu joy o'zgaradi).
- `hooks/*` — TanStack Query wrapper'lar (`useServers`, `useProjects`,
  `useDashboardData.ts` ichida `useProcesses/useDeploys/useAlerts/useCpuSeries`,
  `useMisc.ts` ichida qolganlari).
- `store/*` — Zustand: `uiStore` (theme+sidebar, localStorage persisted),
  `authStore` (mock login/logout, persisted), `serverStore`, `projectStore`,
  `logStore`, `settingsStore`, `topbarStore` (sahifaga xos topbar tugmalari).
- `components/layout/` — `Sidebar`, `Topbar`, `AppShell` (auth guard:
  `loggedIn=false` bo'lsa `/login`ga redirect qiladi).
- `components/shared/` — `Card`, `StatusPill`, `ProgressBar`,
  `SegmentedControl`, `IconButton`, `MetricCard`, `CmdK`, `Modal`/`ConfirmModal`.
- `app/(app)/` route group — barcha autentifikatsiya talab qiladigan
  sahifalar, `app/login/page.tsx` — alohida (shell'siz).
- Design tokenlar `app/globals.css` da CSS custom property + Tailwind v4
  `@theme inline` orqali (`bg-1`, `border-1`, `text-2`, `accent`,
  `accent-soft`, va h.k. utility classlar shu yerdan keladi).

**Auth — hozircha to'liq mock**: faqat client-side Zustand state, real
backend/NextAuth yo'q.

## Backend — holati: REJALASHTIRILGAN, hali yozilmagan

Foydalanuvchi haqiqiy VPS'ni ulashni so'radi. Reja
`C:\Users\aslbe\.claude\plans\greedy-puzzling-river.md` da saqlangan (Claude
Code plan fayli — keyingi sessiyada o'qib davom ettirish mumkin). Qisqacha:

- Yangi `backend/` papkasi (repo ildizida, `D:\Projects\admin-panel\backend`)
  — FastAPI + asyncssh, **SSH orqali** haqiqiy VPS'ga ulanadi (`top`, `free`,
  `df`, `pm2 jlist` orqali real CPU/RAM/disk/PM2 ma'lumot).
- Faqat **bitta haqiqiy VPS** uchun — Dashboard + Servers sahifasi shu server
  uchun real data ko'rsatadi, qolgan hamma narsa (Projects/Domains/SSL/DB/
  Files/Email/Team/Audit/Settings) **mock'da qoladi**.
- Auth: oddiy shared API key (`Authorization: Bearer <token>`), to'liq
  NextAuth/JWT keyingi bosqich.
- SSH autentifikatsiya: **private key fayl yo'li** orqali (parol emas).
  Key matni hech qachon chatga/koddga yozilmaydi — faqat fayl yo'li
  `.env` da saqlanadi.

**Davom ettirish uchun foydalanuvchidan kerak bo'lgan ma'lumotlar (hali
berilmagan):**
1. VPS IP manzili
2. SSH port (default 22)
3. SSH username (masalan `root`)
4. Private key faylining diskdagi to'liq yo'li (masalan
   `C:\Users\aslbe\.ssh\id_rsa`)

Bular kelganda: `backend/.env` (gitignored) ga yoziladi, `.env.example`
repo'da shablon sifatida qoladi. To'liq backend struktura/endpoint rejasi
yuqoridagi plan faylida bor — qayta o'ylab chiqarish shart emas, o'sha
fayldan davom etish kerak.

## Eslatmalar

- `npm run build` va `npm run dev` har doim `D:\Projects\admin-panel` da
  ishga tushiriladi (Bash tool POSIX yo'l: `/d/Projects/admin-panel`).
- Disk joyiga ehtiyot bo'lish kerak — C: drive deyarli to'la, katta
  `node_modules`/build artifaktlarini C: ga yozmaslik kerak.
