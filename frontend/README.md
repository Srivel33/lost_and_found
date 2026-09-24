# Campus Lost & Found 🎒🔒

A privacy-first, zero-backend portal for college campuses built with **React 18 + Vite + Tailwind CSS**. Students report lost and found items, the system matches them automatically using weighted multi-factor heuristics, and finder contact details remain completely locked until the claimant correctly solves an anti-fraud challenge question.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### Installation & Run

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The application will run locally at `http://127.0.0.1:5173/` (or `http://localhost:5173/`).

### Running the Test Suite

```bash
npm test
```

All 24 automated unit tests will run via **Vitest** testing validators, the scoring matching engine, hidden-question anti-fraud verification, and route guards.

---

## 🎬 6-Step Demo Walkthrough Script

### Demo Scenario Overview
- **Meena Iyer** (`meena@college.edu` / `21CS1002AB`): Lost her black earphones case with a green sticker near the Library.
- **Arun Kumar** (`arun@college.edu` / `21CS1001AB`): Found a black earbuds case in the Library and created a challenge question: *"What sticker is on the case?"* with 3 decoys.

### Step-by-Step Walkthrough:
1. **Login as Meena:**
   - Open `/login` and click **"Meena Iyer (Lost Case)"** under *Quick Demo Accounts* (or type `meena@college.edu` and `21CS1002AB`).
   - Click **Sign in** &rarr; Redirects to `/home`.
2. **Review Notifications:**
   - Check the **Campus Alerts bell** in the navigation bar. Notice the unread badge: *"A possible match was found for your Black Earphones Case."*
3. **Open Match Detail & Security Challenge:**
   - Click **"Review match"** (or navigate to `/matches` &rarr; click **"Verify & Unlock"** on the High Confidence match).
   - Observe the match overview: category, location (Library), found time, and *"Why matched: Same category (earphones), matching color (Black), exact location (Library)..."*.
   - Notice that finder contact info is completely absent from the page and network response.
4. **Test Anti-Fraud Challenge & Lockout:**
   - Choose an incorrect decoy option (e.g., *"Yellow smiley"*) and click **Submit Verification Answer**.
   - Notice the error: *"That answer isn't right"*, and the remaining attempts decrement to 2.
   - *(Optional)* After 3 wrong attempts, observe the 24-hour live countdown **CooldownBanner**.
5. **Solve Correct Answer & Reveal Contact:**
   - Select the correct answer: **"Green frog sticker"** and click **Submit Verification Answer**.
   - The **ContactCard** unlocks instantly, revealing Arun Kumar's verified name, phone number (`9876543211`), email (`arun@college.edu`), and custody location (*"With me"*), along with campus handover safety tips.
6. **Confirm Match & Check Retention:**
   - Click **"This is mine (Confirm Match)"**.
   - Go to **My Posts** (`/my-posts`) &rarr; Click **"Mark Returned"** on the recovered post.
   - Notice the **RetentionLabel** updates to **"Auto-deleted in 7 days"** according to the campus privacy purge policy.

---

## 🛡️ Privacy Safeguards & Architecture

1. **No Global Public Found Board:** Found reports are never listed publicly to eliminate false claims. Items are matched 1-to-1 exclusively to students who filed a corresponding lost report.
2. **Hidden Question Security Firewall:** Finder contact details are isolated in the mock store and never returned over API or rendered in DOM until correct challenge verification.
3. **Session Lifetime:** Pure `sessionStorage` session token with an automatic 1-hour expiration.
4. **Data Purge Lifecycle:** Standard posts expire and auto-delete in 60 days; resolved returned items are deleted in 7 days.
5. **Rate Limiting:** Maximum 5 failed logins per 15-minute window before triggering a lockout banner.
