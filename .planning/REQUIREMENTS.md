# CodingCanvas — v1 Requirements

> **Core Value:** Get parents of young kids to trust CodingCanvas enough to book a free trial class.

---

## v1 Requirements

### Public Homepage (Marketing Site)

- [ ] **HOME-01**: Visitor can see a professional hero section with a clear headline and "Book Free Class" CTA
- [ ] **HOME-02**: Visitor can see "How It Works" section explaining the 3-step process (Discover → Try → Learn)
- [ ] **HOME-03**: Visitor can see a Curriculum section explaining what kids learn and the learning path (Blocks → Python)
- [ ] **HOME-04**: Visitor can see a Pricing section showing ₹2,000 / 8 classes with a free first class CTA
- [ ] **HOME-05**: Visitor can see a Testimonials section with parent/student reviews
- [ ] **HOME-06**: Visitor can see a "Meet the Teachers" section with names and credentials
- [ ] **HOME-07**: Visitor can click a WhatsApp button/link to contact the academy directly
- [ ] **HOME-08**: Visitor can see accurate social proof (no false "5,000+ students" claim)

### Navigation & Footer

- [ ] **NAV-01**: Public navigation shows Curriculum, Pricing, and About links (not internal admin/portal links)
- [ ] **NAV-02**: Admin portal link is removed from public-facing navigation
- [ ] **NAV-03**: "Book Free Class" CTA button is visible and sticky in the navbar
- [ ] **FOOT-01**: Footer contains correct links (Curriculum, Privacy, Contact/WhatsApp, Teacher Login)
- [ ] **FOOT-02**: Footer copyright year is current and academy name is correct

### Free Trial Booking

- [ ] **BOOK-01**: Parent can submit a free class booking form with name, child name, email, and phone
- [ ] **BOOK-02**: Parent sees a confirmation message after successful booking submission
- [ ] **BOOK-03**: Free class requests appear in the admin dashboard for the host to action

### SEO & Trust

- [ ] **SEO-01**: Each page has a descriptive `<title>` tag and `<meta description>`
- [ ] **SEO-02**: Homepage has a proper `og:image` for social sharing previews
- [ ] **SEO-03**: Site uses semantic HTML (h1 → h2 → h3 hierarchy respected)

### Core Platform (Already Working — Preserve)

- [ ] **PLAT-01**: Student can access Blockly sandbox and run drag-and-drop programs
- [ ] **PLAT-02**: Student can access Python compiler and run real Python code
- [ ] **PLAT-03**: Teacher can log in and access the teacher portal
- [ ] **PLAT-04**: Admin can access the host/admin portal and manage requests + FAQs
- [ ] **PLAT-05**: AI support chat is functional with host-injected FAQ knowledge

---

## v2 Requirements (Deferred — Post Launch)

- **About Us page** — Company story and mission; lower priority at launch
- **Blog** — Content marketing; valuable but not launch-critical
- **Payment gateway** — Online payment; manual coordination works for now
- **Student dashboard improvements** — Enhanced progress tracking, badges
- **Mobile-optimized class experience** — Web-first launch is sufficient
- **Google/Social login** — Email/password is working; OAuth is nice-to-have

---

## Out of Scope

| Item | Reason |
|------|--------|
| Mobile app (iOS/Android) | Web-first launch; native app is a later milestone |
| Blog / content marketing | Too early; focus is conversion not discovery |
| Payment gateway (Stripe/Razorpay) | Manual class coordination acceptable at this scale |
| Student progress tracking / gamification | Separate milestone post-launch |
| Multi-language support | English-first for now |
| Email marketing / drip campaigns | Post-launch growth lever |

---

## Traceability

| Phase | Requirements Covered |
|-------|----------------------|
| Phase 1 | HOME-01, HOME-08, NAV-01, NAV-02, NAV-03, FOOT-01, FOOT-02 |
| Phase 2 | HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07 |
| Phase 3 | BOOK-01, BOOK-02, BOOK-03, SEO-01, SEO-02, SEO-03 |
| Phase 4 | PLAT-01, PLAT-02, PLAT-03, PLAT-04, PLAT-05 |
