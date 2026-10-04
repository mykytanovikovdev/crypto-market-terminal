import { computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ApiError } from '@/api/http';

export function useApiErrorMessage(error: Ref<ApiError | null>) {
    const { t } = useI18n();

    return computed(() => {
        if (!error.value) {
            return null;
        }

        return t(`errors.${error.value.kind}`, { status: error.value.status });
    });
}
