# Campus Lost & Found — Backend API 🛡️🔌

Production-grade, privacy-first REST API backend built with **Node.js (ESM), Express 5, and SQLite (via `better-sqlite3`)**.

---

## 🏗️ Architecture & Privacy Design

1. **Anti-Fraud Security Firewall:**
   - Finder contact details (`finderName`, `finderPhone`, `finderEmail`) and the hidden question answer (`correctAnswer`) are **never** returned in post queries or match detail endpoints.
   - Contact info is only unlocked and returned via `GET /api/matches/:id/contact` when the claimant has successfully answered the anti-fraud challenge question.
2. **Lockout & Rate Limiting:**
   - **Login Rate Limit:** Maximum 5 failed attempts per 15-minute sliding window before triggering HTTP 429.
   - **Challenge Verification Lockout:** 3 attempts to solve the finder's security question. After 3 wrong attempts, a 24-hour lockout (`lockoutUntil`) is applied.
3. **Multi-Factor Heuristic Matching Engine:**
   - Weighted score formula:
     $$\text{Score} = 0.40 \times \text{Text} + 0.20 \times \text{Color} + 0.25 \times \text{Location} + 0.15 \times \text{Time}$$
   - **Text Similarity:** Jaccard token similarity with stop-word filtering and campus synonym mapping (e.g. *buds* $\to$ *earphones*, *backpack* $\to$ *bag*).
   - **Location Scoring:** Exact match ($1.0$) or campus adjacency graph traversal ($0.6$).
   - **Time Decay:** Linear decay from $1.0$ down to $0$ over a 48-hour window past the lost time.
   - Automatically generates match records and student notification alerts upon submission of any lost or found post.
4. **Data Purge & Retention:**
   - Tracks `returnedAt` timestamps to support auto-purge policies (7-day purge for resolved items; 60-day expiry for open posts).

---

## 📁 Directory Structure

```
backend/
├── package.json               # Node.js ESM configuration and dependencies
├── server.js                  # Entry point (port 5000, graceful shutdown)
├── campus_lost_found.db       # SQLite database (WAL mode, auto-created)
├── test_api.js                # End-to-end API test script
├── uploads/                   # Uploaded item images
├── src/
│   ├── app.js                 # Express application & route mounts
│   ├── config/
│   │   ├── db.js              # SQLite schema, tables & indexes
│   │   └── constants.js       # Campus locations, adjacency, categories, regexes
│   ├── middleware/
│   │   ├── auth.js            # JWT bearer token verification
│   │   ├── rateLimiter.js     # Persistent login rate limiter
│   │   └── upload.js          # Multer image storage handler
│   ├── services/
│   │   ├── matchingService.js # Heuristic scoring algorithm & automated matcher
│   │   └── seedService.js     # Seeds master students & demo records
│   ├── controllers/
│   │   ├── authController.js  # Register, login, me, resetDemo
│   │   ├── lostController.js  # Create, list, return, withdraw lost posts
│   │   ├── foundController.js # Create, list, return, withdraw found posts
│   │   ├── matchController.js # Matches, hidden question verification, contact unlock
│   │   ├── notificationController.js # Alerts & mark read
│   │   └── reportController.js # Dispute reports
│   └── routes/
│       ├── authRoutes.js
│       ├── lostRoutes.js
│       ├── foundRoutes.js
│       ├── matchRoutes.js
│       ├── notificationRoutes.js
│       ├── reportRoutes.js
│       └── uploadRoutes.js
```

---

## 🚀 Running the Backend

### Prerequisites
- Node.js 18+ (tested on Node.js v22.19.0)

### Installation & Run

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Start development server (with auto-reload)
npm run dev

# Or start in standard mode:
npm start
```

The server listens on **`http://localhost:5000`**.

---

## 📡 REST API Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register student account | No |
| `POST` | `/api/auth/login` | Login with email & registration number | No (Rate-limited) |
| `GET` | `/api/auth/me` | Get currently logged-in student profile | Yes (`Bearer <token>`) |
| `POST` | `/api/auth/logout` | Logout | Yes |
| `POST` | `/api/auth/reset-demo` | Restore demo seed data | No |

### 2. Lost Posts (`/api/lost`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/lost` | File a lost report (triggers automatic matching) | Yes |
| `GET` | `/api/lost/my` | Get current student's lost reports | Yes |
| `PATCH`| `/api/lost/:id/returned` | Mark lost item as returned | Yes |
| `PATCH`| `/api/lost/:id/withdraw` | Withdraw lost item | Yes |

### 3. Found Posts (`/api/found`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/found` | File a found item with challenge question | Yes |
| `GET` | `/api/found/my` | Get current student's found reports | Yes |
| `PATCH`| `/api/found/:id/returned` | Mark found item as returned | Yes |
| `PATCH`| `/api/found/:id/withdraw` | Withdraw found item | Yes |

### 4. Matches & Security Verification (`/api/matches`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/matches/my` | Get matches for claimant's lost items | Yes |
| `GET` | `/api/matches/:id` | Get match detail & shuffled challenge options | Yes |
| `POST` | `/api/matches/:id/answer` | Submit challenge answer (3 attempts before 24h lockout) | Yes |
| `GET` | `/api/matches/:id/contact`| Get finder's contact info (**Unlocked only after correct answer**) | Yes |
| `POST` | `/api/matches/:id/confirm` | Confirm claim | Yes |
| `POST` | `/api/matches/:id/reject` | Reject match | Yes |

### 5. Notifications & Uploads
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/notifications` | Get claimant alerts | Yes |
| `PATCH`| `/api/notifications/:id/read` | Mark alert read | Yes |
| `PATCH`| `/api/notifications/read-all`| Mark all alerts read | Yes |
| `POST` | `/api/upload` | Upload item photo (`multipart/form-data`) | Yes |
| `POST` | `/api/reports` | Report dispute or security concern | Yes |

---

## 🧪 Testing the Backend API

Run the automated test script:
```bash
node test_api.js
```
The test script validates authentication, JWT issuance, profile retrieval, heuristic match retrieval, anti-fraud challenge verification (including wrong attempt decrementing), contact unlocking, and notification endpoints.
