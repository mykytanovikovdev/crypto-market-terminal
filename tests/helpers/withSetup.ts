import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { defineComponent } from 'vue';
import type { Router } from 'vue-router';
import { createTestRouter } from './plugins';

export async function withSetup<TResult>(
    composable: () => TResult,
    initialPath = '/',
): Promise<{ result: TResult; router: Router; unmount: () => void }> {
    const router = createTestRouter();
    let result: TResult | undefined;

    const Harness = defineComponent({
        setup() {
            result = composable();

            return () => null;
        },
    });

    const pinia = createPinia();

    setActivePinia(pinia);
    await router.push(initialPath);
    await router.isReady();
    const wrapper = mount(Harness, { global: { plugins: [router, pinia] } });

    return { result: result as TResult, router, unmount: () => wrapper.unmount() };
}
