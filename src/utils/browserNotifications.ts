export type NotificationAccess = 'granted' | 'denied' | 'default' | 'unsupported';

function isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationAccess(): NotificationAccess {
    return isSupported() ? Notification.permission : 'unsupported';
}

export async function requestNotificationAccess(): Promise<NotificationAccess> {
    if (!isSupported()) {
        return 'unsupported';
    }

    if (Notification.permission !== 'default') {
        return Notification.permission;
    }

    return Notification.requestPermission();
}

export function showBrowserNotification(title: string, body: string, icon: string): void {
    if (getNotificationAccess() === 'granted') {
        new Notification(title, { body, icon, tag: title });
    }
}
