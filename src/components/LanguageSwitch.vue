<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import SegmentedControl, { type SegmentedOption } from '@/components/SegmentedControl.vue';
import { useLocale } from '@/composables/useLocale';
import { getLocaleSettings, SUPPORTED_LOCALES, type AppLocale } from '@/i18n/locales';

const { t } = useI18n();
const { currentLocale, setLocale } = useLocale();

const LANGUAGE_OPTIONS: SegmentedOption<AppLocale>[] = SUPPORTED_LOCALES.map((locale) => ({
    value: locale,
    label: getLocaleSettings(locale).shortLabel,
    ariaLabel: getLocaleSettings(locale).nativeName,
    lang: locale,
}));

const selectedLocale = computed<AppLocale>({
    get: () => currentLocale.value,
    set: setLocale,
});
</script>

<template>
    <SegmentedControl
        v-model="selectedLocale"
        class="language-switch"
        :options="LANGUAGE_OPTIONS"
        :label="t('language.label')"
    />
</template>
