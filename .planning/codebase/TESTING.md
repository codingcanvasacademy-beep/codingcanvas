# Testing

### Current Approach
At present, the system leverages end-to-end (E2E) manual User Acceptance Testing (UAT). Heavy reliance on live-check mechanics executed during dev cycles against Edge routing rules means standard unit tests are currently omitted.

### Planned Tooling
Given the application size, robust testing modules are needed for the next phase.
- **Playwright / Cypress:** Since authentication heavily binds to persistent state redirects and Edge validation against Supabase schemas, unit testing with raw React-Testing-Library will fail accurately recreating session limits. Emulated browsers mapping actual flow states are strictly mandated.
- **Component Tests:** Any independent module operating purely on props locally (like the Blockly workspace node, or the Terminal viewer) can be isolated under Jest configurations.

### CI/CD Considerations
Vercel executes implicit Next.js Turbo-build checking on every git branch. The pipeline currently accepts Type strict checks and standard compilation errors. Future pushes should bind standard lint testing prior to commit cycles using tools like Husky.
