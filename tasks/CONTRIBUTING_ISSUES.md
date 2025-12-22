# Contributing Issues for Githouse

This file contains a curated list of potential issues and feature requests for contributors to work on. Each issue includes a title, description, labels, and estimated difficulty.

## Open Issues

### 1. Persist Theme Preference
**Description:** Currently, the theme toggle (sun/moon) resets on page refresh. Implement localStorage to remember the user's theme choice across sessions.

**Labels:** enhancement, frontend, good-first-issue  
**Difficulty:** Easy  
**Files to modify:** `components/Header.tsx`, `App.tsx`  
**Acceptance Criteria:** Theme persists after refresh and browser restart.

### 2. Add Search Functionality
**Description:** Implement a global search feature that allows users to search through projects, developers, and communities. The search bar in the header is currently non-functional.

**Labels:** feature, frontend, backend  
**Difficulty:** Medium  
**Files to modify:** `components/Header.tsx`, `services/github.ts`, add new service  
**Acceptance Criteria:** Search returns relevant results and filters content.

### 3. Implement Real API Integration
**Description:** Replace mock data in `constants.ts` with actual API calls to GitHub or a backend service. Start with fetching real project data.

**Labels:** enhancement, backend, api  
**Difficulty:** Medium  
**Files to modify:** `constants.ts`, `services/github.ts`, `components/` (various widgets)  
**Acceptance Criteria:** Widgets display real data from APIs.

### 4. Add Unit Tests
**Description:** Add Jest and React Testing Library setup, then write tests for key components like Header, Sidebar, and ParticleTextEffect.

**Labels:** testing, infrastructure  
**Difficulty:** Medium  
**Files to modify:** `package.json`, new test files  
**Acceptance Criteria:** At least 70% code coverage for components.

### 5. Improve Mobile Responsiveness
**Description:** The dashboard layout breaks on smaller screens. Improve responsive design for mobile and tablet devices.

**Labels:** frontend, ui/ux, responsive  
**Difficulty:** Easy-Medium  
**Files to modify:** `App.tsx`, `components/Sidebar.tsx`, `components/Header.tsx`  
**Acceptance Criteria:** Layout works well on screens < 768px.

### 6. Add Accessibility Features
**Description:** Improve accessibility by adding ARIA labels, keyboard navigation, and screen reader support throughout the app.

**Labels:** accessibility, frontend  
**Difficulty:** Medium  
**Files to modify:** All components  
**Acceptance Criteria:** Passes basic accessibility audits.

### 7. Implement User Notifications
**Description:** Add a notification system for activities like new messages, project updates, or community invites. Include a bell icon in the header.

**Labels:** feature, frontend  
**Difficulty:** Medium  
**Files to modify:** `components/Header.tsx`, `store/useHubStore.ts`, new component  
**Acceptance Criteria:** Users can view and dismiss notifications.

### 8. Add Project Creation Flow
**Description:** Allow authenticated users to create new projects. Add a form with fields for title, description, tags, etc.

**Labels:** feature, frontend, backend  
**Difficulty:** Hard  
**Files to modify:** New component, `services/github.ts`, `store/useHubStore.ts`  
**Acceptance Criteria:** Users can create and view their projects.

### 9. Enhance Particle Text Effect
**Description:** Improve the particle text animation with more effects, like color changes, speed controls, or user-customizable words.

**Labels:** enhancement, frontend, animation  
**Difficulty:** Medium  
**Files to modify:** `components/ParticleTextEffect.tsx`  
**Acceptance Criteria:** Animation is more interactive and visually appealing.

### 10. Add User Profile Pages
**Description:** Create detailed profile pages for users, showing their projects, contributions, and bio. Link from member finder.

**Labels:** feature, frontend  
**Difficulty:** Medium  
**Files to modify:** New component, `components/MemberFinder.tsx`  
**Acceptance Criteria:** Profiles display user information and stats.

### 11. Implement Moderation Tools
**Description:** Expand the ModerationPanel with more tools like banning users, content flagging, and activity logs.

**Labels:** feature, moderation  
**Difficulty:** Hard  
**Files to modify:** `components/ModerationPanel.tsx`, backend integration  
**Acceptance Criteria:** Moderators can manage community content.

### 12. Add Dark Mode Variants for Charts
**Description:** The ActivityChart component needs better styling for dark mode. Ensure all chart elements are visible and themed properly.

**Labels:** bug, frontend, theming  
**Difficulty:** Easy  
**Files to modify:** `components/ActivityChart.tsx`  
**Acceptance Criteria:** Charts look good in both light and dark modes.

### 13. Optimize Performance
**Description:** The app loads slowly on initial render. Implement code splitting, lazy loading, and optimize bundle size.

**Labels:** performance, infrastructure  
**Difficulty:** Medium  
**Files to modify:** `vite.config.ts`, `App.tsx`, components  
**Acceptance Criteria:** Initial load time < 3 seconds.

### 14. Add Internationalization (i18n)
**Description:** Support multiple languages. Start with English and Spanish, using a library like react-i18next.

**Labels:** feature, internationalization  
**Difficulty:** Hard  
**Files to modify:** All components, new i18n setup  
**Acceptance Criteria:** UI text can be switched between languages.

### 15. Implement Error Boundaries
**Description:** Add React error boundaries to gracefully handle crashes and display user-friendly error messages.

**Labels:** reliability, frontend  
**Difficulty:** Easy  
**Files to modify:** `App.tsx`, new component  
**Acceptance Criteria:** App doesn't crash on errors; shows fallback UI.

## How to Contribute

1. Pick an issue that interests you.
2. Fork the repository and create a branch for your changes.
3. Implement the feature or fix.
4. Test thoroughly and ensure it meets the acceptance criteria.
5. Submit a pull request with a clear description of your changes.

For questions or clarifications, open a discussion in the repository.