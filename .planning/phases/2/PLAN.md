# Phase 2: Homepage Content — Trust & Conversion Sections

Building the missing sections of the homepage to build credibility and convert discovery traffic into free class bookings.

## 1. Components to Build
- **HowItWorks**: 3-step visualization (Book -> Join -> Learn).
- **CurriculumSection**: Highlighting the Blockly to Python journey.
- **PricingSection**: Displaying the ₹2,000 / 8-class value proposition.
- **TestimonialsSection**: Social proof from parents/students.
- **TeachersSection**: Profile of the educators (Meet the Teachers).

## 2. Design Goals
- Use `cc-glass` and `cc-blob` for consistency.
- High-impact typography using the `Outfit` font (already configured).
- Smooth entry animations using `framer-motion`.

## 3. Implementation Steps

### Step 1: Create Section Components
- [x] Create `src/components/HowItWorks.tsx`
- [x] Create `src/components/Curriculum.tsx`
- [x] Create `src/components/Pricing.tsx`
- [x] Create `src/components/Testimonials.tsx`
- [x] Create `src/components/Teachers.tsx`

### Step 2: Integrate into Home Page
- [x] Import and place components in `src/app/page.tsx`
- [x] Ensure `id` attributes match Navigation anchors (`#curriculum`, `#pricing`, etc.)
- [x] Add smooth scroll behavior to the layout.

### Step 3: Polish & Verification
- [x] Verify responsiveness on mobile.
- [x] Check color contrast for accessibility.
- [x] Ensure "Book Free Class" CTA is easily accessible from all sections.

## 4. Verification (UAT)
1. User can scroll to Curriculum section via Nav.
2. Pricing section clearly shows ₹2,000 / 8 classes.
3. WhatsApp link in footer works.
4. Booking a free class via any CTA opens the modal.
