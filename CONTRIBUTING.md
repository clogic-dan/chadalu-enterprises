# Contributing to CHADALU

Thank you for contributing to CHADALU! This document outlines our development guidelines and workflow.

---

## Getting Started

### Prerequisites
- Git installed
- Text editor (VS Code recommended)
- Node.js 16+ (for Phase 2+)
- Supabase account (for Phase 2+)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/CHADALU.git
   cd CHADALU
   ```

2. **Read documentation**
   ```bash
   cat README.md          # Project overview
   cat ROADMAP.md         # Development phases
   cat ARCHITECTURE.md    # Technical design
   ```

3. **Choose your phase**
   - Phase 1 (Frontend): Just open HTML files in browser
   - Phase 2+ (Backend): See `docs/SETUP.md`

---

## Branch Strategy

```
main (stable, production-ready)
  ↑
  │
dev (integration branch)
  ↑
  │
feature/phase-2-auth
feature/phase-3-payments
bugfix/fix-mobile-layout
```

### Branch Naming
- Feature: `feature/phase-X-description`
- Bugfix: `bugfix/short-description`
- Docs: `docs/update-readme`

### Example
```bash
git checkout -b feature/phase-2-database
# ... make changes ...
git add .
git commit -m "feat: Create database schema with 8 tables"
git push origin feature/phase-2-database
# Create pull request on GitHub
```

---

## Commit Message Convention

Format:
```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `refactor:` Code refactoring
- `style:` CSS/styling changes
- `docs:` Documentation
- `chore:` Build, deps, config
- `test:` Tests
- `perf:` Performance improvement

### Examples

**Good** ✅
```
feat: Add M-Pesa payment modal to booking form

- Implement STK push trigger button
- Show payment receipt on completion
- Handle payment timeout scenarios

Closes #42
```

```
fix: Fix calendar date picker not showing selected range

- Reset calendar state on month change
- Add visual feedback for range selection

Fixes #38
```

```
docs: Add Phase 2 database setup instructions

See docs/DATABASE.md for schema details
```

**Bad** ❌
```
update stuff
fixed bug
more changes
asdf
```

---

## Code Style

### HTML
```html
<!-- Use semantic elements -->
<section id="equipment">
  <div class="equipment-grid">
    <div class="equipment-card">
      <!-- Descriptive class names -->
    </div>
  </div>
</section>
```

### CSS
```css
/* Use CSS variables for colors */
:root {
  --g2: #C8922A;  /* Main gold */
  --dark: #080808;
}

/* Semantic class names */
.booking-card { ... }
.btn-primary { ... }

/* Mobile-first */
.card { ... }  /* mobile */

@media (min-width: 768px) {
  .card { ... }  /* tablet+ */
}
```

### JavaScript
```javascript
// Camelcase for variables/functions
const userEmail = 'user@example.com';
function renderBookingCard() { ... }

// UPPERCASE for constants
const MAX_DURATION_HOURS = 72;
const API_BASE = 'https://api.chadalu.co.ke';

// Comments for complex logic
// Check if user has completed at least 1 booking
if (user.totalBookings > 0) { ... }

// Use meaningful variable names
const bookingElements = document.querySelectorAll('.booking-card');
// NOT: const be = document.querySelectorAll('.booking-card');
```

---

## Testing Guidelines

### Phase 1 (Frontend)
- Test in Chrome, Firefox, Safari, Edge
- Test responsive (320px, 768px, 1024px+ widths)
- Test form validation
- Test admin dashboard sections load
- Test client dashboard shows correct data

### Phase 2+ (Backend)
```bash
npm test  # Run all tests
npm test -- --watch  # Watch mode
npm test -- --coverage  # Coverage report
```

### Manual Testing Checklist
- [ ] Feature works on desktop
- [ ] Feature works on mobile (320px+)
- [ ] All form inputs validate
- [ ] No console errors
- [ ] No console warnings
- [ ] Network requests succeed
- [ ] Error cases handled gracefully

---

## Pull Request Process

1. **Create branch**
   ```bash
   git checkout -b feature/your-feature
   ```

2. **Make changes**
   - Write code following style guide
   - Update docs if needed
   - Test thoroughly

3. **Commit with good messages**
   ```bash
   git add .
   git commit -m "feat: Add feature description"
   ```

4. **Push to GitHub**
   ```bash
   git push origin feature/your-feature
   ```

5. **Create Pull Request**
   - Title: Same as your first commit message
   - Description: Explain changes, link issues
   - Add screenshots for UI changes

6. **Code Review**
   - Address feedback
   - Re-request review after changes
   - Wait for approval

7. **Merge**
   - Use "Squash and merge" for small PRs
   - Use "Create a merge commit" for large changes
   - Delete branch after merge

---

## Phase-Specific Guidelines

### Phase 1 (Frontend)
- [ ] No external JavaScript frameworks
- [ ] No jQuery
- [ ] Use vanilla JS only
- [ ] CSS organized by section
- [ ] Mobile responsive (tested at 320px, 768px, 1024px+)
- [ ] All animations smooth (no jank)
- [ ] Accessibility checked (keyboard nav, color contrast)

### Phase 2 (Backend & Auth)
- [ ] Follow REST API conventions
- [ ] Supabase RLS policies tested
- [ ] All endpoints documented
- [ ] Error cases handled
- [ ] Input validation server-side
- [ ] SQL injection prevented
- [ ] Unit tests for business logic

### Phase 3 (Payments)
- [ ] M-Pesa test account used
- [ ] Webhook handlers tested
- [ ] Payment states handled (pending, success, failed)
- [ ] Receipts generated correctly
- [ ] Sensitive data never logged
- [ ] Transaction logs kept for 7 years

### Phase 4 (Deployment)
- [ ] All tests passing
- [ ] Performance benchmarked
- [ ] Security checklist passed
- [ ] Database backups tested
- [ ] Deployment docs updated
- [ ] Monitoring configured

---

## Common Tasks

### Add a New Page (Phase 1)
1. Create `new-page.html`
2. Copy header/footer from existing page
3. Add styles to `<style>` tag
4. Add JavaScript to `<script>` tag
5. Test on desktop + mobile
6. Commit: `feat: Add new page with X functionality`

### Add a New API Endpoint (Phase 2)
1. Design in `ARCHITECTURE.md` first
2. Create Supabase table if needed
3. Write RLS policies
4. Document endpoint in `API.md`
5. Create integration test
6. Commit: `feat: Add GET /api/endpoint`

### Fix a Bug
1. Create issue if it doesn't exist
2. Create branch: `bugfix/description`
3. Write test that reproduces bug
4. Fix the code
5. Verify test passes
6. Commit: `fix: Bug description (#issue-number)`

---

## Documentation Requirements

Every commit to `main` must have:
- [ ] Updated `CHANGELOG.md` with summary
- [ ] Updated relevant `.md` files
- [ ] Updated inline code comments for complex logic

For Phase 2+:
- [ ] API endpoint documented in `API.md`
- [ ] Database changes documented in `DATABASE.md`
- [ ] New endpoints have JSDoc comments

---

## Code Review Checklist

When reviewing code, check:

- [ ] Follows commit message convention
- [ ] Follows code style guide
- [ ] No breaking changes to API
- [ ] Tests pass (if Phase 2+)
- [ ] Performance impact assessed
- [ ] Security reviewed (no XSS, SQL injection, etc.)
- [ ] Documentation updated
- [ ] No dead code
- [ ] Error handling present
- [ ] Mobile compatible (Phase 1)

---

## Reporting Issues

### Bug Report Template
```markdown
**Description:** Clear description of the bug

**Steps to Reproduce:**
1. Go to page X
2. Click button Y
3. See issue Z

**Expected Behavior:** What should happen

**Actual Behavior:** What actually happens

**Environment:** Browser, OS, device size

**Screenshots:** If applicable
```

### Feature Request Template
```markdown
**Description:** Clear description of feature

**Why:** Why this feature is needed

**Implementation:** Suggested approach (optional)

**Phase:** Which phase should this be in?
```

---

## Questions?

- Check `README.md` for overview
- Check `ROADMAP.md` for timeline
- Check `ARCHITECTURE.md` for technical decisions
- Open an issue for questions
- Contact team lead for guidance

---

## Code of Conduct

- Be respectful and inclusive
- No harassment or discrimination
- Constructive feedback only
- Celebrate contributions
- Focus on code quality, not ego
- Help newer contributors

---

**Thank you for contributing to CHADALU!** 🙏

---

**Last Updated:** May 2026  
**Version:** 1.0.0
