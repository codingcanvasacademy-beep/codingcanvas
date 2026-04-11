---
created: 2026-04-11T15:17:46.021Z
title: Differentiate student and teacher sign-in
area: auth
files:
  - src/app/login/page.tsx
---

## Problem

Currently, the sign-in experience is the same for both students and teachers. The user wants to make the sign-in part of the students different from the teachers, likely to provide a more tailored user experience (UX) for each role or to clearly separate their entry points into the platform.

## Solution

TBD. Possible approaches include:
- Adding a toggle or tab on the login page to switch between "Student" and "Teacher" login modes.
- Implementing a role selection landing page that directs users to specialized login routes (e.g., `/login/student` vs `/login/teacher`).
- Customizing the UI components (colors, icons, instructions) based on the selected role during the login process.
