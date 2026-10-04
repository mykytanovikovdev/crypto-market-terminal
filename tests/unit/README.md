# Unit tests

Logic that runs without rendering components.

| Folder         | Covers                                                        |
| -------------- | ------------------------------------------------------------- |
| `api/`         | HTTP client error mapping, API clients, DTO-to-domain mappers |
| `stores/`      | Pinia stores: state transitions, loading and error handling   |
| `composables/` | Reusable composition functions                                |
| `utils/`       | Formatting and other pure helpers                             |

## Mocking

- API clients: spy on the exported axios instance
  (`vi.spyOn(coinGeckoClient, 'get')`) and resolve with data from `../fixtures`.
- Stores: mock the API module with `vi.mock('@/api/...')` and create a fresh Pinia in
  `beforeEach` via `setActivePinia(createPinia())`.

Run only this group:

```bash
npx vitest run tests/unit
```
