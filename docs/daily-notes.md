# Daily Engineering Notes

## Day 1 — React Project Setup
* **Date:** June 30, 2026
* **What I read:** Vite, React v19, TypeScript compilation structures, and React Router v6 routing paradigms.
* **What I built:** Scaffolded the initial React workspace inside the `/frontend` subdirectory, implemented strict type imports for compiler compliance, and built out core navigation routing layers.
* **What worked:** Fast scaffolding using the interactive Vite engine menu and installing clean router dependencies.
* **What was confusing:** Handling strict TypeScript compile parameters without conflicting with global framework layouts.
* **What I need help with:** None, ready to integrate utility styles and atomic UI modules.

## Day 2 — Tailwind Styling & Component Foundation
* **Date:** June 30, 2026
* **What I read:** Tailwind CSS v4 Vite compilation hooks and atomic reusable interface architecture.
* **What I built:** Integrated Tailwind via Vite runtime directives, generated extensible atomic UI blocks (`Button`, `Input`, `Card`), and established the core structural `DashboardLayout` viewport framework.
* **What worked:** Fluid setup of utility styling rules via post-processing configuration engines.
* **What was confusing:** Organizing properties cleanly for forward-referenced TypeScript components.
* **What I need help with:** Ready to shift to state logic hooks and complete form management.

## Day 3 — Mock Data Dashboard Sub-Screens
* **Date:** June 30, 2026
* **What I read:** React Router nested tree configurations, structural layout fallback paths, and data list parsing strategies.
* **What I built:** Implemented domain-specific TypeScript models (`Restaurant`, `MenuItem`, `Order`), constructed modular collection data sheets, and wired nested layout modules under `/dashboard`. Built an interactive public entry routing gateway at the application root directory.
* **What worked:** Designing uniform loading, empty, and data-grid views using pre-built UI cards and buttons.
* **What was confusing:** Synchronizing active matching navigation highlighting with client routes using live location variables.
* **What I need help with:** None, all acceptance criteria are met and ready for review.


## Day 4 Implementation Log: Form Architecture & Schema Validation

### Completed Milestones
* **Reusable UI Components:** Enhanced `<Input />` layout to support real-time reactive error message states.
* **Schema Validation Engine:** Established `zod` validation profiles (`loginSchema`, `registerSchema`, `restaurantSchema`, `menuItemSchema`).
* **Interactive Form Elements:** Created `<LoginForm />`, `<RegisterForm />`, `<RestaurantForm />`, and `<MenuItemForm />` powered completely by `react-hook-form` and `@hookform/resolvers/zod`.
* **State Operations:** Configured client-side mock mutations (Create/Update operations) dynamically mapped directly across the dashboard table panels.
* **Core Navigation Linkage:** Resolved route tree nesting structures to accurately forward authenticated flows straight from auth portals to administrative panels.

### Technical Notes & Edge Cases Handled
> **⚠️ Zod HTML Input Coercion Conflict:**
> When handling numeric inputs (like price or ID attributes) from native HTML DOM elements, standard inputs provide `string` formats. Using `z.coerce.number()` creates a split between validation Input shapes and parsed Output schemas. We resolved this cleanly by setting up a form-specific input layout schema interface (`MenuItemFormInput`) to capture DOM strings and explicitly pass type contracts downstream.