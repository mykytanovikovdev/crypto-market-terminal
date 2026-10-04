import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import AppHeader from '@/components/AppHeader.vue';
import { useLocale } from '@/composables/useLocale';
import { useTheme } from '@/composables/useTheme';
import { createTestPlugins } from '../../helpers/plugins';

function mountAppHeader() {
    return mount(AppHeader, { global: { plugins: createTestPlugins() } });
}

describe('AppHeader', () => {
    afterEach(() => {
        useLocale().setLocale('en');
        useTheme().setTheme('light');
    });

    it('links to every page', () => {
        const links = mountAppHeader().findAll('.app-header__nav-link');

        expect(links.map((link) => link.text())).toEqual(['Markets', 'Watchlist', 'About']);
        expect(links.map((link) => link.attributes('href'))).toEqual(['/', '/watchlist', '/about']);
    });

    it('switches the interface to Persian', async () => {
        const wrapper = mountAppHeader();

        await wrapper
            .find('.language-switch .segmented-control__option[lang="fa"]')
            .trigger('click');

        expect(document.documentElement.dir).toBe('rtl');
        expect(wrapper.find('.app-header__nav-link').text()).toBe('بازارها');
        expect(
            wrapper
                .find('.language-switch .segmented-control__option[lang="fa"]')
                .attributes('aria-pressed'),
        ).toBe('true');
    });

    it('toggles the theme and updates the button label', async () => {
        useTheme().setTheme('light');
        const wrapper = mountAppHeader();
        const toggle = wrapper.find('.theme-toggle');

        expect(toggle.attributes('aria-label')).toBe('Switch to dark theme');

        await toggle.trigger('click');

        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(toggle.attributes('aria-label')).toBe('Switch to light theme');
    });
});
