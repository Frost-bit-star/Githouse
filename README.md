<!DOCTYPE html>
<html class="dark" lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Salamander Tech Hub Landing</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:wght@400&family=Inter:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
    </style>
  </head>
  <body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-[Inter]">
    <div class="flex flex-col min-h-screen">
      <header class="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 border-b border-slate-200/60 dark:border-slate-800/60 backdrop-blur">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined text-slate-900">all_inclusive</span>
            </div>
            <span class="text-xl font-bold">Salamander</span>
          </div>
          <nav class="hidden md:flex gap-6 text-sm text-slate-500 dark:text-slate-400">
            <a href="#">Projects</a>
            <a href="#">Developers</a>
            <a href="#">Docs</a>
            <a href="#">Community</a>
          </nav>
          <div class="flex items-center gap-4">
            <div class="relative hidden sm:block">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input class="w-48 pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" placeholder="Search..." />
            </div>
            <button class="px-4 py-2 rounded-lg bg-primary text-slate-900 font-semibold">Join Hub</button>
          </div>
        </div>
      </header>

      <main class="flex-grow">
        <section class="py-24 md:py-32 text-center">
          <div class="container mx-auto px-6">
            <div class="inline-block bg-primary p-4 rounded-3xl mb-8">
              <div class="bg-slate-900 px-12 py-6 rounded-2xl relative">
                <span class="absolute top-4 left-6 text-[0.6rem] uppercase tracking-[0.2em] text-slate-400">Tech Hub</span>
                <h1 class="font-[DM Serif Display] text-5xl sm:text-7xl md:text-8xl text-primary leading-none">salamander</h1>
                <span class="absolute bottom-4 right-6 text-[0.6rem] uppercase tracking-[0.2em] text-slate-400">Since 2025</span>
              </div>
            </div>
            <p class="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Build, share, and discover cutting-edge projects with a global community of developers.
            </p>
            <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a class="px-8 py-3 font-semibold bg-primary text-slate-900 rounded-lg flex items-center justify-center gap-2" href="#">
                <span class="material-symbols-outlined">explore</span>Explore Projects
              </a>
              <a class="px-8 py-3 font-semibold bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center gap-2" href="#">
                <span class="material-symbols-outlined">description</span>Read the Docs
              </a>
            </div>
          </div>
        </section>

        <section class="py-16 bg-slate-100 dark:bg-slate-900">
          <div class="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p class="text-4xl font-bold text-primary">12k+</p>
              <p class="mt-2 text-sm text-slate-500 uppercase tracking-wider">Active Projects</p>
            </div>
            <div>
              <p class="text-4xl font-bold text-primary">150k+</p>
              <p class="mt-2 text-sm text-slate-500 uppercase tracking-wider">Developers</p>
            </div>
            <div>
              <p class="text-4xl font-bold text-primary">2.1M+</p>
              <p class="mt-2 text-sm text-slate-500 uppercase tracking-wider">Contributions</p>
            </div>
            <div>
              <p class="text-4xl font-bold text-primary">85</p>
              <p class="mt-2 text-sm text-slate-500 uppercase tracking-wider">Countries</p>
            </div>
          </div>
        </section>

        <section class="py-24">
          <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Featured cards (Projects, SynapseML, Krypton) -->
            <!-- Full markup available in /landing-snippets if needed -->
          </div>
        </section>
      </main>

      <footer class="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div class="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-6 text-sm text-slate-500">
          <p>© 2025 Salamander Tech Hub. All rights reserved.</p>
          <div class="flex items-center gap-6">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  </body>
</html>

</details>

## Run Locally

**Prerequisites:** Node.js 18+

## Project Overview

Githouse is a dashboard-style social platform experience intended for Salamander Tech Hub. It combines:

- **Sidebar navigation + widgets** for profiles, community discovery, member search, moderation, and activity analytics.
- **Theming controls** in the Header (sun/moon toggle) with brand-tailored colors.
- **Particle Text background effect** that cycles through words (defaults: `HELLO`, `DEVS`, `SALAMANDER`, `OPEN SOURCE`, `POOL`) and reacts to right-click drag interactions to disperse particles.

When the user is not authenticated (`useHubStore.isAuthenticated === false`), a login screen is displayed. After authentication, the main dashboard and animated backdrop render.

## Customization Tips

- **Particle text words**: open `components/ParticleTextEffect.tsx` and pass a `words` prop from `App.tsx` or change the `DEFAULT_WORDS` array.
- **Background opacity**: adjust the `className` passed to `<ParticleTextEffect />` inside `App.tsx`.
- **Theme toggle logic**: edit `components/Header.tsx` if you need to persist theme choice or integrate with Tailwind config.
- **Data sources**: static mock data lives in `constants.ts`. Replace with API calls or stores as needed.

## Available Scripts

- `npm run dev` — start Vite dev server with HMR.
- `npm run build` — create production build.
- `npm run preview` — preview the production build locally.

## Folder Highlights

- `components/` — UI modules (Header, Sidebar, widgets, Particle effect).
- `store/useHubStore.ts` — Zustand store for auth state.
- `types.ts` / `constants.ts` — shared data contracts and mock datasets.

Feel free to update screenshots, branding copy, or assets under `components/assets` to reflect new visuals.
