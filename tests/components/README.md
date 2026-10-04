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

Components that use translations need the i18n plugin:

```ts
import { createTestI18n } from '../../../helpers/plugins';

mount(MyComponent, { global: { plugins: [createTestI18n()] } });
```

Run only this group:

```bash
npx vitest run tests/components
```
