# Portfolio — Red & Black

A static portfolio site built with **Next.js 14**, **Tailwind CSS**, and **Framer Motion**. Theme: red and black with a bold, modern UI.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build static export

```bash
npm run build
```

Output is in the `out/` folder. Deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Customize

- **Content**: Edit components in `components/` (Hero, About, Skills, Projects, Contact) and `components/Footer.tsx` (social links).
- **Project images**: Add images to `public/projects/` and set the `image` path in `components/Projects.tsx` for each project (e.g. `/projects/ml-pipeline.jpg`). If an image is missing, a placeholder is shown.
- **Theme**: Red/black tokens are in `tailwind.config.ts` and `app/globals.css`.
- **Metadata**: Update `app/layout.tsx` (title, description).

## Stack

- Next.js 14 (App Router, static export)
- TypeScript
- Tailwind CSS
- Framer Motion
# My-Portfolio
