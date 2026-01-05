# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Adding shadcn/ui Components

```bash
npx shadcn@latest add <component-name>
```

Components are installed to `components/ui/`. The project uses the "new-york" style with lucide-react icons.

## Architecture

This is a Next.js 16 application using the App Router with React 19 and Tailwind CSS v4.

### Key Patterns

- **Path alias**: `@/*` maps to project root (e.g., `@/components`, `@/lib`)
- **Styling**: Tailwind CSS v4 with CSS variables for theming (light/dark mode via `.dark` class)
- **Utility function**: Use `cn()` from `lib/utils.ts` for conditional class merging (combines clsx + tailwind-merge)
- **Fonts**: Geist and Geist Mono loaded via `next/font/google` with CSS variables `--font-geist-sans` and `--font-geist-mono`

### Directory Structure

- `app/` - Next.js App Router pages and layouts
- `components/ui/` - shadcn/ui components (auto-generated)
- `lib/` - Utility functions
- `hooks/` - Custom React hooks (if created)

### Tailwind CSS v4 Notes

- Uses `@tailwindcss/postcss` plugin instead of traditional tailwind.config.js
- Theme configuration is in `app/globals.css` using `@theme inline` block
- Color tokens use OKLCH color space
