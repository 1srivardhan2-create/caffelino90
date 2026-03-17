# 📦 Package.json Reference

This document provides information about the expected dependencies for Caffélino.

---

## Example package.json Structure

```json
{
  "name": "caffelino",
  "version": "1.0.0",
  "description": "Premium MeetUp Café Platform for Private Friends & Family Gatherings",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router": "^6.21.0",
    "motion": "^10.16.0",
    "@supabase/supabase-js": "^2.38.0",
    "lucide-react": "^0.294.0",
    "sonner": "^1.2.0",
    "date-fns": "^2.30.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0",
    "class-variance-authority": "^0.7.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "tailwindcss": "^4.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "keywords": [
    "meetup",
    "cafe",
    "coffee",
    "react",
    "typescript",
    "tailwind",
    "supabase",
    "bill-splitting",
    "payments"
  ],
  "author": "Caffélino Development Team",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/caffelino.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/caffelino/issues"
  },
  "homepage": "https://github.com/yourusername/caffelino#readme"
}
```

---

## Key Dependencies Explained

### Core Framework
- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router** - Client-side routing
- **typescript** - Type safety

### Styling
- **tailwindcss** - Utility-first CSS framework
- **tailwind-merge** - Merge Tailwind classes
- **clsx** - Conditional class names
- **class-variance-authority** - Component variants

### Animation
- **motion** (Framer Motion) - Animation library

### Backend
- **@supabase/supabase-js** - Supabase client

### UI Components
- **@radix-ui/*** - Unstyled, accessible UI primitives
- **lucide-react** - Icon library
- **sonner** - Toast notifications

### Utilities
- **date-fns** - Date manipulation

### Build Tools
- **vite** - Build tool
- **@vitejs/plugin-react** - React plugin for Vite

---

## Installation Commands

### Install All Dependencies
```bash
npm install
```

### Install Individual Dependencies

#### Core
```bash
npm install react react-dom react-router motion
```

#### TypeScript
```bash
npm install --save-dev typescript @types/react @types/react-dom
```

#### Tailwind CSS
```bash
npm install --save-dev tailwindcss postcss autoprefixer
```

#### Supabase
```bash
npm install @supabase/supabase-js
```

#### UI Components (ShadCN)
```bash
# Install all Radix UI components
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-tooltip
```

#### Icons & Utilities
```bash
npm install lucide-react sonner date-fns clsx tailwind-merge class-variance-authority
```

---

## Version Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher

Check versions:
```bash
node --version
npm --version
```

---

## Notes

1. This project uses **Vite** as the build tool
2. **Tailwind CSS v4** is used (no config file needed)
3. **Motion** (Framer Motion) replaces the old framer-motion package
4. All dependencies are kept up-to-date for security

---

<div align="center">
  <p>Made with ☕ by the Caffélino Team</p>
</div>
