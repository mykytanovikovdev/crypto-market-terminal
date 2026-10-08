import { afterEach, describe, expect, it, vi } from 'vitest';
import {
    getNotificationAccess,
    requestNotificationAccess,
    showBrowserNotification,
} from '@/utils/browserNotifications';

function stubNotification(
    permission: NotificationPermission,
    answer: NotificationPermission = permission,
) {
    const created: unknown[][] = [];
    const NotificationStub = Object.assign(
        vi.fn(function createNotification(...args: unknown[]) {
            created.push(args);
        }),
        { permission, requestPermission: vi.fn(async () => answer) },
    );

    vi.stubGlobal('Notification', NotificationStub);

    return { NotificationStub, created };
}

describe('browser notifications', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('reports unsupported browsers', async () => {
        vi.stubGlobal('Notification', undefined);
        Reflect.deleteProperty(window, 'Notification');

        expect(getNotificationAccess()).toBe('unsupported');
        expect(await requestNotificationAccess()).toBe('unsupported');
    });

    it('asks for permission only while the user has not decided', async () => {
        const { NotificationStub } = stubNotification('default', 'granted');

        expect(await requestNotificationAccess()).toBe('granted');
        expect(NotificationStub.requestPermission).toHaveBeenCalledTimes(1);

        stubNotification('denied');
        expect(await requestNotificationAccess()).toBe('denied');
    });

    it('shows a notification only when it is allowed', () => {
        const allowed = stubNotification('granted');
        showBrowserNotification('BTC price alert', 'Bitcoin rose above $90,000', 'icon.png');
        expect(allowed.created).toEqual([
            [
                'BTC price alert',
                { body: 'Bitcoin rose above $90,000', icon: 'icon.png', tag: 'BTC price alert' },
            ],
        ]);

        const denied = stubNotification('denied');
        showBrowserNotification('BTC price alert', 'body', 'icon.png');
        expect(denied.created).toEqual([]);
    });
});
