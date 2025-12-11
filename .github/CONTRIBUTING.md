# 🚀 Contribution Guidelines – Event Manager

Thank you for contributing to **Event Manager** – A comprehensive full-stack Event Management System. Please follow these guidelines to ensure your contributions are counted and the workflow stays organized.

## 🌟 How to Contribute (Strict Workflow)

### 1️⃣ Create an Issue FIRST
Before making any changes, contributors must create an issue describing:
- **What** feature/bug they want to work on
- **Why** it is needed
- **Expected behaviour**

👉 **PRs without a linked issue will not be accepted.**

### 2️⃣ Wait Until the Issue Is Assigned
Contributors must not start working until:
✔ A mentor/admin assigns the issue
✔ They receive approval to proceed

This prevents duplicate work and ensures correct tracking.

### 3️⃣ Fork & Clone the Repository
```bash
git clone https://github.com/Deven14125/Event_Manager.git
```

### 4️⃣ Create a New Working Branch
```bash
git checkout -b feature/my-feature
```
**Branch name format:**
- `feature/add-booking-ui`
- `fix/login-validation`
- `docs/update-readme`
- `refactor/api-calls`

### 5️⃣ Implement the Solution
- Write clean, modular code
- Follow component and folder structure
- Keep commit messages meaningful

### 6️⃣ Commit & Push
```bash
git add .
git commit -m "feat: add new booking UI"
git push origin feature/my-feature
```

### 7️⃣ Open a Pull Request
Your PR should include:
✔ A clear description
✔ Screenshots if it's a UI change
✔ The issue link:
> Closes #<issue-number>

⚠ **Do NOT add labels.** Labels will be added ONLY by mentors/admins.

---

## 🏷️ Labeling Policy (Important)
Scoring depends on labels, but:
- **Contributors MUST NOT add labels.**
- Only Admins/Mentors will assign:
  - `wocs`
  - `level 1`
  - `level 2`
  - `level 3`

This ensures fairness and consistent scoring.

---

## 🎨 Code Style Guidelines

### ✔ React
- Use functional components
- Prefer hooks
- Keep components small & reusable

### ✔ Tailwind CSS
- Use utility classes
- Maintain consistency

### ✔ Code Quality
- Meaningful names
- Avoid unnecessary complexity

---

## 🧹 Formatting Rules (Prettier)
Run formatting before submitting:
```bash
npm run lint
```

**Prettier Rules (Already Configured)**
- Semi-colons: yes
- Single quotes: yes
- Print width: 100
- Trailing commas: ES5

**Ignored folders:**
- `node_modules/`
- `build/`
- `dist/`

---

## ✔ Pre-PR Checklist
Before sending a PR:
- [ ] UI works on mobile & desktop
- [ ] No console errors
- [ ] Code is formatted with Prettier
- [ ] ESLint passes: `npm run lint`
- [ ] The PR is linked to an issue
- [ ] No labels were manually added

---

## 🔄 Review & Merge Process
1.  Issue created by contributor
2.  Admin assigns the issue
3.  Contributor works on it
4.  Contributor opens PR
5.  Admin reviews
6.  Admin assigns correct labels
7.  PR approved & merged
8.  Contributor gets points

---

## 🗨️ Communication
- Use **GitHub Issues** for technical doubts
- **PR comments** for code-related discussions
- **Discord community** for general guidance

---

## ⭐ Good First Issues
Beginners can search for:
- `good first issue`

Admins will additionally attach:
- `wocs` + `level 1`

---

## ❤️ Thank You for Contributing
Your work helps build a smoother and more powerful event management experience!

**Manage Events. Simply. Efficiently. — Team Event Manager**
