# Tests

All tests live here, outside `src/`, grouped by what they exercise.

```
tests/
    unit/          pure logic: API clients, stores, composables, utils
    components/    mounted Vue components and their interactions
    e2e/           browser scenarios (Playwright, planned)
    fixtures/      canned API responses and domain data
    helpers/       shared test setup (plugins, mount helpers)
```

## Running

```bash
npm run test          # single run
npm run test:watch    # re-run on change
npm run check         # type-check, lint, format check and tests together
```

## Conventions

- Test files end with `.spec.ts`.
- Paths mirror `src/`: the test for `src/utils/format.ts` is `tests/unit/utils/format.spec.ts`,
  the test for `src/features/market-table/MarketTable.vue` is
  `tests/components/features/market-table/MarketTable.spec.ts`.
- Tests never hit real APIs. Network calls are mocked and fed from `fixtures/`.
- Test names describe behaviour, not implementation: `it('maps HTTP 429 to a rate limit error')`.
- Each test arranges its own state; nothing leaks between tests (`restoreMocks` is on, Pinia is
  recreated per test).
