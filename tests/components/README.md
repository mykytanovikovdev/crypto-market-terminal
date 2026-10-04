# Component tests

Vue components mounted with `@vue/test-utils` in a `happy-dom` environment.
Folder structure mirrors `src/` (e.g. `features/market-table/`).

## What to check

- Rendered output for given props: text, formatted values, BEM modifiers that carry meaning
  (`market-table__cell--up`).
- Accessibility attributes: `aria-pressed`, `aria-label`, roles.
- Emitted events and their payloads.

Avoid asserting on layout or exact markup that may change with styling.

## Setup

Components rely on i18n, Pinia and the router. `createTestPlugins()` provides all three
(English locale, a fresh Pinia, an in-memory router with the app's route names):

```ts
import { createTestPlugins } from '../../../helpers/plugins';

mount(MyComponent, { global: { plugins: createTestPlugins() } });
```

Tests that switch language or theme reset them in `afterEach`, because both live on
`<html>` and are shared across tests in the file.

Run only this group:

```bash
npx vitest run tests/components
```
