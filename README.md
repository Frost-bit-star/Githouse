# DevHub - The Social Platform for Developers

![DevHub Logo](https://via.placeholder.com/150x50?text=DevHub) <!-- Replace with actual logo if available -->

A modern, interactive social platform built with React and TypeScript for developers to build, share, and discover cutting-edge projects with a global community.

## 🚀 Features

- **Project Discovery**: Explore and contribute to thousands of developer projects
- **Community Building**: Connect with developers worldwide
- **Activity Tracking**: Visualize project contributions and trends with interactive charts
- **Moderation Tools**: Manage communities effectively
- **Real-time Search**: Find projects, developers, and communities instantly
- **Dark/Light Theme**: Seamless theme switching with persistence
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Material Symbols

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/devhub.git
   cd devhub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── assets/         # Static assets
│   ├── icons/          # Icon components
│   └── ...             # Individual components
├── lib/                # Utility libraries
├── services/           # API services (GitHub integration)
├── store/              # Zustand state management
└── types.ts            # TypeScript type definitions
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](tasks/CONTRIBUTING_ISSUES.md) for details on:

- Setting up the development environment
- Code style and conventions
- Submitting pull requests
- Reporting issues

## 📚 Developer Guide

For detailed development information, see [DEV_GUIDE.md](DEV_GUIDE.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ by the Salamander team
- Since 2025

---

**Salamander Tech Hub** - Building the future of developer collaboration.
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
