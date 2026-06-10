# 🤝 Contributing to Caffélino

Thank you for your interest in contributing to Caffélino! This document provides guidelines and instructions for contributing.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Bug Reports](#bug-reports)
8. [Feature Requests](#feature-requests)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for everyone. We expect all contributors to:

- **Be respectful** - Treat everyone with respect
- **Be collaborative** - Work together constructively
- **Be professional** - Keep discussions focused and productive
- **Be inclusive** - Welcome diverse perspectives

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

```bash
git clone https://github.com/YOUR-USERNAME/caffelino.git
cd caffelino
```

3. **Add upstream remote**:

```bash
git remote add upstream https://github.com/ORIGINAL-OWNER/caffelino.git
```

4. **Install dependencies**:

```bash
npm install
```

5. **Start development server**:

```bash
npm run dev
```

---

## Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your work:

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# OR for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments where necessary
- Test your changes thoroughly

### 3. Test Your Changes

```bash
# Run the app
npm run dev

# Check TypeScript errors
npm run type-check

# Run linter (if configured)
npm run lint

# Build to ensure no errors
npm run build
```

### 4. Commit Your Changes

```bash
# Stage files
git add .

# Commit with descriptive message
git commit -m "feat: add user profile editing feature"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your feature branch
4. Fill in the PR template
5. Submit the pull request

---

## Coding Standards

### TypeScript

- **Use TypeScript** for all new files
- **Define interfaces** for all data structures
- **Avoid `any` type** - use proper types
- **Use type inference** where possible

**Example:**

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): User | null {
  // ...
}

// ❌ Bad
function getUser(id: any): any {
  // ...
}
```

### React Components

- **Use functional components** with hooks
- **One component per file** (except small helper components)
- **Props should have interfaces**
- **Use meaningful component names**

**Example:**

```typescript
// ✅ Good
interface UserCardProps {
  user: User;
  onEdit: (id: string) => void;
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <h3>{user.name}</h3>
      <button onClick={() => onEdit(user.id)}>Edit</button>
    </div>
  );
}

// ❌ Bad
export function Card(props: any) {
  return <div>{props.name}</div>;
}
```

### Tailwind CSS

- **Use Tailwind classes** instead of custom CSS
- **Follow mobile-first** approach
- **Don't use font size/weight classes** unless specifically needed
- **Use existing design tokens** from `/styles/globals.css`

**Example:**

```tsx
// ✅ Good
<div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h2 className="mb-2">Title</h2>
</div>

// ❌ Bad
<div style={{ padding: '16px', backgroundColor: 'white' }}>
  <h2 style={{ marginBottom: '8px', fontSize: '24px', fontWeight: 'bold' }}>
    Title
  </h2>
</div>
```

### File Naming

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utils**: camelCase (e.g., `safeStorage.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.ts`)

### Code Organization

```
/components
  /ui              # Reusable UI components
  /layouts         # Layout components
  HomePage.tsx     # Page components
  
/utils
  database.ts      # Database utilities
  safeStorage.ts   # Storage utilities
  
/types
  index.ts         # TypeScript type definitions
```

### Comments

- **Use JSDoc** for functions
- **Explain WHY**, not what
- **Keep comments up-to-date**

```typescript
/**
 * Calculates the split amount per person, handling odd amounts.
 * The remaining ₹1 (if any) goes to the admin.
 * 
 * @param total - Total bill amount
 * @param count - Number of people
 * @returns Amount per person (rounded down)
 */
function calculateSplitAmount(total: number, count: number): number {
  return Math.floor(total / count);
}
```

---

## Commit Guidelines

We follow the **Conventional Commits** specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(auth): add social login with Google"

# Bug fix
git commit -m "fix(payments): resolve ₹20 token payment failure"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(utils): extract duplicate code into helper function"

# Multiple changes
git commit -m "feat(dashboard): add revenue analytics

- Add monthly/yearly revenue breakdown
- Implement cash vs online payment charts
- Add export to CSV functionality"
```

### Commit Best Practices

- **Keep commits atomic** - One logical change per commit
- **Write clear messages** - Anyone should understand the change
- **Reference issues** - Use `Fixes #123` or `Closes #456`
- **Don't commit**:
  - `node_modules/`
  - `.env` files
  - Build outputs (`dist/`)
  - IDE configs (`.vscode/`, `.idea/`)

---

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] TypeScript types are correct
- [ ] No console errors
- [ ] Tested on mobile and desktop
- [ ] No merge conflicts with main
- [ ] Commit messages follow guidelines
- [ ] PR description is clear

### PR Title Format

Use the same format as commit messages:

```
feat(component): add new feature
fix(bug): resolve issue with X
```

### PR Description Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
Describe how you tested the changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tested on multiple devices

## Related Issues
Fixes #123
```

### Review Process

1. **Automated checks** run (if configured)
2. **Maintainer reviews** the code
3. **Changes requested** (if needed)
4. **Approval** given
5. **Merge** to main branch

### After Merge

Your PR will be merged and:
- Included in the next release
- Your contribution acknowledged
- You'll be added to contributors list 🎉

---

## Bug Reports

### Before Reporting

1. **Search existing issues** - Your bug might already be reported
2. **Test on latest version** - Update to the latest code
3. **Reproduce the bug** - Ensure it's consistent

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - Device: [e.g. iPhone 12, Desktop]
 - OS: [e.g. iOS 15, Windows 11]
 - Browser: [e.g. Chrome 120, Safari 16]
 - Version: [e.g. 1.2.3]

**Additional context**
Any other relevant information.
```

---

## Feature Requests

### Before Requesting

1. **Check existing requests** - It might already be planned
2. **Consider scope** - Does it fit Caffélino's vision?
3. **Think about users** - Will this benefit most users?

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
What you want to happen.

**Describe alternatives you've considered**
Other solutions you thought about.

**Additional context**
Mockups, examples, or any other information.

**Would you like to work on this?**
Are you willing to implement this feature?
```

---

## Development Tips

### Hot Reload Issues

If hot reload stops working:

```bash
# Restart dev server
npm run dev
```

### Database Changes

When modifying database schema:

1. Update `/utils/database.ts`
2. Update TypeScript interfaces
3. Update `DATABASE_ARCHITECTURE.md`
4. Test with mock data first
5. Test with Supabase

### Testing Locally

```bash
# Test production build
npm run build
npm run preview

# Test on mobile
# Use network URL shown in terminal
# e.g., http://192.168.1.100:3000
```

### Debugging

```typescript
// Use safe console logging
if (import.meta.env.VITE_DEBUG_MODE === 'true') {
  console.log('Debug info:', data);
}
```

---

## Questions?

- **Documentation**: Check existing docs first
- **Issues**: Search or create a new issue
- **Discussions**: Use GitHub Discussions
- **Email**: dev@caffelino.com

---

## Recognition

All contributors will be:
- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Given credit in the project

Thank you for contributing! ☕❤️

---

<div align="center">
  <p>Made with ☕ by the Caffélino Community</p>
</div>
