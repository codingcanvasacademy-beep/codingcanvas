# Conventions

### React Server Framework Native Rules
1. **Data Loaders:** Keep top-level files like `page.tsx` as standard Server Components when doing fetching. Pass resolved string/bool data down to Client elements mapping interactive functions.
2. **Use Client Only When Required:** Explicitly annotate files with `'use client';` only when utilizing React lifecycle tools (`useState`, `useEffect`) or browser window/node objects. Ensure the line is placed strictly at line 1.
3. **Lazy Offloading:** If importing massive client SDKs that mandate window instantiation implicitly (e.g. Blockly or Pyodide), wrap them using Next's `dynamic` export using `{ ssr: false }`. Doing this inside the same file will crash the hydration flow, it **must** be implemented in a separate `.tsx` component.

### Tailwind & Stitch Styling
1. All elements require dynamic responsiveness, preferring `h-full`, `flex-1`, and absolute positioning strategies.
2. Incorporate CSS utility mapping. Use colors defined in the global `.css` variables (`--brand-crimson`, etc.), mapping dynamically in UI interfaces to present modern UI (glassmorphism overlays, blurs).
3. Always implement `framer-motion` `<motion.div>` structures for critical layout elements, maintaining low scale delays (e.g., `0.9` -> `1` scaling with fade). 

### Security & Routing 
- Never perform `router.push('/xyz')` after Auth confirmation if previously encountering HTTP 401s dynamically; instead, force a `window.location.href = "/xyz"` redirect to guarantee Next.js caching memory dumps out the rejected routes cleanly.
- Keep the `api` layer purely functional and handle parameter validation stringently; do not leak backend structural definitions to the user context.
