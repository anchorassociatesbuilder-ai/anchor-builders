# Anchor Associates & Builders — Website

A premium corporate website for **Anchor Associates & Builders**, a Category C-2 PEC registered construction and contracting firm based in Islamabad. Fully dynamic — project portfolios, client rosters, and content are managed through a built-in admin panel backed by Supabase.

---

## Technologies

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, React Server Components) |
| UI | React 18, custom CSS design system (no Tailwind) |
| Database & Auth | Supabase (PostgreSQL + Auth + Storage) |
| Auth middleware | `@supabase/ssr` — cookie-based SSR sessions |
| Deployment | Vercel |
| Fonts | Cormorant Garamond · Manrope · JetBrains Mono (Google Fonts) |
| Image storage | Supabase Storage (`project-images` bucket) |

---

## Key Features

**Public site**
- Cinematic hero with looping slides and caption
- Featured projects swiper on the home page
- Services section with per-category project listings
- Project gallery pages with image lightbox
- Client roster — 40+ clients in a dense 4-column grid
- Individual client pages with testimonials and related projects
- Client logos displayed on cards and detail pages
- Reveal-on-scroll animations throughout
- Six switchable card hover styles (slide, invert, lift, highlight, expand, underline)
- Fully responsive down to mobile

**Admin panel (`/admin`)**
- Role-gated — only users with `role = 'admin'` in the `profiles` table can access
- Manage projects: create, edit, delete, reorder, toggle active/featured
- Manage project images: upload, set cover, reorder, delete; images converted to WebP before upload
- Manage clients: create, edit, delete, upload/replace/remove logos (drag-and-drop supported)
- Manage project categories: create, edit, delete

**Security**
- Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy headers on every route
- Session idle timeout — auto sign-out after 30 minutes of inactivity
- Tab-close logout via `sessionStorage`
- Open redirect protection on the login `?next=` parameter
- Server actions validate admin role before every mutation

---

## Project Structure

```
app/
├── layout.jsx               # Root layout — fonts, SessionGuard, AppShell
├── AppShell.jsx             # Nav, footer, page transitions
├── SessionGuard.jsx         # Client-side idle timeout + tab-close logout
├── page.jsx                 # Home
├── about/page.jsx
├── services/
│   ├── page.jsx
│   └── [id]/page.jsx
├── projects/
│   ├── page.jsx
│   ├── [categorySlug]/page.jsx
│   └── [categorySlug]/[projectSlug]/page.jsx
├── clients/
│   ├── page.jsx             # 4-column client roster grid
│   └── [id]/page.jsx        # Client detail
├── contact/page.jsx
├── login/                   # Auth pages
├── admin/
│   ├── page.jsx             # Dashboard
│   ├── projects/            # Project CRUD + image management
│   ├── clients/             # Client CRUD + logo upload
│   └── categories/          # Category CRUD
└── auth/signout/route.js    # POST sign-out handler

lib/queries.js               # All Supabase read queries
src/
├── data.js                  # Fallback client list, site copy, differentiators
├── components.jsx           # Shared UI components
├── styles.css               # Design system, layout, component CSS
└── animations.css           # Reveal, page transition animations
utils/
├── supabase/                # Browser + server + middleware Supabase clients
├── clients.js               # canonicalClientKey
├── image.js                 # convertToWebp, isImageFile, MAX_UPLOAD_BYTES
└── slug.js                  # toSlug
middleware.js                # Session refresh + /admin auth gate
next.config.mjs              # Security headers, image optimization config
supabase/migrations/         # SQL migration files
```

---

## Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both values are in the Supabase dashboard under **Project Settings → API**.

### 3. Database setup


The core tables (`profiles`, `projects`, `project_categories`, `project_images`, `clients`) must also exist. 


### 4. Storage bucket

In the Supabase dashboard, create a public storage bucket named **`project-images`**. This bucket holds both project gallery images and client logos.

### 5. Create an admin user

1. Create a user in Supabase Auth (Dashboard → Authentication → Users → Add user)
---

## Running Locally

```bash
npm run dev
```

Opens at **http://localhost:3000**. The admin panel is at **http://localhost:3000/admin**.

### Production build

```bash
npm run build
npm run start
```

---

## Deployment (Vercel)

1. Push the repo to GitHub
2. Import into [Vercel](https://vercel.com)
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) under **Project Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js

---

## Customization

### Clients

The admin **Clients** list decides which clients the site shows: the clients page, client detail pages, the homepage marquee, the sitemap and the client dropdown in the project form. Deleting a client there removes it from all of them (projects keep the client name they were saved with). Picking a new custom client on a project adds it to the list automatically.

Clients that are also in the `CLIENTS` array in `src/data.js` keep that array's order, and the rest follow alphabetically. The array is also the fallback list when the clients table can't be read, and its names and full names count as alternate spellings when projects are matched to clients (`utils/clients.js`).

### Card hover style

Controlled by `data-hover-style` on `<body>` in `app/AppShell.jsx`. Options: `slide` (default), `invert`, `lift`, `highlight`, `expand`, `underline`.

### Design tokens

Colors, fonts, and spacing are CSS variables at the top of `src/styles.css`:

```css
:root {
  --bg: #f6f4ef;          /* warm off-white */
  --ink: #14110d;         /* near-black */
  --warm: #b8a888;        /* sand accent */
  --warm-deep: #7d6f55;
  --serif: 'Cormorant Garamond', serif;
  --sans: 'Manrope', sans-serif;
  --mono: 'JetBrains Mono', monospace;
}
```

---

## Database Tables

| Table | Purpose |
|---|---|
| `profiles` | Maps Supabase auth users to roles (`admin` / `viewer`) |
| `project_categories` | Project categories shown in the services section |
| `projects` | All construction projects |
| `project_images` | Gallery images per project, stored in Supabase Storage |
| `clients` | Client roster with optional testimonials and logos |
