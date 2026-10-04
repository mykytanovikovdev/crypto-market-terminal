import { useRoute, useRouter, type LocationQuery, type Router } from 'vue-router';

export type QueryPatch = Record<string, string | undefined>;

// route.query only changes after navigation resolves, so several updates in the same tick
// would each start from the stale query and overwrite one another. Pending queries are
// shared per router so that every composable builds on the latest requested state.
const pendingQueries = new WeakMap<Router, LocationQuery>();

export function readQueryString(query: LocationQuery, key: string): string | null {
    const value = query[key];

    return typeof value === 'string' ? value : null;
}

function applyQueryPatch(query: LocationQuery, patch: QueryPatch): LocationQuery {
    const nextQuery: LocationQuery = { ...query };

    for (const [key, value] of Object.entries(patch)) {
        if (value === undefined || value === '') {
            delete nextQuery[key];
        } else {
            nextQuery[key] = value;
        }
    }

    return nextQuery;
}

export function useRouteQuery() {
    const route = useRoute();
    const router = useRouter();

    function clearPendingQuery(query: LocationQuery): void {
        if (pendingQueries.get(router) === query) {
            pendingQueries.delete(router);
        }
    }

    function updateQuery(patch: QueryPatch): void {
        const nextQuery = applyQueryPatch(pendingQueries.get(router) ?? route.query, patch);

        pendingQueries.set(router, nextQuery);
        void router.replace({ query: nextQuery }).finally(() => clearPendingQuery(nextQuery));
    }

    return { route, updateQuery };
}
