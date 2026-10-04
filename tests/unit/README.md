# Unit tests

Logic that runs without rendering components.

| Folder         | Covers                                                         |
| -------------- | -------------------------------------------------------------- |
| `api/`         | HTTP client error mapping, API clients, DTO-to-domain mappers  |
| `stores/`      | Pinia stores: state transitions, loading and error handling    |
| `composables/` | Reusable composition functions                                 |
| `features/`    | Feature-level composables, e.g. sorting and filters in the URL |
| `utils/`       | Formatting and other pure helpers                              |

## Composables that need a component

Composables that use the router (`useRoute`, `useRouter`) run inside a tiny harness via
`withSetup(composable, initialPath)` from `../helpers/withSetup`. It returns the composable's
result and the in-memory router, so tests can assert on `router.currentRoute.value.query`.

## Mocking

- API clients: spy on the exported axios instance
  (`vi.spyOn(coinGeckoClient, 'get')`) and resolve with data from `../fixtures`.
- Stores: mock the API module with `vi.mock('@/api/...')` and create a fresh Pinia in
  `beforeEach` via `setActivePinia(createPinia())`.

Run only this group:

```bash
npx vitest run tests/unit
```
