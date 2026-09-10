# University Innovation Hub — Jharkhand

Higher-education innovation platform connecting Jharkhand universities (BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, Ranchi University, etc.) to real-world societal problems reported by citizens and prioritized by government departments.

---

## Features
- **Challenge Marketplace**: Browse real societal challenges from across Jharkhand, evaluate institution-problem match scores, and institutional adoption.
- **Academic Project Management**: Turn adopted societal challenges into multidisciplinary research and development projects.
- **Technology Readiness Level (TRL 1–9) Tracker**: Track project progression from basic research through lab validation, benchtop prototype, controlled field pilots, to full deployment.
- **AI Student Team Builder**: Assemble student teams matching skills in software, electronics, civil, environmental, and mechanical engineering.
- **Faculty Mentorship Roster**: Track faculty domains, workload, and assign principal investigators.
- **Lab & Testing Rig Reservations**: Centralized equipment booking across university shared research facilities.
- **Reusable Solution Repository**: Catalog proven prototypes, open hardware designs, and patent/IP readiness.
- **Lessons Learned Module**: Document field trial failures, environmental findings, and replication blueprints.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Framer Motion
- **Backend**: Node.js, Express, tsx
- **Persistence**: File-backed JSON store with transactional safety (`src/db/storage.ts`)

---

## Default Port
Runs by default on **Port 3003**.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file based on `.env.example`:
```env
PORT=3003
NODE_ENV=development
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser to: [http://localhost:3003](http://localhost:3003)

### 4. Build for Production
```bash
npm run build
npm start
```

---

## API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status |
| `GET` | `/api/v1/university/overview` | Dashboard KPIs (active projects, prototypes, field pilots) |
| `GET` | `/api/v1/university/challenges` | Challenges marketplace with domain and status filters |
| `POST` | `/api/v1/university/challenges/:id/adopt` | Adopt challenge and create academic project |
| `GET` | `/api/v1/university/projects` | List of active university projects |
| `GET` | `/api/v1/university/projects/:id` | Project details, milestones, and team roster |
| `PATCH` | `/api/v1/university/projects/:id/trl` | Advance TRL stage with milestone evidence |
| `GET` | `/api/v1/university/labs` | University research labs inventory |
| `POST` | `/api/v1/university/labs/book` | Reserve specialized testing equipment |
| `GET` | `/api/v1/university/solutions` | Reusable solutions and prototype catalog |
| `GET` | `/api/v1/university/faculty` | Faculty mentors directory |
| `GET` | `/api/v1/university/students` | Student talent roster |
| `GET` | `/api/v1/university/lessons` | Catalog of documented lessons learned |
| `POST` | `/api/v1/university/lessons` | Submit a new field/research lesson learned |
