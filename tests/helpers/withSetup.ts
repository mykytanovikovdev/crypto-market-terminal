import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import type { Router } from 'vue-router';
import { createTestRouter } from './plugins';

export async function withSetup<TResult>(
    composable: () => TResult,
    initialPath = '/',
): Promise<{ result: TResult; router: Router }> {
    const router = createTestRouter();
    let result: TResult | undefined;

    const Harness = defineComponent({
        setup() {
            result = composable();

            return () => null;
        },
    });

    await router.push(initialPath);
    await router.isReady();
    mount(Harness, { global: { plugins: [router] } });

    return { result: result as TResult, router };
}
