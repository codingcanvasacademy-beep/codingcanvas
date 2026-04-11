# CodingCanvas — Project Context

## What This Is

CodingCanvas is a live-online Python coding academy for kids, targeting parents of children aged roughly 6–14 years. The platform combines a drag-and-drop Blockly sandbox with real Python compilation, live video classes with teachers, and an AI support chatbot. The business runs on a ₹2,000 / 8-class package model with a free first class to convert discovery traffic into paying students.

**Current state:** 2 paying students. The app runs on Next.js 16 + Supabase + Vercel. A codebase map exists in `.planning/codebase/`. Core technical infrastructure (auth, DB, AI proxy, video meetings, admin portal) works. The public-facing website is incomplete and looks unprofessional to new visitors.

**Launch definition:** A .com or .in domain going live with a polished, trust-building homepage that converts browsing parents into free-trial bookings.

---

## Core Value

> Get parents of young kids to trust CodingCanvas enough to book a free trial class.

Every design and feature decision must serve this one goal.

---

## Audience

**Primary:** Indian parents discovering the platform for the first time — looking for a safe, credible, structured coding program for their child. They are evaluating trustworthiness, curriculum quality, and price before booking.

**Secondary:** Students (the kids) who use the Blockly sandbox + compiler in class.

**Internal:** Teachers (manage sessions, control classrooms), Admin (Vaibh managing everything).

---

## Requirements

### Validated (Already Working)
- ✓ Student Blockly sandbox with live Python compilation (Pyodide)
- ✓ Teacher portal for class management
- ✓ Admin God-Mode portal (invite teachers, manage free class requests, AI FAQ injection)
- ✓ Video meeting rooms (Jitsi integration)
- ✓ AI Support Chat with dynamic FAQ injection from admin
- ✓ Free class booking form → Supabase → admin dashboard
- ✓ Supabase auth (email/password login)
- ✓ "Book Free Class" CTA functional in hero + CTA sections
- ✓ Navigation — removed "Main Host Portal (Admin)" and "Log In" links (Phase 1)
- ✓ Homepage — removed false social proof "5,000+ students" (Phase 1)
- ✓ Footer — fixed broken links & added WhatsApp contact (Phase 1)
- ✓ Isolated Admin Environment — Docker setup with automatic redirect (Phase 1)

### Active (Must Build for Launch)
- [ ] "How It Works" section — 3-step process for parents
- [ ] Curriculum section — what kids actually learn, skill progression
- [ ] Pricing section — ₹2,000 / 8 classes, free first class CTA
- [ ] Testimonials section — parent/student reviews (start with 1–2 real ones or placeholder)
- [ ] Meet the Teachers section — credibility builder
- [ ] SEO basics — title tags, meta descriptions, og:image for each page
- [ ] Custom domain setup — .com or .in via Hostinger, pointed to Vercel

### Out of Scope (This Milestone)
- Blog / content marketing — too early
- Payment gateway integration — manual coordination for now
- Student dashboard improvements beyond current state — separate milestone
- Mobile app — web-first launch

---

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Keep existing color scheme (pink/coral gradient) | User confirmed colors are good — only layout/positioning is the issue | — Keep |
| No false social proof | "5,000+ students" is misleading for a 2-student startup — remove it | — Fix |
| WhatsApp CTA over contact form | Faster for Indian parents; direct conversion | — Build |
| Pricing: ₹2,000 / 8 classes, first class free | Already decided by owner | — Display on site |
| Custom domain via Hostinger | Vercel doesn't offer free domain | — Configure post-build |
| Admin portal link hidden from public nav | Unprofessional and a security concern | — Remove from nav |

---

## Current Pain Points (Homepage Audit)

1. **Nav bar** — shows "Main Host Portal (Admin)" publicly — embarrassing and a security risk
2. **Hero** — "5,000+ young innovators" is false for a 2-student startup
3. **Homepage sections** — only has Hero + "CodingCanvas Advantage" + CTA. Missing: How it Works, Curriculum, Pricing, Testimonials, Teachers
4. **Footer** — "Contact" links to `#book` instead of a real contact; "Curriculum" links to `#features` which doesn't exist
5. **No WhatsApp** — primary conversion tool for Indian parents is missing

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition:**
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions

**After each milestone:**
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?

---
*Last updated: 2026-04-11 after initialization*
